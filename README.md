# Barcode Studio Pro

A production-ready full-stack application for generating 1D (Code 128) and 2D (PDF417) barcodes, compliant with the 50-State American Association of Motor Vehicle Administrators (AAMVA) DL/ID card specification.

Built with **FastAPI**, **SQLAlchemy** (PostgreSQL / SQLite), **JWT Authentication**, **Stripe Checkout Paywall**, and **Tailwind CSS + JsBarcode + bwip-js + jsPDF**.

---

## Features

- **1D Barcode Generator (Code 128)**:
  - Real-time client-side rendering with SVG vector and Canvas output.
  - Custom height, bar width, human-readable text toggles, and fonts.
- **2D Barcode Generator (PDF417)**:
  - High-density matrix generation with `bwip-js`.
  - Configurable column matrix (3–10) and Reed-Solomon Error Correction Level (ECC 0–8).
  - Compact mode and aspect-ratio tuning.
- **50-State AAMVA Compliance Engine**:
  - Full jurisdictional preset coverage across all 50 US States + DC + Generic AAMVA standard.
  - Automatically calculates subfile lengths, offsets, IIN numbers, and standard subfile headers (`@\x0A\x1E\x0DANSI ...`).
  - Standard D-tags supported: `DAC` (First), `DAD` (Middle), `DCS` (Last), `DBB` (DOB), `DBD` (Issue), `DBA` (Expire), `DAQ` (License No), `DCF` (Doc Discriminator), `DCK` (Inventory Control), `DBC` (Sex), `DAU` (Height), `DAY` (Eyes), `DAG` (Address), `DAI` (City), `DAJ` (State), `DAK` (Zip).
  - Live byte counter with compliance warnings.
  - Random test identity generator.
  - Save and load form presets in browser `localStorage`.
- **CR-80 Full Card Back Generator**:
  - Automatically generates a 300 DPI composite ID card back (1012 &times; 638 px) featuring a magnetic stripe track simulator and PDF417 barcode.
- **Multi-Format Export Suite**:
  - High-resolution 300 DPI PNG.
  - Vector SVG.
  - Printable 4" &times; 2" label PDF using `jsPDF`.
  - Full CR80 Card Back PNG.
- **Auth & Paywall Engine**:
  - User registration & login with secure JSON payloads and password hashing.
  - Free tier credit: 3 free export tokens automatically assigned to new accounts.
  - Token paywall: `/api/export` securely decrements user tokens.
  - Stripe Checkout integration for token purchasing ($5.00 for 10 tokens).
  - Stripe Webhook listener for automatic token crediting.
  - Rate limiting with `slowapi`.

---

## Directory Structure

```
barcode-studio-pro/
├── static/
│   ├── index.html           # Unified application frontend
│   ├── success.html         # Stripe payment success landing page
│   └── cancel.html          # Stripe payment cancellation landing page
├── main.py                  # FastAPI server with auth, db, stripe, and static mount
├── requirements.txt         # Python dependencies
├── .env                     # Local environment settings (SQLite by default)
├── .env.example             # Production environment template
├── test_api.py              # Automated test suite
└── README.md                # Documentation
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+ (or virtual environment)
- Optional: PostgreSQL (for production), Stripe CLI (for webhook testing)

### 2. Installation
```bash
# Navigate to the project directory
cd barcode-studio-pro

# Create and activate a virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Server Locally
```bash
uvicorn main:app --reload --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser. The application will be live immediately.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create user with JSON body `{ email, password }` (starts with 3 free tokens) |
| `POST` | `/login` | OAuth2 password flow returning JWT Bearer token |
| `GET` | `/users/me` | Current user profile, role, and remaining token balance |
| `POST` | `/api/export` | Validates JWT and deducts 1 token (returns 402 if balance is 0) |
| `POST` | `/create-checkout-session` | Generates Stripe Checkout Session for 10 tokens |
| `POST` | `/webhook` | Receives Stripe webhook events (`checkout.session.completed`) |

---

## Deployment Guide

### Option 1: Unified Render / Railway / Fly.io (Single Service)
1. Push this directory to your GitHub repository.
2. Create a Web Service on **Render** (or Railway).
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add your Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL database URL.
   - `SECRET_KEY`: A random 32+ character hex string.
   - `STRIPE_API_KEY`: Your live Stripe secret key.
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.

### Option 2: Split Deployment (Netlify Frontend + Render Backend)
1. **Render (Backend)**: Deploy `main.py` as a Python API service.
2. **Netlify (Frontend)**:
   - Deploy the `static/` directory to Netlify.
   - In `static/index.html`, set `const API_BASE = 'https://your-render-api.onrender.com';`.
   - Update `allow_origins` in `main.py` with your Netlify domain.
