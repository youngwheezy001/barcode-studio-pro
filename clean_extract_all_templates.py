import os
import sys
import io
import re
import zipfile
from PIL import Image
from psd_tools import PSDImage

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.abspath('static/card_templates')
os.makedirs(OUTPUT_DIR, exist_ok=True)

CR80_WIDTH = 1200
CR80_HEIGHT = 756

def clean_extract_back_psd(psd_bytes):
    """Parses PSD bytes, forces back layer visible, suppresses text/sample/barcode layers, and composites."""
    try:
        psd = PSDImage.open(io.BytesIO(psd_bytes))
        
        # 1. Locate the back group or layer
        back_layer = None
        for l in psd:
            l_name = l.name.lower()
            if 'back' in l_name or l_name == 'bg':
                back_layer = l
                l.visible = True
            elif 'front' in l_name:
                l.visible = False
            elif 'select background' in l_name:
                l.visible = True
            else:
                l.visible = False
                
        if not back_layer:
            # Try to see if there's any group with back
            for l in psd:
                if l.is_group():
                    for sub in l:
                        if 'back' in sub.name.lower():
                            back_layer = sub
                            sub.visible = True
                            l.visible = True
                            break
                            
        if not back_layer:
            return None

        # 2. Recursively suppress sample/type/barcode layers inside back group
        def suppress_leaf_layers(group):
            for sub in group:
                name_l = sub.name.lower()
                if sub.kind == 'type':
                    sub.visible = False
                elif any(k in name_l for k in [
                    'barcode', 'bar code', 'matrix', '2d', '1d', 'sample', 'photo', 
                    'ghost', 'edit', 'data', 'text', 'code128', 'pdf417', 'uv', 'dob',
                    'endorsements', 'restrictions', 'class', 'donor'
                ]):
                    sub.visible = False
                elif sub.is_group():
                    suppress_leaf_layers(sub)

        if back_layer.is_group():
            suppress_leaf_layers(back_layer)

        comp = psd.composite()
        if comp:
            if comp.mode != 'RGB':
                comp = comp.convert('RGB')
            return comp.resize((CR80_WIDTH, CR80_HEIGHT), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Extraction error: {e}")
    return None

# Mapping of target states to PSD files
TARGET_EXTRACTIONS = [
    # Idaho
    ('idaho', 'E:/drive-download-20261022T182330Z-1-002.zip', 'IDAHO DL/Idaho-Driver-License-5oc4os.zip', r'DL ID\.psd'),
    # Iowa
    ('iowa', 'E:/PSD/Iowa-Driver-License-ghh0ae.zip', None, r'Iowa dl front and back\.psd'),
    # Hawaii
    ('hawaii', 'E:/drive-download-20261022T182330Z-1-001.zip', 'HAWAII DL/HI-n8jqzu.zip', r'HI\.psd'),
    # Rhode Island
    ('rhode_island', 'E:/drive-download-20261022T182330Z-1-002.zip', 'RHODE ISLAND DL/Rhode-Island-Driver-License-4qbegn.zip', r'DL RI front and back\.psd'),
    # South Carolina
    ('south_carolina', 'E:/drive-download-20261022T182330Z-1-001.zip', 'SOUTH CAROLINA DL/South-Carolina-Driver-License-new-gsayy0.zip', r'South Carolina new dl front & back\.psd'),
    # Vermont
    ('vermont', 'E:/PSD/VTDL-yjp6cv.zip', None, r'Usa vermont DL new\.psd'),
    # Utah
    ('utah', 'E:/drive-download-20261022T182330Z-1-002.zip', 'UTAH DL/Utah-Driver-License-8l9aku.zip', r'Utah dl front&back\.psd'),
    # North Carolina
    ('north_carolina', 'E:/drive-download-20261022T182330Z-1-002.zip', 'NORTH CAROLINA DL/NC-4zja9b.zip', r'NC\.psd'),
    # North Dakota
    ('north_dakota', 'E:/drive-download-20261022T182330Z-1-002.zip', 'NORTH DAKOTA DL/NDDL-ge2l5q.zip', r'North Dakota DL\.psd'),
    # Ohio
    ('ohio', 'E:/drive-download-20261022T182330Z-1-002.zip', 'OHIO DL/OH_NEW-zw55xj.zip', r'OH_NEW\.psd'),
    # Wyoming
    ('wyoming', 'E:/drive-download-20261022T182330Z-1-001.zip', 'WYOMING DL/WYDL-soxkzf.zip', r'Wyoming DL\.psd'),
    # West Virginia
    ('west_virginia', 'E:/drive-download-20261022T182330Z-1-001.zip', 'WEST VIRGINIA DL/WV-zesnp5.zip', r'WV\.psd'),
    # Alberta
    ('alberta', 'E:/PSD/ALBERTA-DL-n5v04c.zip', None, r'ALBERTA DL\.psd'),
    # Washington DC
    ('district_of_columbia', 'E:/PSD/DC_DL-p9u96r.zip', None, r'DC LIC BACK\.psd'),
    # Texas
    ('texas', 'E:/PSD/TX_DL-abkr0t.zip', None, r'.*\.psd'),
    # Oklahoma
    ('oklahoma', 'E:/drive-download-20261022T182330Z-1-001.zip', 'OKLAHOMA DL/Oklahoma-DL-New-w4d1fd.zip', r'Oklahoma DL New\.psd'),
    # New Mexico
    ('new_mexico', 'E:/drive-download-20261022T182330Z-1-001.zip', None, r'NEW MEXICO DL/.*\.psd'),
    # New York
    ('new_york', 'E:/drive-download-20261022T182330Z-1-001.zip', 'NEW YORK/NY-zstwnl.zip', r'NY\.psd'),
]

def extract_bytes(pz_path, nz_name, pattern):
    if not os.path.exists(pz_path):
        return None
    try:
        with zipfile.ZipFile(pz_path, 'r') as pz:
            if nz_name:
                target_nz = None
                for n in pz.namelist():
                    if n == nz_name or os.path.basename(n) == os.path.basename(nz_name):
                        target_nz = n
                        break
                if not target_nz:
                    return None
                nz_bytes = pz.read(target_nz)
                with zipfile.ZipFile(io.BytesIO(nz_bytes), 'r') as nz:
                    for name in nz.namelist():
                        if re.search(pattern, name, re.IGNORECASE):
                            return nz.read(name)
            else:
                for name in pz.namelist():
                    if re.search(pattern, name, re.IGNORECASE):
                        return pz.read(name)
    except Exception as e:
        print(f"Archive read error for {pattern}: {e}")
    return None

def main():
    success_count = 0
    for state_slug, pz, nz, pattern in TARGET_EXTRACTIONS:
        print(f"Processing clean back for {state_slug}...")
        psd_data = extract_bytes(pz, nz, pattern)
        if psd_data:
            img = clean_extract_back_psd(psd_data)
            if img:
                out_path = os.path.join(OUTPUT_DIR, f"{state_slug}_back.webp")
                img.save(out_path, 'WEBP', quality=92)
                print(f"[OK] Extracted and saved clean {state_slug}_back.webp ({img.size})")
                success_count += 1
            else:
                print(f"[WARN] Failed to composite clean back for {state_slug}")
        else:
            print(f"[MISS] PSD data not found for {state_slug} ({pattern})")
            
    print(f"\nFinished! Successfully updated {success_count}/{len(TARGET_EXTRACTIONS)} templates.")

if __name__ == '__main__':
    main()
