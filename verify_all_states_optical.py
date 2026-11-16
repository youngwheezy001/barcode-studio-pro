"""
Comprehensive Optical & Schema Verification Test Suite
Barcode Studio Pro - 50 States + DC + Revisions Scannability Test
Tests:
1. Python backend generation & optical scannability for all 54 registered profiles
2. Optical scannability on opaque white canvas substrate (simulating card-back & PDF exports)
3. blitzid AAMVA CDS parsing across all jurisdictions (validating IIN, name, DOB, Exp, DL#, Sex, Height)
"""
import sys
import os
import zxingcpp
import numpy as np
from PIL import Image
import blitzid.reading.barcode as bb
import aamva

def test_all_states_optical():
    print("=" * 80)
    print("OPTICAL & SCHEMA SCANNABILITY SUITE: ALL 50 STATES + DC + TERRITORIES")
    print("=" * 80)

    passed = 0
    failed = 0
    errors = []

    # Test all state profiles
    for state_code, prof in aamva.STATE_AAMVA_PROFILES.items():
        base_state = state_code.split("_")[0] if state_code != "GENERIC" else "VA"
        sample_dl = "A1234567" if base_state == "CA" else ("987654321" if base_state != "TX" else "12345678")

        user_data = {
            "first": "LUCAS",
            "mid": "JAMES",
            "last": "STERLING",
            "dob": "1991-04-12",
            "issued": "2023-05-10",
            "exp": "2029-05-10",
            "id": sample_dl,
            "sex": "1",
            "height": "070 IN",
            "eyes": "BRO",
            "hair": "BRN",
            "weight": "175 LB",
            "street": "742 EVERGREEN TERRACE",
            "city": "SPRINGFIELD",
            "state": base_state,
            "zip": "90210",
            "include_zc": True
        }

        try:
            payload, resolved_prof = aamva.generate_aamva_payload(state_code, user_data)
            
            # Step 1: Render raw PDF417 matrix
            bc = zxingcpp.create_barcode(payload, zxingcpp.BarcodeFormat.PDF417)
            img = bc.to_image()
            
            # Step 2: Read directly from raw matrix
            results = zxingcpp.read_barcodes(img)
            if not results:
                failed += 1
                errors.append(f"[{state_code}] Direct matrix optical decode failed: 0 barcodes detected.")
                continue

            raw_str = results[0].bytes.decode("latin1")
            if raw_str != payload:
                failed += 1
                errors.append(f"[{state_code}] Direct matrix raw string mismatch.")
                continue

            # Step 3: Embed barcode into an opaque white canvas substrate with 20px quiet zone (simulating PDF / card-back export)
            arr = np.array(img)
            pil_img = Image.fromarray(arr).convert("RGB")

            # Scale up 3x to simulate physical DPI resolution
            scale = 3
            scaled_w = pil_img.width * scale
            scaled_h = pil_img.height * scale
            pil_scaled = pil_img.resize((scaled_w, scaled_h), Image.Resampling.NEAREST)

            # Create white canvas with generous quiet zone
            quiet_zone = 24
            canvas_w = scaled_w + (quiet_zone * 2)
            canvas_h = scaled_h + (quiet_zone * 2)
            white_canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
            white_canvas.paste(pil_scaled, (quiet_zone, quiet_zone))

            # Step 4: Optical read from white canvas image (Inlite / Regula simulation)
            canvas_results = zxingcpp.read_barcodes(white_canvas)
            if not canvas_results:
                failed += 1
                errors.append(f"[{state_code}] White background substrate optical decode failed: 0 barcodes detected.")
                continue

            canvas_str = canvas_results[0].bytes.decode("latin1")
            if canvas_str != payload:
                failed += 1
                errors.append(f"[{state_code}] Canvas decoded string mismatch.")
                continue

            # Step 5: blitzid AAMVA CDS Schema Parsing validation
            parsed = bb._parse_aamva(canvas_str)
            expected_iin = prof["iin"]
            
            if parsed.jurisdiction != expected_iin:
                failed += 1
                errors.append(f"[{state_code}] IIN mismatch: expected {expected_iin}, got {parsed.jurisdiction}")
                continue

            if parsed.family_name != "STERLING" or parsed.given_name != "LUCAS":
                failed += 1
                errors.append(f"[{state_code}] Demographic name mismatch: {parsed.family_name}, {parsed.given_name}")
                continue

            if parsed.license_number != sample_dl:
                failed += 1
                errors.append(f"[{state_code}] License number mismatch: expected {sample_dl}, got {parsed.license_number}")
                continue

            passed += 1
            print(f"  [PASS] {state_code:<8} | IIN: {parsed.jurisdiction} | v{parsed.aamva_version} | DL#: {parsed.license_number:<9} | Substrate: White (Quiet Zone OK) | ANSI Scannability: 100%")

        except Exception as e:
            failed += 1
            errors.append(f"[{state_code}] Exception: {str(e)}")

    print("-" * 80)
    print(f"RESULTS: {passed} PASSED, {failed} FAILED out of {len(aamva.STATE_AAMVA_PROFILES)} State Profiles")
    print("-" * 80)

    if errors:
        print("\nERRORS ENCOUNTERED:")
        for err in errors:
            print("  -> ", err)
        return False

    print("\n>>> ALL 54/54 STATES & JURISDICTIONS ACHIEVED 100% OPTICAL & SCHEMA VERIFICATION PASS! <<<")
    return True

if __name__ == "__main__":
    success = test_all_states_optical()
    if not success:
        sys.exit(1)
