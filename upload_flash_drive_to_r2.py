#!/usr/bin/env python3
r"""
Autonomous Flash Drive Analyzer & Cloudflare R2 Synchronizer (US States Focused)
================================================================================
Scans flash drive (E:\PSD and subfolders), selectively filters ONLY US State
Driver Licenses, State ID Cards, and US Utility Bills / Bank Statements,
compares against existing objects in Cloudflare R2, and uploads uncopied US files.

Usage:
  # Push ONLY US State files (default):
  python upload_flash_drive_to_r2.py --us-only

  # Dry-run to inspect matched US files without uploading:
  python upload_flash_drive_to_r2.py --us-only --dry-run

  # Target a specific state (e.g., California or Texas only):
  python upload_flash_drive_to_r2.py --state CA --dry-run
"""

import os
import sys
import re
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Load local environment
load_dotenv()

try:
    import boto3
    from botocore.config import Config
except ImportError:
    print("[ERROR] boto3 is not installed in current environment.")
    sys.exit(1)

US_STATES = {
    'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California',
    'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware', 'fl': 'Florida', 'ga': 'Georgia',
    'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa',
    'ks': 'Kansas', 'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
    'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi', 'mo': 'Missouri',
    'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
    'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio',
    'ok': 'Oklahoma', 'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
    'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah', 'vt': 'Vermont',
    'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia', 'wi': 'Wisconsin', 'wy': 'Wyoming',
    'dc': 'District of Columbia'
}

FOREIGN_TERMS = [
    'albania', 'algeria', 'andorra', 'angola', 'argentina', 'armenia', 'australia', 'austria',
    'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize',
    'benin', 'bermuda', 'bolivia', 'bosnia', 'botswana', 'brazil', 'bulgaria', 'burundi', 'cambodia',
    'cameroon', 'canada', 'alberta', 'ontario', 'quebec', 'manitoba', 'chile', 'china', 'colombia',
    'costa rica', 'croatia', 'cuba', 'cyprus', 'czech', 'denmark', 'dominican', 'ecuador', 'egypt',
    'el salvador', 'estonia', 'ethiopia', 'finland', 'france', 'gabon', 'germany', 'ghana', 'greece',
    'guatemala', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq',
    'ireland', 'israel', 'italy', 'jamaica', 'japan', 'jordan', 'kazakhstan', 'kenya', 'kuwait',
    'latvia', 'lebanon', 'lithuania', 'luxembourg', 'malaysia', 'malta', 'mexico', 'monaco', 'morocco',
    'netherlands', 'new zealand', 'nigeria', 'norway', 'pakistan', 'panama', 'paraguay', 'peru',
    'philippines', 'poland', 'portugal', 'qatar', 'romania', 'russia', 'saudi', 'singapore',
    'south africa', 'spain', 'sweden', 'switzerland', 'thailand', 'turkey', 'uk', 'ukraine',
    'uae', 'uruguay', 'venezuela', 'vietnam', 'united kingdom'
]

US_NATIONAL_TERMS = [
    'chase', 'wells fargo', 'bank of america', 'boa', 'citibank', 'citi', 'att', 'at&t',
    'verizon', 't-mobile', 'comcast', 'xfinity', 'spectrum', 'duke energy', 'conedison',
    'pseg', '1040', 'w2', 'w-2', 'ssn', 'social security', 'greencard', 'green card', 'usps'
]

ALLOWED_EXTENSIONS = {
    ".psd", ".psb",
    ".pdf", ".doc", ".docx",
    ".zip", ".rar", ".7z"
}

CONTENT_TYPES = {
    ".psd": "image/vnd.adobe.photoshop",
    ".psb": "image/vnd.adobe.photoshop",
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".zip": "application/zip",
    ".rar": "application/vnd.rar",
    ".7z": "application/x-7z-compressed"
}

def is_us_asset(filename: str) -> tuple[bool, str]:
    """
    Returns (True, State/Region Name) if file belongs to a US State or US National institution.
    Excludes foreign countries.
    """
    lower = filename.lower()
    for f in FOREIGN_TERMS:
        if f in lower:
            return False, ""

    for code, full in US_STATES.items():
        if full.lower() in lower:
            return True, full

    for code in US_STATES.keys():
        pattern = r'(?:^|[\W_])' + code + r'[\-_](?:dl|id|bill|license|new|water|electric|statement)'
        pattern2 = r'(?:dl|id|bill|license)[\-_]' + code + r'(?:[\W_]|\d|$)'
        if re.search(pattern, lower) or re.search(pattern2, lower):
            return True, US_STATES[code]

    for b in US_NATIONAL_TERMS:
        if b in lower:
            return True, "US National"

    return False, ""

def classify_asset(filepath: Path) -> tuple[str, str]:
    name_lower = filepath.name.lower()
    ext = filepath.suffix.lower()

    if ext in (".doc", ".docx", ".pdf") or any(k in name_lower for k in [
        "bill", "statement", "utility", "bank", "invoice", "receipt", "paystub", "tax", "lease", "proof", "form"
    ]):
        return "section2", "documents"
    elif any(k in name_lower for k in [
        "dl", "license", "card", "id", "driver", "passport", "badge", "credential", "state", "aamva", "permit"
    ]):
        return "section1", "cards"
    elif ext in (".zip", ".rar", ".7z") and any(k in name_lower for k in ["bundle", "archive", "pack"]):
        return "bundles", "bundles"
    else:
        return "templates", "templates"

def get_r2_client(account_id=None, access_key=None, secret_key=None, endpoint=None):
    account_id = account_id or os.getenv("R2_ACCOUNT_ID") or os.getenv("CLOUDFLARE_ACCOUNT_ID") or ""
    access_key = access_key or os.getenv("R2_ACCESS_KEY_ID") or os.getenv("AWS_ACCESS_KEY_ID") or ""
    secret_key = secret_key or os.getenv("R2_SECRET_ACCESS_KEY") or os.getenv("AWS_SECRET_ACCESS_KEY") or ""
    endpoint = endpoint or os.getenv("R2_ENDPOINT_URL") or os.getenv("AWS_ENDPOINT_URL") or ""

    if not (access_key and secret_key and (account_id or endpoint)):
        return None

    endpoint_url = endpoint if endpoint else f"https://{account_id}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version="s3v4"),
        region_name="auto"
    )

def analyze_and_upload(source_dir: str, bucket_name: str = None, us_only: bool = True, state_filter: str = None, dry_run: bool = False):
    source_path = Path(source_dir)
    if not source_path.exists():
        print(f"[ERROR] Source drive / folder '{source_dir}' not found. Please ensure flash drive is plugged in.")
        return

    print(f"\n=======================================================")
    print(f"  US STATES FLASH DRIVE ANALYZER: {source_path}")
    print(f"=======================================================\n")

    matched_files = []
    category_counts = {"section1": 0, "section2": 0, "templates": 0, "bundles": 0}
    by_state_count = {}
    total_bytes = 0

    for p in source_path.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        is_us, region = is_us_asset(p.name)

        if us_only and not is_us:
            continue

        if state_filter:
            target_state = US_STATES.get(state_filter.lower(), state_filter.lower())
            if target_state.lower() not in region.lower() and state_filter.lower() not in p.name.lower():
                continue

        category, prefix = classify_asset(p)
        size = p.stat().st_size
        if size > 0:
            matched_files.append((p, category, prefix, size, region or "General"))
            category_counts[category] += 1
            by_state_count[region or "General"] = by_state_count.get(region or "General", 0) + 1
            total_bytes += size

    print(f"Filtered {len(matched_files)} US State Assets ({total_bytes / (1024*1024):.1f} MB):")
    print(f"  - 💳 Section 1 (US DLs & ID Cards): {category_counts['section1']} files")
    print(f"  - 🧾 Section 2 (US Utility Bills, Bank Statements & Tax): {category_counts['section2']} files")
    print(f"  - 🎨 Templates & Mockups: {category_counts['templates']} files")
    print(f"  - 📦 Bundles: {category_counts['bundles']} files\n")

    print(f"States Represented ({len(by_state_count)} regions):")
    for st, count in sorted(by_state_count.items()):
        print(f"  • {st}: {count} file(s)")

    bucket = bucket_name or os.getenv("R2_BUCKET_NAME") or os.getenv("AWS_BUCKET_NAME") or os.getenv("R2_BUCKET") or ""
    client = get_r2_client()

    if not client or not bucket:
        print("\n-------------------------------------------------------")
        print("  HOW TO PUSH ONLY THESE US FILES TO CLOUDFLARE R2")
        print("-------------------------------------------------------")
        print("1. Set your 4 Cloudflare R2 keys in your environment or .env:")
        print("     R2_ACCOUNT_ID=your_account_id")
        print("     R2_ACCESS_KEY_ID=your_access_key")
        print("     R2_SECRET_ACCESS_KEY=your_secret_key")
        print("     R2_BUCKET_NAME=your_bucket_name")
        print("\n2. Run the command:")
        print("     python upload_flash_drive_to_r2.py --us-only")
        print("\n   Or for a single state (e.g. California only):")
        print("     python upload_flash_drive_to_r2.py --state CA")
        print("-------------------------------------------------------\n")
        return

    print(f"\nConnected to Cloudflare R2 bucket: '{bucket}'")
    print("Checking existing files in bucket to avoid duplicate uploads...")

    existing_keys = set()
    try:
        paginator = client.get_paginator('list_objects_v2')
        for page in paginator.paginate(Bucket=bucket):
            for obj in page.get('Contents', []):
                existing_keys.add(obj['Key'])
                existing_keys.add(os.path.basename(obj['Key']).lower())
    except Exception as e:
        print(f"[R2 LIST WARNING] Could not list existing objects: {e}")

    uncopied = []
    for filepath, cat, prefix, size, region in matched_files:
        clean_name = filepath.name.replace(" ", "_")
        r2_key = f"{prefix}/{clean_name}"
        if r2_key not in existing_keys and filepath.name.lower() not in existing_keys:
            uncopied.append((filepath, r2_key, cat, size, region))

    print(f"US Files remaining to copy: {len(uncopied)} of {len(matched_files)}")

    if not uncopied:
        print("All US State files are already uploaded to Cloudflare R2! Bucket is up to date.")
        return

    if dry_run:
        print("\n[DRY RUN PREVIEW] The following US files will be pushed:")
        for fp, key, cat, size, region in uncopied:
            print(f"  [{region}] {fp.name} -> s3://{bucket}/{key} ({size / (1024*1024):.1f} MB)")
        return

    print(f"\nPushing {len(uncopied)} US State files to Cloudflare R2...")
    uploaded = 0
    failed = 0
    for idx, (filepath, r2_key, cat, size, region) in enumerate(uncopied, start=1):
        ext = filepath.suffix.lower()
        content_type = CONTENT_TYPES.get(ext, "application/octet-stream")
        print(f"[{idx}/{len(uncopied)}] Uploading [{region}] {filepath.name} -> {r2_key}...", end=" ", flush=True)
        try:
            with open(filepath, "rb") as f:
                client.put_object(
                    Bucket=bucket,
                    Key=r2_key,
                    Body=f,
                    ContentType=content_type,
                    Metadata={
                        "original_filename": filepath.name,
                        "category": cat,
                        "region": region
                    }
                )
            print("OK")
            uploaded += 1
        except Exception as e:
            print(f"ERROR: {e}")
            failed += 1

    print(f"\nFinished! Uploaded: {uploaded}, Failed: {failed}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload US State files to Cloudflare R2")
    parser.add_argument("--source", default=r"E:\PSD", help="Source folder on flash drive (default: E:\\PSD)")
    parser.add_argument("--bucket", default=None, help="Cloudflare R2 Bucket name")
    parser.add_argument("--us-only", action="store_true", default=True, help="Push ONLY US States and US National assets (default: True)")
    parser.add_argument("--all", dest="us_only", action="store_false", help="Push all files including foreign countries")
    parser.add_argument("--state", default=None, help="Push only a specific state (e.g. CA, TX, FL, NY)")
    parser.add_argument("--dry-run", action="store_true", help="Inspect and preview matched files without uploading")
    args = parser.parse_args()

    analyze_and_upload(
        source_dir=args.source,
        bucket_name=args.bucket,
        us_only=args.us_only,
        state_filter=args.state,
        dry_run=args.dry_run
    )
