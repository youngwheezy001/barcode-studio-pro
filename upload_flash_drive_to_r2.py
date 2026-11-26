#!/usr/bin/env python3
r"""
Autonomous Flash Drive Analyzer & Cloudflare R2 Synchronizer
============================================================
Scans flash drive (E:\PSD and subfolders), analyzes and classifies all template
and document assets, checks existing objects in Cloudflare R2, and uploads
all uncopied files with autonomous category paths and content types.

Usage:
  python upload_flash_drive_to_r2.py [--source E:\PSD] [--dry-run]
"""

import os
import sys
import re
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Load local environment
load_dotenv()

# S3 / Cloudflare R2 Boto3 imports
try:
    import boto3
    from botocore.config import Config
except ImportError:
    print("[ERROR] boto3 is not installed in current environment.")
    sys.exit(1)

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

def classify_asset(filepath: Path) -> tuple[str, str]:
    """
    Classifies file into (category, target_r2_prefix)
    Section 1 (DLs & IDs) -> 'cards/'
    Section 2 (Utility Bills & Bank Statements) -> 'documents/'
    Bundles -> 'bundles/'
    General Templates -> 'templates/'
    """
    name_lower = filepath.name.lower()
    path_lower = str(filepath).lower()
    ext = filepath.suffix.lower()

    if ext in (".doc", ".docx", ".pdf") or any(k in name_lower or k in path_lower for k in [
        "bill", "statement", "utility", "bank", "invoice", "receipt", "paystub", "tax", "lease", "proof", "fullz", "form"
    ]):
        return "section2", "documents"
    elif any(k in name_lower or k in path_lower for k in [
        "dl", "license", "card", "id", "driver", "passport", "badge", "credential", "state", "aamva", "permit"
    ]):
        return "section1", "cards"
    elif ext in (".zip", ".rar", ".7z") and any(k in name_lower for k in ["bundle", "archive", "pack", "all"]):
        return "bundles", "bundles"
    else:
        return "templates", "templates"

def analyze_and_upload(source_dir: str, bucket_name: str = None, dry_run: bool = False):
    source_path = Path(source_dir)
    if not source_path.exists():
        print(f"[ERROR] Source drive / folder '{source_dir}' not found. Please ensure flash drive is plugged in.")
        return

    print(f"\n=======================================================")
    print(f"  AUTONOMOUS FLASH DRIVE ANALYZER: {source_path}")
    print(f"=======================================================\n")

    # 1. Scan flash drive files
    all_files = []
    category_counts = {"section1": 0, "section2": 0, "templates": 0, "bundles": 0}
    total_bytes = 0

    for p in source_path.rglob("*"):
        if p.is_file() and p.suffix.lower() in ALLOWED_EXTENSIONS:
            category, prefix = classify_asset(p)
            size = p.stat().st_size
            if size > 0:
                all_files.append((p, category, prefix, size))
                category_counts[category] += 1
                total_bytes += size

    print(f"Found {len(all_files)} relevant product files on flash drive ({total_bytes / (1024*1024):.1f} MB):")
    print(f"  - 💳 Section 1 (DLs & ID Cards): {category_counts['section1']} files")
    print(f"  - 🧾 Section 2 (Utility Bills & Bank Statements): {category_counts['section2']} files")
    print(f"  - 🎨 Templates & PSDs: {category_counts['templates']} files")
    print(f"  - 📦 Bundles & Archives: {category_counts['bundles']} files\n")

    # 2. Check Cloudflare R2 Connection
    bucket = bucket_name or os.getenv("R2_BUCKET_NAME") or os.getenv("AWS_BUCKET_NAME") or os.getenv("R2_BUCKET") or ""
    client = get_r2_client()

    if not client or not bucket:
        print("[NOTICE] Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME) are not configured locally.")
        print(f"All {len(all_files)} files are cataloged and ready to sync as soon as credentials are added to .env or environment variables.")
        print("Example .env entries:")
        print("  R2_ACCOUNT_ID=your_cloudflare_account_id")
        print("  R2_ACCESS_KEY_ID=your_access_key_id")
        print("  R2_SECRET_ACCESS_KEY=your_secret_access_key")
        print("  R2_BUCKET_NAME=your_bucket_name\n")
        return

    print(f"Connected to Cloudflare R2 bucket: '{bucket}'")
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

    print(f"Found {len(existing_keys)} existing objects already in Cloudflare R2.")

    # 3. Filter uncopied files
    uncopied = []
    for filepath, cat, prefix, size in all_files:
        clean_name = filepath.name.replace(" ", "_")
        r2_key = f"{prefix}/{clean_name}"
        if r2_key not in existing_keys and filepath.name.lower() not in existing_keys:
            uncopied.append((filepath, r2_key, cat, size))

    print(f"\nFiles remaining to copy to Cloudflare R2: {len(uncopied)} of {len(all_files)}")

    if not uncopied:
        print("All files from the flash drive have already been copied to Cloudflare R2! Bucket is up to date.")
        return

    if dry_run:
        print("\n[DRY RUN MODE] The following files would be uploaded:")
        for fp, key, cat, size in uncopied[:20]:
            print(f"  -> {fp.name} -> s3://{bucket}/{key} ({size / (1024*1024):.1f} MB)")
        if len(uncopied) > 20:
            print(f"  ... and {len(uncopied) - 20} more files.")
        return

    # 4. Upload uncopied files to R2
    print(f"\nStarting upload of {len(uncopied)} files to Cloudflare R2 bucket '{bucket}'...")
    uploaded_count = 0
    failed_count = 0

    for idx, (filepath, r2_key, cat, size) in enumerate(uncopied, start=1):
        ext = filepath.suffix.lower()
        content_type = CONTENT_TYPES.get(ext, "application/octet-stream")
        print(f"[{idx}/{len(uncopied)}] Uploading {filepath.name} -> {r2_key} ({size / (1024*1024):.1f} MB)...", end=" ", flush=True)

        try:
            with open(filepath, "rb") as f:
                client.put_object(
                    Bucket=bucket,
                    Key=r2_key,
                    Body=f,
                    ContentType=content_type,
                    Metadata={
                        "original_filename": filepath.name,
                        "category": cat
                    }
                )
            print("DONE")
            uploaded_count += 1
        except Exception as up_err:
            print(f"FAILED ({up_err})")
            failed_count += 1

    print(f"\nUpload complete! Successfully uploaded: {uploaded_count}, Failed: {failed_count}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload relevant flash drive files to Cloudflare R2")
    parser.add_argument("--source", default=r"E:\PSD", help="Source folder on flash drive (default: E:\\PSD)")
    parser.add_argument("--bucket", default=None, help="Cloudflare R2 Bucket name")
    parser.add_argument("--dry-run", action="store_true", help="Inspect and list files without actually uploading")
    args = parser.parse_args()

    analyze_and_upload(source_dir=args.source, bucket_name=args.bucket, dry_run=args.dry_run)
