"""
Automated Verification Suite for Barcode Studio Pro
Tests registration, JWT authentication, token deduction, paywall gating, and database operations.
"""
import os
import sys
from fastapi.testclient import TestClient

# Ensure local directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app, SessionLocal, User

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("Starting Barcode Studio Pro Verification Test Suite")
    print("=" * 60)

    # 1. Test Static files route
    print("\n[1/5] Testing Frontend Index Route...")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert "Barcode Studio Pro" in res.text, "Index does not contain title"
    print("  -> Passed: Static frontend is mounted and served correctly.")

    # 2. Test User Registration
    test_email = "tester@barcodestudio.pro"
    test_password = "SecurePassword123!"

    # Clean up existing user if needed
    db = SessionLocal()
    existing = db.query(User).filter(User.email == test_email).first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()

    print("\n[2/5] Testing User Registration...")
    res = client.post("/register", json={"email": test_email, "password": test_password})
    assert res.status_code == 200, f"Register failed: {res.text}"
    print(f"  -> Passed: Registered user ({test_email}) with initial 3 tokens.")

    # 3. Test Login and JWT Token Generation
    print("\n[3/5] Testing Authentication & JWT Token Issuance...")
    res = client.post("/login", data={"username": test_email, "password": test_password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token_data = res.json()
    assert "access_token" in token_data, "No access token in response"
    token = token_data["access_token"]
    print("  -> Passed: Valid JWT Bearer token issued.")

    headers = {"Authorization": f"Bearer {token}"}

    # 4. Test User Profile Retrieval
    print("\n[4/5] Testing /users/me Profile Endpoint...")
    res = client.get("/users/me", headers=headers)
    assert res.status_code == 200, f"Users me failed: {res.text}"
    user_info = res.json()
    assert user_info["email"] == test_email
    assert user_info["tokens"] == 3
    print(f"  -> Passed: User verified with {user_info['tokens']} tokens.")

    # 5. Test Export Token Deduction & Paywall Enforcement
    print("\n[5/5] Testing Token Deductions & Paywall Gating...")
    # Deduct 1st token
    res1 = client.post("/api/export", headers=headers)
    assert res1.status_code == 200
    assert res1.json()["tokens_remaining"] == 2
    print("  -> Deducted token 1 (2 remaining)")

    # Deduct 2nd token
    res2 = client.post("/api/export", headers=headers)
    assert res2.status_code == 200
    assert res2.json()["tokens_remaining"] == 1
    print("  -> Deducted token 2 (1 remaining)")

    # Deduct 3rd token
    res3 = client.post("/api/export", headers=headers)
    assert res3.status_code == 200
    assert res3.json()["tokens_remaining"] == 0
    print("  -> Deducted token 3 (0 remaining)")

    # 4th deduction must trigger 402 Payment Required
    res4 = client.post("/api/export", headers=headers)
    assert res4.status_code == 402, f"Expected 402 Payment Required, got {res4.status_code}"
    print("  -> Passed: 402 Payment Required correctly enforced when tokens depleted!")

    # 6. Test AAMVA API Profiles & Compilation
    print("\n[6/6] Testing AAMVA API Endpoints (/api/aamva/profiles & /api/aamva/compile)...")
    res_prof = client.get("/api/aamva/profiles")
    assert res_prof.status_code == 200
    profiles = res_prof.json()["profiles"]
    assert len(profiles) >= 52
    assert "CT" in profiles and "WA" in profiles
    print("  -> Passed: 52 AAMVA state profiles retrieved successfully via API.")

    res_comp = client.post("/api/aamva/compile", json={
        "state": "CT",
        "user_data": {
            "first": "Jonathan",
            "last": "Garcia",
            "issued": "07262024",
            "dob": "06211992",
            "id": "188892143"
        },
        "version": "AUTO"
    })
    assert res_comp.status_code == 200
    comp_data = res_comp.json()
    assert comp_data["profile"]["aamva_version"] == "09"
    assert comp_data["profile"]["data_format"] == "11"
    assert '<subfile designator="DL" offset="41"' in comp_data["xml"]
    print("  -> Passed: CT 2024 compiled to v09 Format 11 with offset 41 via API.")

    # 7. Test Admin User Unlimited Exports (No Token Depletion)
    print("\n[7/9] Testing Admin Auto-Promotion & Unlimited Exports...")
    admin_login = client.post("/login", data={"username": "mwangilewis205@gmail.com", "password": "AdminPassword123!"})
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    admin_profile = client.get("/users/me", headers=admin_headers)
    assert admin_profile.status_code == 200
    assert admin_profile.json()["role"] == "admin"
    assert admin_profile.json()["tokens"] >= 999999
    print(f"  -> Passed: Admin ({admin_profile.json()['email']}) has role='admin' and unlimited tokens ({admin_profile.json()['tokens']}).")

    for i in range(5):
        exp_res = client.post("/api/export", headers=admin_headers)
        assert exp_res.status_code == 200, f"Export failed on run {i+1}: {exp_res.text}"
        assert exp_res.json()["tokens_remaining"] >= 999999
    print("  -> Passed: Admin executed 5 consecutive exports with zero token depletion and 100% bypass!")

    # 8. Test Admin Registration via Passkey
    print("\n[8/9] Testing Admin Registration via admin_key...")
    new_admin_email = "passkey_admin@barcodestudio.pro"
    db = SessionLocal()
    existing_new = db.query(User).filter(User.email == new_admin_email).first()
    if existing_new:
        db.delete(existing_new)
        db.commit()
    db.close()

    reg_admin = client.post("/register", json={
        "email": new_admin_email,
        "password": "SecretPassword123!",
        "admin_key": "admin2026"
    })
    assert reg_admin.status_code == 200
    assert reg_admin.json()["role"] == "admin"
    print("  -> Passed: New user registered with passkey 'admin2026' immediately created as admin!")

    # 9. Test Instant Admin Unlock on Depleted Account
    print("\n[9/9] Testing Instant Admin Unlock (/api/admin/unlock) on Depleted User...")
    unlock_res = client.post("/api/admin/unlock", json={"admin_key": "admin2026"}, headers=headers)
    assert unlock_res.status_code == 200, f"Unlock failed: {unlock_res.text}"
    unlock_data = unlock_res.json()
    assert unlock_data["role"] == "admin"
    assert unlock_data["tokens"] == 999999

    # Now the previously depleted tester can export freely
    depleted_now_admin_exp = client.post("/api/export", headers=headers)
    assert depleted_now_admin_exp.status_code == 200
    assert depleted_now_admin_exp.json()["tokens_remaining"] == 999999
    print("  -> Passed: Depleted account successfully unlocked to admin with unlimited tokens!")

    print("\n" + "=" * 60)
    print("ALL 9/9 TEST SUITES PASSED! Admin unlimited token bypass verified.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
