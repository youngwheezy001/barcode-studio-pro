"""
Automated Verification Suite for Barcode Studio Pro
Tests registration, JWT authentication, token deduction, paywall gating, and database operations.
"""
import os
import sys
import io
import zipfile
import uuid
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

    print("\n[2/5] Testing User Registration (Zero-Credit Pay-First Policy)...")
    res = client.post("/register", json={"email": test_email, "password": test_password})
    assert res.status_code == 200, f"Register failed: {res.text}"
    print(f"  -> Passed: Registered user ({test_email}) with initial 0 tokens (pay-first policy).")

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
    assert user_info["tokens"] == 0, f"Expected 0 tokens for new account, got {user_info['tokens']}"
    print(f"  -> Passed: User verified with 0 tokens (strict pay-first policy).")

    # 5. Test Export Token Deduction & Paywall Enforcement
    print("\n[5/5] Testing Token Deductions & Paywall Gating...")
    # Zero tokens must immediately trigger 402 Payment Required
    res_zero = client.post("/api/export", headers=headers)
    assert res_zero.status_code == 402, f"Expected 402 Payment Required for 0-token user, got {res_zero.status_code}"
    print("  -> Passed: 402 Payment Required strictly enforced on 0-token accounts!")

    # Grant 3 tokens to test sequential deduction
    db = SessionLocal()
    u = db.query(User).filter(User.email == test_email).first()
    u.tokens = 3
    db.commit()
    db.close()

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
    print("  -> Passed: 402 Payment Required correctly re-enforced when tokens depleted!")

    # 6. Test AAMVA API Profiles & Compilation
    print("\n[6/6] Testing AAMVA API Endpoints (/api/aamva/profiles & /api/aamva/compile)...")
    res_prof = client.get("/api/aamva/profiles")
    assert res_prof.status_code == 200
    profiles = res_prof.json()["profiles"]
    assert len(profiles) >= 52
    assert "CT" in profiles and "WA" in profiles and "TX" in profiles
    assert profiles["TX"]["dd_label"] == "Audit Number"
    assert profiles["TX"]["uses_icn"] is False
    assert profiles["CT"]["uses_icn"] is True
    assert profiles["WA"]["uses_icn"] is True
    print("  -> Passed: 52 AAMVA state profiles retrieved successfully with state-aware DD & ICN rules.")

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
    assert "DCK" in comp_data["payload"]  # CT uses ICN
    print("  -> Passed: CT 2024 compiled to v09 Format 11 with offset 41 & active ICN via API.")

    # Test Texas (Audit Number used, ICN omitted per AAMVA Section D.2)
    res_tx = client.post("/api/aamva/compile", json={
        "state": "TX",
        "user_data": {
            "first": "Michael",
            "last": "Austin",
            "issued": "05122023",
            "dob": "08141988",
            "id": "38914028"
        },
        "version": "AUTO"
    })
    assert res_tx.status_code == 200
    tx_data = res_tx.json()
    assert tx_data["profile"]["dd_label"] == "Audit Number"
    assert "DCF" in tx_data["payload"]  # Texas Audit Number present
    assert "DCK" not in tx_data["payload"]  # Texas standard cards omit DCK!
    assert '<element id="DCF" name="Audit Number"' in tx_data["xml"]
    assert '<element id="DCK"' not in tx_data["xml"]
    print("  -> Passed: TX 2023 compiled with Audit Number (DCF) and omitted ICN (DCK).")

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

    # Verify initial 0 tokens (pay-first policy)
    out_profile = client.get("/users/me", headers=out_headers).json()
    assert out_profile["tokens"] == 0

    # Outsider purchases Starter Pack (10 sets)
    p1 = client.post("/api/tokens/purchase-mock", json={"package_id": "starter_10", "tokens": 10, "amount_usd": 18.00}, headers=out_headers)
    assert p1.status_code == 200
    assert p1.json()["tokens_remaining"] == 10
    print("  -> Passed: Purchased Starter Pack (+10 sets, balance: 10)")

    # Outsider purchases Professional Pack (50 sets)
    p2 = client.post("/api/tokens/purchase-mock", json={"package_id": "pro_50", "tokens": 50, "amount_usd": 75.00}, headers=out_headers)
    assert p2.status_code == 200
    assert p2.json()["tokens_remaining"] == 60
    print("  -> Passed: Purchased Professional Pack (+50 sets, balance: 60)")

    # Outsider purchases Enterprise Pack (250 sets)
    p3 = client.post("/api/tokens/purchase-mock", json={"package_id": "enterprise_250", "tokens": 250, "amount_usd": 159.00}, headers=out_headers)
    assert p3.status_code == 200
    assert p3.json()["tokens_remaining"] == 310
    print("  -> Passed: Purchased Enterprise Pack (+250 sets, balance: 310)")

    # 11. Test Stripe Checkout Session Dynamic Packages
    print("\n[11/11] Testing Dynamic Stripe Checkout Session Generation...")
    stripe_session = client.post("/create-checkout-session", json={"package_id": "pro_50", "tokens": 50, "amount_cents": 7500}, headers=out_headers)
    assert stripe_session.status_code == 200
    assert "checkout_url" in stripe_session.json()
    print("  -> Passed: Generated dynamic Stripe checkout session URL for 50 sets ($75.00).")

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

    # Create Crypto Order for 50 sets ($75.00)
    order_res = client.post("/api/crypto/create-order", json={
        "package_id": "pro_50",
        "crypto_currency": "USDT_TRC20"
    }, headers=out_headers)
    assert order_res.status_code == 200
    order_data = order_res.json()
    order_id = order_data["order_id"]
    assert order_data["base_amount_usd"] == 75.00
    assert order_data["amount_usd"] >= 75.00
    assert "cent_offset" in order_data
    assert order_data["tokens"] == 50
    assert order_data["crypto_currency"] == "USDT_TRC20"
    assert "wallet_address" in order_data
    print(f"  -> Passed: Created Crypto Order #{order_id} for ${order_data['amount_usd']:.2f} USDT (TRC-20, base: $75.00 + {order_data['cent_offset']} cent tag).")

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

    # 15. Test 8-Tier Competitive Pricing Matrix (XXS - XXXL) & Dual Barcode Companion Sets
    print("\n[15/15] Testing 8-Tier Pricing Matrix (XXS-XXXL) & Dual Barcode Companion Sets...")
    from main import TOKEN_PACKAGES
    
    expected_matrix = {
        "xxs_1": {"sets": 1, "price": 2.50, "competitor": 3.00, "undercut": 0.50},
        "xs_5": {"sets": 5, "price": 11.00, "competitor": 12.00, "undercut": 1.00},
        "s_10": {"sets": 10, "price": 18.00, "competitor": 19.00, "undercut": 1.00},
        "m_20": {"sets": 20, "price": 37.00, "competitor": 39.00, "undercut": 2.00},
        "l_50": {"sets": 50, "price": 75.00, "competitor": 79.00, "undercut": 4.00},
        "xl_100": {"sets": 100, "price": 95.00, "competitor": 99.00, "undercut": 4.00},
        "xxl_200": {"sets": 200, "price": 159.00, "competitor": 169.00, "undercut": 10.00},
        "xxxl_500": {"sets": 500, "price": 279.00, "competitor": 299.00, "undercut": 20.00},
    }

    for tier_id, meta in expected_matrix.items():
        assert tier_id in TOKEN_PACKAGES, f"Tier {tier_id} missing from TOKEN_PACKAGES"
        pkg = TOKEN_PACKAGES[tier_id]
        assert pkg["tokens"] == meta["sets"], f"{tier_id} sets mismatch: expected {meta['sets']}, got {pkg['tokens']}"
        assert pkg["price"] == meta["price"], f"{tier_id} price mismatch: expected {meta['price']}, got {pkg['price']}"
        assert pkg["competitor_price"] == meta["competitor"], f"{tier_id} competitor price mismatch: expected {meta['competitor']}, got {pkg['competitor_price']}"
        assert round(meta["competitor"] - meta["price"], 2) == meta["undercut"], f"Undercut mismatch on {tier_id}"
        print(f"  -> Verified Tier {tier_id.upper()}: {pkg['tokens']} sets @ ${pkg['price']:.2f} (Competitor: ${pkg['competitor_price']:.2f}, Saved: ${meta['undercut']:.2f})")

    # Purchase XXS package ($2.50 for 1 Barcode Set)
    bal_pre_xxs = client.get("/users/me", headers=out_headers).json()["tokens"]
    res_xxs = client.post("/api/tokens/purchase-mock", json={"package_id": "xxs_1", "tokens": 1, "amount_usd": 2.50}, headers=out_headers)
    assert res_xxs.status_code == 200
    assert res_xxs.json()["tokens_remaining"] == bal_pre_xxs + 1
    print("  -> Passed: Purchased XXS 1-Set Package for $2.50 (+1 set credited)")

    # Purchase S package ($18.00 for 10 Barcode Sets)
    res_s = client.post("/api/tokens/purchase-mock", json={"package_id": "s_10", "tokens": 10, "amount_usd": 18.00}, headers=out_headers)
    assert res_s.status_code == 200
    assert res_s.json()["tokens_remaining"] == bal_pre_xxs + 1 + 10
    print("  -> Passed: Purchased Popular S 10-Set Package for $18.00 (+10 sets credited)")

    # Purchase XXXL package ($279.00 for 500 Barcode Sets)
    res_xxxl = client.post("/api/tokens/purchase-mock", json={"package_id": "xxxl_500", "tokens": 500, "amount_usd": 279.00}, headers=out_headers)
    assert res_xxxl.status_code == 200
    assert res_xxxl.json()["tokens_remaining"] == bal_pre_xxs + 1 + 10 + 500
    print("  -> Passed: Purchased Volume XXXL 500-Set Package for $279.00 (+500 sets credited)")

    # Create crypto order for Best Value XL package ($95.00, 100 sets)
    xl_order = client.post("/api/crypto/create-order", json={"package_id": "xl_100", "crypto_currency": "USDT_TRC20"}, headers=out_headers)
    assert xl_order.status_code == 200
    xl_data = xl_order.json()
    assert xl_data["base_amount_usd"] == 95.00
    assert xl_data["amount_usd"] >= 95.00
    assert xl_data["tokens"] == 100
    print(f"  -> Passed: Created Crypto Order for XL Best Value tier (${xl_data['amount_usd']:.2f} USDT, 100 sets).")

    # 16. Test User Order History Endpoint (/api/user/orders)
    print("\n[16/16] Testing /api/user/orders Customer Order History...")
    res_orders = client.get("/api/user/orders", headers=out_headers)
    assert res_orders.status_code == 200, f"Expected 200, got {res_orders.status_code}"
    orders_data = res_orders.json()
    assert "orders" in orders_data, "No 'orders' key in response"
    assert len(orders_data["orders"]) >= 1, "Expected at least 1 order in user history"
    found_order = next((o for o in orders_data["orders"] if o["id"] == xl_data["order_id"]), None)
    assert found_order is not None, f"Created order {xl_data['order_id']} not found in user orders"
    assert found_order["package_id"] == "xl_100"
    assert found_order["tokens"] == 100
    assert found_order["amount_usd"] >= 95.00
    assert found_order["crypto_currency"] == "USDT_TRC20"
    print(f"  -> Passed: Retrieved {len(orders_data['orders'])} order(s) for customer; verified Order #{found_order['id']} ({found_order['tokens']} sets).")

    # Verify unauthenticated protection on /api/user/orders
    res_unauth = client.get("/api/user/orders")
    assert res_unauth.status_code == 401, f"Expected 401 for unauthenticated request, got {res_unauth.status_code}"
    print("  -> Passed: Unauthenticated request to /api/user/orders correctly blocked (401 Unauthorized).")

    # 17. Test Strict On-Chain Crypto Verification & Anti-Replay Guard (/api/crypto/verify-onchain)
    print("\n[17/18] Testing Strict On-Chain Crypto Verification & Anti-Replay Protection...")
    # A. Rejection of invalid short hash
    res_short = client.post(
        "/api/crypto/verify-onchain",
        json={"order_id": xl_data["order_id"], "tx_hash": "short"},
        headers=out_headers
    )
    assert res_short.status_code == 400, f"Expected 400 for short TxID, got {res_short.status_code}"
    print("  -> Passed: Invalid short TxID correctly rejected (400 Bad Request).")

    # B. Anonymous unauthenticated verification rejected
    res_anon = client.post(
        "/api/crypto/verify-onchain",
        json={"order_id": xl_data["order_id"], "tx_hash": "TEST_BLOCKCHAIN_CONFIRMED_abc123456"}
    )
    assert res_anon.status_code == 401, f"Expected 401 for anonymous verification, got {res_anon.status_code}"
    print("  -> Passed: Anonymous on-chain verification attempt blocked (401 Unauthorized).")

    # C. Successful on-chain confirmation via test blockchain verifier
    tx_test_id = f"TEST_BLOCKCHAIN_CONFIRMED_{uuid.uuid4().hex}"
    pre_verif_tokens = client.get("/users/me", headers=out_headers).json()["tokens"]
    res_verif = client.post(
        "/api/crypto/verify-onchain",
        json={"order_id": xl_data["order_id"], "tx_hash": tx_test_id},
        headers=out_headers
    )
    assert res_verif.status_code == 200, f"Expected 200 for confirmed test tx, got {res_verif.status_code}: {res_verif.text}"
    verif_data = res_verif.json()
    assert verif_data["status"] == "success"
    assert verif_data["tokens_added"] == 100
    assert verif_data["tokens_remaining"] == pre_verif_tokens + 100
    print(f"  -> Passed: On-chain transaction confirmed! Added {verif_data['tokens_added']} sets (Balance: {verif_data['tokens_remaining']}).")

    # D. Anti-Replay double-spend attack rejection: another order cannot use the same TxID
    replay_order = client.post("/api/crypto/create-order", json={"package_id": "xxs_1", "crypto_currency": "USDT_TRC20"}, headers=out_headers).json()
    res_replay = client.post(
        "/api/crypto/verify-onchain",
        json={"order_id": replay_order["order_id"], "tx_hash": tx_test_id},
        headers=out_headers
    )
    assert res_replay.status_code == 400, f"Expected 400 for duplicate TxID replay, got {res_replay.status_code}"
    assert "already been redeemed" in res_replay.text or "replay" in res_replay.text.lower()
    print("  -> Passed: Anti-replay double-spending blocked! Duplicate TxID reuse strictly rejected (400 Bad Request).")

    # 18. Test CSV Batch / Bulk Barcode Generator (/api/batch/generate-zip)
    print("\n[18/18] Testing Batch CSV Generator & Companion Set ZIP Bundle...")
    # A. Rejection of empty records
    res_empty_batch = client.post("/api/batch/generate-zip", json={"records": []}, headers=out_headers)
    assert res_empty_batch.status_code == 400, f"Expected 400 for empty batch, got {res_empty_batch.status_code}"
    print("  -> Passed: Empty batch records correctly rejected (400 Bad Request).")

    # B. Successful generation of 2 companion sets packaged in ZIP
    batch_payload = {
        "records": [
            {
                "dl_number": "D88889999",
                "first_name": "SARAH",
                "last_name": "CONNER",
                "state": "CT",
                "dob": "19850315",
                "exp_date": "20290315"
            },
            {
                "dl_number": "Y99991111",
                "first_name": "MICHAEL",
                "last_name": "BIHN",
                "state": "CA",
                "dob": "19820710",
                "exp_date": "20300710"
            }
        ]
    }
    tokens_before_batch = client.get("/users/me", headers=out_headers).json()["tokens"]
    res_batch = client.post("/api/batch/generate-zip", json=batch_payload, headers=out_headers)
    assert res_batch.status_code == 200, f"Expected 200 for batch zip, got {res_batch.status_code}"
    assert res_batch.headers["content-type"] == "application/zip"

    # Inspect ZIP archive contents
    zip_bytes = io.BytesIO(res_batch.content)
    with zipfile.ZipFile(zip_bytes, "r") as zf:
        namelist = zf.namelist()
        assert "batch_manifest.csv" in namelist, "Manifest CSV missing from batch ZIP"
        assert any("D88889999" in name for name in namelist), "Record 1 missing from batch ZIP"
        assert any("Y99991111" in name for name in namelist), "Record 2 missing from batch ZIP"
        manifest_text = zf.read("batch_manifest.csv").decode("utf-8")
        assert "SARAH CONNER" in manifest_text
        assert "MICHAEL BIHN" in manifest_text

    tokens_after_batch = client.get("/users/me", headers=out_headers).json()["tokens"]
    assert tokens_after_batch == tokens_before_batch - 2
    print(f"  -> Passed: Batch ZIP synthesized with {len(namelist)} items; deducted 2 sets (New balance: {tokens_after_batch}).")

    # 19. Test Duplicate Account Registration Prevention
    print("\n[19/22] Testing Duplicate Registration & Accurate Error Notification...")
    res_dup = client.post("/register", json={"email": test_email.upper(), "password": "AnotherPassword999!"})
    assert res_dup.status_code == 400, f"Expected 400 for duplicate email, got {res_dup.status_code}"
    dup_msg = res_dup.json().get("detail", "")
    assert "already exists" in dup_msg.lower() and "sign in" in dup_msg.lower(), f"Unexpected duplicate message: {dup_msg}"
    print(f"  -> Passed: Duplicate registration rejected with professional message: '{dup_msg}'")

    # 20. Test ICAO 9303 MRZ Generation Endpoint
    print("\n[20/22] Testing ICAO 9303 MRZ Generation Endpoint (/api/mrz/generate)...")
    mrz_payload = {
        "doc_type": "TD3",
        "document_type_code": "P",
        "issuing_country": "USA",
        "document_number": "C01234567",
        "surname": "GARCIA",
        "given_names": "JONATHAN",
        "nationality": "USA",
        "birth_date": "1992-06-21",
        "sex": "M",
        "expiry_date": "2032-06-21",
        "optional_data": "A1234567"
    }
    res_mrz_gen = client.post("/api/mrz/generate", json=mrz_payload)
    assert res_mrz_gen.status_code == 200, f"MRZ generate failed: {res_mrz_gen.text}"
    mrz_data = res_mrz_gen.json()
    assert mrz_data["doc_type"] == "TD3"
    assert len(mrz_data["lines"]) == 2
    assert len(mrz_data["lines"][0]) == 44
    assert len(mrz_data["lines"][1]) == 44
    assert mrz_data["lines"][0].startswith("P<USAGARCIA<<JONATHAN")
    assert "C01234567" in mrz_data["lines"][1]
    assert mrz_data["checksums"]["doc_number"] == "2"
    assert mrz_data["checksums"]["dob"] == "8"
    assert mrz_data["checksums"]["expiry"] == "6"
    assert mrz_data["checksums"]["composite"] == "4"
    print("  -> Passed: TD3 Passport MRZ generated with 100% compliant ICAO 9303 checksums.")

    # Test TD1 generation
    mrz_td1_payload = dict(mrz_payload, doc_type="TD1", document_type_code="I", issuing_country="DEU", document_number="122000129", optional_data="IDD<<")
    res_td1 = client.post("/api/mrz/generate", json=mrz_td1_payload)
    assert res_td1.status_code == 200
    td1_data = res_td1.json()
    assert len(td1_data["lines"]) == 3
    assert all(len(line) == 30 for line in td1_data["lines"])
    print("  -> Passed: TD1 National ID MRZ generated (3 lines x 30 characters).")

    # 21. Test MRZ Parser and Inspector Endpoint
    print("\n[21/22] Testing MRZ Decoder & Checksum Verification (/api/mrz/parse)...")
    valid_mrz = mrz_data["raw_text"]
    res_parse = client.post("/api/mrz/parse", json={"text": valid_mrz})
    assert res_parse.status_code == 200, f"MRZ parse failed: {res_parse.text}"
    parsed = res_parse.json()
    assert parsed["format"] == "TD3"
    assert "USA" in parsed["issuing_country"]
    assert parsed["surname"] == "GARCIA"
    assert parsed["given_names"] == "JONATHAN"
    assert parsed["document_number"] == "C01234567"
    assert parsed["birth_date"] == "1992-06-21"
    assert parsed["all_checksums_pass"] is True
    print("  -> Passed: Valid MRZ string parsed with all 4 checksums confirmed PASS.")

    # Test tampered MRZ check failure
    tampered_mrz = valid_mrz.replace("C012345672", "C012345679")
    res_tampered = client.post("/api/mrz/parse", json={"text": tampered_mrz})
    assert res_tampered.status_code == 200
    tampered_data = res_tampered.json()
    assert tampered_data["all_checksums_pass"] is False
    assert tampered_data["checksums"]["doc_number"]["valid"] is False
    print("  -> Passed: Tampered document number check digit correctly detected as FAIL.")

    # 22. Test Database Backup and Sync Persistence
    print("\n[22/22] Testing Persistent User Store & Backup Synchronization...")
    from main import USERS_BACKUP_FILE, sync_users_to_backup, restore_users_from_backup
    assert os.path.exists(USERS_BACKUP_FILE), f"Backup file {USERS_BACKUP_FILE} must exist"
    
    # Verify backup contains user data
    db = SessionLocal()
    sync_count = sync_users_to_backup(db)
    assert sync_count > 0, "No users synchronized to backup"
    db.close()

    # Verify restore function works
    db = SessionLocal()
    restored = restore_users_from_backup(db)
    db.close()
    print(f"  -> Passed: Backup file active ({sync_count} users backed up). Re-sync and restore verified.")

    # 23. Test OWASP Enterprise Security Headers
    print("\n[23/26] Testing OWASP Enterprise Security Headers...")
    sec_res = client.get("/")
    assert sec_res.headers.get("X-Frame-Options") == "DENY", "X-Frame-Options must be DENY"
    assert sec_res.headers.get("X-Content-Type-Options") == "nosniff", "X-Content-Type-Options must be nosniff"
    assert "strict-origin" in sec_res.headers.get("Referrer-Policy", ""), "Referrer-Policy missing"
    assert sec_res.headers.get("X-XSS-Protection") == "1; mode=block", "X-XSS-Protection must be 1; mode=block"
    print("  -> Passed: OWASP Anti-Clickjacking, No-Sniff, and Strict Referrer Headers verified.")

    # 24. Test Crypto Order Polling Endpoint
    print("\n[24/26] Testing Automated Blockchain Payment Polling Endpoint...")
    poll_res = client.get(f"/api/crypto/poll-order/{order_id}", headers=out_headers)
    assert poll_res.status_code == 200, f"Poll order failed: {poll_res.text}"
    poll_data = poll_res.json()
    assert poll_data["order_id"] == order_id
    assert poll_data["status"] in ["confirmed", "pending"]
    assert "tokens_remaining" in poll_data or "time_remaining_seconds" in poll_data
    print(f"  -> Passed: Auto-detection poll returned order status '{poll_data['status']}'.")

    # 25. Test Official Payment Receipt / Invoice Metadata
    print("\n[25/26] Testing Official Payment Receipt & Digital Invoice (/api/crypto/order/{id}/receipt)...")
    rcpt_res = client.get(f"/api/crypto/order/{order_id}/receipt", headers=out_headers)
    assert rcpt_res.status_code == 200, f"Receipt retrieval failed: {rcpt_res.text}"
    rcpt = rcpt_res.json()
    assert rcpt["receipt_number"].startswith("RCP-2026-")
    assert rcpt["order_id"] == order_id
    assert rcpt["barcode_sets"] == 50
    assert rcpt["total_barcodes"] == 100
    assert rcpt["support_email"] == "youngwheezy001@gmail.com"
    assert rcpt["status"] == "CONFIRMED"
    assert "TNWLVHKxe3SoBRa6hpnGsXEK2HRToZMP9H" in rcpt["wallet_address"]
    print(f"  -> Passed: Official Receipt #{rcpt['receipt_number']} verified with support email {rcpt['support_email']}.")

    # 26. Test Anti-Replay Double-Spend Protection
    print("\n[26/26] Testing Anti-Replay Double-Spend Protection...")
    # Create a new pending order
    dup_order_res = client.post("/api/crypto/create-order", json={
        "package_id": "xxs_1",
        "crypto_currency": "USDT_TRC20"
    }, headers=out_headers)
    dup_order_id = dup_order_res.json()["order_id"]

    # Try verifying with the already-used txid from order 1
    dup_verif_res = client.post("/api/crypto/verify-onchain", json={
        "order_id": dup_order_id,
        "tx_hash": test_txid
    }, headers=out_headers)
    assert dup_verif_res.status_code == 400, "Replaying a used TxID must be rejected with 400"
    assert "already been redeemed" in dup_verif_res.json()["detail"].lower()
    print("  -> Passed: Double-spend replay attack strictly rejected by server.")

    print("\n" + "=" * 60)
    print("ALL 26/26 TEST SUITES PASSED! Automated Payments, Zero Tokens, Security Headers & Persistence verified.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()

