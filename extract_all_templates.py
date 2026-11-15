import os
import sys
import io
import re
import shutil
import zipfile
from PIL import Image, ImageDraw, ImageFilter
from psd_tools import PSDImage

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.abspath('static/card_templates')
MRZ_OUTPUT_DIR = os.path.abspath('static/mrz_templates')
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(MRZ_OUTPUT_DIR, exist_ok=True)

CR80_WIDTH = 1200
CR80_HEIGHT = 756  # 1.587 aspect ratio (Standard ID-1 / CR80)

# 1. First, sync the existing 9 curated back templates
EXISTING_TEMPLATES = {
    'alabama': 'static/alabama_back_bg.webp',
    'arizona': 'static/arizona_back_bg.webp',
    'arkansas': 'static/arkansas_back_bg.webp',
    'california': 'static/california_back_bg.webp',
    'colorado': 'static/colorado_back_bg.webp',
    'florida': 'static/florida_back_bg.webp',
    'georgia': 'static/georgia_back_bg.webp',
    'idaho': 'static/idaho_back_bg.webp',
    'kansas': 'static/kansas_back_bg.webp',
}

for slug, src in EXISTING_TEMPLATES.items():
    if os.path.exists(src):
        dst = os.path.join(OUTPUT_DIR, f"{slug}_back.webp")
        shutil.copyfile(src, dst)
        print(f"Synced existing: {slug}_back.webp")

# State & Province mapping to flash drive source files
# Each entry contains: list of (parent_zip, nested_zip, psd_filename_regex, role: 'back' | 'front' | 'both')
TEMPLATE_SOURCES = {
    # US States
    'washington': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'WASHINGTON DL/WA-NEW-lpwwzq.zip', r'WA.*NEW\.psd', 'both'),
    ],
    'texas': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', None, r'TEXAS DL/.*Front&Back.*\.psd', 'both'),
        ('E:/PSD/TX_DL-abkr0t.zip', None, r'.*\.psd', 'both'),
    ],
    'new_york': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'NEW YORK/NY-zstwnl.zip', r'NY\.psd', 'both'),
        ('E:/PSD/NY_IDCARD-qmez8n.zip', None, r'NYidback\.psd', 'back'),
    ],
    'illinois': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', None, r'ILLINOIS DL/ILLINOIS_DL\.psd', 'both'),
        ('E:/PSD/DL-IL-bb5xuj.zip', None, r'.*\.psd', 'both'),
    ],
    'pennsylvania': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'PENNSYLVANIA DL/Pennsylvania-Driver-License-y0pam9.zip', r'front & back\.psd', 'both'),
        ('E:/PSD/PADL-levpba.zip', None, r'.*\.psd', 'both'),
    ],
    'ohio': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'OHIO DL/OH_NEW-zw55xj.zip', r'OH_NEW\.psd', 'both'),
    ],
    'michigan': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MICHIGAN DL/MI-p5iwpe.zip', r'MI Back\.psd', 'back'),
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MICHIGAN DL/MI-p5iwpe.zip', r'MI Front\.psd', 'front'),
    ],
    'maryland': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MARYLAND DL/MD-Driver-License-qnljs8.zip', r'MDBACK\.psd', 'back'),
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MARYLAND DL/MD-Driver-License-qnljs8.zip', r'MDFRONT\.psd', 'front'),
    ],
    'massachusetts': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', None, r'MASSACHUSETTS/MASSACHUSETTS\.psd', 'both'),
    ],
    'new_jersey': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'NEW JERSEY DL/NJ-4jibgc.zip', r'V7 Back\.psd', 'back'),
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'NEW JERSEY DL/NJ-4jibgc.zip', r'V7 Front\.psd', 'front'),
    ],
    'virginia': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'VIRGINIA DL/VA_DL-knelex.zip', r'Back\.psd', 'back'),
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'VIRGINIA DL/VA_DL-knelex.zip', r'Front\.psd', 'front'),
    ],
    'indiana': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'INDIANA DL/Indiana-Driver-License-New-ub26cb.zip', r'Indiana DL New \(scan\)\.psd', 'both'),
    ],
    'missouri': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'MISSOURI DL/Missouri_Driver_License_NEW-1200-DPI-e1gzce.zip', r'Missouri_Driver_License_NEW.*\.psd', 'both'),
    ],
    'tennessee': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'TENNESSEE DL/TN-qfvfnu.zip', r'TN\.psd', 'both'),
    ],
    'wisconsin': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'WISCONSIN DL/WI_NEW-krgooj.zip', r'WI_NEW\.psd', 'both'),
    ],
    'minnesota': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MINNESOTA DL/Minnesota-Driver-License-rdjank.zip', r'Minnesota dl front & back\.psd', 'both'),
    ],
    'colorado': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'COLORADO/Colorado_Driver_License_NEW_NEW-ckbxir.zip', r'Colorado_Driver_License.*\.psd', 'both'),
    ],
    'south_carolina': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'SOUTH CAROLINA DL/South-Carolina-Driver-License-new-gsayy0.zip', r'South Carolina new dl front & back\.psd', 'both'),
    ],
    'alabama': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'ALABAMA DL/Alabama-Driving-License-ahq5kk.zip', r'DL AL\(front and back\)\.psd', 'both'),
    ],
    'louisiana': [
        ('E:/PSD/LA_DL-phpphc.zip', None, r'.*\.psd', 'both'),
    ],
    'kentucky': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'KENTUCKY DL/Kentucky-Driver-License-1rfx6a.zip', r'Kentucky DL New front & back\.psd', 'both'),
    ],
    'oregon': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'OREGON DL/OR_NEW-cglnos.zip', r'OR_NEW\.psd', 'both'),
    ],
    'oklahoma': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'OKLAHOMA DL/Oklahoma-DL-New-w4d1fd.zip', r'Oklahoma DL New\.psd', 'both'),
    ],
    'connecticut': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', None, r'CONNECTICUT DL/.*\.psd', 'both'),
    ],
    'utah': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'UTAH DL/Utah-Driver-License-8l9aku.zip', r'Utah dl front&back\.psd', 'both'),
    ],
    'nevada': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'NEVADA DL/Nevada-NEW-wmrdxe.zip', r'Nevada NEW\.psd', 'both'),
    ],
    'arkansas': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'ARKANSAS DL/Arkansas_Driver_License_NEW-1200-DPI-ol8iaz.zip', r'.*\.psd', 'both'),
    ],
    'mississippi': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'MISSISSIPPI DL/Mississippi-Driver-License-7rncub.zip', r'DL MS front and back\.psd', 'both'),
    ],
    'new_mexico': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', None, r'NEW MEXICO DL/.*\.psd', 'both'),
    ],
    'kansas': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'KANSAS DL/Kansas-Driver-License-bbp4em.zip', r'.*\.psd', 'both'),
    ],
    'west_virginia': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'WEST VIRGINIA DL/WV-zesnp5.zip', r'WV\.psd', 'both'),
    ],
    'nebraska': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', None, r'NEBRASKA DL/.*\.psd', 'both'),
    ],
    'idaho': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'IDAHO DL/Idaho-Driver-License-5oc4os.zip', r'.*\.psd', 'both'),
    ],
    'hawaii': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'HAWAII DL/HI-n8jqzu.zip', r'HI\.psd', 'both'),
    ],
    'new_hampshire': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'NEW HAMPSHIRE DL/New-Hampshire-Driver-License-qujatl.zip', r'New Hampshire dl front and back\.psd', 'both'),
    ],
    'maine': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', None, r'MAINE/Maine DL\.psd', 'both'),
    ],
    'rhode_island': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'RHODE ISLAND DL/Rhode-Island-Driver-License-4qbegn.zip', r'DL RI front and back\.psd', 'both'),
    ],
    'montana': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'MONTANA DL/Montana-dl-1l29ih.zip', r'Montana Dl front & back\.psd', 'both'),
    ],
    'delaware': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'DELAWARE DL/Delaware-Driver-License-qoehon.zip', r'.*\.psd', 'both'),
    ],
    'south_dakota': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', None, r'SOUTH DAKOTA DL/.*\.psd', 'both'),
    ],
    'north_dakota': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'NORTH DAKOTA DL/NDDL-ge2l5q.zip', r'North Dakota DL\.psd', 'both'),
    ],
    'alaska': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'ALASKA DL/Alaska-New-kw2n6q.zip', r'Alaska DL New\.psd', 'both'),
    ],
    'district_of_columbia': [
        ('E:/PSD/DC_DL-p9u96r.zip', None, r'DC LIC BACK\.psd', 'back'),
        ('E:/PSD/DC_DL-p9u96r.zip', None, r'DC LIC\.psd', 'front'),
    ],
    'vermont': [
        ('E:/PSD/VTDL-yjp6cv.zip', None, r'Usa vermont DL new\.psd', 'both'),
    ],
    'wyoming': [
        ('E:/drive-download-20261022T182330Z-1-001.zip', 'WYOMING DL/WYDL-soxkzf.zip', r'Wyoming DL\.psd', 'both'),
    ],
    'iowa': [
        ('E:/PSD/Iowa-Driver-License-ghh0ae.zip', None, r'Iowa dl front and back\.psd', 'both'),
    ],
    'north_carolina': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', 'NORTH CAROLINA DL/NC-4zja9b.zip', r'NC\.psd', 'both'),
    ],
    
    # Canadian Provinces & Territories
    'alberta': [
        ('E:/PSD/ALBERTA-DL-n5v04c.zip', None, r'ALBERTA DL\.psd', 'both'),
    ],
    'british_columbia': [
        ('E:/PSD/DRIVER-LICENSE-BC-9shqck.zip', None, r'DRIVER LICENSE BC\.psd', 'both'),
    ],
    'manitoba': [
        ('E:/PSD/MANITOBA_DL-uph2nf.zip', None, r'MANITOBA_BACK\.psd', 'back'),
        ('E:/PSD/MANITOBA_DL-uph2nf.zip', None, r'MANOTOBA_FRONT\.psd', 'front'),
    ],
    'new_brunswick': [
        ('E:/PSD/CANADA-NB-New-v2cgs9.zip', None, r'CANADA NB-New\.psd', 'both'),
    ],
    'nova_scotia': [
        ('E:/PSD/Nova-Scotia-Driver-License-bbxpgz.zip', None, r'Nova Scotia\.psd', 'both'),
    ],
    'northwest_territories': [
        ('E:/PSD/NWT-Canada-Driving-licence-psd-template-9495ag.zip', None, r'Back\.psd', 'back'),
        ('E:/PSD/NWT-Canada-Driving-licence-psd-template-9495ag.zip', None, r'NWT\.psd', 'front'),
    ],
    'ontario': [
        ('E:/PSD/ON_ID-thq4yg.zip', None, r'BACK ON\.psd', 'back'),
        ('E:/PSD/ON-DRIVING-LICENSE-bejk4i.zip', None, r'ON DRIVING LICENSE\.psd', 'front'),
    ],
    'quebec': [
        ('E:/PSD/QC-NEW-qp31cu.zip', None, r'DL BACK.*\.psd', 'back'),
        ('E:/PSD/QC-NEW-qp31cu.zip', None, r'DL V.*\.psd', 'front'),
    ],
    'saskatchewan': [
        ('E:/PSD/SASKATCHEWAN_DL-bf3qtw.zip', None, r'Sakatchewan DL Back\.psd', 'back'),
        ('E:/PSD/SASKATCHEWAN_DL-bf3qtw.zip', None, r'Sakatchewan DL Front\.psd', 'front'),
    ],
    'canada_id': [
        ('E:/PSD/Canada-ID-ypheos.zip', None, r'Canada ID\.psd', 'both'),
    ],
    
    # Passports & Travel Documents
    'us_passport_card': [
        ('E:/drive-download-20261022T182330Z-1-002.zip', None, r'Passport Card/Passport Card\.psd', 'both'),
    ],
    'us_greencard': [
        ('E:/PSD/USA_GreenCard-wwordn.zip', None, r'USA_GreenCard\.psd', 'both'),
        ('E:/PSD/GREENCARD_USA-di9rna.zip', None, r'USA_GREEN_CARD\.psd', 'both'),
    ],
    'uk_passport': [
        ('E:/PSD/UK-PASSPORT-hof0bg.zip', None, r'UKPPV4\.psd', 'both'),
    ],
}

def extract_psd_from_zip(parent_zip, nested_zip, psd_pattern):
    """Safely extracts PSD bytes from parent (and optional nested) zip."""
    if not os.path.exists(parent_zip):
        return None
    try:
        with zipfile.ZipFile(parent_zip, 'r') as pz:
            if nested_zip:
                # Find matching nested zip if wildcard
                target_nz = None
                for n in pz.namelist():
                    if n == nested_zip or (nested_zip.endswith('.zip') and os.path.basename(n) == os.path.basename(nested_zip)):
                        target_nz = n
                        break
                if not target_nz:
                    return None
                nz_bytes = pz.read(target_nz)
                with zipfile.ZipFile(io.BytesIO(nz_bytes), 'r') as nz:
                    for name in nz.namelist():
                        if re.search(psd_pattern, name, re.IGNORECASE):
                            return nz.read(name)
            else:
                for name in pz.namelist():
                    if re.search(psd_pattern, name, re.IGNORECASE):
                        return pz.read(name)
    except Exception as e:
        print(f"Error extracting {psd_pattern} from {parent_zip}: {e}")
    return None

def process_image(img, target_w=CR80_WIDTH, target_h=CR80_HEIGHT):
    """Resizes and normalizes an image to CR80 dimensions with high-quality resampling."""
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def generate_security_card_template(name, state_code, tint_hex='#1e3a8a'):
    """Generates a high-fidelity guilloche/vector security card background if PSD is missing."""
    w, h = CR80_WIDTH, CR80_HEIGHT
    img = Image.new('RGB', (w, h), color='#f8fafc')
    draw = ImageDraw.Draw(img)
    
    # 1. Subtle Guilloche Wave Curves
    import math
    for i in range(0, h, 14):
        points = []
        for x in range(0, w, 20):
            y = i + math.sin(x / 40.0 + i / 30.0) * 8.0 + math.cos(x / 70.0) * 5.0
            points.append((x, int(y)))
        draw.line(points, fill='#e2e8f0', width=1)
        
    # 2. State Header Banner Tint
    draw.rectangle([0, 0, w, 65], fill=tint_hex)
    
    # 3. Magnetic stripe on back
    draw.rectangle([0, 75, w, 185], fill='#0f172a')
    
    # 4. Subtle watermark circle in center
    draw.ellipse([w//2 - 180, h//2 - 120, w//2 + 180, h//2 + 240], outline='#cbd5e1', width=3)
    draw.ellipse([w//2 - 140, h//2 - 80, w//2 + 140, h//2 + 200], outline='#e2e8f0', width=1)
    
    # 5. Security border microprint line
    draw.rectangle([25, 25, w - 25, h - 25], outline='#cbd5e1', width=2)
    return img

def main():
    extracted_count = 0
    generated_count = 0
    
    for slug, sources in TEMPLATE_SOURCES.items():
        is_mrz = slug.startswith(('us_passport', 'us_greencard', 'uk_passport'))
        target_dir = MRZ_OUTPUT_DIR if is_mrz else OUTPUT_DIR
        back_out = os.path.join(target_dir, f"{slug}_back.webp")
        front_out = os.path.join(target_dir, f"{slug}_front.webp")
        
        # Check if already curated
        if os.path.exists(back_out) and slug in EXISTING_TEMPLATES:
            print(f"Skipping extraction for curated back template: {slug}")
            continue
            
        success = False
        for pz, nz, pattern, role in sources:
            data = extract_psd_from_zip(pz, nz, pattern)
            if data:
                try:
                    psd = PSDImage.open(io.BytesIO(data))
                    composite = psd.composite()
                    if composite:
                        processed = process_image(composite)
                        if role in ('back', 'both'):
                            processed.save(back_out, 'WEBP', quality=85)
                            print(f"[OK] Extracted {slug}_back.webp ({processed.size})")
                            extracted_count += 1
                        if role in ('front', 'both'):
                            processed.save(front_out, 'WEBP', quality=85)
                            print(f"[OK] Extracted {slug}_front.webp ({processed.size})")
                            extracted_count += 1
                        success = True
                        break
                except Exception as e:
                    print(f"[WARN] PSD processing failed for {slug} ({pattern}): {e}")
                    
        if not success and not os.path.exists(back_out):
            # Generate fallback security card template
            gen_img = generate_security_card_template(slug.replace('_', ' ').title(), slug[:2].upper())
            gen_img.save(back_out, 'WEBP', quality=85)
            gen_img.save(front_out, 'WEBP', quality=85)
            print(f"[GEN] Generated security card template for {slug}")
            generated_count += 1
            
    print(f"\nCompleted! Extracted: {extracted_count}, Generated: {generated_count}")
    print(f"Total templates in {OUTPUT_DIR}: {len(os.listdir(OUTPUT_DIR))}")
    print(f"Total templates in {MRZ_OUTPUT_DIR}: {len(os.listdir(MRZ_OUTPUT_DIR))}")

if __name__ == '__main__':
    main()
