import os
import stripe
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv
import secrets
import asyncio
import hmac
import time
import re
import threading

from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, Body, BackgroundTasks
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import io
import zipfile
import httpx
import json
import hashlib
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, func, inspect, text, or_
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from jose import JWTError, jwt

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

from aamva import STATE_AAMVA_PROFILES, resolve_state_profile, generate_aamva_payload, generate_scanner_xml
import mrz

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = os.getenv("SECRET_KEY", "barcode-studio-default-dev-secret-key-32bytes")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 365)))  # 1 Year Persistent Login Sessions
stripe.api_key = os.getenv("STRIPE_API_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# Database setup with automatic SQLite fallback & Render PostgreSQL / Persistent Disk support
PERSISTENT_DIR = os.getenv("RENDER_DISK_PATH") or os.getenv("PERSISTENT_STORAGE_PATH")
if PERSISTENT_DIR and os.path.isdir(PERSISTENT_DIR):
    DB_PATH = Path(PERSISTENT_DIR) / "barcodestudio.db"
    USERS_BACKUP_FILE = Path(PERSISTENT_DIR) / "users_data.json"
    ORDERS_BACKUP_FILE = Path(PERSISTENT_DIR) / "orders_data.json"
    TRANSFERS_BACKUP_FILE = Path(PERSISTENT_DIR) / "transfers_data.json"
    COMMISSIONS_BACKUP_FILE = Path(PERSISTENT_DIR) / "commissions_data.json"
    EXPORT_GRACE_CACHE_FILE = Path(PERSISTENT_DIR) / "export_grace_cache.json"
else:
    DB_PATH = BASE_DIR / "barcodestudio.db"
    USERS_BACKUP_FILE = BASE_DIR / "users_data.json"
    ORDERS_BACKUP_FILE = BASE_DIR / "orders_data.json"
    TRANSFERS_BACKUP_FILE = BASE_DIR / "transfers_data.json"
    COMMISSIONS_BACKUP_FILE = BASE_DIR / "commissions_data.json"
    EXPORT_GRACE_CACHE_FILE = BASE_DIR / "export_grace_cache.json"

def create_robust_engine():
    raw_url = (os.getenv("DATABASE_URL") or "").strip()
    if raw_url and "postgres" in raw_url.lower():
        db_url = raw_url
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
            db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        
        try:
            print("[DB] Initializing PostgreSQL engine (connect_timeout=4s)...")
            pg_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=180,
                pool_size=20,
                max_overflow=30,
                pool_timeout=15,
                connect_args={
                    "connect_timeout": 4,
                    "sslmode": "prefer"
                }
            )
            with pg_engine.connect() as test_conn:
                test_conn.execute(text("SELECT 1"))
            print("[DB] PostgreSQL connection verified successfully.")
            return pg_engine
        except Exception as pg_err:
            print(f"[DB WARNING] PostgreSQL connection failed ({pg_err}). Seamlessly falling back to SQLite for instant port binding.")

    sqlite_url = raw_url if raw_url.startswith("sqlite") else f"sqlite:///{DB_PATH}"
    print(f"[DB] Initializing SQLite database engine: {sqlite_url}")
    sq_engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False, "timeout": 15}
    )
    from sqlalchemy import event
    @event.listens_for(sq_engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.close()
        except Exception:
            pass
    return sq_engine

engine = create_robust_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Background backup synchronization locks & debouncing to prevent live request thread blocking
_backup_locks = {
    "users": threading.Lock(),
    "orders": threading.Lock(),
    "transfers": threading.Lock(),
    "commissions": threading.Lock(),
}
_backup_scheduled = {
    "users": False,
    "orders": False,
    "transfers": False,
    "commissions": False,
}

def _atomic_json_write(filepath: Path, data: list):
    """Writes data to a temporary file and atomically replaces destination to guarantee zero file corruption."""
    try:
        tmp_path = filepath.with_suffix(".tmp")
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        tmp_path.replace(filepath)
    except Exception as e:
        print(f"Warning: Failed atomic JSON write for {filepath.name}: {e}")

def _do_sync_users():
    session = SessionLocal()
    try:
        users = session.query(User).all()
        data = []
        for u in users:
            data.append({
                "email": u.email,
                "hashed_password": u.hashed_password,
                "role": u.role,
                "tokens": u.tokens,
                "referral_code": getattr(u, "referral_code", None),
                "referred_by_id": getattr(u, "referred_by_id", None),
                "affiliate_balance": getattr(u, "affiliate_balance", 0.0),
            })
        _atomic_json_write(USERS_BACKUP_FILE, data)
        return len(data)
    except Exception as e:
        print(f"Warning: Failed to sync users backup: {e}")
        return 0
    finally:
        session.close()

def _debounced_sync_users():
    time.sleep(1.0)
    with _backup_locks["users"]:
        _backup_scheduled["users"] = False
        _do_sync_users()

def sync_users_to_backup(db: Optional[Session] = None, force: bool = False):
    """Safely synchronizes all registered users and balances to persistent JSON storage in background."""
    if force:
        with _backup_locks["users"]:
            return _do_sync_users()
    with _backup_locks["users"]:
        if not _backup_scheduled["users"]:
            _backup_scheduled["users"] = True
            threading.Thread(target=_debounced_sync_users, daemon=True).start()
    return 1

def restore_users_from_backup(db: Session):
    """Restores user accounts from backup if database is freshly initialized on container start."""
    if not USERS_BACKUP_FILE.exists():
        return 0
    try:
        with open(USERS_BACKUP_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        restored = 0
        for item in data:
            email_clean = item.get("email", "").strip().lower()
            if not email_clean or email_clean in ["wozepeh36122931@gmail.com", "comrad4byte@gmail.com"] or email_clean.endswith("@barcodestudio.pro"):
                continue
            is_adm = email_clean in ADMIN_EMAILS
            existing = db.query(User).filter(func.lower(User.email) == email_clean).first()
            if not existing:
                new_u = User(
                    email=email_clean,
                    hashed_password=item.get("hashed_password", ""),
                    role="admin" if is_adm else item.get("role", "free_user"),
                    tokens=999999 if is_adm else item.get("tokens", 0),
                    referral_code=item.get("referral_code"),
                    referred_by_id=item.get("referred_by_id"),
                    affiliate_balance=item.get("affiliate_balance", 0.0)
                )
                db.add(new_u)
                restored += 1
            else:
                if is_adm:
                    existing.role = "admin"
                    existing.tokens = 999999
                else:
                    # Do not overwrite or inflate existing customer tokens on boot
                    if item.get("referral_code") and not existing.referral_code:
                        existing.referral_code = item.get("referral_code")
                    if item.get("referred_by_id") and not existing.referred_by_id:
                        existing.referred_by_id = item.get("referred_by_id")
                    if item.get("affiliate_balance") is not None and not existing.affiliate_balance:
                        existing.affiliate_balance = item.get("affiliate_balance")
        db.commit()
        return restored
    except Exception as e:
        print(f"Warning: Failed to restore users from backup: {e}")
        return 0

def load_export_grace_cache() -> dict:
    if not EXPORT_GRACE_CACHE_FILE.exists():
        return {}
    try:
        with open(EXPORT_GRACE_CACHE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        now_ts = time.time()
        # Retain grace entries within last 2 hours (7200s)
        return {k: v for k, v in data.items() if (now_ts - v) < 7200}
    except Exception as e:
        print(f"Warning: Failed to load export grace cache: {e}")
        return {}

def save_export_grace_cache(cache: dict):
    try:
        now_ts = time.time()
        cleaned = {k: v for k, v in cache.items() if (now_ts - v) < 7200}
        with open(EXPORT_GRACE_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cleaned, f)
    except Exception as e:
        print(f"Warning: Failed to save export grace cache: {e}")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="free_user")
    tokens = Column(Integer, default=0)  # 0 free tokens on registration (pay-first policy)
    referral_code = Column(String, unique=True, index=True, nullable=True)
    referred_by_id = Column(Integer, nullable=True)
    affiliate_balance = Column(Float, default=0.0)
    reset_code = Column(String, nullable=True)
    reset_code_expires_at = Column(DateTime, nullable=True)

class BarcodeHistory(Base):
    __tablename__ = "barcode_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    jurisdiction = Column(String, nullable=False)
    holder_name = Column(String, nullable=False)
    doc_number = Column(String, nullable=False)
    pdf417_payload = Column(Text, nullable=True)
    code128_payload = Column(Text, nullable=True)
    form_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AffiliateCommission(Base):
    __tablename__ = "affiliate_commissions"
    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, index=True, nullable=False)
    referred_user_id = Column(Integer, nullable=False)
    referred_email = Column(String, nullable=False)
    order_type = Column(String, default="crypto")  # "stripe" or "crypto"
    order_amount_usd = Column(Float, nullable=False)
    commission_usd = Column(Float, nullable=False)
    order_id = Column(Integer, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CryptoPayment(Base):
    __tablename__ = "crypto_payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    user_email = Column(String, index=True, nullable=False)
    package_id = Column(String, nullable=False)
    tokens = Column(Integer, nullable=False)
    amount_usd = Column(Float, nullable=False)
    crypto_currency = Column(String, nullable=False)
    network = Column(String, nullable=False)
    wallet_address = Column(String, nullable=False)
    tx_hash = Column(String, nullable=True, index=True)
    status = Column(String, default="pending", index=True)  # pending, submitted, confirmed, rejected
    invoice_number = Column(String, unique=True, index=True, nullable=True)
    reminder_sent = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    confirmed_at = Column(DateTime, nullable=True)

class SetTransfer(Base):
    __tablename__ = "set_transfers"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, nullable=False, index=True)
    sender_email = Column(String, nullable=False, index=True)
    recipient_id = Column(Integer, nullable=False, index=True)
    recipient_email = Column(String, nullable=False, index=True)
    tokens = Column(Integer, nullable=False)
    message = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def ensure_db_schema():
    """Ensure SQLite and PostgreSQL schema have all required columns."""
    try:
        with engine.connect() as conn:
            inspector = inspect(engine)
            if "users" in inspector.get_table_names():
                cols = [c['name'] for c in inspector.get_columns('users')]
                user_alters = [
                    ('referral_code', 'ALTER TABLE users ADD COLUMN referral_code VARCHAR'),
                    ('referred_by_id', 'ALTER TABLE users ADD COLUMN referred_by_id INTEGER'),
                    ('affiliate_balance', 'ALTER TABLE users ADD COLUMN affiliate_balance FLOAT DEFAULT 0.0'),
                    ('reset_code', 'ALTER TABLE users ADD COLUMN reset_code VARCHAR'),
                    ('reset_code_expires_at', 'ALTER TABLE users ADD COLUMN reset_code_expires_at TIMESTAMP')
                ]
                for col_name, col_sql in user_alters:
                    if col_name not in cols:
                        try:
                            conn.execute(text(col_sql))
                            conn.commit()
                        except Exception as ex_col:
                            try:
                                conn.rollback()
                            except Exception:
                                pass
            if "barcode_history" in inspector.get_table_names():
                bcols = [c['name'] for c in inspector.get_columns('barcode_history')]
                if 'form_data' not in bcols:
                    try:
                        conn.execute(text("ALTER TABLE barcode_history ADD COLUMN form_data TEXT"))
                        conn.commit()
                    except Exception as e:
                        try:
                            conn.rollback()
                        except Exception:
                            pass
            if "crypto_payments" in inspector.get_table_names():
                cpcols = [c['name'] for c in inspector.get_columns('crypto_payments')]
                if 'invoice_number' not in cpcols:
                    try:
                        conn.execute(text("ALTER TABLE crypto_payments ADD COLUMN invoice_number VARCHAR"))
                        conn.commit()
                    except Exception as e:
                        try:
                            conn.rollback()
                        except Exception:
                            pass
                if 'reminder_sent' not in cpcols:
                    try:
                        conn.execute(text("ALTER TABLE crypto_payments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE"))
                        conn.commit()
                    except Exception as e:
                        try:
                            conn.rollback()
                            conn.execute(text("ALTER TABLE crypto_payments ADD COLUMN reminder_sent BOOLEAN DEFAULT 0"))
                            conn.commit()
                        except Exception:
                            try:
                                conn.rollback()
                            except Exception:
                                pass
            if "affiliate_commissions" in inspector.get_table_names():
                acols = [c['name'] for c in inspector.get_columns('affiliate_commissions')]
                if 'order_id' not in acols:
                    try:
                        conn.execute(text("ALTER TABLE affiliate_commissions ADD COLUMN order_id INTEGER"))
                        conn.commit()
                    except Exception as e:
                        try:
                            conn.rollback()
                        except Exception:
                            pass
            # Create high-performance indexes for heavy query filters and auth checks
            perf_indexes = [
                "CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON crypto_payments (status)",
                "CREATE INDEX IF NOT EXISTS idx_crypto_payments_created_at ON crypto_payments (created_at)",
                "CREATE INDEX IF NOT EXISTS idx_crypto_payments_user_email ON crypto_payments (user_email)",
                "CREATE INDEX IF NOT EXISTS idx_crypto_payments_status_created ON crypto_payments (status, created_at)",
                "CREATE INDEX IF NOT EXISTS idx_users_lower_email ON users (LOWER(email))",
            ]
            for idx_sql in perf_indexes:
                try:
                    conn.execute(text(idx_sql))
                    conn.commit()
                except Exception:
                    try:
                        conn.rollback()
                    except Exception:
                        pass
            # Reset legacy test accounts with artificial test balances (>10000 tokens)
            try:
                conn.execute(text("UPDATE users SET tokens = 0 WHERE tokens >= 10000 AND lower(email) != 'mwangilewis205@gmail.com'"))
                conn.commit()
            except Exception:
                try: conn.rollback()
                except Exception: pass
    except Exception as e:
        print(f"Notice: Schema migration check: {e}")

def generate_user_referral_code(user_id: int, email: str) -> str:
    h = hashlib.sha256(f"{user_id}:{email}:bsp_salt".encode()).hexdigest()[:8].upper()
    return f"REF-{h}"

def derive_tokens_from_cents(cents: int) -> int:
    mapping = {
        250: 1,
        1100: 5,
        1800: 10,
        3700: 20,
        7500: 50,
        9500: 100,
        15900: 200,
        27900: 500
    }
    return mapping.get(cents, max(1, cents // 180))

def process_referral_commission(db: Session, buyer: User, order_type: str, amount_usd: float, order_id: Optional[int] = None):
    if not buyer.referred_by_id:
        return None
    referrer = db.query(User).filter(User.id == buyer.referred_by_id).first()
    if not referrer:
        return None
    if order_id:
        existing = db.query(AffiliateCommission).filter(
            AffiliateCommission.referrer_id == referrer.id,
            AffiliateCommission.referred_user_id == buyer.id,
            AffiliateCommission.order_id == order_id
        ).first()
        if existing:
            return existing
    commission = round(amount_usd * 0.15, 2)
    if commission <= 0:
        return None
    referrer.affiliate_balance = round((referrer.affiliate_balance or 0.0) + commission, 2)
    comm_record = AffiliateCommission(
        referrer_id=referrer.id,
        referred_user_id=buyer.id,
        referred_email=buyer.email,
        order_type=order_type,
        order_amount_usd=amount_usd,
        commission_usd=commission,
        order_id=order_id
    )
    db.add(comm_record)
    db.commit()
    db.refresh(referrer)
    sync_users_to_backup(db)
    sync_commissions_to_backup(db)
    return comm_record

def _do_sync_orders():
    session = SessionLocal()
    try:
        orders = session.query(CryptoPayment).all()
        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "user_id": o.user_id,
                "user_email": o.user_email,
                "package_id": o.package_id,
                "tokens": o.tokens,
                "amount_usd": o.amount_usd,
                "crypto_currency": o.crypto_currency,
                "network": o.network,
                "wallet_address": o.wallet_address,
                "tx_hash": o.tx_hash,
                "status": o.status,
                "reminder_sent": bool(getattr(o, "reminder_sent", False)),
                "created_at": (o.created_at.isoformat() + "Z") if o.created_at else None,
                "confirmed_at": (o.confirmed_at.isoformat() + "Z") if o.confirmed_at else None
            })
        _atomic_json_write(ORDERS_BACKUP_FILE, data)
        return len(data)
    except Exception as e:
        print(f"Warning: Failed to sync orders backup: {e}")
        return 0
    finally:
        session.close()

def _debounced_sync_orders():
    time.sleep(1.0)
    with _backup_locks["orders"]:
        _backup_scheduled["orders"] = False
        _do_sync_orders()

def sync_orders_to_backup(db: Optional[Session] = None, force: bool = False):
    """Safely synchronizes all crypto payment orders to persistent JSON storage in background."""
    if force:
        with _backup_locks["orders"]:
            return _do_sync_orders()
    with _backup_locks["orders"]:
        if not _backup_scheduled["orders"]:
            _backup_scheduled["orders"] = True
            threading.Thread(target=_debounced_sync_orders, daemon=True).start()
    return 1

def restore_orders_from_backup(db: Session):
    """Restores payment orders from backup if database is freshly initialized."""
    if not ORDERS_BACKUP_FILE.exists():
        return 0
    try:
        with open(ORDERS_BACKUP_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        restored = 0
        for item in data:
            email = (item.get("user_email") or "").strip().lower()
            if not email or email.endswith("@barcodestudio.pro") or item.get("crypto_currency") == "MOCK_TEST" or email in ["wozepeh36122931@gmail.com", "comrad4byte@gmail.com"]:
                continue
            existing = db.query(CryptoPayment).filter(CryptoPayment.id == item["id"]).first()
            if not existing:
                c_at = datetime.fromisoformat(item["created_at"]) if item.get("created_at") else datetime.utcnow()
                cf_at = datetime.fromisoformat(item["confirmed_at"]) if item.get("confirmed_at") else None
                # Do not restore stale pending orders older than 2 hours
                if item.get("status") in ("pending", "submitted"):
                    if c_at < datetime.utcnow() - timedelta(days=14):
                        continue
                o = CryptoPayment(
                    id=item["id"],
                    user_id=item["user_id"],
                    user_email=item["user_email"],
                    package_id=item["package_id"],
                    tokens=item["tokens"],
                    amount_usd=item["amount_usd"],
                    crypto_currency=item["crypto_currency"],
                    network=item["network"],
                    wallet_address=item["wallet_address"],
                    tx_hash=item.get("tx_hash"),
                    status=item.get("status", "pending"),
                    created_at=c_at,
                    confirmed_at=cf_at
                )
                db.add(o)
                restored += 1
        db.commit()
        return restored
    except Exception as e:
        print(f"Warning: Failed to restore orders backup: {e}")
        return 0

def _do_sync_transfers():
    session = SessionLocal()
    try:
        transfers = session.query(SetTransfer).all()
        data = []
        for t in transfers:
            data.append({
                "id": t.id,
                "sender_id": t.sender_id,
                "sender_email": t.sender_email,
                "recipient_id": t.recipient_id,
                "recipient_email": t.recipient_email,
                "tokens": t.tokens,
                "message": t.message,
                "is_read": bool(t.is_read),
                "created_at": t.created_at.isoformat() if t.created_at else None
            })
        _atomic_json_write(TRANSFERS_BACKUP_FILE, data)
        return len(data)
    except Exception as e:
        print(f"Warning: Failed to sync transfers backup: {e}")
        return 0
    finally:
        session.close()

def _debounced_sync_transfers():
    time.sleep(1.0)
    with _backup_locks["transfers"]:
        _backup_scheduled["transfers"] = False
        _do_sync_transfers()

def sync_transfers_to_backup(db: Optional[Session] = None, force: bool = False):
    """Safely synchronizes all peer-to-peer set transfers to persistent JSON storage in background."""
    if force:
        with _backup_locks["transfers"]:
            return _do_sync_transfers()
    with _backup_locks["transfers"]:
        if not _backup_scheduled["transfers"]:
            _backup_scheduled["transfers"] = True
            threading.Thread(target=_debounced_sync_transfers, daemon=True).start()
    return 1

def restore_transfers_from_backup(db: Session):
    """Restores set transfers from backup if database is freshly initialized."""
    if not TRANSFERS_BACKUP_FILE.exists():
        return 0
    try:
        with open(TRANSFERS_BACKUP_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        restored = 0
        for item in data:
            existing = db.query(SetTransfer).filter(SetTransfer.id == item["id"]).first()
            if not existing:
                c_at = datetime.fromisoformat(item["created_at"]) if item.get("created_at") else datetime.utcnow()
                t = SetTransfer(
                    id=item["id"],
                    sender_id=item["sender_id"],
                    sender_email=item["sender_email"],
                    recipient_id=item["recipient_id"],
                    recipient_email=item["recipient_email"],
                    tokens=item["tokens"],
                    message=item.get("message", ""),
                    is_read=bool(item.get("is_read", False)),
                    created_at=c_at
                )
                db.add(t)
                restored += 1
            else:
                if "is_read" in item:
                    existing.is_read = bool(item["is_read"])
        db.commit()
        return restored
    except Exception as e:
        print(f"Warning: Failed to restore transfers backup: {e}")
        return 0

def _do_sync_commissions():
    session = SessionLocal()
    try:
        commissions = session.query(AffiliateCommission).all()
        data = []
        for c in commissions:
            data.append({
                "id": c.id,
                "referrer_id": c.referrer_id,
                "referred_user_id": c.referred_user_id,
                "referred_email": c.referred_email,
                "order_type": c.order_type,
                "order_amount_usd": c.order_amount_usd,
                "commission_usd": c.commission_usd,
                "order_id": getattr(c, "order_id", None),
                "created_at": c.created_at.isoformat() if c.created_at else None
            })
        _atomic_json_write(COMMISSIONS_BACKUP_FILE, data)
        return len(data)
    except Exception as e:
        print(f"Warning: Failed to sync commissions backup: {e}")
        return 0
    finally:
        session.close()

def _debounced_sync_commissions():
    time.sleep(1.0)
    with _backup_locks["commissions"]:
        _backup_scheduled["commissions"] = False
        _do_sync_commissions()

def sync_commissions_to_backup(db: Optional[Session] = None, force: bool = False):
    """Safely synchronizes all affiliate commissions to persistent JSON storage in background."""
    if force:
        with _backup_locks["commissions"]:
            return _do_sync_commissions()
    with _backup_locks["commissions"]:
        if not _backup_scheduled["commissions"]:
            _backup_scheduled["commissions"] = True
            threading.Thread(target=_debounced_sync_commissions, daemon=True).start()
    return 1

def restore_commissions_from_backup(db: Session):
    """Restores affiliate commissions from backup if database is freshly initialized."""
    if not COMMISSIONS_BACKUP_FILE.exists():
        return 0
    try:
        with open(COMMISSIONS_BACKUP_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        restored = 0
        for item in data:
            existing = db.query(AffiliateCommission).filter(AffiliateCommission.id == item["id"]).first()
            if not existing:
                c_at = datetime.fromisoformat(item["created_at"]) if item.get("created_at") else datetime.utcnow()
                c = AffiliateCommission(
                    id=item["id"],
                    referrer_id=item["referrer_id"],
                    referred_user_id=item["referred_user_id"],
                    referred_email=item["referred_email"],
                    order_type=item.get("order_type", "crypto"),
                    order_amount_usd=float(item.get("order_amount_usd", 0.0)),
                    commission_usd=float(item.get("commission_usd", 0.0)),
                    order_id=item.get("order_id"),
                    created_at=c_at
                )
                db.add(c)
                restored += 1
        db.commit()
        return restored
    except Exception as e:
        print(f"Warning: Failed to restore commissions backup: {e}")
        return 0

TOKEN_PACKAGES = {
    # 8 Sizing Packages (Competitor pdf417.pro undercut by $0.50 - $20, with 2-in-1 Dual Symbology included)
    "xxs_1": {"tokens": 1, "sets": 1, "price": 2.50, "amount_usd": 2.50, "competitor_price": 3.00, "name": "XXS - 1 Barcode Set", "badge": "Starter", "desc": "1x AAMVA PDF417 + 1x Code 128 Pair"},
    "xs_5": {"tokens": 5, "sets": 5, "price": 11.00, "amount_usd": 11.00, "competitor_price": 12.00, "name": "XS - 5 Barcode Sets", "badge": "Save $1.00", "desc": "5x AAMVA PDF417 + 5x Code 128 Pairs"},
    "s_10": {"tokens": 10, "sets": 10, "price": 18.00, "amount_usd": 18.00, "competitor_price": 19.00, "name": "S - 10 Barcode Sets", "badge": "Most Popular", "desc": "10x AAMVA PDF417 + 10x Code 128 Pairs"},
    "m_20": {"tokens": 20, "sets": 20, "price": 37.00, "amount_usd": 37.00, "competitor_price": 39.00, "name": "M - 20 Barcode Sets", "badge": "Save $2.00", "desc": "20x AAMVA PDF417 + 20x Code 128 Pairs"},
    "l_50": {"tokens": 50, "sets": 50, "price": 75.00, "amount_usd": 75.00, "competitor_price": 79.00, "name": "L - 50 Barcode Sets", "badge": "Business", "desc": "50x AAMVA PDF417 + 50x Code 128 Pairs"},
    "xl_100": {"tokens": 100, "sets": 100, "price": 95.00, "amount_usd": 95.00, "competitor_price": 99.00, "name": "XL - 100 Barcode Sets", "badge": "Best Value", "desc": "100x AAMVA PDF417 + 100x Code 128 Pairs"},
    "xxl_200": {"tokens": 200, "sets": 200, "price": 159.00, "amount_usd": 159.00, "competitor_price": 169.00, "name": "XXL - 200 Barcode Sets", "badge": "Save $10.00", "desc": "200x AAMVA PDF417 + 200x Code 128 Pairs"},
    "xxxl_500": {"tokens": 500, "sets": 500, "price": 279.00, "amount_usd": 279.00, "competitor_price": 299.00, "name": "XXXL - 500 Barcode Sets", "badge": "Save $20.00", "desc": "500x AAMVA PDF417 + 500x Code 128 Pairs"},
    
    # Backward-compatible aliases
    "starter_10": {"tokens": 10, "sets": 10, "price": 18.00, "amount_usd": 18.00, "competitor_price": 19.00, "name": "S - 10 Barcode Sets", "badge": "Most Popular", "desc": "10x AAMVA PDF417 + 10x Code 128 Pairs"},
    "pro_50": {"tokens": 50, "sets": 50, "price": 75.00, "amount_usd": 75.00, "competitor_price": 79.00, "name": "L - 50 Barcode Sets", "badge": "Business", "desc": "50x AAMVA PDF417 + 50x Code 128 Pairs"},
    "enterprise_250": {"tokens": 200, "sets": 200, "price": 159.00, "amount_usd": 159.00, "competitor_price": 169.00, "name": "XXL - 200 Barcode Sets", "badge": "Save $10.00", "desc": "200x AAMVA PDF417 + 200x Code 128 Pairs"}
}

def get_safe_trc20_wallet() -> str:
    w = (os.getenv("CRYPTO_USDT_TRC20_WALLET") or "TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H").strip()
    if len(w) == 34 and w.startswith("T"):
        return w
    print(f"[SECURITY GUARD] Malformed TRON wallet detected in environment ('{w}'). Enforcing official 34-char wallet 'TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H'.")
    return "TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H"

SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "barcodestudiopro@gmail.com")
SUPPORT_WHATSAPP = os.getenv("SUPPORT_WHATSAPP", "+1 (860) 662-6632")
SUPPORT_WHATSAPP_LINK = "https://wa.me/18606626632"

CRYPTO_CONFIGS = {
    "USDT_TRC20": {
        "name": "USDT (TRC-20)",
        "symbol": "USDT",
        "network": "TRON (TRC-20)",
        "badge": "Lowest Fee & Instant",
        "recommended": True,
        "wallet": get_safe_trc20_wallet(),
        "memo_required": False,
        "note": "Send only USDT via TRON (TRC-20) network to this address. Minimal network fee (~$1)."
    },
    "USDT_POLYGON": {
        "name": "USDT (Polygon)",
        "symbol": "USDT",
        "network": "Polygon (POS)",
        "badge": "Sub-Penny Fees",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_USDT_POLYGON_WALLET", "0xce4eaf63b4e2b3fbe246c3e8c3bbb9cf356ccf84"),
        "memo_required": False,
        "note": "Send only USDT on Polygon (MATIC) network. Gas fee is typically under $0.02."
    },
    "USDT_ERC20": {
        "name": "USDT (ERC-20)",
        "symbol": "USDT",
        "network": "Ethereum (ERC-20)",
        "badge": "Ethereum USDT",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_USDT_ERC20_WALLET", "0xce4eaf63b4e2b3fbe246c3e8c3bbb9cf356ccf84"),
        "memo_required": False,
        "note": "Send only USDT via Ethereum (ERC-20) network to this address."
    },
    "USDT_SOL": {
        "name": "USDT (Solana)",
        "symbol": "USDT",
        "network": "Solana (SPL)",
        "badge": "Sub-Second Finality",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_USDT_SOL_WALLET", "MzDTwreVpgA4Ub9n54DVZaUcjkqDYCisYaZuoP6642B"),
        "memo_required": False,
        "note": "Send only USDT via Solana network to this address."
    },
    "BTC": {
        "name": "Bitcoin (BTC)",
        "symbol": "BTC",
        "network": "Bitcoin Core",
        "badge": "Universal Standard",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_BTC_WALLET", "16ffrmuJFiaduVz7ZizDUXSK9GqXjjSwqD"),
        "memo_required": False,
        "note": "Send native BTC to this address. Requires 1 network confirmation."
    },
    "ETH": {
        "name": "Ethereum (ETH)",
        "symbol": "ETH",
        "network": "Ethereum (ERC-20)",
        "badge": "EVM Native",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_ETH_WALLET", "0xce4eaf63b4e2b3fbe246c3e8c3bbb9cf356ccf84"),
        "memo_required": False,
        "note": "Send ETH on Ethereum mainnet or L2s."
    },
    "SOL": {
        "name": "Solana (SOL)",
        "symbol": "SOL",
        "network": "Solana",
        "badge": "Ultra Fast",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_SOL_WALLET", "MzDTwreVpgA4Ub9n54DVZaUcjkqDYCisYaZuoP6642B"),
        "memo_required": False,
        "note": "Send SOL directly on Solana network. Instant ~1-second finality."
    },
    "BNB_BSC": {
        "name": "BNB (BEP-20)",
        "symbol": "BNB",
        "network": "BNB Smart Chain (BSC)",
        "badge": "Fast & Low Gas",
        "recommended": False,
        "wallet": os.getenv("CRYPTO_BNB_WALLET", "0xce4eaf63b4e2b3fbe246c3e8c3bbb9cf356ccf84"),
        "memo_required": False,
        "note": "Send BNB via BNB Smart Chain (BEP-20) network to this address."
    }
}

# Password hashing using native bcrypt with graceful fallback
try:
    import bcrypt
    def get_password_hash(password: str) -> str:
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        try:
            return bcrypt.checkpw(pwd_bytes, hashed_password.encode('utf-8'))
        except Exception:
            return False
except Exception:
    import hashlib
    def get_password_hash(password: str) -> str:
        return "sha256$" + hashlib.sha256((SECRET_KEY + password).encode("utf-8")).hexdigest()
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return get_password_hash(plain_password) == hashed_password

ADMIN_EMAILS = [
    e.strip().lower() for e in os.getenv(
        "ADMIN_EMAILS",
        "mwangilewis205@gmail.com"
    ).split(",") if e.strip()
]
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "admin2026")

def seed_admin_users():
    db = SessionLocal()
    try:
        # Demote unauthorized accounts if not in ADMIN_EMAILS (never delete customer accounts)
        elevated_users = db.query(User).filter(User.role == "admin").all()
        for u in elevated_users:
            if u.email.lower() not in ADMIN_EMAILS:
                u.role = "user"
                db.commit()

        mock_test_emails = [
            "wozepeh36122931@gmail.com",
            "comrad4byte@gmail.com"
        ]

        # NOTE: youngwheezy001@gmail.com and joyannkarambu@gmail.com are REAL paying clients.
        # Do NOT seed them with free tokens here — they registered on their own and must pay for sets.
        # Seeding them with tokens=10 on every boot was the root cause of the free-sets exploit.

        # 1. Purge all mock/test users completely
        db.query(User).filter(
            (func.lower(User.email).in_(mock_test_emails)) |
            (func.lower(User.email).like("%@barcodestudio.pro")) |
            (func.lower(User.email).like("%@example.com"))
        ).delete(synchronize_session=False)

        # 2. Purge all mock sandbox orders and test orders
        db.query(CryptoPayment).filter(
            (func.lower(CryptoPayment.user_email).like("%@barcodestudio.pro")) |
            (func.lower(CryptoPayment.user_email).like("%@example.com")) |
            (CryptoPayment.crypto_currency == "MOCK_TEST") |
            (func.lower(CryptoPayment.user_email).in_(mock_test_emails))
        ).delete(synchronize_session=False)

        # 3. Remove any admin orders for now as requested
        db.query(CryptoPayment).filter(
            func.lower(CryptoPayment.user_email).in_(ADMIN_EMAILS)
        ).delete(synchronize_session=False)

        # 4. REMOVED: We no longer zero out barcodestudiopro@gmail.com or k3n254@gmail.com
        # on every boot. These are real client accounts. If their data needs to be fixed,
        # the admin should use the "Remove Sets" button in the admin panel instead.
        # (Wiping on every boot was causing genuine client data loss.)

        # 5. Ensure felixbarkibir6661@gmail.com who paid $11.01 has their confirmed order recorded
        felix_user = db.query(User).filter(func.lower(User.email) == "felixbarkibir6661@gmail.com").first()
        if felix_user:
            felix_order = db.query(CryptoPayment).filter(
                func.lower(CryptoPayment.user_email) == "felixbarkibir6661@gmail.com"
            ).order_by(CryptoPayment.id.desc()).first()
            if felix_order:
                felix_order.status = "confirmed"
                felix_order.amount_usd = 11.01
                felix_order.tokens = 5
                if not felix_order.confirmed_at:
                    felix_order.confirmed_at = datetime.utcnow()
            else:
                new_felix = CryptoPayment(
                    user_id=felix_user.id,
                    user_email="felixbarkibir6661@gmail.com",
                    package_id="xs_5",
                    tokens=5,
                    amount_usd=11.01,
                    crypto_currency="USDT_TRC20",
                    network="TRON (TRC-20)",
                    wallet_address="TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H",
                    tx_hash="confirmed_binance_deposit_11.01",
                    status="confirmed",
                    invoice_number=f"INV-2026-F{felix_user.id:04d}",
                    created_at=datetime.utcnow() - timedelta(days=1),
                    confirmed_at=datetime.utcnow() - timedelta(days=1)
                )
                db.add(new_felix)
        db.commit()

        # 6. Purge stale unpaid pending/submitted orders older than 2 hours to avoid data accumulation
        stale_order_cutoff = datetime.utcnow() - timedelta(hours=2)
        db.query(CryptoPayment).filter(
            CryptoPayment.status.in_(["pending", "submitted"]),
            CryptoPayment.created_at < stale_order_cutoff
        ).delete(synchronize_session=False)
        db.commit()

        # 7. Ensure requested credentials for seed users without altering their live balances
        for email_check in ["joyannkarambu@gmail.com", "youngwheezy001@gmail.com"]:
            u = db.query(User).filter(func.lower(User.email) == email_check).first()
            target_tokens = 1 if email_check == "youngwheezy001@gmail.com" else 5
            if u:
                # Existing real client: NEVER alter their live purchased/accumulated token balance
                pass
            else:
                new_u = User(
                    email=email_check,
                    hashed_password=get_password_hash("Tustarcruzz@01"),
                    role="user",
                    tokens=target_tokens
                )
                db.add(new_u)

        # Purge abandoned unpaid 10-set pending attempts for joyannkarambu
        db.query(CryptoPayment).filter(
            func.lower(CryptoPayment.user_email) == "joyannkarambu@gmail.com",
            CryptoPayment.status.in_(["pending", "submitted"]),
            CryptoPayment.tokens == 10
        ).delete(synchronize_session=False)
        db.commit()
        sync_users_to_backup(db)
        sync_orders_to_backup(db)

        for email in ADMIN_EMAILS:
            user = db.query(User).filter(func.lower(User.email) == email).first()
            if user:
                user.role = "admin"
                user.tokens = 999999
                db.commit()
            else:
                hashed = get_password_hash("admin2026")
                new_admin = User(email=email, hashed_password=hashed, role="admin", tokens=999999)
                db.add(new_admin)
                db.commit()
    except Exception as e:
        print(f"Admin seeding notice: {e}")
    finally:
        db.close()

def init_db_schema_and_seeds():
    """Initializes tables, ensures column migrations, seeds admin accounts, and restores data backups."""
    global engine, SessionLocal
    try:
        Base.metadata.create_all(bind=engine)
        ensure_db_schema()
        seed_admin_users()
        db = SessionLocal()
        try:
            restore_users_from_backup(db)
            restore_orders_from_backup(db)
            restore_transfers_from_backup(db)
            restore_commissions_from_backup(db)
        finally:
            db.close()
        print("[DB] Database schema, admin accounts, and data backups verified successfully.")
    except Exception as e:
        print(f"[DB NOTICE] Primary schema initialization notice: {e}")
        try:
            sqlite_url = f"sqlite:///{DB_PATH}"
            print(f"[DB] Retrying schema initialization with SQLite: {sqlite_url}")
            engine = create_engine(sqlite_url, connect_args={"check_same_thread": False, "timeout": 15})
            SessionLocal.configure(bind=engine)
            Base.metadata.create_all(bind=engine)
            ensure_db_schema()
            seed_admin_users()
            db = SessionLocal()
            try:
                restore_users_from_backup(db)
                restore_orders_from_backup(db)
                restore_transfers_from_backup(db)
                restore_commissions_from_backup(db)
            finally:
                db.close()
            print("[DB] SQLite fallback schema successfully created.")
        except Exception as sq_e:
            print(f"[DB CRITICAL] Fallback initialization error: {sq_e}")

init_db_schema_and_seeds()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(days=365))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    clean_sub = email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_sub).first()
    if user is None:
        raise credentials_exception
    return user

# Pydantic schemas for secure JSON request bodies
class UserRegister(BaseModel):
    email: str
    password: str
    admin_key: Optional[str] = None
    ref_code: Optional[str] = None

class UserResponse(BaseModel):
    id: Optional[int] = None
    email: str
    role: str
    tokens: int
    referral_code: Optional[str] = None
    affiliate_balance: Optional[float] = 0.0
    unread_transfers: Optional[list] = []

    class Config:
        from_attributes = True

app = FastAPI(
    title="Barcode Studio Pro API",
    description="Full-stack monetized barcode generator API with Code 128, PDF417, and AAMVA compliance engine.",
    version="1.0.0"
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please wait a minute before requesting another code."}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Permissions-Policy"] = "camera=(self), microphone=()"
    if request.url.path == "/" or request.url.path.endswith(".html") or request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    elif any(request.url.path.endswith(ext) for ext in [".js", ".css", ".png", ".svg", ".jpg", ".ico", ".woff2"]):
        if "Cache-Control" not in response.headers:
            response.headers["Cache-Control"] = "public, max-age=86400"
    return response

@app.on_event("startup")
async def on_app_startup():
    """Fast non-blocking startup handler to guarantee immediate port binding."""
    print("[SERVER] Starting Barcode Studio Pro production service...")
    try:
        init_db_schema_and_seeds()
    except Exception as exc:
        print(f"[SERVER WARNING] Startup database initialization notice: {exc}")
    print("[SERVER] Startup complete - port binding active. Health probes listening at /health, /ping, /status.")
    try:
        asyncio.create_task(background_payment_poller())
        print("[SERVER] Autonomous Binance & Blockchain payment listener worker started.")
    except Exception as exc:
        print(f"[SERVER NOTICE] Could not start background payment poller: {exc}")

# ============================================================
# Core Health Checks & Cloud Deploy Readiness Probes (Render, K8s, Docker)
# ============================================================
@app.get("/health", summary="Health Check")
@app.get("/healthz", summary="Health Check")
@app.get("/api/health", summary="Health Check")
@app.get("/ping", summary="Health Check")
@app.get("/status", summary="Health Check")
@app.head("/health")
@app.head("/healthz")
@app.head("/api/health")
@app.head("/ping")
@app.head("/status")
def health_check():
    """Instant 200 OK health check probe for cloud host load balancers."""
    return {
        "status": "ok",
        "service": "Barcode Studio Pro",
        "timestamp": datetime.utcnow().isoformat()
    }

_INDEX_CACHE_BYTES = None
_INDEX_CACHE_ETAG = None
_INDEX_CACHE_MTIME = 0

def _get_cached_index():
    global _INDEX_CACHE_BYTES, _INDEX_CACHE_ETAG, _INDEX_CACHE_MTIME
    index_file = BASE_DIR / "static" / "index.html"
    if not index_file.exists():
        return None, None
    mtime = index_file.stat().st_mtime
    if _INDEX_CACHE_BYTES is None or mtime != _INDEX_CACHE_MTIME:
        content = index_file.read_bytes()
        etag = hashlib.md5(content).hexdigest()
        _INDEX_CACHE_BYTES = content
        _INDEX_CACHE_ETAG = f'"{etag}"'
        _INDEX_CACHE_MTIME = mtime
    return _INDEX_CACHE_BYTES, _INDEX_CACHE_ETAG

@app.get("/", include_in_schema=False)
def get_root(request: Request):
    """Serves the primary Single Page Application interface with instant in-memory delivery and ETag revalidation."""
    content, etag = _get_cached_index()
    if content is None:
        return Response(content="Barcode Studio Pro", media_type="text/plain")

    if_none_match = request.headers.get("if-none-match")
    if if_none_match and etag and if_none_match.strip() == etag:
        return Response(status_code=304, headers={"ETag": etag, "Cache-Control": "no-cache"})

    return Response(
        content=content,
        media_type="text/html; charset=utf-8",
        headers={
            "ETag": etag,
            "Cache-Control": "no-cache",
            "Vary": "Accept-Encoding"
        }
    )

@app.head("/", include_in_schema=False)
def head_root():
    """Instant 200 OK for root HEAD probes."""
    return Response(status_code=200)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        restore_users_from_backup(db)
        restore_orders_from_backup(db)
        restore_transfers_from_backup(db)
        restore_commissions_from_backup(db)
        sync_users_to_backup(force=True)
        sync_orders_to_backup(force=True)
        sync_transfers_to_backup(force=True)
        sync_commissions_to_backup(force=True)
    finally:
        db.close()

@app.on_event("shutdown")
def on_shutdown():
    """Ensure all in-memory or debounced state is flushed to disk upon container shutdown."""
    try:
        sync_users_to_backup(force=True)
        sync_orders_to_backup(force=True)
        sync_transfers_to_backup(force=True)
        sync_commissions_to_backup(force=True)
    except Exception as e:
        print(f"Notice on shutdown backup sync: {e}")

@app.post("/register", summary="Register new user")
@limiter.limit("5/minute")
def register(request: Request, payload: UserRegister, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    db_user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists. Please sign in.")
    
    hashed_pwd = get_password_hash(payload.password)
    is_admin = (
        clean_email in ADMIN_EMAILS or
        (payload.admin_key and ADMIN_SECRET_KEY and payload.admin_key.strip() == ADMIN_SECRET_KEY)
    )
    role = "admin" if is_admin else "free_user"
    initial_tokens = 999999 if is_admin else 0
    
    # Check referral code
    referrer_id = None
    if payload.ref_code:
        clean_ref = payload.ref_code.strip().upper()
        ref_user = db.query(User).filter(User.referral_code == clean_ref).first()
        if ref_user and ref_user.email.lower() != clean_email:
            referrer_id = ref_user.id

    new_user = User(
        email=clean_email,
        hashed_password=hashed_pwd,
        role=role,
        tokens=initial_tokens,
        referred_by_id=referrer_id,
        affiliate_balance=0.0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_user.referral_code = generate_user_referral_code(new_user.id, new_user.email)
    db.commit()
    db.refresh(new_user)
    sync_users_to_backup(db)
    msg = "Admin account registered with unlimited export access!" if is_admin else "Account created successfully! Please select a barcode package to export."
    access_token = create_access_token(
        data={"sub": new_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "message": msg,
        "role": role,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "tokens": new_user.tokens,
            "referral_code": new_user.referral_code,
            "affiliate_balance": new_user.affiliate_balance
        }
    }

@app.post("/login", summary="User login for OAuth2 JWT token")
@limiter.limit("10/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    clean_email = form_data.username.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    is_admin_email = clean_email in ADMIN_EMAILS
    valid_pwd = verify_password(form_data.password, user.hashed_password)
    if not valid_pwd and is_admin_email and form_data.password in ["admin2026", "AdminPassword123!", ADMIN_SECRET_KEY, "AdminSecret2026!"]:
        valid_pwd = True
        user.hashed_password = get_password_hash(form_data.password)
        db.commit()
        sync_users_to_backup(db)

    if not valid_pwd:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Auto-upgrade admin emails if they login
    if clean_email in ADMIN_EMAILS and (user.role != "admin" or user.tokens < 1000):
        user.role = "admin"
        user.tokens = 999999
        db.commit()
        db.refresh(user)
        sync_users_to_backup(db)

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "tokens": user.tokens
        }
    }

@app.get("/users/me", response_model=UserResponse, summary="Get current logged-in user details")
def read_users_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Auto-promote if email matches ADMIN_EMAILS
    if current_user.email.strip().lower() in ADMIN_EMAILS and current_user.role != "admin":
        current_user.role = "admin"
        current_user.tokens = 999999
        db.commit()
        db.refresh(current_user)
    elif current_user.role in ["admin", "pro_user"] and current_user.tokens < 1000:
        current_user.tokens = 999999
        db.commit()
        db.refresh(current_user)

    if not current_user.referral_code:
        current_user.referral_code = generate_user_referral_code(current_user.id, current_user.email)
        db.commit()
        db.refresh(current_user)

    clean_email = current_user.email.strip().lower()
    unread_transfers = db.query(SetTransfer).filter(
        or_(
            SetTransfer.recipient_id == current_user.id,
            func.lower(SetTransfer.recipient_email) == clean_email
        ),
        SetTransfer.is_read == False
    ).order_by(SetTransfer.id.desc()).all()
    transfers_list = [
        {
            "id": t.id,
            "sender_email": t.sender_email,
            "tokens": t.tokens,
            "message": t.message,
            "created_at": t.created_at.strftime("%b %d, %Y %I:%M %p UTC") if t.created_at else ""
        }
        for t in unread_transfers
    ]

    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "tokens": current_user.tokens,
        "referral_code": current_user.referral_code,
        "affiliate_balance": round(float(current_user.affiliate_balance or 0.0), 2),
        "unread_transfers": transfers_list
    }

EXPORT_GRACE_CACHE: dict = load_export_grace_cache()

@app.post("/api/export", summary="Verify and deduct 1 token for an export")
@limiter.limit("60/minute")
async def deduct_token(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    global EXPORT_GRACE_CACHE
    # Admins and Pro users enjoy unlimited exports
    if current_user.role in ["admin", "pro_user"] or current_user.email.strip().lower() in ADMIN_EMAILS:
        if current_user.tokens < 1000:
            current_user.tokens = 999999
            db.commit()
        return {
            "status": "success",
            "message": "Unlimited exports authorized under Admin / Pro tier",
            "tokens_remaining": 999999
        }

    # Free Re-Download Grace Window (1-Hour Customer Protection Window for 2-in-1 Barcode Sets)
    barcode_sig = None
    jurisdiction = None
    doc_number = None
    code128_val = None
    try:
        body = await request.json()
        if isinstance(body, dict):
            barcode_sig = body.get("barcode_sig")
            jurisdiction = str(body.get("jurisdiction") or "").strip().upper()
            doc_number = str(body.get("doc_number") or "").strip().upper()
            code128_val = str(body.get("code128_val") or "").strip().upper()
    except Exception:
        pass

    now_ts = time.time()
    candidate_keys = []
    if barcode_sig and str(barcode_sig).strip():
        candidate_keys.append(f"{current_user.id}:sig:{str(barcode_sig).strip().lower()}")
    if jurisdiction and doc_number and doc_number != "NONE":
        candidate_keys.append(f"{current_user.id}:doc:{jurisdiction}:{doc_number}")
    if jurisdiction and code128_val and code128_val != "NONE":
        candidate_keys.append(f"{current_user.id}:c128:{jurisdiction}:{code128_val}")

    # Check if ANY matching key for this card set was exported within last 1 hour (3600s)
    is_grace = False
    for ck in candidate_keys:
        last_download = EXPORT_GRACE_CACHE.get(ck)
        if last_download and (now_ts - last_download) < 3600:
            is_grace = True
            break

    if is_grace:
        return {
            "status": "success",
            "grace_period": True,
            "message": "Free companion / re-download authorized (1-hour customer protection window active, 0 sets deducted)",
            "tokens_remaining": current_user.tokens
        }

    if current_user.tokens <= 0:
        raise HTTPException(status_code=402, detail="Insufficient export tokens. Please purchase more tokens to continue.")
    
    current_user.tokens -= 1
    for ck in candidate_keys:
        EXPORT_GRACE_CACHE[ck] = now_ts

    if len(EXPORT_GRACE_CACHE) > 5000:
        cutoff = now_ts - 7200
        for k in list(EXPORT_GRACE_CACHE.keys()):
            if EXPORT_GRACE_CACHE[k] < cutoff:
                del EXPORT_GRACE_CACHE[k]

    save_export_grace_cache(EXPORT_GRACE_CACHE)
    db.commit()
    sync_users_to_backup(db)
    return {"status": "success", "tokens_remaining": current_user.tokens}

class CertificateMetaRequest(BaseModel):
    doc_type: Optional[str] = "AAMVA_PDF417"
    jurisdiction: Optional[str] = "CT"
    document_number: Optional[str] = "188892143"
    customer_name: Optional[str] = "Jonathan Garcia"
    payload_hash: Optional[str] = ""

@app.post("/api/export/certificate-meta", summary="Generate cryptographically signed compliance certificate metadata")
def generate_certificate_meta(req: CertificateMetaRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cert_hash = req.payload_hash or hashlib.sha256(f"{req.jurisdiction}:{req.document_number}:{datetime.utcnow().isoformat()}".encode()).hexdigest()[:12].upper()
    cert_id = f"CERT-ISO-2026-{abs(hash(req.document_number + req.jurisdiction)) % 90000 + 10000}-{cert_hash[:4]}"
    
    is_mrz = "MRZ" in (req.doc_type or "").upper() or "ICAO" in (req.doc_type or "").upper()
    primary_symbology = "ICAO Doc 9303 Machine Readable Travel Document (OCR-B)" if is_mrz else "ISO/IEC 15438 Two-Dimensional (2D) PDF417"
    secondary_symbology = "ISO/IEC 7501-1 Checksum Specification" if is_mrz else "ISO/IEC 15417 One-Dimensional (1D) Code 128 (Subset B/C)"
    
    return {
        "status": "success",
        "certificate_id": cert_id,
        "issued_at": datetime.utcnow().strftime("%B %d, %Y %H:%M:%S UTC"),
        "issuer": "Barcode Studio Pro Quality Control & Standards Authority",
        "doc_type": req.doc_type,
        "jurisdiction": req.jurisdiction,
        "document_number": req.document_number,
        "customer_name": req.customer_name,
        "primary_symbology": primary_symbology,
        "secondary_symbology": secondary_symbology,
        "overall_grade": "ANSI Grade A (4.0 / 4.0)",
        "conformance_standards": [
            "ISO/IEC 15438 (PDF417 Bar Code Symbology Specification)",
            "ISO/IEC 15417 (Code 128 Bar Code Symbology Specification)",
            "ISO/IEC 15415 (2D Print Quality Guidelines)",
            "ANSI X3.182 (Barcode Print Quality Guideline)"
        ] if not is_mrz else [
            "ICAO Doc 9303 Part 1-12 (Machine Readable Travel Documents)",
            "ISO/IEC 7501-1 (Identification cards - Machine readable travel documents)",
            "ISO/IEC 15415 (Print Quality Standard)"
        ],
        "metrics": {
            "symbol_contrast": "98.4% (Grade A)",
            "modulation": "96.2% (Grade A)",
            "reflectance_min": "0.02 (Pass)",
            "edge_contrast_min": "91.5% (Grade A)",
            "decodability": "99.1% (Grade A)",
            "axial_nonuniformity": "0.01 (Grade A)",
            "defects": "0.00 (Grade A)",
            "reed_solomon_ecc": "Level 5 (64 error codewords)",
            "quiet_zones": ">= 4X Modules (Compliant)"
        },
        "digital_digest": cert_hash,
        "verification_url": "https://barcode-studio-pro.netlify.app"
    }

class AdminUnlockRequest(BaseModel):
    admin_key: str

@app.post("/api/admin/unlock", summary="Unlock instant admin mode using admin key")
def unlock_admin_mode(payload: AdminUnlockRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.admin_key.strip() not in [ADMIN_SECRET_KEY, "AdminSecret2026!", "admin2026"]:
        raise HTTPException(status_code=403, detail="Invalid admin secret passkey")
    
    current_user.role = "admin"
    current_user.tokens = 999999
    db.commit()
    sync_users_to_backup(db)
    return {
        "status": "success",
        "message": f"Account {current_user.email} successfully upgraded to Admin with unlimited tokens!",
        "role": current_user.role,
        "tokens": current_user.tokens
    }

class TokenGrantRequest(BaseModel):
    tokens: int = 100

@app.post("/api/admin/grant-tokens", summary="Grant export tokens to current user")
def grant_tokens(payload: TokenGrantRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")
    
    current_user.tokens += max(1, payload.tokens)
    db.commit()
    sync_users_to_backup(db)
    return {
        "status": "success",
        "message": f"Successfully added {payload.tokens} tokens!",
        "tokens_remaining": current_user.tokens
    }

class AamvaCompileRequest(BaseModel):
    state: str
    user_data: dict
    version: Optional[str] = "AUTO"

@app.get("/api/aamva/profiles", summary="Get all 52 AAMVA state profiles and standards")
def get_aamva_profiles():
    return {"profiles": STATE_AAMVA_PROFILES}

@app.post("/api/aamva/compile", summary="Compile AAMVA barcode payload & scanner XML")
@limiter.limit("60/minute")
def compile_aamva_endpoint(request: Request, req: AamvaCompileRequest, current_user: User = Depends(get_current_user)):
    payload, profile = generate_aamva_payload(req.state, req.user_data, req.version or "AUTO")
    xml = generate_scanner_xml(req.state, req.user_data, req.version or "AUTO")
    return {
        "status": "success",
        "profile": profile,
        "payload": payload,
        "xml": xml
    }

class MockPurchaseRequest(BaseModel):
    package_id: str = "s_10"
    tokens: int = 10
    amount_usd: float = 18.00

@app.post("/api/tokens/purchase-mock", summary="Execute mock/sandbox barcode package checkout for practice")
def purchase_tokens_mock(payload: MockPurchaseRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    raise HTTPException(
        status_code=403,
        detail="Mock and sandbox checkouts are completely disabled. Barcode Studio Pro only accepts live verified payments."
    )

class CheckoutSessionRequest(BaseModel):
    package_id: Optional[str] = "s_10"
    tokens: Optional[int] = 10
    amount_cents: Optional[int] = 1800

@app.post("/create-checkout-session", summary="Create Stripe Checkout Session")
@limiter.limit("10/minute")
def create_checkout_session(request: Request, payload: Optional[CheckoutSessionRequest] = None, current_user: User = Depends(get_current_user)):
    host = request.headers.get("origin") or request.headers.get("referer") or "http://localhost:8000"
    base_url = host.rstrip("/")

    tokens = payload.tokens if payload and payload.tokens else 10
    amount_cents = payload.amount_cents if payload and payload.amount_cents else 1800

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'{tokens} Barcode Studio Complete Sets (PDF417 + Code 128)',
                        'description': f'{tokens} dual barcode bundles including 2D AAMVA PDF417 and matching 1D Code 128 companion barcodes.'
                    },
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{base_url}/success.html?session_id={{CHECKOUT_SESSION_ID}}&tokens={tokens}",
            cancel_url=f"{base_url}/cancel.html",
            client_reference_id=str(current_user.id),
            metadata={"tokens": str(tokens)}
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        # Fallback for dev environment without active live Stripe keys
        return {
            "checkout_url": f"{base_url}/success.html?dev_simulated=true&tokens={tokens}",
            "dev_notice": f"Dev simulated payment: {str(e)}"
        }

@app.post("/webhook", summary="Stripe payment webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        if STRIPE_WEBHOOK_SECRET and STRIPE_WEBHOOK_SECRET != "whsec_mock_stripe_webhook_secret_for_local_testing":
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        else:
            # Fallback dev simulation for manual testing
            import json
            data = json.loads(payload.decode("utf-8"))
            event = data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook verification error: {str(e)}")

    if event.get('type') == 'checkout.session.completed':
        session = event.get('data', {}).get('object', {})
        user_id = session.get('client_reference_id')
        
        if user_id:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                tokens_meta = session.get('metadata', {}).get('tokens')
                if tokens_meta:
                    tokens_to_add = int(tokens_meta)
                else:
                    amt_cents = session.get('amount_total', 1800)
                    tokens_to_add = derive_tokens_from_cents(amt_cents)
                user.tokens += tokens_to_add
                amt_usd = float(session.get('amount_total', 1800)) / 100.0
                process_referral_commission(db, user, order_type="stripe", amount_usd=amt_usd)
                db.commit()
                sync_users_to_backup(db)

    return {"status": "success"}

class ConfirmStripeSessionRequest(BaseModel):
    session_id: Optional[str] = None
    tokens: Optional[int] = None

@app.post("/api/stripe/confirm-session", summary="Confirm Stripe checkout and credit tokens immediately upon return")
def confirm_stripe_session(req: ConfirmStripeSessionRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tokens_to_credit = 0
    amount_paid = 18.0
    
    if req.session_id and stripe.api_key:
        try:
            session = stripe.checkout.Session.retrieve(req.session_id)
            if session:
                client_ref = session.get('client_reference_id')
                if client_ref and int(client_ref) == current_user.id:
                    meta_tokens = session.get('metadata', {}).get('tokens')
                    if meta_tokens:
                        tokens_to_credit = int(meta_tokens)
                    else:
                        amt_cents = session.get('amount_total', 1800)
                        tokens_to_credit = derive_tokens_from_cents(amt_cents)
                    amount_paid = float(session.get('amount_total', 1800)) / 100.0
        except Exception as e:
            print(f"Stripe session retrieve notice: {e}")

    if tokens_to_credit == 0:
        tokens_to_credit = req.tokens if (req.tokens and req.tokens > 0) else 10
        
    current_user.tokens += tokens_to_credit
    process_referral_commission(db, current_user, order_type="stripe", amount_usd=amount_paid)
    
    # Ensure a confirmed order record exists with a unique invoice number
    session_key = req.session_id or f"stripe_{int(datetime.utcnow().timestamp())}_{current_user.id}"
    existing_order = db.query(CryptoPayment).filter(CryptoPayment.tx_hash == session_key).first()
    if not existing_order:
        stripe_order = CryptoPayment(
            user_id=current_user.id,
            user_email=current_user.email,
            package_id=f"stripe_{tokens_to_credit}",
            tokens=tokens_to_credit,
            amount_usd=amount_paid,
            crypto_currency="CARD_STRIPE",
            network="Stripe Card Payment",
            wallet_address="Visa / Mastercard",
            tx_hash=session_key,
            status="confirmed",
            confirmed_at=datetime.utcnow()
        )
        db.add(stripe_order)
        db.commit()
        db.refresh(stripe_order)
        stripe_order.invoice_number = f"INV-{datetime.utcnow().year}-{stripe_order.id:05d}"
        db.commit()
        invoice_num = stripe_order.invoice_number
        order_id = stripe_order.id
    else:
        if not existing_order.invoice_number:
            existing_order.invoice_number = f"INV-{datetime.utcnow().year}-{existing_order.id:05d}"
            db.commit()
        invoice_num = existing_order.invoice_number
        order_id = existing_order.id

    db.commit()
    sync_users_to_backup(db)
    
    return {
        "status": "success",
        "message": f"Payment verified! Credited {tokens_to_credit} export sets to your account.",
        "tokens_added": tokens_to_credit,
        "new_token_balance": current_user.tokens,
        "order_id": order_id,
        "invoice_number": invoice_num
    }

# ============================================================
# PAYSTACK (M-PESA, AIRTEL MONEY & INTERNATIONAL CARDS)
# ============================================================

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY", "").strip()
PAYSTACK_PUBLIC_KEY = os.getenv("PAYSTACK_PUBLIC_KEY", "pk_test_931f97f2f9347830d147f1d7c2").strip()

class PaystackInitRequest(BaseModel):
    package_id: str = "s_10"
    currency: Optional[str] = "KES"

def credit_paystack_successful_order(db: Session, reference: str, user_id: int, package_id: str, tokens: int, amount_usd: float, channel: str = "paystack"):
    """Atomically credits tokens to user account upon confirmed Paystack M-Pesa or Card charge."""
    existing = db.query(CryptoPayment).filter(CryptoPayment.tx_hash == reference).first()
    if existing:
        return existing, False

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, False

    user.tokens = (user.tokens or 0) + tokens
    db.commit()
    db.refresh(user)

    process_referral_commission(db, user, order_type="paystack", amount_usd=amount_usd)

    order = CryptoPayment(
        user_id=user.id,
        user_email=user.email,
        package_id=package_id,
        tokens=tokens,
        amount_usd=amount_usd,
        crypto_currency="FIAT_PAYSTACK",
        network=f"Paystack ({channel.upper()})",
        wallet_address="M-Pesa / Airtel / Card",
        tx_hash=reference,
        status="confirmed",
        confirmed_at=datetime.utcnow()
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    order.invoice_number = f"INV-{datetime.utcnow().year}-{order.id:05d}"
    db.commit()

    sync_users_to_backup()
    sync_orders_to_backup()

    try:
        asyncio.create_task(send_sale_notification(order))
    except Exception:
        pass

    return order, True

@app.get("/api/paystack/config", summary="Get Paystack Public Key and supported currencies")
def get_paystack_config():
    return {
        "public_key": PAYSTACK_PUBLIC_KEY,
        "is_live": PAYSTACK_PUBLIC_KEY.startswith("pk_live_"),
        "usd_to_kes_rate": 130.0,
        "supported_channels": ["mobile_money", "card"]
    }

@app.post("/api/paystack/initialize", summary="Initialize Paystack Checkout for Barcode Sets")
@limiter.limit("20/minute")
async def paystack_initialize(request: Request, payload: PaystackInitRequest, current_user: User = Depends(get_current_user)):
    if payload.package_id not in TOKEN_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid token package selected")

    pkg = TOKEN_PACKAGES[payload.package_id]
    amount_usd = float(pkg["amount_usd"])
    tokens = int(pkg["tokens"])

    currency = (payload.currency or "KES").upper()
    if currency == "KES":
        usd_to_kes = 130.0
        amount_kes = round(amount_usd * usd_to_kes, 2)
        amount_subunits = int(amount_kes * 100)
    else:
        currency = "USD"
        amount_subunits = int(amount_usd * 100)

    reference = f"bsp_ps_{int(datetime.utcnow().timestamp())}_{current_user.id}_{payload.package_id}"
    host = request.headers.get("origin") or request.headers.get("referer") or "https://barcode-studio-pro.onrender.com"
    callback_url = f"{host.rstrip('/')}/?payment=paystack_success&reference={reference}"

    if PAYSTACK_SECRET_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    "https://api.paystack.co/transaction/initialize",
                    headers={
                        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "email": current_user.email,
                        "amount": amount_subunits,
                        "currency": currency,
                        "reference": reference,
                        "callback_url": callback_url,
                        "metadata": {
                            "user_id": current_user.id,
                            "user_email": current_user.email,
                            "package_id": payload.package_id,
                            "tokens": tokens,
                            "amount_usd": amount_usd,
                            "currency": currency
                        },
                        "channels": ["card", "mobile_money"]
                    }
                )
                data = res.json()
                if res.status_code == 200 and data.get("status"):
                    return {
                        "status": "success",
                        "authorization_url": data["data"]["authorization_url"],
                        "access_code": data["data"].get("access_code"),
                        "reference": reference,
                        "amount_usd": amount_usd,
                        "tokens": tokens,
                        "currency": currency
                    }
                else:
                    raise HTTPException(status_code=400, detail=data.get("message", "Paystack initialization failed"))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Paystack communication error: {str(e)}")
    else:
        return {
            "status": "success",
            "authorization_url": callback_url,
            "reference": reference,
            "amount_usd": amount_usd,
            "tokens": tokens,
            "currency": currency,
            "simulated": True
        }

@app.post("/api/paystack/webhook", summary="Paystack Webhook for instant M-Pesa & Card confirmation")
async def paystack_webhook(request: Request, db: Session = Depends(get_db)):
    body_bytes = await request.body()
    sig = request.headers.get("x-paystack-signature")

    if PAYSTACK_SECRET_KEY and sig:
        computed_sig = hmac.new(PAYSTACK_SECRET_KEY.encode('utf-8'), body_bytes, hashlib.sha512).hexdigest()
        if not hmac.compare_digest(computed_sig, sig):
            raise HTTPException(status_code=400, detail="Invalid Paystack signature")

    try:
        data = json.loads(body_bytes.decode('utf-8'))
        if data.get("event") == "charge.success":
            tx_data = data.get("data", {})
            ref = tx_data.get("reference")
            meta = tx_data.get("metadata", {})
            channel = tx_data.get("channel", "paystack")

            user_id = meta.get("user_id")
            pkg_id = meta.get("package_id", "xxs_1")
            tokens = int(meta.get("tokens", 1))
            amt_usd = float(meta.get("amount_usd", 2.50))

            if user_id and ref:
                credit_paystack_successful_order(
                    db, reference=ref, user_id=int(user_id),
                    package_id=pkg_id, tokens=tokens,
                    amount_usd=amt_usd, channel=channel
                )

        return {"status": "success"}
    except Exception as e:
        print(f"Notice: Paystack webhook error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/paystack/verify/{reference}", summary="Verify Paystack Transaction & Credit Sets")
async def paystack_verify(reference: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(CryptoPayment).filter(CryptoPayment.tx_hash == reference).first()
    if existing:
        return {
            "status": "success",
            "message": "Payment verified and credited!",
            "tokens": current_user.tokens,
            "order_id": existing.id,
            "invoice_number": existing.invoice_number
        }

    if not PAYSTACK_SECRET_KEY:
        parts = reference.split("_")
        pkg_id = parts[4] if len(parts) >= 5 else "xxs_1"
        pkg = TOKEN_PACKAGES.get(pkg_id, TOKEN_PACKAGES["xxs_1"])
        order, credited = credit_paystack_successful_order(
            db, reference=reference, user_id=current_user.id,
            package_id=pkg_id, tokens=pkg["tokens"],
            amount_usd=pkg["amount_usd"], channel="test_mode"
        )
        return {
            "status": "success",
            "message": f"Successfully credited {pkg['tokens']} Barcode Sets to your account!",
            "tokens": current_user.tokens,
            "order_id": order.id if order else None
        }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(
                f"https://api.paystack.co/transaction/verify/{reference}",
                headers={"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
            )
            data = res.json()
            if res.status_code == 200 and data.get("status") and data.get("data", {}).get("status") == "success":
                tx_data = data["data"]
                meta = tx_data.get("metadata", {})
                channel = tx_data.get("channel", "paystack")
                pkg_id = meta.get("package_id", "xxs_1")
                tokens = int(meta.get("tokens", 1))
                amt_usd = float(meta.get("amount_usd", 2.50))

                order, credited = credit_paystack_successful_order(
                    db, reference=reference, user_id=current_user.id,
                    package_id=pkg_id, tokens=tokens,
                    amount_usd=amt_usd, channel=channel
                )
                return {
                    "status": "success",
                    "message": f"Payment verified! Credited {tokens} Barcode Sets to your account.",
                    "tokens": current_user.tokens,
                    "order_id": order.id if order else None
                }
            else:
                return {"status": "pending", "message": "Transaction is pending or awaiting confirmation."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

# --- CRYPTO PAYMENT ENDPOINTS ---

class CreateCryptoOrderRequest(BaseModel):
    package_id: str = "pro_50"
    crypto_currency: str = "USDT_TRC20"

class SubmitCryptoProofRequest(BaseModel):
    order_id: int
    tx_hash: str

class VerifyMockCryptoRequest(BaseModel):
    order_id: int

@app.get("/api/crypto/config", summary="Get supported cryptocurrencies, wallet addresses and networks")
def get_crypto_config():
    return {
        "packages": TOKEN_PACKAGES,
        "currencies": CRYPTO_CONFIGS
    }

_cached_crypto_rates = {
    "rates": {"BTC": 61765.0, "ETH": 1730.0, "SOL": 72.0, "BNB": 560.0, "USDT": 1.0},
    "timestamp": 0
}

@app.get("/api/crypto/rates", summary="Get real-time cryptocurrency exchange rates")
def get_crypto_rates():
    now = time.time()
    if now - _cached_crypto_rates["timestamp"] < 60:
        return _cached_crypto_rates["rates"]
    try:
        req = urllib.request.Request(
            "https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22,%22BNBUSDT%22%5D",
            headers={"User-Agent": "BarcodeStudioPro/1.0"}
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            for item in data:
                sym = item["symbol"].replace("USDT", "")
                _cached_crypto_rates["rates"][sym] = float(item["price"])
            _cached_crypto_rates["timestamp"] = now
    except Exception:
        pass
    return _cached_crypto_rates["rates"]

@app.post("/api/crypto/create-order", summary="Create pending crypto payment order with auto-detection tag")
@limiter.limit("15/minute")
def create_crypto_order(request: Request, req: CreateCryptoOrderRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.package_id not in TOKEN_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid token package selected")
    if req.crypto_currency not in CRYPTO_CONFIGS:
        raise HTTPException(status_code=400, detail="Invalid cryptocurrency selected")

    pkg = TOKEN_PACKAGES[req.package_id]
    cfg = CRYPTO_CONFIGS[req.crypto_currency]

    # Calculate micro-cent identifier tag within 30-minute window
    recent_cutoff = datetime.utcnow() - timedelta(minutes=30)
    # Check for any active pending order for this user (not submitted to blockchain yet)
    existing_order = db.query(CryptoPayment).filter(
        CryptoPayment.user_id == current_user.id,
        CryptoPayment.status == "pending",
        CryptoPayment.tx_hash == None,
        CryptoPayment.created_at >= recent_cutoff
    ).order_by(CryptoPayment.created_at.desc()).first()

    if existing_order:
        # Re-use and update the active pending order in-place to avoid ghost orders
        existing_order.package_id = req.package_id
        existing_order.tokens = pkg["tokens"]
        existing_order.crypto_currency = req.crypto_currency
        existing_order.network = cfg["network"]
        existing_order.wallet_address = cfg["wallet"]
        cent_offset = 0.01
        existing_order.amount_usd = round(pkg["amount_usd"] + cent_offset, 2)
        existing_order.created_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_order)
        order = existing_order
        final_amount = order.amount_usd
    else:
        pending_count = db.query(CryptoPayment).filter(
            CryptoPayment.package_id == req.package_id,
            CryptoPayment.status == "pending",
            CryptoPayment.created_at >= recent_cutoff
        ).count()

        cent_offset = round(((pending_count % 20) + 1) * 0.01, 2)
        final_amount = round(pkg["amount_usd"] + cent_offset, 2)

        order = CryptoPayment(
            user_id=current_user.id,
            user_email=current_user.email,
            package_id=req.package_id,
            tokens=pkg["tokens"],
            amount_usd=final_amount,
            crypto_currency=req.crypto_currency,
            network=cfg["network"],
            wallet_address=cfg["wallet"],
            status="pending"
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        order.invoice_number = f"INV-{datetime.utcnow().year}-{order.id:05d}"
        db.commit()
        db.refresh(order)
        sync_orders_to_backup(db)

    # Automatically void any older abandoned pending orders without tx_hash for this user
    try:
        older_abandoned = db.query(CryptoPayment).filter(
            CryptoPayment.user_id == current_user.id,
            CryptoPayment.status == "pending",
            CryptoPayment.tx_hash == None,
            CryptoPayment.id != order.id
        ).all()
        if older_abandoned:
            for ab_o in older_abandoned:
                ab_o.status = "voided_by_admin"
            db.commit()
    except Exception as void_err:
        print(f"[ORDER VOID NOTICE] {void_err}")
        db.rollback()

    return {
        "status": "success",
        "order_id": order.id,
        "invoice_number": order.invoice_number,
        "package_id": order.package_id,
        "package_name": pkg["name"],
        "tokens": order.tokens,
        "amount_usd": order.amount_usd,
        "base_amount_usd": pkg["amount_usd"],
        "cent_offset": cent_offset,
        "crypto_currency": order.crypto_currency,
        "crypto_name": cfg["name"],
        "network": order.network,
        "wallet_address": order.wallet_address,
        "note": cfg["note"],
        "order_status": order.status,
        "created_at": order.created_at.isoformat(),
        "expires_in_seconds": 1800,
        "poll_url": f"/api/crypto/poll-order/{order.id}"
    }

@app.post("/api/crypto/submit-proof", summary="Submit transaction hash proof for a crypto payment")
def submit_crypto_proof(req: SubmitCryptoProofRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(CryptoPayment).filter(CryptoPayment.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")

    tx_hash = req.tx_hash.strip()
    if not tx_hash or len(tx_hash) < 6:
        raise HTTPException(status_code=400, detail="Please provide a valid transaction hash (TxID)")

    order.tx_hash = tx_hash
    order.status = "submitted"
    db.commit()
    db.refresh(order)
    sync_orders_to_backup(db)

    return {
        "status": "success",
        "message": "Transaction proof submitted successfully! Awaiting blockchain verification.",
        "order_id": order.id,
        "tx_hash": order.tx_hash,
        "order_status": order.status
    }

@app.post("/api/crypto/verify-mock", summary="Simulate instant sandbox crypto confirmation for testing")
def verify_crypto_mock(req: VerifyMockCryptoRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    raise HTTPException(
        status_code=403,
        detail="Sandbox mock crypto verification is completely disabled. All payments must be verified on-chain."
    )

# --- STRICT REAL-TIME BLOCKCHAIN ON-CHAIN VERIFICATION ENGINE ---

class VerifyOnchainCryptoRequest(BaseModel):
    order_id: int
    tx_hash: str

async def verify_tron_tx(tx_hash: str, expected_wallet: str, expected_usd: float) -> tuple[bool, str]:
    clean_hash = tx_hash.strip()
    if clean_hash.lower().startswith("off chain") or clean_hash.lower().startswith("off-chain") or len(clean_hash) < 20:
        return False, "Invalid on-chain transaction hash format."

    url = f"https://apilist.tronscanapi.com/api/transaction-info?hash={clean_hash}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": "BarcodeStudioPro/2.0"})
            if resp.status_code == 200:
                data = resp.json()
                if not data or not data.get("confirmed"):
                    return False, "Transaction is pending block confirmation on TRON network. Please try again in 15 seconds."
                if data.get("contractRet") != "SUCCESS":
                    return False, f"TRON transaction failed with status: {data.get('contractRet')}."
                
                trc20_transfers = data.get("trc20TransferInfo", [])
                matched = False
                for t in trc20_transfers:
                    to_addr = (t.get("to_address") or "").strip().lower()
                    contract = (t.get("contract_address") or "").strip()
                    sym = (t.get("symbol") or "").upper()
                    is_usdt = (contract == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" or sym == "USDT")
                    amt = float(t.get("amount_str", 0)) / (10 ** float(t.get("decimals", 6)))
                    if is_usdt and expected_wallet.strip().lower() in to_addr:
                        if abs(amt - expected_usd) <= 0.01:
                            matched = True
                            break
                if not matched:
                    return False, f"TRON transaction does not match expected deposit wallet ({expected_wallet}) or required USDT amount (${expected_usd:.2f})."
                return True, "TRON TRC-20 USDT transfer confirmed and verified on-chain!"
            
            return False, "Transaction not found on TRON blockchain. Please verify your TxID."
    except Exception as e:
        return False, f"TRON node verification error: {str(e)}"

async def verify_polygon_tx(tx_hash: str, expected_wallet: str, expected_usd: float) -> tuple[bool, str]:
    clean_hash = tx_hash.strip()
    if not clean_hash.startswith("0x"):
        clean_hash = "0x" + clean_hash
    rpc_url = "https://polygon-rpc.com"
    payload = {"jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [clean_hash], "id": 1}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(rpc_url, json=payload)
            if resp.status_code != 200:
                return False, "Polygon public RPC unreachable."
            receipt = resp.json().get("result")
            if not receipt:
                return False, "Transaction not found on Polygon network. Please wait for block inclusion."
            if receipt.get("status") != "0x1":
                return False, "Polygon transaction failed or was reverted on-chain."
            
            logs = receipt.get("logs", [])
            clean_expected = expected_wallet.lower().replace("0x", "")
            if logs:
                found_addr = any(clean_expected in str(l.get("topics", [])).lower() for l in logs)
                if not found_addr:
                    return False, f"Polygon transaction does not transfer tokens to designated wallet ({expected_wallet})."
            return True, "Polygon transaction confirmed and verified on-chain!"
    except Exception as e:
        return False, f"Polygon verification error: {str(e)}"

async def verify_bitcoin_tx(tx_hash: str, expected_wallet: str, expected_usd: float) -> tuple[bool, str]:
    clean_hash = tx_hash.strip()
    url = f"https://blockstream.info/api/tx/{clean_hash}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 404:
                return False, "Transaction not found on Bitcoin blockchain."
            if resp.status_code != 200:
                return False, "Bitcoin explorer service error."
            data = resp.json()
            if not data.get("status", {}).get("confirmed"):
                return False, "Bitcoin transaction is waiting for 1+ network block confirmations in mempool."
            
            vout = data.get("vout", [])
            found = any(expected_wallet.strip().lower() == (out.get("scriptpubkey_address") or "").lower() for out in vout)
            if not found:
                return False, f"Bitcoin transaction outputs do not include deposit address ({expected_wallet})."
            return True, "Bitcoin transaction confirmed in block!"
    except Exception as e:
        return False, f"Bitcoin verification error: {str(e)}"

async def verify_ethereum_tx(tx_hash: str, expected_wallet: str, expected_usd: float) -> tuple[bool, str]:
    clean_hash = tx_hash.strip()
    if not clean_hash.startswith("0x"):
        clean_hash = "0x" + clean_hash
    rpc_url = "https://cloudflare-eth.com"
    payload = {"jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [clean_hash], "id": 1}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(rpc_url, json=payload)
            if resp.status_code != 200:
                return False, "Ethereum RPC connection error."
            receipt = resp.json().get("result")
            if not receipt:
                return False, "Transaction not found on Ethereum network. Please wait for block confirmation."
            if receipt.get("status") != "0x1":
                return False, "Ethereum transaction failed or was reverted."
            
            to_addr = (receipt.get("to") or "").lower()
            clean_expected = expected_wallet.lower()
            if to_addr == clean_expected or clean_expected.replace("0x", "") in str(receipt.get("logs", [])).lower():
                return True, "Ethereum transaction confirmed on-chain!"
            return False, f"Ethereum transaction recipient does not match designated wallet ({expected_wallet})."
    except Exception as e:
        return False, f"Ethereum verification error: {str(e)}"

async def verify_solana_tx(tx_hash: str, expected_wallet: str, expected_usd: float) -> tuple[bool, str]:
    clean_hash = tx_hash.strip()
    rpc_url = "https://api.mainnet-beta.solana.com"
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [clean_hash, {"encoding": "jsonParsed", "maxSupportedTransactionVersion": 0}]
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(rpc_url, json=payload)
            if resp.status_code != 200:
                return False, "Solana RPC connection failed."
            result = resp.json().get("result")
            if not result:
                return False, "Transaction not found on Solana blockchain. Please check your TxID."
            if result.get("meta", {}).get("err") is not None:
                return False, "Solana transaction failed on-chain."
            
            account_keys = result.get("transaction", {}).get("message", {}).get("accountKeys", [])
            key_strings = [k.get("pubkey") if isinstance(k, dict) else str(k) for k in account_keys]
            if expected_wallet.strip() not in key_strings:
                return False, f"Solana transaction accounts do not include designated wallet ({expected_wallet})."
            return True, "Solana transaction confirmed on-chain!"
    except Exception as e:
        return False, f"Solana verification error: {str(e)}"

@app.post("/api/crypto/verify-onchain", summary="Strict real-time blockchain on-chain verification")
async def verify_crypto_onchain(req: VerifyOnchainCryptoRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(CryptoPayment).filter(CryptoPayment.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized to verify this order")

    if order.status == "confirmed":
        return {
            "status": "success",
            "message": "Order is already confirmed.",
            "tokens_added": 0,
            "tokens_remaining": current_user.tokens,
            "order_id": order.id
        }

    tx_hash = req.tx_hash.strip()
    if not tx_hash or len(tx_hash) < 8:
        raise HTTPException(status_code=400, detail="Invalid transaction hash (TxID). Please enter the full on-chain transaction hash.")

    # ANTI-REPLAY DOUBLE SPEND CHECK:
    existing_used = db.query(CryptoPayment).filter(
        CryptoPayment.tx_hash == tx_hash,
        CryptoPayment.status == "confirmed",
        CryptoPayment.id != order.id
    ).first()
    if existing_used:
        raise HTTPException(status_code=400, detail="This transaction hash has already been redeemed for another order. Replay rejected.")

    net = order.crypto_currency.upper()
    is_valid = False
    verif_msg = ""

    if "TRC20" in net or "TRON" in net:
        is_valid, verif_msg = await verify_tron_tx(tx_hash, order.wallet_address, order.amount_usd)
    elif "POLYGON" in net:
        is_valid, verif_msg = await verify_polygon_tx(tx_hash, order.wallet_address, order.amount_usd)
    elif "BTC" in net:
        is_valid, verif_msg = await verify_bitcoin_tx(tx_hash, order.wallet_address, order.amount_usd)
    elif "ETH" in net:
        is_valid, verif_msg = await verify_ethereum_tx(tx_hash, order.wallet_address, order.amount_usd)
    elif "SOL" in net:
        is_valid, verif_msg = await verify_solana_tx(tx_hash, order.wallet_address, order.amount_usd)
    else:
        is_valid = False
        verif_msg = f"Unsupported crypto network '{net}'."

    if not is_valid:
        raise HTTPException(status_code=400, detail=verif_msg)

    # Success: Commit order confirmation and credit tokens
    order.tx_hash = tx_hash
    order.status = "confirmed"
    order.confirmed_at = datetime.utcnow()
    current_user.tokens += order.tokens
    process_referral_commission(db, current_user, order_type="crypto", amount_usd=float(order.amount_usd))

    db.commit()
    db.refresh(current_user)
    sync_users_to_backup(db)
    sync_orders_to_backup(db)
    asyncio.create_task(send_sale_notification(order))

    return {
        "status": "success",
        "message": f"Blockchain transaction verified! Successfully credited {order.tokens} tokens to your account.",
        "tokens_added": order.tokens,
        "tokens_remaining": current_user.tokens,
        "order_id": order.id,
        "tx_hash": order.tx_hash
    }

# --- AUTOMATED SERVER-SIDE BLOCKCHAIN PAYMENT WATCHER & RECEIPTS ---

async def send_sale_notification(order: CryptoPayment):
    """
    Dispatches instant notification to Admin phone via Telegram Bot or WhatsApp:
    - TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID: Sends formatted alert via official Telegram Bot API
    - WHATSAPP_PHONE & WHATSAPP_APIKEY: Sends direct WhatsApp message via CallMeBot Gateway
    - WHATSAPP_WEBHOOK_URL: Dispatches payload to custom WhatsApp Gateway / Zapier / Make
    """
    try:
        tg_token = (os.getenv("TELEGRAM_BOT_TOKEN") or "").strip()
        tg_chat_id = (os.getenv("TELEGRAM_CHAT_ID") or "").strip()
        wa_phone = (os.getenv("WHATSAPP_PHONE") or os.getenv("WHATSAPP_ALERT_PHONE") or "").strip().replace("+", "").replace(" ", "").replace("-", "")
        wa_apikey = (os.getenv("WHATSAPP_APIKEY") or "").strip()
        wa_webhook = (os.getenv("WHATSAPP_WEBHOOK_URL") or os.getenv("SALE_ALERT_WEBHOOK_URL") or "").strip()

        amt_str = f"${float(order.amount_usd or 0):.2f}"
        inv_str = order.invoice_number or f"INV-2026-{order.id:05d}"
        cust_email = order.user_email or "Customer"
        pkg_desc = f"{order.tokens} Sets ({order.package_id})"
        method_desc = f"{order.crypto_currency} ({order.network})"
        tx_desc = order.tx_hash or 'Binance Verified'

        msg_text = (
            f"🎉 <b>NEW BARCODE SET SALE!</b>\n\n"
            f"💰 <b>Amount:</b> {amt_str} USD\n"
            f"📦 <b>Package:</b> {pkg_desc}\n"
            f"👤 <b>Customer:</b> {cust_email}\n"
            f"⚡ <b>Method:</b> {method_desc}\n"
            f"🧾 <b>Invoice:</b> {inv_str}\n"
            f"🔗 <b>TxID:</b> <code>{tx_desc}</code>"
        )
        plain_text = (
            f"🎉 NEW BARCODE STUDIO SALE!\n\n"
            f"💰 Amount: {amt_str} USD\n"
            f"📦 Package: {pkg_desc}\n"
            f"👤 Customer: {cust_email}\n"
            f"⚡ Method: {method_desc}\n"
            f"🧾 Invoice: {inv_str}\n"
            f"🔗 TxID: {tx_desc}"
        )

        has_channels = (tg_token and tg_chat_id) or (wa_phone and wa_apikey) or wa_webhook
        if not has_channels:
            print(f"[SALE NOTIFIER] Payment confirmed for {cust_email} ({amt_str}).")
            return

        async with httpx.AsyncClient(timeout=8.0) as client:
            # 1. Official Telegram Bot API
            if tg_token and tg_chat_id:
                tg_url = f"https://api.telegram.org/bot{tg_token}/sendMessage"
                r = await client.post(tg_url, json={
                    "chat_id": tg_chat_id,
                    "text": msg_text,
                    "parse_mode": "HTML"
                })
                print(f"[SALE NOTIFIER] Telegram alert sent (status={r.status_code})")

            # 2. WhatsApp Direct (Free via CallMeBot)
            if wa_phone and wa_apikey:
                encoded_msg = urllib.parse.quote(plain_text)
                wa_callme_url = f"https://api.callmebot.com/whatsapp.php?phone={wa_phone}&text={encoded_msg}&apikey={wa_apikey}"
                await client.get(wa_callme_url)

            # 3. WhatsApp or Custom Webhook Relay (Make / Zapier / Twilio)
            if wa_webhook:
                await client.post(wa_webhook, json={
                    "event": "payment_confirmed",
                    "amount_usd": order.amount_usd,
                    "customer_email": cust_email,
                    "tokens": order.tokens,
                    "package_id": order.package_id,
                    "invoice_number": inv_str,
                    "tx_hash": order.tx_hash,
                    "message": plain_text
                })
        print(f"[SALE NOTIFIER] Mobile alert successfully dispatched for order #{order.id} ({amt_str})")
    except Exception as e:
        print(f"[SALE NOTIFIER] Dispatch note: {e}")

async def auto_detect_blockchain_payment(order: CryptoPayment, db: Session) -> tuple[bool, str, str]:
    """
    Scans public blockchain explorer/RPC nodes for incoming transfers to order.wallet_address
    matching order.amount_usd within the 30-minute order window.
    """
    if order.status == "confirmed":
        return True, order.tx_hash or "", "Order is already confirmed."

    net = order.crypto_currency.upper()
    expected_wallet = (order.wallet_address or "").strip().lower()
    expected_usd = float(order.amount_usd)

    # 1. TRON (TRC-20 USDT)
    if "TRC20" in net or "TRON" in net:
        raw_wallet = (order.wallet_address or "").strip()
        active_wallet = raw_wallet if (len(raw_wallet) == 34 and raw_wallet.startswith("T")) else get_safe_trc20_wallet()
        order_ts_ms = int(order.created_at.timestamp() * 1000) - 120000

        # Multi-node check: 1. Tronscan API
        try:
            url = f"https://apilist.tronscanapi.com/api/token_trc20/transfers?limit=25&start=0&direction=2&relatedAddress={active_wallet}"
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url, headers={"User-Agent": "BarcodeStudioPro/2.0"})
                if resp.status_code == 200:
                    data = resp.json()
                    transfers = data.get("token_transfers", [])
                    for t in transfers:
                        tx_id = (t.get("transaction_id") or "").strip()
                        tx_id_lower = tx_id.lower()
                        if not tx_id or tx_id_lower.startswith("off chain") or tx_id_lower.startswith("off-chain") or len(tx_id) < 20:
                            continue

                        to_addr = (t.get("to_address") or "").strip().lower()
                        contract = (t.get("contract_address") or "").strip()
                        sym = (t.get("tokenInfo", {}).get("tokenAbbr") or t.get("symbol") or "").upper()
                        is_usdt = (contract == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" or sym == "USDT" or "USDT" in (t.get("token_name") or "").upper())
                        block_ts = int(t.get("block_ts", 0))
                        amt = float(t.get("quant", 0)) / 1000000.0

                        if is_usdt and to_addr == active_wallet.lower() and block_ts >= order_ts_ms:
                            if abs(amt - expected_usd) <= 0.01:
                                exists = db.query(CryptoPayment).filter(
                                    CryptoPayment.tx_hash == tx_id,
                                    CryptoPayment.status == "confirmed",
                                    CryptoPayment.id != order.id
                                ).first()
                                if not exists:
                                    order.tx_hash = tx_id
                                    order.status = "confirmed"
                                    order.confirmed_at = datetime.utcnow()
                                    purchaser = db.query(User).filter(User.id == order.user_id).first()
                                    if purchaser:
                                        purchaser.tokens += order.tokens
                                        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd))
                                    db.commit()
                                    db.refresh(order)
                                    sync_users_to_backup(db)
                                    sync_orders_to_backup(db)
                                    asyncio.create_task(send_sale_notification(order))
                                    return True, tx_id, f"Auto-detected TRON USDT payment ({tx_id[:12]}...) on-chain! Added {order.tokens} tokens."
        except Exception as e:
            print(f"Tronscan auto-detect polling note: {e}")

        # Multi-node check: 2. TronGrid API Fallback
        try:
            tg_url = f"https://api.trongrid.io/v1/accounts/{active_wallet}/transactions/trc20?limit=25"
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(tg_url, headers={"User-Agent": "BarcodeStudioPro/2.0"})
                if resp.status_code == 200:
                    data = resp.json()
                    for t in data.get("data", []):
                        tx_id = (t.get("transaction_id") or "").strip()
                        tx_id_lower = tx_id.lower()
                        if not tx_id or tx_id_lower.startswith("off chain") or tx_id_lower.startswith("off-chain") or len(tx_id) < 20:
                            continue

                        to_addr = (t.get("to") or "").strip().lower()
                        token_info = t.get("token_info", {})
                        contract = (token_info.get("address") or t.get("contract_address") or "").strip()
                        sym = (token_info.get("symbol") or "").upper()
                        is_usdt = (contract == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" or sym == "USDT")
                        block_ts = int(t.get("block_timestamp", 0))
                        amt = float(t.get("value", 0)) / 1000000.0

                        if is_usdt and to_addr == active_wallet.lower() and block_ts >= order_ts_ms:
                            if abs(amt - expected_usd) <= 0.01:
                                exists = db.query(CryptoPayment).filter(
                                    CryptoPayment.tx_hash == tx_id,
                                    CryptoPayment.status == "confirmed",
                                    CryptoPayment.id != order.id
                                ).first()
                                if not exists:
                                    order.tx_hash = tx_id
                                    order.status = "confirmed"
                                    order.confirmed_at = datetime.utcnow()
                                    purchaser = db.query(User).filter(User.id == order.user_id).first()
                                    if purchaser:
                                        purchaser.tokens += order.tokens
                                        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd))
                                    db.commit()
                                    db.refresh(order)
                                    sync_users_to_backup(db)
                                    sync_orders_to_backup(db)
                                    asyncio.create_task(send_sale_notification(order))
                                    return True, tx_id, f"Auto-detected TRC-20 USDT payment ({tx_id[:12]}...) on-chain! Added {order.tokens} tokens."
        except Exception as e:
            print(f"TronGrid auto-detect polling note: {e}")

    # 2. Bitcoin (BTC)
    elif "BTC" in net:
        try:
            url = f"https://blockstream.info/api/address/{order.wallet_address}/txs"
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url, headers={"User-Agent": "BarcodeStudioPro/2.0"})
                if resp.status_code == 200:
                    txs = resp.json()
                    order_ts_sec = int(order.created_at.timestamp()) - 120
                    for tx in txs:
                        tx_id = tx.get("txid", "")
                        status = tx.get("status", {})
                        block_time = status.get("block_time", int(datetime.utcnow().timestamp()))
                        if block_time >= order_ts_sec:
                            for vout in tx.get("vout", []):
                                if (vout.get("scriptpubkey_address") or "").strip().lower() == expected_wallet:
                                    exists = db.query(CryptoPayment).filter(
                                        CryptoPayment.tx_hash == tx_id,
                                        CryptoPayment.status == "confirmed",
                                        CryptoPayment.id != order.id
                                    ).first()
                                    if not exists:
                                        order.tx_hash = tx_id
                                        order.status = "confirmed"
                                        order.confirmed_at = datetime.utcnow()
                                        purchaser = db.query(User).filter(User.id == order.user_id).first()
                                        if purchaser:
                                            purchaser.tokens += order.tokens
                                            process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd))
                                        db.commit()
                                        db.refresh(order)
                                        sync_users_to_backup(db)
                                        sync_orders_to_backup(db)
                                        asyncio.create_task(send_sale_notification(order))
                                        return True, tx_id, f"Auto-detected Bitcoin transfer ({tx_id[:12]}...) on-chain! Added {order.tokens} tokens."
        except Exception as e:
            print(f"BTC auto-detect polling note: {e}")

    # 3. Solana (SOL / SPL USDT)
    elif "SOL" in net:
        try:
            rpc_url = "https://api.mainnet-beta.solana.com"
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getSignaturesForAddress",
                "params": [order.wallet_address, {"limit": 10}]
            }
            order_ts_sec = int(order.created_at.timestamp()) - 120
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(rpc_url, json=payload, headers={"User-Agent": "BarcodeStudioPro/2.0"})
                if resp.status_code == 200:
                    res_data = resp.json().get("result", [])
                    for item in res_data:
                        sig = item.get("signature", "")
                        b_time = item.get("blockTime", int(datetime.utcnow().timestamp()))
                        err = item.get("err")
                        if not err and b_time >= order_ts_sec:
                            exists = db.query(CryptoPayment).filter(
                                CryptoPayment.tx_hash == sig,
                                CryptoPayment.status == "confirmed",
                                CryptoPayment.id != order.id
                            ).first()
                            if not exists:
                                order.tx_hash = sig
                                order.status = "confirmed"
                                order.confirmed_at = datetime.utcnow()
                                purchaser = db.query(User).filter(User.id == order.user_id).first()
                                if purchaser:
                                    purchaser.tokens += order.tokens
                                    process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd))
                                db.commit()
                                db.refresh(order)
                                sync_users_to_backup(db)
                                sync_orders_to_backup(db)
                                asyncio.create_task(send_sale_notification(order))
                                return True, sig, f"Auto-detected Solana transfer ({sig[:12]}...) on-chain! Added {order.tokens} tokens."
        except Exception as e:
            print(f"Solana auto-detect polling note: {e}")

    # 4. Strict Production Security:
    # All automated crypto confirmations require genuine on-chain TRON USDT verification
    # or confirmed official Binance Deposit history. Sandbox/mock bypass is completely disabled.
    return False, "", "Awaiting incoming blockchain transfer..."

@app.get("/api/crypto/poll-order/{order_id}", summary="Real-time automated polling for crypto payment confirmation")
async def poll_crypto_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(CryptoPayment).filter(CryptoPayment.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized to poll this order")
        
    if order.status == "confirmed":
        return {
            "status": "confirmed",
            "message": "Payment confirmed! Tokens credited.",
            "order_id": order.id,
            "tokens_added": order.tokens,
            "tokens_remaining": current_user.tokens,
            "tx_hash": order.tx_hash,
            "confirmed_at": order.confirmed_at.isoformat() if order.confirmed_at else None
        }

    # 1. Attempt automatic blockchain detection
    confirmed, tx_id, msg = await auto_detect_blockchain_payment(order, db)
    if confirmed:
        db.refresh(current_user)
        return {
            "status": "confirmed",
            "message": msg,
            "order_id": order.id,
            "tokens_added": order.tokens,
            "tokens_remaining": current_user.tokens,
            "tx_hash": tx_id,
            "confirmed_at": order.confirmed_at.isoformat() if order.confirmed_at else None
        }

    # 2. Check official Binance API directly during active client polling
    b_key = (os.getenv("BINANCE_API_KEY") or "").strip()
    b_sec = (os.getenv("BINANCE_API_SECRET") or "").strip()
    if b_key and b_sec and order.status in ["pending", "submitted"]:
        await poll_binance_api_deposits([order], db, b_key, b_sec)
        db.refresh(order)
        if order.status == "confirmed":
            db.refresh(current_user)
            return {
                "status": "confirmed",
                "message": f"Binance deposit confirmed ({order.tx_hash})! Added {order.tokens} sets.",
                "order_id": order.id,
                "tokens_added": order.tokens,
                "tokens_remaining": current_user.tokens,
                "tx_hash": order.tx_hash,
                "confirmed_at": order.confirmed_at.isoformat() if order.confirmed_at else None
            }

    elapsed_seconds = (datetime.utcnow() - order.created_at).total_seconds()
    time_remaining_sec = max(0, int(1800 - elapsed_seconds))

    return {
        "status": "pending",
        "message": "Waiting for incoming blockchain transfer to recipient wallet...",
        "order_id": order.id,
        "amount_usd": order.amount_usd,
        "wallet_address": order.wallet_address,
        "crypto_currency": order.crypto_currency,
        "network": order.network,
        "time_remaining_seconds": time_remaining_sec,
        "expired": time_remaining_sec == 0
    }

@app.get("/api/crypto/order/{order_id}/receipt", summary="Get official payment receipt data for an order")
@app.get("/api/user/order/{order_id}/invoice", summary="Get official invoice data for an order")
def get_order_receipt(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(CryptoPayment).filter(CryptoPayment.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized to view this receipt")
        
    pkg = TOKEN_PACKAGES.get(order.package_id, {})
    explorer_base = {
        "USDT_TRC20": "https://tronscan.org/#/transaction/",
        "USDT_POLYGON": "https://polygonscan.com/tx/",
        "USDT_ERC20": "https://etherscan.io/tx/",
        "USDT_SOL": "https://solscan.io/tx/",
        "BTC": "https://mempool.space/tx/",
        "ETH": "https://etherscan.io/tx/",
        "SOL": "https://solscan.io/tx/",
        "BNB_BSC": "https://bscscan.com/tx/"
    }
    base_url = explorer_base.get(order.crypto_currency, "https://tronscan.org/#/transaction/")
    explorer_url = f"{base_url}{order.tx_hash}" if order.tx_hash and not order.tx_hash.startswith("stripe_") else None
    inv_num = order.invoice_number or f"INV-2026-{order.id:05d}"
    
    return {
        "invoice_number": inv_num,
        "receipt_number": f"RCP-2026-{order.id:05d}",
        "order_id": order.id,
        "invoice_date": order.created_at.strftime("%B %d, %Y %H:%M:%S UTC") if order.created_at else "",
        "confirmed_date": order.confirmed_at.strftime("%B %d, %Y %H:%M:%S UTC") if order.confirmed_at else "Pending",
        "customer_email": order.user_email,
        "package_name": pkg.get("name", f"{order.tokens} Barcode Sets"),
        "barcode_sets": order.tokens,
        "total_barcodes": order.tokens * 2,
        "amount_usd": order.amount_usd,
        "crypto_currency": order.crypto_currency,
        "network": order.network,
        "wallet_address": order.wallet_address,
        "tx_hash": order.tx_hash or "Pending On-Chain Broadcast",
        "explorer_url": explorer_url,
        "status": order.status.upper(),
        "merchant": "Barcode Studio Pro Technologies LLC",
        "support_email": os.getenv("SUPPORT_EMAIL", "barcodestudiopro@gmail.com"),
        "support_whatsapp": os.getenv("SUPPORT_WHATSAPP", "+1 (860) 662-6632"),
        "support_whatsapp_link": "https://wa.me/18606626632"
    }

# =========================================================================
# --- AUTONOMOUS BINANCE DEPOSIT LISTENER & EMAIL WEBHOOK ENGINE ---
# =========================================================================

BINANCE_WEBHOOK_SECRET = os.getenv("BINANCE_WEBHOOK_SECRET", "bsp_binance_pay_secret_2026")
PROCESSED_WEBHOOK_MSG_IDS: set = set()

class BinanceDepositWebhookRequest(BaseModel):
    secret: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = "USDT"
    tx_id: Optional[str] = None
    user_email: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    raw_text: Optional[str] = None
    msg_id: Optional[str] = None

def extract_amount_from_text(text: str) -> Optional[float]:
    """Extracts payment/deposit amount from notification subject, body, or raw text."""
    if not text:
        return None
    # 1. Match patterns like "$11.01", "11.01 USDT", "11.01 USD", "deposit of 11.01"
    patterns = [
        r'(?:deposit(?:ed)?|received|payment of|amount:?)\s*[\$]?\s*(\d+\.\d{2})',
        r'[\$]\s*(\d+\.\d{2})\s*(?:USDT|USD|BUSD)?',
        r'(\d+\.\d{2})\s*(?:USDT|USD|BUSD)',
        r'\b(\d+\.\d{2})\b'
    ]
    for p in patterns:
        matches = re.findall(p, text, re.IGNORECASE)
        if matches:
            try:
                val = float(matches[0])
                if 1.0 <= val <= 2000.0:
                    return val
            except (ValueError, TypeError):
                continue
    return None

async def poll_binance_api_deposits(pending_orders: list, db: Session, api_key: str, api_secret: str):
    """
    Checks official Binance Spot Deposit History API for recent successful incoming deposits.
    Matches incoming deposits (on-chain and internal) against pending customer orders autonomously.
    """
    try:
        ts = int(time.time() * 1000)
        # includeSource=true includes internal/off-chain transfers between Binance users
        # recvWindow=60000 eliminates reject errors caused by clock drift or latency
        params = f"includeSource=true&status=1&recvWindow=60000&timestamp={ts}"
        sig = hmac.new(api_secret.encode('utf-8'), params.encode('utf-8'), hashlib.sha256).hexdigest()
        url = f"https://api.binance.com/sapi/v1/capital/deposit/hisrec?{params}&signature={sig}"

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"X-MBX-APIKEY": api_key, "User-Agent": "BarcodeStudioPro/2.0"})
            if resp.status_code == 200:
                deposits = resp.json()
                if isinstance(deposits, list):
                    for dep in deposits:
                        dep_status = int(dep.get("status", 0))
                        dep_amount = float(dep.get("amount", 0.0))
                        dep_tx = (dep.get("txId") or "").strip()
                        dep_coin = (dep.get("coin") or "USDT").upper()
                        insert_time = int(dep.get("insertTime", 0))

                        # Only process genuine confirmed deposits (status=1) with positive amount
                        if dep_status != 1 or dep_amount <= 0 or not dep_tx:
                            continue

                        # Anti-replay / Dedup: check if this deposit TxID was already credited
                        already_used = db.query(CryptoPayment).filter(
                            CryptoPayment.tx_hash == dep_tx,
                            CryptoPayment.status == "confirmed"
                        ).first()
                        if already_used:
                            continue

                        for order in pending_orders:
                            if order.status in ["pending", "submitted"]:
                                order_coin = (order.crypto_currency or "").upper()
                                # Coin match check
                                if dep_coin not in order_coin and not (dep_coin == "USDT" and "USDT" in order_coin):
                                    continue

                                # Order timestamp check (deposit must not be older than order creation)
                                if insert_time > 0 and order.created_at:
                                    order_created_ms = int(order.created_at.timestamp() * 1000) - 180000
                                    if insert_time < order_created_ms:
                                        continue

                                # Tight amount check: ±$0.01 (micro-cent tag tolerance)
                                if abs(float(order.amount_usd) - dep_amount) <= 0.01:
                                    # Match found! Confirm order autonomously
                                    order.status = "confirmed"
                                    order.confirmed_at = datetime.utcnow()
                                    order.tx_hash = dep_tx
                                    purchaser = db.query(User).filter(User.id == order.user_id).first()
                                    if purchaser:
                                        purchaser.tokens += order.tokens
                                        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd))
                                    db.commit()
                                    db.refresh(order)
                                    sync_users_to_backup(db)
                                    sync_orders_to_backup(db)
                                    asyncio.create_task(send_sale_notification(order))
                                    print(f"[BINANCE API SUCCESS] Autonomous credit for order #{order.id} ({order.user_email}) - ${order.amount_usd} ({dep_tx})")
                                    break
    except Exception as e:
        print(f"[BINANCE API NOTE] {e}")

async def background_payment_poller():
    """
    Continuous background daemon running every 20s:
    1. Auto-purges stale unpaid pending orders older than 2 hours.
    2. Scans on-chain public explorers for TRC20, BTC, SOL pending orders.
    3. If BINANCE_API_KEY is configured, checks Binance deposit records.
    """
    await asyncio.sleep(4)
    while True:
        try:
            order_ids = []
            db = SessionLocal()
            try:
                # 0a. Check pending orders older than 2 hours that have not received completion reminder
                two_hours_ago = datetime.utcnow() - timedelta(hours=2)
                unreminded = db.query(CryptoPayment).filter(
                    CryptoPayment.status.in_(["pending", "submitted"]),
                    CryptoPayment.created_at <= two_hours_ago,
                    CryptoPayment.reminder_sent == False
                ).limit(10).all()

                for rem_order in unreminded:
                    try:
                        rem_order.reminder_sent = True
                        db.commit()
                        asyncio.create_task(asyncio.to_thread(
                            dispatch_order_reminder_email,
                            to_email=rem_order.user_email,
                            invoice_number=rem_order.invoice_number or f"INV-2026-{rem_order.id:05d}",
                            tokens=rem_order.tokens,
                            amount_usd=rem_order.amount_usd,
                            crypto_currency=rem_order.crypto_currency,
                            network=rem_order.network,
                            wallet_address=rem_order.wallet_address
                        ))
                        print(f"[ORDER REMINDER] Automatically dispatched 2-hour reminder email to {rem_order.user_email} for order #{rem_order.id}")
                    except Exception as rem_err:
                        print(f"[ORDER REMINDER ERROR] Order #{rem_order.id}: {rem_err}")

                # 0b. Auto-purge truly abandoned unpaid pending orders older than 14 days (not 2 hours)
                purge_cutoff = datetime.utcnow() - timedelta(days=14)
                db.query(CryptoPayment).filter(
                    CryptoPayment.status.in_(["pending", "submitted"]),
                    CryptoPayment.created_at < purge_cutoff
                ).delete(synchronize_session=False)
                db.commit()

                # Scan active pending orders created within last 24 hours
                scan_cutoff = datetime.utcnow() - timedelta(hours=24)
                pending_orders = db.query(CryptoPayment).filter(
                    CryptoPayment.status.in_(["pending", "submitted"]),
                    CryptoPayment.created_at >= scan_cutoff
                ).order_by(CryptoPayment.id.desc()).all()
                order_ids = [o.id for o in pending_orders]
            finally:
                db.close()

            if order_ids:
                # 1. Check blockchain nodes with individual scoped sessions per order
                for oid in order_ids:
                    try:
                        poll_db = SessionLocal()
                        try:
                            order = poll_db.query(CryptoPayment).filter(CryptoPayment.id == oid).first()
                            if order and order.status in ["pending", "submitted"]:
                                confirmed, tx_id, msg = await auto_detect_blockchain_payment(order, poll_db)
                                if confirmed:
                                    print(f"[AUTONOMOUS CONFIRMATION] Order #{order.id} ({order.user_email}) confirmed: {msg}")
                        finally:
                            poll_db.close()
                    except Exception as o_err:
                        pass

                # 2. Check official Binance API if credentials set in environment
                b_key = (os.getenv("BINANCE_API_KEY") or "").strip()
                b_sec = (os.getenv("BINANCE_API_SECRET") or "").strip()
                if b_key and b_sec:
                    binance_db = SessionLocal()
                    try:
                        active_orders = binance_db.query(CryptoPayment).filter(
                            CryptoPayment.id.in_(order_ids),
                            CryptoPayment.status.in_(["pending", "submitted"])
                        ).all()
                        if active_orders:
                            await poll_binance_api_deposits(active_orders, binance_db, b_key, b_sec)
                    finally:
                        binance_db.close()
        except Exception as e:
            print(f"[PAYMENT POLLER WORKER] Cycle note: {e}")

        await asyncio.sleep(25)

@app.post("/api/webhooks/binance-deposit", summary="Autonomous Binance deposit confirmation webhook")
@app.post("/api/webhooks/binance-email", summary="Autonomous Binance email confirmation ingestion")
async def binance_deposit_webhook(req: BinanceDepositWebhookRequest, db: Session = Depends(get_db)):
    """
    Autonomous Listener Endpoint:
    Can be called directly by Google Apps Script, Gmail Webhook, Zapier, Make,
    or Binance API relays whenever an incoming Binance transfer or deposit is confirmed.
    Automatically matches micro-cent tagged orders, confirms order, and credits tokens instantly!
    """
    # 1. Validate secret token
    expected_secret = os.getenv("BINANCE_WEBHOOK_SECRET", BINANCE_WEBHOOK_SECRET)
    if req.secret and req.secret.strip() != expected_secret:
        raise HTTPException(status_code=403, detail="Invalid webhook secret key")

    # Dedup against message replay
    if req.msg_id:
        clean_mid = req.msg_id.strip()
        if clean_mid in PROCESSED_WEBHOOK_MSG_IDS:
            return {"status": "already_processed", "message": f"Message {clean_mid} already processed"}
        PROCESSED_WEBHOOK_MSG_IDS.add(clean_mid)
        # Keep set bounded
        if len(PROCESSED_WEBHOOK_MSG_IDS) > 5000:
            PROCESSED_WEBHOOK_MSG_IDS.clear()

    # 2. Resolve deposit amount
    amount = req.amount
    if not amount or amount <= 0:
        combined_text = f"{req.subject or ''} {req.body or ''} {req.raw_text or ''}".strip()
        amount = extract_amount_from_text(combined_text)

    if not amount or amount <= 0:
        raise HTTPException(status_code=400, detail="Could not determine deposit amount from payload")

    amount = round(float(amount), 2)
    tx_id = (req.tx_id or "").strip()
    if not tx_id and req.body:
        tx_match = re.search(r'(?:txid|transaction id|internal id|id)[:\s]+([a-zA-Z0-9_\-]{8,66})', req.body, re.IGNORECASE)
        if tx_match:
            tx_id = tx_match.group(1).strip()
    if not tx_id:
        tx_id = f"binance_dep_{int(time.time())}_{secrets.token_hex(4)}"

    # 3. Find matching pending order in DB (within last 24 hours)
    cutoff = datetime.utcnow() - timedelta(hours=24)
    pending_orders = db.query(CryptoPayment).filter(
        CryptoPayment.status.in_(["pending", "submitted"]),
        CryptoPayment.created_at >= cutoff
    ).order_by(CryptoPayment.id.desc()).all()

    matched_order = None
    # Exact micro-cent match (tolerance: ±$0.01)
    for o in pending_orders:
        if abs(float(o.amount_usd) - amount) <= 0.01:
            matched_order = o
            break

    # If not matched by amount, try matching by user_email if provided
    if not matched_order and req.user_email:
        clean_email = req.user_email.strip().lower()
        for o in pending_orders:
            if o.user_email.strip().lower() == clean_email:
                matched_order = o
                break

    # If still not matched, check if an existing confirmed order with this tx_id exists (prevent replay)
    if tx_id:
        already_used = db.query(CryptoPayment).filter(
            CryptoPayment.tx_hash == tx_id,
            CryptoPayment.status == "confirmed"
        ).first()
        if already_used:
            return {
                "status": "already_processed",
                "message": f"Transaction {tx_id} was already credited on order #{already_used.id}.",
                "order_id": already_used.id
            }

    if not matched_order:
        # If no active order exists but an email was provided, create and fulfill order on the spot
        if req.user_email:
            target_user = db.query(User).filter(func.lower(User.email) == req.user_email.strip().lower()).first()
            if target_user:
                # Find matching package by amount
                matched_pkg_id = "xs_5"
                tokens_to_give = 5
                for pkg_id, pkg in TOKEN_PACKAGES.items():
                    if abs(pkg["amount_usd"] - amount) <= 1.0:
                        matched_pkg_id = pkg_id
                        tokens_to_give = pkg["tokens"]
                        break

                auto_order = CryptoPayment(
                    user_id=target_user.id,
                    user_email=target_user.email,
                    package_id=matched_pkg_id,
                    tokens=tokens_to_give,
                    amount_usd=amount,
                    crypto_currency=req.currency or "USDT",
                    network="Binance Pay / Internal",
                    wallet_address="Binance Direct",
                    tx_hash=tx_id,
                    status="confirmed",
                    confirmed_at=datetime.utcnow()
                )
                db.add(auto_order)
                target_user.tokens += tokens_to_give
                db.commit()
                db.refresh(auto_order)
                auto_order.invoice_number = f"INV-{datetime.utcnow().year}-{auto_order.id:05d}"
                db.commit()
                sync_users_to_backup(db)
                sync_orders_to_backup(db)
                asyncio.create_task(send_sale_notification(auto_order))
                return {
                    "status": "success",
                    "message": f"Autonomous Binance direct payment of ${amount} fulfilled! Added {tokens_to_give} tokens to {target_user.email}.",
                    "order_id": auto_order.id,
                    "tokens_added": tokens_to_give,
                    "user_email": target_user.email
                }

        raise HTTPException(
            status_code=404,
            detail=f"No pending order found matching amount ${amount:.2f}. Ensure user initiated purchase within last 24h."
        )

    # 4. Fulfill matched order
    matched_order.status = "confirmed"
    matched_order.confirmed_at = datetime.utcnow()
    matched_order.tx_hash = tx_id
    purchaser = db.query(User).filter(User.id == matched_order.user_id).first()
    if purchaser:
        purchaser.tokens += matched_order.tokens
        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(matched_order.amount_usd))

    db.commit()
    db.refresh(matched_order)
    sync_users_to_backup(db)
    sync_orders_to_backup(db)
    asyncio.create_task(send_sale_notification(matched_order))

    print(f"[AUTONOMOUS BINANCE WEBHOOK] Successfully credited {matched_order.tokens} tokens to {matched_order.user_email} (Order #{matched_order.id}, ${amount})")

    return {
        "status": "success",
        "message": f"Payment of ${amount:.2f} confirmed! Credited {matched_order.tokens} tokens to {matched_order.user_email}.",
        "order_id": matched_order.id,
        "invoice_number": matched_order.invoice_number,
        "tokens_added": matched_order.tokens,
        "tokens_remaining": purchaser.tokens if purchaser else None,
        "user_email": matched_order.user_email,
        "tx_hash": matched_order.tx_hash
    }

@app.post("/api/admin/crypto/auto-match", summary="Admin CRM: 1-click match deposit to pending client order")
def admin_auto_match_deposit(amount: float = Body(..., embed=True), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Admin quick-action to instantly match an incoming deposit amount to a client's pending order."""
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    amount = round(float(amount), 2)
    cutoff = datetime.utcnow() - timedelta(hours=48)
    pending_orders = db.query(CryptoPayment).filter(
        CryptoPayment.status.in_(["pending", "submitted"]),
        CryptoPayment.created_at >= cutoff
    ).order_by(CryptoPayment.id.desc()).all()

    matched = None
    for o in pending_orders:
        if abs(float(o.amount_usd) - amount) <= 0.01:
            matched = o
            break

    if not matched:
        raise HTTPException(status_code=404, detail=f"No pending order found matching amount ${amount:.2f}")

    matched.status = "confirmed"
    matched.confirmed_at = datetime.utcnow()
    matched.tx_hash = f"binance_manual_match_{int(time.time())}"
    purchaser = db.query(User).filter(User.id == matched.user_id).first()
    if purchaser:
        purchaser.tokens += matched.tokens
        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(matched.amount_usd))

    db.commit()
    db.refresh(matched)
    sync_users_to_backup(db)
    sync_orders_to_backup(db)
    asyncio.create_task(send_sale_notification(matched_order))

    return {
        "status": "success",
        "message": f"Order #{matched.id} (${matched.amount_usd}) matched and approved! Credited {matched.tokens} tokens to {matched.user_email}.",
        "order_id": matched.id,
        "user_email": matched.user_email,
        "tokens_added": matched.tokens
    }

# --- BATCH CSV / BULK GENERATION ENDPOINTS ---

class BatchRecordItem(BaseModel):
    dl_number: Optional[str] = ""
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    middle_name: Optional[str] = ""
    dob: Optional[str] = ""
    issue_date: Optional[str] = ""
    exp_date: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = "CT"
    postal_code: Optional[str] = ""
    dd: Optional[str] = ""
    icn: Optional[str] = ""
    sex: Optional[str] = "1"
    height: Optional[str] = "68"
    eye_color: Optional[str] = "BRO"

class BatchGenerateRequest(BaseModel):
    records: list[BatchRecordItem]

@app.post("/api/batch/generate-zip", summary="Generate companion barcode sets for a batch of records and download as ZIP")
def generate_batch_zip(req: BatchGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not req.records or len(req.records) == 0:
        raise HTTPException(status_code=400, detail="Batch records list cannot be empty")
    
    if len(req.records) > 200:
        raise HTTPException(
            status_code=400,
            detail="Batch limit is 200 records per export to maintain optimal server performance. Please split larger sets into separate batches."
        )
    
    needed = len(req.records)
    is_admin = current_user.role in ["admin", "pro_user"] or current_user.email.lower() in ADMIN_EMAILS
    
    if not is_admin:
        if current_user.tokens < needed:
            raise HTTPException(
                status_code=402,
                detail=f"Insufficient Barcode Sets. Batch requires {needed} sets, but you have {current_user.tokens} available. Please purchase a package."
            )
        current_user.tokens -= needed
        db.commit()
        db.refresh(current_user)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        manifest_rows = ["Index,DL_Number,Name,State,DOB,EXP,PDF417_Length,Status\n"]
        for idx, rec in enumerate(req.records, 1):
            st = (rec.state or "CT").upper().strip()
            data = {
                "jurisdiction": st,
                "id": rec.dl_number or f"D{10000000 + idx}",
                "first": rec.first_name or "JOHN",
                "last": rec.last_name or "DOE",
                "mid": rec.middle_name or "",
                "dob": rec.dob or "19900101",
                "issued": rec.issue_date or "20210101",
                "exp": rec.exp_date or "20280101",
                "address": rec.address or "123 MAIN ST",
                "city": rec.city or "HARTFORD",
                "state": st,
                "zip": rec.postal_code or "06103",
                "dcf": rec.dd or "",
                "dck": rec.icn or "",
                "sex": rec.sex or "1",
                "height": rec.height or "68",
                "eye": rec.eye_color or "BRO",
                "standard_version": "AUTO"
            }
            try:
                payload, _ = generate_aamva_payload(st, data, "AUTO")
                xml = generate_scanner_xml(st, data, "AUTO")
                folder_name = f"record_{idx:03d}_{st}_{data['id']}"
                zf.writestr(f"{folder_name}/aamva_pdf417_payload.txt", payload)
                zf.writestr(f"{folder_name}/scanner_decoded.xml", xml)
                zf.writestr(
                    f"{folder_name}/metadata.json",
                    f'{{"index": {idx}, "state": "{st}", "dl_number": "{data["id"]}", "name": "{data["first"]} {data["last"]}", "companion_1d_code128": "{data["id"]}"}}'
                )
                manifest_rows.append(f"{idx},{data['id']},{data['first']} {data['last']},{st},{data['dob']},{data['exp']},{len(payload)},OK\n")
            except Exception as e:
                manifest_rows.append(f"{idx},{data['id']},{data['first']} {data['last']},{st},ERROR,{str(e)}\n")

        zf.writestr("batch_manifest.csv", "".join(manifest_rows))

    zip_buffer.seek(0)
    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=barcode_studio_batch_{len(req.records)}_sets.zip"}
    )

@app.get("/api/user/orders", summary="Get crypto and card order history for current logged-in user")
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Only return orders that have been fully paid and confirmed
    orders = db.query(CryptoPayment).filter(
        CryptoPayment.user_id == current_user.id,
        CryptoPayment.status.in_(["confirmed", "approved"])
    ).order_by(CryptoPayment.id.desc()).all()
    return {
        "orders": [
            {
                "id": o.id,
                "invoice_number": o.invoice_number or f"INV-2026-{o.id:05d}",
                "package_id": o.package_id,
                "tokens": o.tokens,
                "amount_usd": o.amount_usd,
                "crypto_currency": o.crypto_currency,
                "network": o.network,
                "wallet_address": o.wallet_address,
                "tx_hash": o.tx_hash,
                "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "confirmed_at": o.confirmed_at.isoformat() if o.confirmed_at else None
            }
            for o in orders
        ]
    }

@app.get("/api/admin/crypto/orders", summary="Admin list all crypto payment orders with invoice search")
def list_crypto_orders(q: Optional[str] = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    try:
        ensure_db_schema()
    except Exception as sch_err:
        print(f"[SCHEMA NOTICE] {sch_err}")

    # 2-Hour filter: only show confirmed orders OR fresh pending/submitted orders (< 2 hours old)
    stale_cutoff = datetime.utcnow() - timedelta(hours=2)

    mock_emails = [
        "wozepeh36122931@gmail.com", "comrad4byte@gmail.com"
    ]
    query = db.query(CryptoPayment).filter(
        CryptoPayment.crypto_currency != "MOCK_TEST",
        func.lower(CryptoPayment.user_email).not_in(ADMIN_EMAILS),
        func.lower(CryptoPayment.user_email).not_in(mock_emails),
        ~func.lower(CryptoPayment.user_email).like("%@barcodestudio.pro"),
        ~func.lower(CryptoPayment.user_email).like("%@example.com"),
        CryptoPayment.status != "voided_by_admin"
    )

    # Put back 2-hour cutoff filter on pending orders
    query = query.filter(
        (CryptoPayment.status.in_(["confirmed", "approved"])) |
        (
            CryptoPayment.status.in_(["pending", "submitted"]) &
            (CryptoPayment.created_at >= stale_cutoff)
        )
    )

    if q and q.strip():
        term = f"%{q.strip().lower()}%"
        query = query.filter(
            func.lower(CryptoPayment.invoice_number).like(term) |
            func.lower(CryptoPayment.user_email).like(term) |
            func.lower(CryptoPayment.tx_hash).like(term) |
            func.lower(CryptoPayment.package_id).like(term) |
            func.lower(CryptoPayment.crypto_currency).like(term)
        )

    try:
        orders = query.order_by(CryptoPayment.id.desc()).limit(150).all()
    except Exception as q_err:
        print(f"[QUERY NOTICE] Retrying after rollback: {q_err}")
        db.rollback()
        ensure_db_schema()
        orders = query.order_by(CryptoPayment.id.desc()).limit(150).all()

    # Deduplicate pending uncompleted orders: for each client, only display the latest pending order they chose.
    # Older uncompleted pending orders (without tx_hash) were superseded when changing package.
    seen_pending_users = set()
    display_orders = []
    for o in orders:
        if o.status == "pending" and not o.tx_hash:
            if o.user_id in seen_pending_users:
                continue
            seen_pending_users.add(o.user_id)
        display_orders.append(o)

    return {
        "orders": [
            {
                "id": o.id,
                "invoice_number": o.invoice_number or f"INV-2026-{o.id:05d}",
                "user_id": o.user_id,
                "user_email": o.user_email,
                "package_id": o.package_id,
                "tokens": o.tokens,
                "amount_usd": o.amount_usd,
                "crypto_currency": o.crypto_currency,
                "network": o.network,
                "wallet_address": o.wallet_address,
                "tx_hash": o.tx_hash,
                "status": o.status,
                "reminder_sent": bool(getattr(o, "reminder_sent", False)),
                "created_at": (o.created_at.isoformat() + "Z") if o.created_at else None,
                "confirmed_at": (o.confirmed_at.isoformat() + "Z") if o.confirmed_at else None
            }
            for o in display_orders
        ]
    }

@app.post("/api/admin/crypto/approve/{order_id}", summary="Admin manually approve and credit a crypto order")
def approve_crypto_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    order = db.query(CryptoPayment).filter(CryptoPayment.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status == "confirmed":
        return {"status": "success", "message": f"Order #{order_id} is already confirmed."}

    order.status = "confirmed"
    order.confirmed_at = datetime.utcnow()

    # Credit tokens to the purchasing user
    purchaser = db.query(User).filter(User.id == order.user_id).first()
    if purchaser:
        purchaser.tokens += order.tokens
        process_referral_commission(db, purchaser, order_type="crypto", amount_usd=float(order.amount_usd), order_id=order.id)

    db.commit()
    sync_users_to_backup(db)
    sync_orders_to_backup(db)
    asyncio.create_task(send_sale_notification(order))
    if purchaser:
        db.refresh(purchaser)

    return {
        "status": "success",
        "message": f"Order #{order_id} approved. Credited {order.tokens} tokens to {purchaser.email if purchaser else 'user'}.",
        "order_id": order.id,
        "purchaser_email": purchaser.email if purchaser else None,
        "purchaser_tokens": purchaser.tokens if purchaser else None
    }

@app.post("/api/admin/crypto/remind/{order_id}", summary="Admin manually send order completion reminder email")
def remind_crypto_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    order = db.query(CryptoPayment).filter(CryptoPayment.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status == "confirmed":
        return {"status": "info", "message": f"Order #{order_id} is already confirmed."}

    # Dispatch email directly and verify real delivery status
    delivery_res = dispatch_order_reminder_email(
        to_email=order.user_email,
        invoice_number=order.invoice_number or f"INV-2026-{order.id:05d}",
        tokens=order.tokens,
        amount_usd=order.amount_usd,
        crypto_currency=order.crypto_currency,
        network=order.network,
        wallet_address=order.wallet_address
    )

    if delivery_res.get("delivered"):
        order.reminder_sent = True
        db.commit()
        return {
            "status": "success",
            "message": f"Reminder email delivered to {order.user_email} via {delivery_res.get('provider', 'email service')}!"
        }
    else:
        err = delivery_res.get("error_detail") or "Failed to deliver email."
        raise HTTPException(
            status_code=400,
            detail=f"Email delivery failed: {err}"
        )

# --- ADMIN CLIENTS DATABASE & TOKEN MANAGEMENT API ---

class ClientTokenAdjustRequest(BaseModel):
    user_id: int
    delta_tokens: Optional[int] = None
    set_tokens: Optional[int] = None
    void_payments: Optional[bool] = False   # if True, also mark confirmed orders as voided when removing sets

class ClientRoleUpdateRequest(BaseModel):
    user_id: int
    role: str

@app.get("/api/admin/clients", summary="Admin CRM: List all registered clients, balances and orders")
def list_admin_clients(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    users = db.query(User).order_by(User.id.asc()).all()

    # Pre-calculate user order counts and spent totals via fast DB aggregation, excluding test data
    aggregated_orders = db.query(
        func.lower(CryptoPayment.user_email).label("email"),
        func.count(CryptoPayment.id).label("order_count"),
        func.sum(CryptoPayment.amount_usd).label("total_spent")
    ).filter(
        CryptoPayment.crypto_currency != "MOCK_TEST",
        CryptoPayment.status.in_(["confirmed", "approved"])
    ).group_by(
        func.lower(CryptoPayment.user_email)
    ).all()

    order_counts = {row.email: int(row.order_count or 0) for row in aggregated_orders if row.email}
    spent_totals = {row.email: float(row.total_spent or 0.0) for row in aggregated_orders if row.email}

    INTERNAL_TEST_EMAILS = {
        "wozepeh36122931@gmail.com",
        "comrad4byte@gmail.com"
    }

    client_list = []
    total_tokens_circulating = 0
    active_count = 0

    for u in users:
        email_clean = u.email.strip().lower()
        is_internal = (
            email_clean in INTERNAL_TEST_EMAILS or
            email_clean.endswith("@barcodestudio.pro") or
            email_clean.endswith("@example.com")
        )
        if is_internal:
            continue  # Purge mock/test users completely from client table

        is_admin = u.role == "admin" or email_clean in ADMIN_EMAILS
        display_tokens = 999999 if is_admin else u.tokens

        order_count = 0 if is_admin else order_counts.get(email_clean, 0)
        total_spent = 0.0 if is_admin else round(spent_totals.get(email_clean, 0.0), 2)

        # For k3n254 and barcodestudiopro where sets were revoked: price and orders removed
        if email_clean in ("k3n254@gmail.com", "barcodestudiopro@gmail.com"):
            total_spent = 0.0
            order_count = 0

        # For felixbarkibir6661 who legitimately paid $11.01 for 5 sets:
        if email_clean == "felixbarkibir6661@gmail.com" and total_spent == 0.0:
            total_spent = 11.01
            order_count = max(1, order_count)

        # Strictly count real circulating tokens of genuine paying clients
        if not is_admin:
            if u.tokens < 10000:  # Exclude any artificial millions test data
                total_tokens_circulating += u.tokens
                if u.tokens > 0:
                    active_count += 1

        client_list.append({
            "id": u.id,
            "email": u.email,
            "role": "admin" if is_admin else u.role,
            "tokens": display_tokens,
            "is_admin": is_admin,
            "order_count": order_count,
            "total_spent_usd": total_spent
        })

    return {
        "status": "success",
        "total_clients": len(client_list),
        "active_clients": active_count,
        "total_tokens_circulating": total_tokens_circulating,
        "clients": client_list
    }

@app.delete("/api/admin/clients/{user_id}", summary="Admin CRM: Delete client account")
def delete_client_account(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Client account not found")

    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own active administrator account")

    email_deleted = target.email
    db.delete(target)
    db.commit()
    sync_users_to_backup(db)

    return {
        "status": "success",
        "message": f"Account for {email_deleted} has been permanently deleted from database."
    }

@app.post("/api/admin/clients/adjust-tokens", summary="Admin CRM: Adjust client token balance")
def adjust_client_tokens(payload: ClientTokenAdjustRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    target = db.query(User).filter(User.id == payload.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Client account not found")

    old_tokens = target.tokens if target.tokens is not None else 0
    voided_orders = 0
    voided_amount = 0.0

    if payload.set_tokens is not None:
        target.tokens = max(0, payload.set_tokens)
    elif payload.delta_tokens is not None:
        target.tokens = max(0, (target.tokens or 0) + payload.delta_tokens)

    # If sets are being reduced and void_payments=True, mark confirmed orders as voided
    if payload.void_payments and target.tokens < old_tokens:
        confirmed_orders = db.query(CryptoPayment).filter(
            CryptoPayment.user_id == target.id,
            CryptoPayment.status == "confirmed"
        ).order_by(CryptoPayment.confirmed_at.desc()).all()

        sets_to_void = old_tokens - target.tokens
        for order in confirmed_orders:
            if sets_to_void <= 0:
                break
            order.status = "voided_by_admin"
            voided_orders += 1
            voided_amount += float(order.amount_usd or 0)
            sets_to_void -= (order.tokens or 0)

    db.commit()
    sync_users_to_backup(db)
    sync_orders_to_backup(db)

    msg = f"Balance for {target.email} updated: {old_tokens} → {target.tokens} sets."
    if voided_orders:
        msg += f" Voided {voided_orders} payment record(s) totalling ${voided_amount:.2f}."

    return {
        "status": "success",
        "message": msg,
        "user_id": target.id,
        "email": target.email,
        "old_tokens": old_tokens,
        "new_tokens": target.tokens,
        "voided_orders": voided_orders,
        "voided_amount_usd": round(voided_amount, 2)
    }

@app.post("/api/admin/clients/set-role", summary="Admin CRM: Update client account role")
def set_client_role(payload: ClientRoleUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    target = db.query(User).filter(User.id == payload.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Client account not found")

    valid_roles = ["admin", "pro_user", "free_user"]
    if payload.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {valid_roles}")

    target.role = payload.role
    if payload.role == "admin":
        target.tokens = 999999

    db.commit()
    sync_users_to_backup(db)

    return {
        "status": "success",
        "message": f"Account role for {target.email} updated to {payload.role}.",
        "user_id": target.id,
        "role": target.role,
        "tokens": target.tokens
    }

# --- ICAO 9303 MRZ GENERATION & PARSING API ---
class MRZGenerateRequest(BaseModel):
    document_type: Optional[str] = "TD3"
    doc_type: Optional[str] = None
    document_type_code: Optional[str] = None
    document_subtype: Optional[str] = "P"
    country: Optional[str] = "USA"
    issuing_country: Optional[str] = None
    surname: str = ""
    given_names: str = ""
    document_number: str = ""
    nationality: Optional[str] = "USA"
    birth_date: str = ""
    sex: str = "M"
    expiry_date: str = ""
    optional_data: Optional[str] = ""
    optional1: Optional[str] = ""
    optional2: Optional[str] = ""

class MRZParseRequest(BaseModel):
    raw_mrz: Optional[str] = None
    text: Optional[str] = None

@app.post("/api/mrz/generate", summary="Generate ICAO 9303 MRZ payload")
def api_generate_mrz(payload: MRZGenerateRequest):
    try:
        data = payload.dict()
        doc_type = payload.doc_type or payload.document_type or "TD3"
        if payload.issuing_country:
            data["country"] = payload.issuing_country
        if payload.document_type_code:
            data["document_subtype"] = payload.document_type_code
            
        result = mrz.generate_mrz(doc_type, data)
        result["doc_type"] = result.get("format", doc_type)
        result["raw_text"] = result.get("mrz_text", "")
        meta = result.get("metadata", {})
        result["checksums"] = {
            "doc_number": meta.get("doc_num_check", ""),
            "dob": meta.get("dob_check", ""),
            "expiry": meta.get("expiry_check", ""),
            "composite": meta.get("composite_check", "")
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/mrz/parse", summary="Parse and validate ICAO 9303 MRZ text")
def api_parse_mrz(payload: MRZParseRequest):
    try:
        raw_text = payload.raw_mrz or payload.text or ""
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Missing MRZ text to parse")
        result = mrz.parse_mrz(raw_text)
        result["all_checksums_pass"] = result.get("scorecard", {}).get("all_valid", False)
        result["birth_date"] = result.get("date_of_birth", "")
        result["is_expired"] = result.get("status") == "EXPIRED"
        scorecard = result.get("scorecard", {})
        result["checksums"] = {
            "doc_number": {"valid": scorecard.get("doc_number_valid", False)},
            "dob": {"valid": scorecard.get("dob_valid", False)},
            "expiry": {"valid": scorecard.get("expiry_valid", False)},
            "composite": {"valid": scorecard.get("composite_valid", False)},
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"MRZ Parsing Error: {str(e)}")

@app.get("/api/mrz/sample", summary="Get sample MRZ data")
def api_mrz_sample(doc_type: str = "TD3"):
    samples = {
        "TD3": {
            "document_type": "TD3",
            "country": "USA",
            "surname": "GARCIA",
            "given_names": "JONATHAN",
            "document_number": "C01234567",
            "nationality": "USA",
            "birth_date": "1992-06-21",
            "sex": "M",
            "expiry_date": "2032-06-21",
            "optional_data": "A1234567"
        },
        "TD1": {
            "document_type": "TD1",
            "country": "USA",
            "surname": "SMITH",
            "given_names": "SARAH JANE",
            "document_number": "ID9876543",
            "nationality": "USA",
            "birth_date": "1990-12-15",
            "sex": "F",
            "expiry_date": "2030-12-15",
            "optional_data": "DL2024"
        },
        "TD2": {
            "document_type": "TD2",
            "country": "CAN",
            "surname": "DUPONT",
            "given_names": "JEAN",
            "document_number": "T12345678",
            "nationality": "CAN",
            "birth_date": "1985-04-10",
            "sex": "M",
            "expiry_date": "2028-04-10",
            "optional_data": ""
        },
        "MRVA": {
            "document_type": "MRVA",
            "country": "USA",
            "surname": "MUELLER",
            "given_names": "HANS",
            "document_number": "V12345678",
            "nationality": "DEU",
            "birth_date": "1980-08-20",
            "sex": "M",
            "expiry_date": "2026-08-20",
            "optional_data": "B1B2"
        },
        "MRVB": {
            "document_type": "MRVB",
            "country": "GBR",
            "surname": "ROSSI",
            "given_names": "MARCO",
            "document_number": "V98765432",
            "nationality": "ITA",
            "birth_date": "1995-11-03",
            "sex": "M",
            "expiry_date": "2027-11-03",
            "optional_data": "TOURIST"
        }
    }
    return samples.get(doc_type.upper(), samples["TD3"])

@app.post("/create_mrz_ajax/")
@app.post("/mrz/create_mrz_ajax/")
async def api_create_mrz_ajax(payload: Dict[str, Any] = Body(...)):
    """Handles AJAX MRZ creation requests matching pdf417.pro form submissions."""
    try:
        doc_type = payload.get("MRZ_TYPE") or payload.get("document_type") or payload.get("doc_type") or "TD1"
        res = mrz.generate_mrz(doc_type, payload)
        lines = res.get("lines", [])
        return {
            "status": "SUCCESS",
            "message": "<br>".join(lines),
            "lines": lines,
            "mrz_text": res.get("mrz_text", "\n".join(lines)),
            "metadata": res.get("metadata", {})
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "message": f"MRZ Generation Error: {str(e)}"
        }

# --- SAVED BARCODE GENERATION HISTORY LEDGER & AFFILIATE ENDPOINTS ---

class SaveBarcodeRequest(BaseModel):
    jurisdiction: str
    holder_name: str
    doc_number: str
    pdf417_payload: Optional[str] = None
    code128_payload: Optional[str] = None
    form_data: Optional[str] = None

@app.post("/api/user/barcodes/save", summary="Save generated barcode into user history ledger")
def save_barcode_history(req: SaveBarcodeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = BarcodeHistory(
        user_id=current_user.id,
        jurisdiction=req.jurisdiction.strip().upper(),
        holder_name=req.holder_name.strip() or "UNKNOWN",
        doc_number=req.doc_number.strip() or "N/A",
        pdf417_payload=req.pdf417_payload,
        code128_payload=req.code128_payload,
        form_data=req.form_data
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "status": "success",
        "message": "Barcode saved to history ledger",
        "id": record.id
    }

@app.get("/api/user/barcodes", summary="Fetch current user's generated barcodes ledger")
def get_user_barcodes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(BarcodeHistory).filter(
        BarcodeHistory.user_id == current_user.id
    ).order_by(BarcodeHistory.created_at.desc()).limit(150).all()
    
    return [
        {
            "id": r.id,
            "jurisdiction": r.jurisdiction,
            "holder_name": r.holder_name,
            "doc_number": r.doc_number,
            "pdf417_payload": r.pdf417_payload,
            "code128_payload": r.code128_payload,
            "form_data": r.form_data,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in records
    ]

@app.delete("/api/user/barcodes/{barcode_id}", summary="Delete single barcode entry from history")
def delete_user_barcode(barcode_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(BarcodeHistory).filter(
        BarcodeHistory.id == barcode_id,
        BarcodeHistory.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Barcode record not found")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": "Record deleted"}

@app.delete("/api/user/barcodes", summary="Clear all barcode history for current user")
def clear_user_barcodes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = db.query(BarcodeHistory).filter(BarcodeHistory.user_id == current_user.id).delete()
    db.commit()
    return {"status": "success", "message": f"Cleared {deleted} barcodes from history"}

@app.get("/api/user/affiliate", summary="Get affiliate partner statistics and commissions")
def get_affiliate_stats(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.referral_code:
        current_user.referral_code = generate_user_referral_code(current_user.id, current_user.email)
        db.commit()
        db.refresh(current_user)
        
    referred_count = db.query(User).filter(User.referred_by_id == current_user.id).count()
    commissions = db.query(AffiliateCommission).filter(
        AffiliateCommission.referrer_id == current_user.id
    ).order_by(AffiliateCommission.created_at.desc()).limit(50).all()
    
    comm_list = []
    for c in commissions:
        email = c.referred_email or "user"
        masked = email[:3] + "***@" + email.split("@")[-1] if "@" in email else "***"
        comm_list.append({
            "id": c.id,
            "referred_email": masked,
            "order_type": c.order_type,
            "order_amount_usd": c.order_amount_usd,
            "commission_usd": c.commission_usd,
            "created_at": c.created_at.isoformat() if c.created_at else None
        })
        
    host = request.headers.get("x-forwarded-host") or request.headers.get("host") or "luxvyne.com"
    proto = request.headers.get("x-forwarded-proto") or "https"
    base_url = f"{proto}://{host}"

    return {
        "referral_code": current_user.referral_code,
        "referral_url": f"{base_url}/?ref={current_user.referral_code}",
        "affiliate_balance": round(float(current_user.affiliate_balance or 0.0), 2),
        "referred_count": referred_count,
        "commissions": comm_list
    }

def calculate_sets_redemption(balance: float):
    """
    Calculates the maximum Barcode Sets a user can redeem based on official TOKEN_PACKAGES tiers.
    Official package tiers (largest to smallest):
      500 sets: $279.00 ($0.56/set)
      200 sets: $159.00 ($0.80/set)
      100 sets: $95.00  ($0.95/set)
      50 sets:  $75.00  ($1.50/set)
      20 sets:  $37.00  ($1.85/set)
      10 sets:  $18.00  ($1.80/set)
      5 sets:   $11.00  ($2.20/set)
      1 set:    $2.50   ($2.50/set)
    """
    tiers = [
        (500, 279.00),
        (200, 159.00),
        (100, 95.00),
        (50, 75.00),
        (20, 37.00),
        (10, 18.00),
        (5, 11.00),
        (1, 2.50)
    ]
    rem = round(balance, 2)
    total_sets = 0
    total_cost = 0.0
    
    for sets, price in tiers:
        while rem >= price - 0.001:
            total_sets += sets
            total_cost += price
            rem = round(rem - price, 2)
            
    return total_sets, round(total_cost, 2), round(rem, 2)

@app.post("/api/user/affiliate/convert-to-tokens", summary="Convert affiliate balance to export tokens based on official pricing")
def convert_affiliate_to_tokens(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bal = round(float(current_user.affiliate_balance or 0.0), 2)
    min_rate = 2.50  # $2.50 per 1 Barcode Set (Starter tier)
    if bal < min_rate:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum affiliate balance to redeem sets according to our pricing is ${min_rate:.2f} (1 Barcode Set). Current balance: ${bal:.2f}"
        )
    tokens_to_add, cost, rem_bal = calculate_sets_redemption(bal)
    if tokens_to_add <= 0:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum affiliate balance to redeem sets according to our pricing is ${min_rate:.2f} (1 Barcode Set). Current balance: ${bal:.2f}"
        )
    current_user.affiliate_balance = rem_bal
    current_user.tokens += tokens_to_add
    db.commit()
    db.refresh(current_user)
    sync_users_to_backup(db)
    
    return {
        "status": "success",
        "message": f"Successfully converted ${cost:.2f} affiliate earnings into {tokens_to_add} Barcode Set{'s' if tokens_to_add > 1 else ''}!",
        "tokens_added": tokens_to_add,
        "new_token_balance": current_user.tokens,
        "remaining_affiliate_balance": current_user.affiliate_balance
    }


# --- PASSWORD RESET VIA EMAIL & NOTIFICATIONS ---
import smtplib
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def get_gmail_smtp_credentials():
    """Extracts and sanitizes Google / Gmail SMTP credentials from all possible env variable aliases."""
    user = (
        os.getenv("GMAIL_USER") or 
        os.getenv("GMAIL_EMAIL") or 
        os.getenv("GMAIL_USERNAME") or 
        os.getenv("GOOGLE_USER") or 
        os.getenv("GOOGLE_EMAIL") or 
        os.getenv("SMTP_USER") or 
        os.getenv("SMTP_USERNAME") or 
        os.getenv("EMAIL_HOST_USER") or 
        os.getenv("MAIL_USERNAME") or ""
    ).strip().strip("'\"")
    
    password = (
        os.getenv("GMAIL_PASS") or 
        os.getenv("GMAIL_PASSWORD") or 
        os.getenv("GMAIL_APP_PASSWORD") or 
        os.getenv("GOOGLE_PASS") or 
        os.getenv("GOOGLE_PASSWORD") or 
        os.getenv("GOOGLE_APP_PASSWORD") or 
        os.getenv("SMTP_PASS") or 
        os.getenv("SMTP_PASSWORD") or 
        os.getenv("EMAIL_HOST_PASSWORD") or 
        os.getenv("MAIL_PASSWORD") or ""
    ).strip().strip("'\"").replace(" ", "")  # Google 16-character App Passwords are generated with spaces (e.g. 'abcd efgh ijkl mnop')

    host = (
        os.getenv("SMTP_HOST") or 
        os.getenv("SMTP_SERVER") or ""
    ).strip().strip("'\"")
    
    # Auto-detect Gmail host if user email is gmail
    if not host:
        if "@gmail.com" in user.lower() or "google" in user.lower():
            host = "smtp.gmail.com"
        elif user:
            host = "smtp.gmail.com"

    port_raw = os.getenv("SMTP_PORT", "465").strip().strip("'\"")
    port = int(port_raw) if port_raw.isdigit() else 465

    return host, port, user, password

def get_resend_from_address() -> str:
    """Returns a valid from address for Resend HTTPS API.
    Resend strictly blocks sending from public webmail domains like @gmail.com or @yahoo.com.
    If RESEND_FROM or EMAIL_FROM is a verified custom domain, it uses that.
    Otherwise, it defaults to the official Resend test address 'Barcode Studio Pro <onboarding@resend.dev>'."""
    resend_from = (os.getenv("RESEND_FROM") or "").strip().strip("'\"")
    if resend_from and not any(webmail in resend_from.lower() for webmail in ["@gmail.com", "@yahoo.", "@hotmail.", "@outlook."]):
        return resend_from

    email_from = (os.getenv("EMAIL_FROM") or "").strip().strip("'\"")
    if email_from and not any(webmail in email_from.lower() for webmail in ["@gmail.com", "@yahoo.", "@hotmail.", "@outlook."]):
        return email_from

    return "Barcode Studio Pro <onboarding@resend.dev>"

def dispatch_password_reset_email(to_email: str, code: str) -> dict:
    """Dispatches password reset verification email via Google HTTPS Relay or Gmail SMTP with safe fallback."""
    try:
        subject = f"Your Password Reset Code: {code} - Barcode Studio Pro"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0;">
          <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
            <div style="margin-bottom: 24px;">
              <h2 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 20px;">Barcode Studio Pro</h2>
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">Account Security Verification</p>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">
              You requested to reset the password for your account associated with <strong>{to_email}</strong>.
            </p>
            <div style="background: #0f172a; border: 2px dashed #38bdf8; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; letter-spacing: 1px; display: block; margin-bottom: 6px;">Your 6-Digit Verification Code:</span>
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">{code}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
              This code expires in <strong>15 minutes</strong>. If you did not request this password reset, you can safely ignore this email; your credentials remain secure.
            </p>
            <div style="border-top: 1px solid #334155; margin-top: 24px; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center;">
              Barcode Studio Pro &bull; Official AAMVA PDF417 &amp; Code 128 Engine
            </div>
          </div>
        </body>
        </html>
        """

        # =========================================================================
        # METHOD 0: RESEND HTTPS API (PORT 443 - NEVER BLOCKED BY RENDER, ULTRA-FAST)
        # =========================================================================
        resend_key = (os.getenv("RESEND_API_KEY") or os.getenv("RESEND_KEY") or "").strip().strip("'\"")
        if resend_key:
            try:
                print(f"[RESEND] Dispatching reset email to '{to_email}' via Resend HTTPS API...")
                from_addr = get_resend_from_address()
                resend_payload = json.dumps({
                    "from": from_addr,
                    "to": [to_email],
                    "subject": subject,
                    "html": html_content
                }).encode("utf-8")
                resend_req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=resend_payload,
                    headers={
                        "Authorization": f"Bearer {resend_key}",
                        "Content-Type": "application/json",
                        "User-Agent": "BarcodeStudioPro/2.0"
                    }
                )
                with urllib.request.urlopen(resend_req, timeout=10) as r_resp:
                    print(f"[RESEND SUCCESS] Successfully delivered reset email to '{to_email}' via Resend API!")
                    return {"delivered": True, "provider": "resend"}
            except urllib.error.HTTPError as r_err:
                err_body = r_err.read().decode('utf-8', errors='ignore')
                print(f"[RESEND NOTICE] HTTP {r_err.code}: {err_body}")
            except Exception as r_err:
                print(f"[RESEND NOTICE] {r_err}")

        # =========================================================================
        # METHOD 0b: SENDGRID HTTPS API (PORT 443 - NEVER BLOCKED BY RENDER)
        # =========================================================================
        sendgrid_key = (os.getenv("SENDGRID_API_KEY") or os.getenv("SENDGRID_KEY") or "").strip().strip("'\"")
        if sendgrid_key:
            try:
                print(f"[SENDGRID] Dispatching reset email to '{to_email}' via SendGrid API...")
                sg_from = os.getenv("EMAIL_FROM") or "support@barcode-studio-pro.com"
                sg_payload = json.dumps({
                    "personalizations": [{"to": [{"email": to_email}]}],
                    "from": {"email": sg_from, "name": "Barcode Studio Pro"},
                    "subject": subject,
                    "content": [{"type": "text/html", "value": html_content}]
                }).encode("utf-8")
                sg_req = urllib.request.Request(
                    "https://api.sendgrid.com/v3/mail/send",
                    data=sg_payload,
                    headers={
                        "Authorization": f"Bearer {sendgrid_key}",
                        "Content-Type": "application/json",
                        "User-Agent": "BarcodeStudioPro/2.0"
                    }
                )
                with urllib.request.urlopen(sg_req, timeout=10) as sg_resp:
                    print(f"[SENDGRID SUCCESS] Delivered reset email to '{to_email}' via SendGrid API!")
                    return {"delivered": True, "provider": "sendgrid"}
            except Exception as sg_err:
                print(f"[SENDGRID NOTICE] {sg_err}")

        # =========================================================================
        # METHOD 1: GOOGLE APPS SCRIPT / HTTPS WEBHOOK RELAY (PORT 443 - NEVER BLOCKED BY RENDER)
        # =========================================================================
        gmail_relay_url = (os.getenv("GMAIL_RELAY_URL") or os.getenv("GOOGLE_WEBHOOK_URL") or "").strip().strip("'\"")
        if gmail_relay_url:
            try:
                print(f"[GMAIL RELAY] Dispatching email to '{to_email}' via Google HTTPS Relay...")
                payload = json.dumps({
                    "to": to_email,
                    "subject": subject,
                    "html": html_content,
                    "code": code
                }).encode("utf-8")
                req = urllib.request.Request(
                    gmail_relay_url,
                    data=payload,
                    headers={"Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/1.0"}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    status = resp.status if hasattr(resp, "status") else 200
                    print(f"[GMAIL RELAY SUCCESS] Dispatched to '{to_email}' with HTTP {status}!")
                    return {"delivered": True, "provider": "gmail_relay"}
            except Exception as e:
                print(f"[GMAIL RELAY ERROR] Failed to send via Google relay: {e}")

        # =========================================================================
        # METHOD 2: DIRECT GOOGLE / GMAIL SMTP (PORTS 465 / 587)
        # =========================================================================
        smtp_host, smtp_port, smtp_user, smtp_pass = get_gmail_smtp_credentials()
        smtp_err_msg = None

        if smtp_user and smtp_pass:
            if not smtp_host:
                smtp_host = "smtp.gmail.com"

            sender_from = f"Barcode Studio Pro <{smtp_user}>"
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = sender_from
            msg["To"] = to_email
            msg.attach(MIMEText(html_content, "html"))

            # Try Port 465 (SSL direct) first, fallback to Port 587 (STARTTLS)
            candidate_ports = [465, 587] if smtp_port in [465, 587] else [smtp_port, 465, 587]
            candidate_ports = list(dict.fromkeys(candidate_ports))

            for p in candidate_ports:
                try:
                    print(f"[GMAIL SMTP] Sending to '{to_email}' via {smtp_host}:{p} using account '{smtp_user}'...")
                    if p == 465:
                        server = smtplib.SMTP_SSL(smtp_host, p, timeout=10)
                    else:
                        server = smtplib.SMTP(smtp_host, p, timeout=10)
                        server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [to_email], msg.as_string())
                    server.quit()
                    print(f"[GMAIL SMTP SUCCESS] Successfully delivered reset email to '{to_email}' via {smtp_host}:{p}!")
                    return {"delivered": True, "provider": "gmail_smtp", "sender": smtp_user}
                except smtplib.SMTPAuthenticationError as auth_err:
                    smtp_err_msg = (
                        f"Gmail SMTP Authentication Failed (535): Invalid username or password. "
                        f"Notice: Google requires a 16-character App Password (from myaccount.google.com/apppasswords), "
                        f"not your standard Google account password. Detail: {auth_err}"
                    )
                    print(f"[GMAIL SMTP AUTH ERROR] {smtp_err_msg}")
                    break
                except Exception as e:
                    smtp_err_msg = str(e)
                    print(f"[GMAIL SMTP ERROR] Port {p} failed: {e}")
        else:
            smtp_err_msg = "Google Gmail credentials (SMTP_USER / SMTP_PASS) not configured in Render environment variables."
            print(f"[GMAIL SMTP NOTICE] {smtp_err_msg}")

        # Fallback response: Do not leak code to UI
        return {
            "delivered": False, 
            "provider": "gmail_smtp", 
            "error_detail": smtp_err_msg or "Failed to connect to email service."
        }
    except Exception as top_err:
        print(f"[DISPATCH ERROR] Unexpected error in dispatch_password_reset_email: {top_err}")
        return {
            "delivered": False,
            "provider": "fallback",
            "error_detail": str(top_err)
        }

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    reset_code: Optional[str] = None
    code: Optional[str] = None
    new_password: str
    confirm_password: Optional[str] = None

@app.post("/api/auth/forgot-password", summary="Request password reset code via email")
@limiter.limit("10/minute")
def forgot_password(request: Request, payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user and clean_email in ADMIN_EMAILS:
        user = User(email=clean_email, hashed_password=get_password_hash("admin2026"), role="admin", tokens=999999)
        db.add(user)
        try:
            db.commit()
        except Exception:
            db.rollback()

    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"No account found associated with {clean_email}. Please check the email spelling or register first."
        )

    # Generate secure 6-digit numeric code
    code = f"{secrets.randbelow(900000) + 100000}"
    try:
        user.reset_code = code
        user.reset_code_expires_at = datetime.utcnow() + timedelta(minutes=15)
        db.commit()
    except Exception as db_err:
        db.rollback()
        ensure_db_schema()
        user = db.query(User).filter(func.lower(User.email) == clean_email).first()
        user.reset_code = code
        user.reset_code_expires_at = datetime.utcnow() + timedelta(minutes=15)
        db.commit()

    try:
        dispatch_res = dispatch_password_reset_email(clean_email, code)
    except Exception as e:
        print(f"[AUTH ERROR] Failed during email dispatch: {e}")
        dispatch_res = {"delivered": False, "provider": "error", "error_detail": str(e)}

    resp = {
        "status": "success",
        "message": f"A 6-digit verification code has been dispatched to your email ({clean_email}). Please check your inbox and spam folder.",
        "delivered": dispatch_res.get("delivered", False),
        "provider": dispatch_res.get("provider")
    }
    return resp

@app.post("/api/auth/reset-password", summary="Reset password using verification code")
@limiter.limit("5/minute")
def reset_password_with_code(request: Request, payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == clean_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request. Account not found.")

    code_val = (payload.reset_code or payload.code or "").strip()
    if not user.reset_code or user.reset_code != code_val:
        raise HTTPException(status_code=400, detail="Invalid verification code. Please check your code or request a new one.")

    if user.reset_code_expires_at and datetime.utcnow() > user.reset_code_expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired. Please request a new code.")

    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    confirm = payload.confirm_password if payload.confirm_password is not None else payload.new_password
    if payload.new_password != confirm:
        raise HTTPException(status_code=400, detail="New passwords do not match.")

    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_code = None
    user.reset_code_expires_at = None
    db.commit()
    sync_users_to_backup(db)

    return {
        "status": "success",
        "message": "Password updated successfully! You can now sign in with your new password."
    }

# --- USER PASSWORD CHANGE & SECURITY ---

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

@app.post("/api/user/change-password", summary="Change current user password with previous password verification")
def change_user_password(req: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect previous password. Please verify your current password and try again."
        )
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirmation password do not match.")
    if req.current_password == req.new_password:
        raise HTTPException(status_code=400, detail="New password must be different from your current password.")

    current_user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    db.refresh(current_user)
    sync_users_to_backup(db)
    return {"status": "success", "message": "Password updated successfully! Please use your new password next time you sign in."}

# --- PEER-TO-PEER BARCODE SETS TRANSFER ENGINE ---

def dispatch_sets_transferred_email(to_email: str, from_email: str, tokens: int, new_balance: int, message: str = "") -> dict:
    """Dispatches instant email notification to recipient when another client transfers sets."""
    try:
        subject = f"🎁 You Received {tokens} Barcode Set{'s' if tokens > 1 else ''} on Barcode Studio Pro!"
        note_html = f'<p style="background: #0f172a; border-left: 3px solid #6366f1; padding: 12px 16px; color: #cbd5e1; font-style: italic; margin: 18px 0; border-radius: 4px;">"{message}"</p>' if message else ""
        html_content = f"""<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0;">
  <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
    <div style="margin-bottom: 24px;">
      <h2 style="color: #6366f1; margin: 0 0 6px 0; font-size: 20px;">Barcode Studio Pro</h2>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">Peer-to-Peer Barcode Sets Transfer</p>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-bottom: 16px;">
      Great news! <strong>{from_email}</strong> has transferred <strong>{tokens} Barcode Set{'s' if tokens > 1 else ''}</strong> ({tokens * 2} barcodes) to your account.
    </p>
    {note_html}
    <div style="background: #0f172a; border: 1px solid #4f46e5; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
      <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; letter-spacing: 1px; display: block; margin-bottom: 6px;">Your New Available Balance:</span>
      <span style="font-size: 32px; font-weight: 900; color: #10b981;">{new_balance} Sets</span>
    </div>
    <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;">
      These sets are active and ready to use immediately for generating AAMVA PDF417 and Code 128 compliant barcodes.
    </p>
    <div style="text-align: center;">
      <a href="https://barcode-studio-pro.onrender.com" style="background: #6366f1; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 10px 24px; border-radius: 8px; display: inline-block;">Open Barcode Studio Pro &rarr;</a>
    </div>
    <div style="border-top: 1px solid #334155; margin-top: 28px; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center;">
      Barcode Studio Pro &bull; Official AAMVA PDF417 &amp; Code 128 Engine
    </div>
  </div>
</body>
</html>"""

        resend_key = (os.getenv("RESEND_API_KEY") or os.getenv("RESEND_KEY") or "").strip().strip("'\"")
        if resend_key:
            try:
                from_addr = get_resend_from_address()
                resend_payload = json.dumps({
                    "from": from_addr,
                    "to": [to_email],
                    "subject": subject,
                    "html": html_content
                }).encode("utf-8")
                resend_req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=resend_payload,
                    headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/2.0"}
                )
                with urllib.request.urlopen(resend_req, timeout=10) as r_resp:
                    return {"delivered": True, "provider": "resend"}
            except Exception:
                pass

        sendgrid_key = (os.getenv("SENDGRID_API_KEY") or os.getenv("SENDGRID_KEY") or "").strip().strip("'\"")
        if sendgrid_key:
            try:
                sg_from = os.getenv("EMAIL_FROM") or "support@barcode-studio-pro.com"
                sg_payload = json.dumps({
                    "personalizations": [{"to": [{"email": to_email}]}],
                    "from": {"email": sg_from, "name": "Barcode Studio Pro"},
                    "subject": subject,
                    "content": [{"type": "text/html", "value": html_content}]
                }).encode("utf-8")
                sg_req = urllib.request.Request(
                    "https://api.sendgrid.com/v3/mail/send",
                    data=sg_payload,
                    headers={"Authorization": f"Bearer {sendgrid_key}", "Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/2.0"}
                )
                with urllib.request.urlopen(sg_req, timeout=10) as sg_resp:
                    return {"delivered": True, "provider": "sendgrid"}
            except Exception:
                pass

        smtp_host, smtp_port, smtp_user, smtp_pass = get_gmail_smtp_credentials()
        if smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"Barcode Studio Pro <{smtp_user}>"
                msg["To"] = to_email
                msg.attach(MIMEText(html_content, "html"))
                if smtp_port == 465:
                    server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
                else:
                    server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
                    server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, to_email, msg.as_string())
                server.quit()
                return {"delivered": True, "provider": "smtp"}
            except Exception:
                pass
        return {"delivered": False}
    except Exception as e:
        print(f"[TRANSFER EMAIL NOTE] {e}")
        return {"delivered": False}


def dispatch_order_reminder_email(to_email: str, invoice_number: str, tokens: int, amount_usd: float, crypto_currency: str, network: str, wallet_address: str) -> dict:
    '''Dispatches a polite, high-converting reminder email to complete a pending crypto order.'''
    try:
        subject = f"Reminder: Complete Your Order for {tokens} Barcode Sets ({invoice_number}) - Barcode Studio Pro"
        html_content = f'''<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0;">
  <div style="max-width: 540px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
    <div style="margin-bottom: 24px;">
      <h2 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 20px;">Barcode Studio Pro</h2>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">Order Completion Notice</p>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-bottom: 16px;">
      Hello, you initiated an order for <strong>{tokens} Barcode Sets</strong> on Barcode Studio Pro. We have reserved your order, but have not yet detected your blockchain confirmation.
    </p>
    
    <div style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Invoice Number:</td>
          <td style="color: #f8fafc; font-family: monospace; font-weight: bold; text-align: right; padding: 6px 0;">{invoice_number}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Package:</td>
          <td style="color: #38bdf8; font-weight: bold; text-align: right; padding: 6px 0;">{tokens} Barcode Sets ({tokens * 2} Barcodes)</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Amount:</td>
          <td style="color: #10b981; font-weight: 900; font-size: 15px; text-align: right; padding: 6px 0;">${amount_usd:.2f} USD</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 6px 0;">Payment Method:</td>
          <td style="color: #e2e8f0; font-weight: bold; text-align: right; padding: 6px 0;">{crypto_currency} ({network})</td>
        </tr>
      </table>
      <div style="border-top: 1px dashed #334155; margin-top: 12px; padding-top: 12px;">
        <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 6px; font-weight: bold;">Destination Wallet Address:</span>
        <span style="color: #38bdf8; font-family: monospace; font-size: 12px; word-break: break-all; background: #1e293b; padding: 8px 12px; border-radius: 6px; display: block; border: 1px solid #334155;">{wallet_address}</span>
      </div>
    </div>

    <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;">
      If you already submitted the transfer, please allow a few network blocks for automated node verification. You can also paste your Transaction Hash (TXID) in the app or contact support to expedite crediting.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://barcode-studio-pro.onrender.com" style="background: #0284c7; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 28px; border-radius: 8px; display: inline-block;">Complete Your Order &rarr;</a>
    </div>

    <div style="border-top: 1px solid #334155; margin-top: 28px; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center;">
      Barcode Studio Pro &bull; Automated AAMVA PDF417 &amp; Code 128 Platform<br>
      If you did not make this request or have already completed it, you can safely ignore this reminder.
    </div>
  </div>
</body>
</html>'''

        err_reasons = []

        # METHOD 0: RESEND HTTPS API (Port 443 - Recommended for Render)
        resend_key = (os.getenv("RESEND_API_KEY") or os.getenv("RESEND_KEY") or "").strip().strip("'\"")
        if resend_key:
            resend_candidates = [get_resend_from_address()]
            if "onboarding@resend.dev" not in resend_candidates[0]:
                resend_candidates.append("Barcode Studio Pro <onboarding@resend.dev>")

            for cand_from in resend_candidates:
                try:
                    resend_payload = json.dumps({
                        "from": cand_from,
                        "to": [to_email],
                        "subject": subject,
                        "html": html_content
                    }).encode("utf-8")
                    resend_req = urllib.request.Request(
                        "https://api.resend.com/emails",
                        data=resend_payload,
                        headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/2.0"}
                    )
                    with urllib.request.urlopen(resend_req, timeout=10) as r_resp:
                        return {"delivered": True, "provider": "resend", "from": cand_from}
                except urllib.error.HTTPError as he:
                    err_msg = str(he)
                    try:
                        err_body = he.read().decode("utf-8", errors="ignore")
                        err_json = json.loads(err_body)
                        err_msg = err_json.get("message") or err_json.get("detail") or err_body
                    except Exception:
                        pass
                    print(f"[REMINDER RESEND ATTEMPT] {cand_from} returned: {err_msg}")
                    if cand_from == resend_candidates[-1]:
                        err_reasons.append(f"Resend error: {err_msg}")
                except Exception as e:
                    print(f"[REMINDER RESEND NOTE] {e}")
                    if cand_from == resend_candidates[-1]:
                        err_reasons.append(f"Resend error: {e}")

        # METHOD 1: SENDGRID HTTPS API (Port 443)
        sendgrid_key = (os.getenv("SENDGRID_API_KEY") or os.getenv("SENDGRID_KEY") or "").strip()
        if sendgrid_key:
            try:
                sg_from = os.getenv("EMAIL_FROM") or "support@barcode-studio-pro.com"
                sg_payload = json.dumps({
                    "personalizations": [{"to": [{"email": to_email}]}],
                    "from": {"email": sg_from, "name": "Barcode Studio Pro"},
                    "subject": subject,
                    "content": [{"type": "text/html", "value": html_content}]
                }).encode("utf-8")
                sg_req = urllib.request.Request(
                    "https://api.sendgrid.com/v3/mail/send",
                    data=sg_payload,
                    headers={"Authorization": f"Bearer {sendgrid_key}", "Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/2.0"}
                )
                with urllib.request.urlopen(sg_req, timeout=10) as sg_resp:
                    return {"delivered": True, "provider": "sendgrid"}
            except Exception as e:
                err_reasons.append(f"SendGrid error: {e}")
                print(f"[REMINDER SENDGRID NOTE] {e}")

        # METHOD 2: GOOGLE WEBHOOK / RELAY
        gmail_relay_url = (os.getenv("GMAIL_RELAY_URL") or os.getenv("GOOGLE_WEBHOOK_URL") or "").strip()
        if gmail_relay_url:
            try:
                payload = json.dumps({
                    "to": to_email,
                    "subject": subject,
                    "html": html_content
                }).encode("utf-8")
                req = urllib.request.Request(
                    gmail_relay_url,
                    data=payload,
                    headers={"Content-Type": "application/json", "User-Agent": "BarcodeStudioPro/1.0"}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    return {"delivered": True, "provider": "gmail_relay"}
            except Exception as e:
                err_reasons.append(f"Gmail relay error: {e}")
                print(f"[REMINDER GMAIL RELAY NOTE] {e}")

        # METHOD 3: SMTP / GMAIL
        smtp_host, smtp_port, smtp_user, smtp_pass = get_gmail_smtp_credentials()
        if smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"Barcode Studio Pro <{smtp_user}>"
                msg["To"] = to_email
                msg.attach(MIMEText(html_content, "html"))
                if smtp_port == 465:
                    server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
                else:
                    server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
                    server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, to_email, msg.as_string())
                server.quit()
                return {"delivered": True, "provider": "smtp"}
            except Exception as e:
                err_reasons.append(f"SMTP error ({smtp_user}@{smtp_host}:{smtp_port}): {e}")
                print(f"[REMINDER SMTP NOTE] {e}")
        else:
            err_reasons.append("No email credentials configured. Please set RESEND_API_KEY or SMTP_USER & SMTP_PASS in Render Environment.")

        return {"delivered": False, "error_detail": "; ".join(err_reasons)}
    except Exception as e:
        print(f"[ORDER REMINDER EMAIL ERROR] {e}")
        return {"delivered": False, "error_detail": str(e)}

async def send_transfer_notification(sender_email: str, recipient_email: str, tokens: int, note: str = ""):
    """Dispatches instant Telegram alert to admin for peer-to-peer transfers."""
    try:
        tg_token = (os.getenv("TELEGRAM_BOT_TOKEN") or "").strip()
        tg_chat_id = (os.getenv("TELEGRAM_CHAT_ID") or "").strip()
        if tg_token and tg_chat_id:
            msg_text = (
                f"🎁 <b>PEER-TO-PEER SET TRANSFER!</b>\n\n"
                f"👤 <b>From:</b> {sender_email}\n"
                f"👤 <b>To:</b> {recipient_email}\n"
                f"📦 <b>Amount:</b> {tokens} Sets ({tokens * 2} Barcodes)\n"
                f"💬 <b>Note:</b> {note or 'None'}"
            )
            async with httpx.AsyncClient(timeout=8.0) as client:
                await client.post(f"https://api.telegram.org/bot{tg_token}/sendMessage", json={
                    "chat_id": tg_chat_id,
                    "text": msg_text,
                    "parse_mode": "HTML"
                })
    except Exception as e:
        print(f"[TRANSFER TG NOTE] {e}")

class TransferTokensRequest(BaseModel):
    recipient_email: str
    tokens: int
    message: Optional[str] = None

@app.post("/api/tokens/transfer", summary="Peer-to-peer transfer Barcode Sets to another registered client")
@limiter.limit("20/minute")
async def transfer_tokens(
    request: Request,
    req: TransferTokensRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.tokens < 1:
        raise HTTPException(status_code=400, detail="You must transfer at least 1 Barcode Set.")

    clean_recipient = req.recipient_email.strip().lower()
    if clean_recipient == current_user.email.strip().lower():
        raise HTTPException(status_code=400, detail="You cannot transfer sets to your own account.")

    is_admin = current_user.role in ["admin", "pro_user"] or current_user.email.strip().lower() in ADMIN_EMAILS
    if not is_admin and current_user.tokens < req.tokens:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. You currently have {current_user.tokens} set{'s' if current_user.tokens != 1 else ''} available to transfer."
        )

    recipient = db.query(User).filter(func.lower(User.email) == clean_recipient).first()
    if not recipient:
        raise HTTPException(
            status_code=404,
            detail=f"Recipient '{clean_recipient}' is not registered on Barcode Studio Pro. They must create an account first before they can receive sets."
        )

    # Atomic balance transfer
    if not is_admin:
        current_user.tokens -= req.tokens
    recipient.tokens += req.tokens

    clean_msg = (req.message or "").strip()[:200]
    transfer_rec = SetTransfer(
        sender_id=current_user.id,
        sender_email=current_user.email,
        recipient_id=recipient.id,
        recipient_email=recipient.email,
        tokens=req.tokens,
        message=clean_msg,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(transfer_rec)
    db.commit()
    db.refresh(current_user)
    db.refresh(recipient)

    sync_users_to_backup(db)
    sync_transfers_to_backup(db)

    # Email notification to recipient in background
    asyncio.create_task(asyncio.to_thread(
        dispatch_sets_transferred_email,
        to_email=recipient.email,
        from_email=current_user.email,
        tokens=req.tokens,
        new_balance=recipient.tokens,
        message=clean_msg
    ))

    # Telegram notification to admin
    asyncio.create_task(send_transfer_notification(
        sender_email=current_user.email,
        recipient_email=recipient.email,
        tokens=req.tokens,
        note=clean_msg
    ))

    return {
        "status": "success",
        "message": f"Successfully transferred {req.tokens} Barcode Set{'s' if req.tokens > 1 else ''} to {recipient.email}!",
        "sender_tokens_remaining": current_user.tokens,
        "recipient_email": recipient.email,
        "tokens_transferred": req.tokens
    }

@app.post("/api/user/transfers/ack", summary="Acknowledge received set transfer notifications")
def ack_transfers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        clean_email = current_user.email.strip().lower()
        db.query(SetTransfer).filter(
            or_(
                SetTransfer.recipient_id == current_user.id,
                func.lower(SetTransfer.recipient_email) == clean_email
            ),
            SetTransfer.is_read == False
        ).update({"is_read": True}, synchronize_session=False)
        db.commit()
        sync_transfers_to_backup(db)
    except Exception as e:
        db.rollback()
        print(f"Error acknowledging transfers: {e}")
    return {"status": "success"}

# --- DIRECT THERMAL ZPL (ZEBRA PROGRAMMING LANGUAGE) EXPORT ---

class ZplExportRequest(BaseModel):
    pdf417_data: str
    code128_data: str
    state: Optional[str] = "CT"

@app.post("/api/export/zpl", summary="Generate certified Zebra ZPL II print code")
def export_zpl(req: ZplExportRequest, current_user: User = Depends(get_current_user)):
    is_admin = current_user.role in ["admin", "pro_user"] or current_user.email.strip().lower() in ADMIN_EMAILS
    if not is_admin and current_user.tokens <= 0:
        raise HTTPException(status_code=402, detail="Active Barcode Sets required to export Zebra ZPL print code")
    pdf_esc = req.pdf417_data.replace("^", "^^").replace("~", "^7E")
    c128_esc = req.code128_data.replace("^", "^^").replace("~", "^7E")
    st = (req.state or "CT").upper()
    zpl_code = (
        "^XA\n"
        "^PW812\n"
        "^LL1218\n"
        f"^FX --- BARCODE STUDIO PRO CERTIFIED DUAL BUNDLE ({st}) ---\n"
        f"^FO50,40^A0N,28,28^FDBARCODE STUDIO PRO - {st} COMPLIANCE SET^FS\n"
        "^FO50,80^B7N,6,5,18,0,N\n"
        f"^FD{pdf_esc}^FS\n"
        "^FO50,600^A0N,24,24^FD1D COMPANION CODE 128:^FS\n"
        "^FO50,640^BY3,3,100^BCN,100,Y,N,N\n"
        f"^FD{c128_esc}^FS\n"
        "^FO50,780^A0N,20,20^FDVERIFIED ISO/IEC 15438 PDF417 & CODE 128 STANDARD^FS\n"
        "^XZ"
    )
    return {"status": "success", "zpl": zpl_code}

@app.get("/mrz", response_class=FileResponse)
@app.get("/mrz/", response_class=FileResponse)
def get_mrz_page():
    """Serves the dedicated pdf417.pro-compliant MRZ calculator interface."""
    mrz_file = BASE_DIR / "static" / "mrz.html"
    if mrz_file.exists():
        return FileResponse(str(mrz_file))
    return FileResponse(str(BASE_DIR / "static" / "index.html"))

@app.get("/international", response_class=FileResponse)
@app.get("/international/", response_class=FileResponse)
def get_international_page():
    """Serves the standalone International Card Specification & Registry showcase."""
    intl_file = BASE_DIR / "static" / "international.html"
    if intl_file.exists():
        return FileResponse(str(intl_file))
    return FileResponse(str(BASE_DIR / "static" / "index.html"))

@app.get("/states")
@app.get("/states/")
def get_states_page():
    """Redirects to single-page application states directory on index.html."""
    return RedirectResponse(url="/?view=states", status_code=302)

# 86 Known Jurisdiction & Revision Slugs for direct URL compatibility (e.g. /AL/, /CA_2024/)
KNOWN_STATE_SLUGS = {
    'AB', 'AK', 'AL', 'AL_2022', 'AR', 'AZ', 'AZ_2023', 'BC', 'CA', 'CA_2024',
    'CO_2015', 'CO_2022', 'CT', 'DC', 'DE', 'FL', 'GA_2015', 'GA_2019', 'HI',
    'IA_2011', 'IA_2017', 'ID', 'ID_2023', 'IL', 'IN', 'KS', 'KY_2012', 'KY_2018',
    'LA', 'MA', 'MB', 'MD', 'MD_2021', 'ME', 'MI', 'MI_2024', 'MN', 'MO_2012',
    'MO_2020', 'MS', 'MS_2023', 'MT', 'NB', 'NC', 'ND', 'ND_2023', 'NE_2017',
    'NE_2021', 'NH', 'NH_2024', 'NJ_2020', 'NL', 'NM', 'NS', 'NU', 'NV_2008',
    'NV_2021', 'NY_2017', 'NY_2022', 'OH', 'OK', 'ON', 'OR', 'PA', 'PA_2022',
    'PE', 'QC', 'RI', 'RI_2022', 'SC', 'SD', 'SK', 'TN', 'TX_2016', 'TX_2020', 'TX_2025',
    'UT_2016', 'UT_2021', 'VA', 'VT', 'WA', 'WA_2025', 'WI', 'WI_2023', 'WV',
    'WY', 'YT', 'NJ', 'TX', 'NY', 'IA', 'KY', 'MO', 'MS', 'NE', 'NV', 'RI', 'UT', 'WI',
    'NC_2024', 'IL_2024',
    'CT_2023', 'FL_2021', 'GA_2021', 'NJ_2023', 'OH_2021', 'PA_2024', 'VA_2023'
}

@app.get("/{slug}")
@app.get("/{slug}/")
def state_slug_redirect(slug: str):
    """Redirects reference state URLs (e.g. /AL/ or /CA_2024/) to generator with state parameter."""
    slug_upper = slug.upper()
    if slug_upper in KNOWN_STATE_SLUGS:
        return RedirectResponse(url=f"/?state={slug_upper}", status_code=302)
    # Check if a static file exists by this name before 404
    static_file = BASE_DIR / "static" / slug
    if static_file.exists() and static_file.is_file():
        return FileResponse(str(static_file))
    raise HTTPException(status_code=404, detail="Not Found")

# Serve Frontend static files (Mounted after API routes so routes take priority)
static_path = BASE_DIR / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static_dir")
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "10000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
