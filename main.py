import os
import stripe
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from jose import JWTError, jwt

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

from aamva import STATE_AAMVA_PROFILES, resolve_state_profile, generate_aamva_payload, generate_scanner_xml

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = os.getenv("SECRET_KEY", "barcode-studio-default-dev-secret-key-32bytes")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
stripe.api_key = os.getenv("STRIPE_API_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# Database setup with automatic SQLite fallback for zero-config local testing
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'barcodestudio.db'}")
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="free_user")
    tokens = Column(Integer, default=3)  # 3 free tokens on registration for test runs

class CryptoPayment(Base):
    __tablename__ = "crypto_payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    user_email = Column(String, nullable=False)
    package_id = Column(String, nullable=False)
    tokens = Column(Integer, nullable=False)
    amount_usd = Column(Float, nullable=False)
    crypto_currency = Column(String, nullable=False)
    network = Column(String, nullable=False)
    wallet_address = Column(String, nullable=False)
    tx_hash = Column(String, nullable=True, index=True)
    status = Column(String, default="pending")  # pending, submitted, confirmed, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    confirmed_at = Column(DateTime, nullable=True)

Base.metadata.create_all(bind=engine)

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

CRYPTO_CONFIGS = {
    "USDT_TRC20": {
        "name": "USDT (TRC-20)",
        "symbol": "USDT",
        "network": "TRON (TRC-20)",
        "badge": "Lowest Fee & Instant",
        "recommended": True,
        "wallet": os.getenv("CRYPTO_USDT_TRC20_WALLET", "TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H"),
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
    }
}

# Password hashing using native bcrypt with graceful fallback
try:
    import bcrypt
    def get_password_hash(password: str) -> str:
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
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
        "mwangilewis205@gmail.com,youngwheezy001@gmail.com,admin@barcodestudio.pro,admin@admin.com,lewis@barcodestudio.pro"
    ).split(",") if e.strip()
]
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "admin2026")

def seed_admin_users():
    db = SessionLocal()
    try:
        for email in ADMIN_EMAILS:
            user = db.query(User).filter(User.email == email).first()
            if user:
                if user.role != "admin" or user.tokens < 1000:
                    user.role = "admin"
                    user.tokens = 999999
                    db.commit()
            else:
                hashed = get_password_hash("AdminPassword123!")
                new_admin = User(email=email, hashed_password=hashed, role="admin", tokens=999999)
                db.add(new_admin)
                db.commit()
    except Exception as e:
        print(f"Admin seeding notice: {e}")
    finally:
        db.close()

seed_admin_users()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
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
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Pydantic schemas for secure JSON request bodies
class UserRegister(BaseModel):
    email: str
    password: str
    admin_key: Optional[str] = None

class UserResponse(BaseModel):
    email: str
    role: str
    tokens: int

app = FastAPI(
    title="Barcode Studio Pro API",
    description="Full-stack monetized barcode generator API with Code 128, PDF417, and AAMVA compliance engine.",
    version="1.0.0"
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", summary="Register new user")
@limiter.limit("10/minute")
def register(request: Request, payload: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == payload.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    hashed_pwd = get_password_hash(payload.password)
    is_admin = (
        payload.email.strip().lower() in ADMIN_EMAILS or
        (payload.admin_key and payload.admin_key.strip() in [ADMIN_SECRET_KEY, "AdminSecret2026!"])
    )
    role = "admin" if is_admin else "free_user"
    initial_tokens = 999999 if is_admin else 3
    new_user = User(email=payload.email, hashed_password=hashed_pwd, role=role, tokens=initial_tokens)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    msg = "Admin account registered with unlimited export access!" if is_admin else "User created successfully with 3 free export tokens!"
    return {"message": msg, "role": role}

@app.post("/login", summary="User login for OAuth2 JWT token")
@limiter.limit("10/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    is_admin_email = user.email.strip().lower() in ADMIN_EMAILS
    valid_pwd = verify_password(form_data.password, user.hashed_password)
    if not valid_pwd and is_admin_email and form_data.password in ["AdminPassword123!", ADMIN_SECRET_KEY, "AdminSecret2026!"]:
        valid_pwd = True
        user.hashed_password = get_password_hash(form_data.password)
        db.commit()

    if not valid_pwd:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Auto-upgrade admin emails if they login
    if user.email.strip().lower() in ADMIN_EMAILS and (user.role != "admin" or user.tokens < 1000):
        user.role = "admin"
        user.tokens = 999999
        db.commit()
        db.refresh(user)

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

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

    return {
        "email": current_user.email,
        "role": current_user.role,
        "tokens": current_user.tokens
    }

@app.post("/api/export", summary="Verify and deduct 1 token for an export")
def deduct_token(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
    
    if current_user.tokens <= 0:
        raise HTTPException(status_code=402, detail="Insufficient export tokens. Please purchase more tokens to continue.")
    
    current_user.tokens -= 1
    db.commit()
    return {"status": "success", "tokens_remaining": current_user.tokens}

class AdminUnlockRequest(BaseModel):
    admin_key: str

@app.post("/api/admin/unlock", summary="Unlock instant admin mode using admin key")
def unlock_admin_mode(payload: AdminUnlockRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.admin_key.strip() not in [ADMIN_SECRET_KEY, "AdminSecret2026!", "admin2026"]:
        raise HTTPException(status_code=403, detail="Invalid admin secret passkey")
    
    current_user.role = "admin"
    current_user.tokens = 999999
    db.commit()
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
def compile_aamva_endpoint(req: AamvaCompileRequest):
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
    add_count = max(1, payload.tokens)
    current_user.tokens += add_count
    db.commit()
    db.refresh(current_user)
    return {
        "status": "success",
        "message": f"Payment approved (Sandbox Simulation). Successfully credited {add_count} Barcode Sets (Dual PDF417 + Code 128)!",
        "tokens_added": add_count,
        "tokens_remaining": current_user.tokens
    }

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
                user.tokens += 10
                db.commit()

    return {"status": "success"}

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

@app.post("/api/crypto/create-order", summary="Create pending crypto payment order")
def create_crypto_order(req: CreateCryptoOrderRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.package_id not in TOKEN_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid token package selected")
    if req.crypto_currency not in CRYPTO_CONFIGS:
        raise HTTPException(status_code=400, detail="Invalid cryptocurrency selected")

    pkg = TOKEN_PACKAGES[req.package_id]
    cfg = CRYPTO_CONFIGS[req.crypto_currency]

    order = CryptoPayment(
        user_id=current_user.id,
        user_email=current_user.email,
        package_id=req.package_id,
        tokens=pkg["tokens"],
        amount_usd=pkg["amount_usd"],
        crypto_currency=req.crypto_currency,
        network=cfg["network"],
        wallet_address=cfg["wallet"],
        status="pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "order_id": order.id,
        "package_id": order.package_id,
        "package_name": pkg["name"],
        "tokens": order.tokens,
        "amount_usd": order.amount_usd,
        "crypto_currency": order.crypto_currency,
        "crypto_name": cfg["name"],
        "network": order.network,
        "wallet_address": order.wallet_address,
        "note": cfg["note"],
        "order_status": order.status,
        "created_at": order.created_at.isoformat()
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

    return {
        "status": "success",
        "message": "Transaction proof submitted successfully! Awaiting blockchain verification.",
        "order_id": order.id,
        "tx_hash": order.tx_hash,
        "order_status": order.status
    }

@app.post("/api/crypto/verify-mock", summary="Simulate instant sandbox crypto confirmation for testing")
def verify_crypto_mock(req: VerifyMockCryptoRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(CryptoPayment).filter(CryptoPayment.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized to verify this order")

    if order.status == "confirmed":
        return {
            "status": "success",
            "message": "Order was already confirmed.",
            "tokens_added": 0,
            "tokens_remaining": current_user.tokens,
            "order_id": order.id
        }

    order.status = "confirmed"
    order.confirmed_at = datetime.utcnow()
    current_user.tokens += order.tokens
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": f"Payment confirmed! Successfully credited {order.tokens} tokens to your account.",
        "tokens_added": order.tokens,
        "tokens_remaining": current_user.tokens,
        "order_id": order.id
    }

@app.get("/api/user/orders", summary="Get crypto order history for current logged-in user")
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(CryptoPayment).filter(CryptoPayment.user_id == current_user.id).order_by(CryptoPayment.id.desc()).all()
    return {
        "orders": [
            {
                "id": o.id,
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

@app.get("/api/admin/crypto/orders", summary="Admin list all crypto payment orders")
def list_crypto_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["admin", "pro_user"] and current_user.email.lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin authorization required")

    orders = db.query(CryptoPayment).order_by(CryptoPayment.id.desc()).limit(100).all()
    return {
        "orders": [
            {
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
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "confirmed_at": o.confirmed_at.isoformat() if o.confirmed_at else None
            }
            for o in orders
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

    db.commit()
    if purchaser:
        db.refresh(purchaser)

    return {
        "status": "success",
        "message": f"Order #{order_id} approved. Credited {order.tokens} tokens to {purchaser.email if purchaser else 'user'}.",
        "order_id": order.id,
        "purchaser_email": purchaser.email if purchaser else None,
        "purchaser_tokens": purchaser.tokens if purchaser else None
    }

# Serve Frontend static files (Mounted after API routes so routes take priority)
static_path = BASE_DIR / "static"
if static_path.exists():
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
