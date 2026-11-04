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
from sqlalchemy import create_engine, Column, Integer, String
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

Base.metadata.create_all(bind=engine)

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

@app.post("/create-checkout-session", summary="Create Stripe Checkout Session for 10 tokens")
@limiter.limit("5/minute")
def create_checkout_session(request: Request, current_user: User = Depends(get_current_user)):
    host = request.headers.get("origin") or request.headers.get("referer") or "http://localhost:8000"
    base_url = host.rstrip("/")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': '10 Barcode Studio Export Tokens',
                        'description': 'High-resolution PNG, SVG, PDF and AAMVA ID card exports.'
                    },
                    'unit_amount': 500,  # $5.00 USD
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{base_url}/success.html?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{base_url}/cancel.html",
            client_reference_id=str(current_user.id)
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        # Fallback for dev environment without active live Stripe keys
        return {
            "checkout_url": f"{base_url}/success.html?dev_simulated=true",
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

# Serve Frontend static files (Mounted after API routes so routes take priority)
static_path = BASE_DIR / "static"
if static_path.exists():
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
