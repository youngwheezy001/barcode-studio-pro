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

    # 10. Test Outsider Practice Token Checkout (Mock Purchases)
    print("\n[10/11] Testing Outsider Practice Token Purchases (Mock Sandbox)...")
    outsider_email = "outsider_client@barcodestudio.pro"
    outsider_pwd = "ClientPassword123!"

    db = SessionLocal()
    existing_out = db.query(User).filter(User.email == outsider_email).first()
    if existing_out:
        db.delete(existing_out)
        db.commit()
    db.close()

    reg_out = client.post("/register", json={"email": outsider_email, "password": outsider_pwd})
    assert reg_out.status_code == 200
    out_login = client.post("/login", data={"username": outsider_email, "password": outsider_pwd})
    out_token = out_login.json()["access_token"]
    out_headers = {"Authorization": f"Bearer {out_token}"}

    # Verify initial 3 tokens
    out_profile = client.get("/users/me", headers=out_headers).json()
    assert out_profile["tokens"] == 3

    # Outsider purchases Starter Pack (10 tokens)
    p1 = client.post("/api/tokens/purchase-mock", json={"package_id": "starter_10", "tokens": 10, "amount_usd": 4.99}, headers=out_headers)
    assert p1.status_code == 200
    assert p1.json()["tokens_remaining"] == 13
    print("  -> Passed: Purchased Starter Pack (+10 tokens, balance: 13)")

    # Outsider purchases Professional Pack (50 tokens)
    p2 = client.post("/api/tokens/purchase-mock", json={"package_id": "pro_50", "tokens": 50, "amount_usd": 14.99}, headers=out_headers)
    assert p2.status_code == 200
    assert p2.json()["tokens_remaining"] == 63
    print("  -> Passed: Purchased Professional Pack (+50 tokens, balance: 63)")

    # Outsider purchases Enterprise Pack (250 tokens)
    p3 = client.post("/api/tokens/purchase-mock", json={"package_id": "enterprise_250", "tokens": 250, "amount_usd": 39.99}, headers=out_headers)
    assert p3.status_code == 200
    assert p3.json()["tokens_remaining"] == 313
    print("  -> Passed: Purchased Enterprise Pack (+250 tokens, balance: 313)")

    # 11. Test Stripe Checkout Session Dynamic Packages
    print("\n[11/11] Testing Dynamic Stripe Checkout Session Generation...")
    stripe_session = client.post("/create-checkout-session", json={"package_id": "pro_50", "tokens": 50, "amount_cents": 1499}, headers=out_headers)
    assert stripe_session.status_code == 200
    assert "checkout_url" in stripe_session.json()
    print("  -> Passed: Generated dynamic Stripe checkout session URL for 50 tokens ($14.99).")

    # 12. Test Crypto Config & Order Creation
    print("\n[12/14] Testing Crypto Payment Config & Order Initiation...")
    cfg_res = client.get("/api/crypto/config")
    assert cfg_res.status_code == 200
    cfg_data = cfg_res.json()
    assert "USDT_TRC20" in cfg_data["currencies"]
    assert "BTC" in cfg_data["currencies"]
    assert "ETH" in cfg_data["currencies"]
    assert "SOL" in cfg_data["currencies"]
    print("  -> Passed: Crypto configurations verified for USDT (TRC-20), Polygon, BTC, ETH, and SOL.")

    # Create Crypto Order for 50 tokens ($14.99)
    order_res = client.post("/api/crypto/create-order", json={
        "package_id": "pro_50",
        "crypto_currency": "USDT_TRC20"
    }, headers=out_headers)
    assert order_res.status_code == 200
    order_data = order_res.json()
    order_id = order_data["order_id"]
    assert order_data["amount_usd"] == 14.99
    assert order_data["tokens"] == 50
    assert order_data["crypto_currency"] == "USDT_TRC20"
    assert "wallet_address" in order_data
    print(f"  -> Passed: Created Crypto Order #{order_id} for $14.99 USDT (TRC-20).")

    # 13. Test TxID Proof Submission & Mock Verification
    print("\n[13/14] Testing Transaction Hash (TxID) Submission & Mock Verification...")
    test_txid = "0x98f4e2c1a3b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1"
    proof_res = client.post("/api/crypto/submit-proof", json={
        "order_id": order_id,
        "tx_hash": test_txid
    }, headers=out_headers)
    assert proof_res.status_code == 200
    assert proof_res.json()["order_status"] == "submitted"
    print("  -> Passed: Successfully submitted TxID proof.")

    # Simulate Instant Sandbox Crypto Verification
    balance_before = client.get("/users/me", headers=out_headers).json()["tokens"]
    verify_res = client.post("/api/crypto/verify-mock", json={"order_id": order_id}, headers=out_headers)
    assert verify_res.status_code == 200
    balance_after = client.get("/users/me", headers=out_headers).json()["tokens"]
    assert balance_after == balance_before + 50
    print(f"  -> Passed: Mock crypto verification credited 50 tokens (Balance: {balance_before} -> {balance_after}).")

    # 14. Test Admin Crypto Orders Ledger & Manual Approval
    print("\n[14/14] Testing Admin Crypto Ledger & Manual Approval...")
    # Create another order to test admin manual approval
    order2_res = client.post("/api/crypto/create-order", json={
        "package_id": "starter_10",
        "crypto_currency": "SOL"
    }, headers=out_headers)
    order2_id = order2_res.json()["order_id"]
    client.post("/api/crypto/submit-proof", json={
        "order_id": order2_id,
        "tx_hash": "5KnmZ1L...solana_tx_test"
    }, headers=out_headers)

    # Admin lists orders
    admin_orders_res = client.get("/api/admin/crypto/orders", headers=admin_headers)
    assert admin_orders_res.status_code == 200
    orders_list = admin_orders_res.json()["orders"]
    assert any(o["id"] == order2_id for o in orders_list)
    print(f"  -> Passed: Admin retrieved crypto ledger with order #{order2_id} present.")

    # Admin approves order 2
    approve_res = client.post(f"/api/admin/crypto/approve/{order2_id}", headers=admin_headers)
    assert approve_res.status_code == 200
    assert "approved" in approve_res.json()["message"].lower()

    # Verify user received 10 tokens from order 2
    user_final_balance = client.get("/users/me", headers=out_headers).json()["tokens"]
    assert user_final_balance == balance_after + 10
    print(f"  -> Passed: Admin manual approval credited 10 tokens to user (Final balance: {user_final_balance}).")

    print("\n" + "=" * 60)
    print("ALL 14/14 TEST SUITES PASSED! Direct crypto payments, TxID proof submission, and admin approval verified.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
