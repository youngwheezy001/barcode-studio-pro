import os
import sys
import io
import re
import zipfile
from PIL import Image
from psd_tools import PSDImage

sys.stdout.reconfigure(encoding='utf-8')

CARD_DIR = os.path.abspath('static/card_templates')
MRZ_DIR = os.path.abspath('static/mrz_templates')
os.makedirs(CARD_DIR, exist_ok=True)
os.makedirs(MRZ_DIR, exist_ok=True)

CR80_WIDTH = 1200
CR80_HEIGHT = 756

def suppress_unwanted_layers(layer, is_front=True):
    name_l = layer.name.lower()
    if layer.kind == 'type':
        layer.visible = False
        return
    
    # Hide photos, signatures, barcodes, and dummy overlays
    unwanted = ['photo', 'picture', 'face', 'portrait', 'sig', 'sign', 'barcode', 'bar code', 
                'pdf417', 'code128', 'sample', 'deadpool', 'ghost', 'edit', 'data', 'qr', 'matrix']
    if any(k in name_l for k in unwanted):
        layer.visible = False
        return

    if layer.is_group():
        for sub in layer:
            suppress_unwanted_layers(sub, is_front)

def extract_clean_psd(psd_bytes, target_side='front', resize_to=(CR80_WIDTH, CR80_HEIGHT)):
    try:
        psd = PSDImage.open(io.BytesIO(psd_bytes))
        
        target_side_l = target_side.lower()
        other_side_l = 'back' if target_side_l == 'front' else 'front'

        # 1. Manage top-level layer visibility
        for l in psd:
            l_name = l.name.lower()
            if target_side_l in l_name:
                l.visible = True
            elif other_side_l in l_name:
                l.visible = False
            elif 'select background' in l_name:
                l.visible = True
            elif any(k in l_name for k in ['photo', 'barcode', 'sample', 'text', 'data']):
                l.visible = False

        # If there's a specific top group like 'DL' or 'Front'
        for l in psd:
            if l.is_group():
                if l.name.lower() == 'dl':
                    for sub in l:
                        s_name = sub.name.lower()
                        if target_side_l in s_name:
                            sub.visible = True
                        elif other_side_l in s_name or any(k in s_name for k in ['photo', 'signature', 'barcode', 'text']):
                            sub.visible = False
                        else:
                            suppress_unwanted_layers(sub, target_side_l == 'front')
                else:
                    suppress_unwanted_layers(l, target_side_l == 'front')

        comp = psd.composite()
        if comp:
            if comp.mode != 'RGB':
                comp = comp.convert('RGB')
            if resize_to:
                comp = comp.resize(resize_to, Image.Resampling.LANCZOS)
            return comp
    except Exception as e:
        print(f"Error extracting {target_side}: {e}")
    return None

def extract_from_archive(outer_zip, inner_rel, psd_regex):
    if not os.path.exists(outer_zip):
        return None
    try:
        with zipfile.ZipFile(outer_zip, 'r') as outer:
            if inner_rel:
                inner_bytes = outer.read(inner_rel)
                with zipfile.ZipFile(io.BytesIO(inner_bytes), 'r') as inner:
                    for n in inner.namelist():
                        if re.search(psd_regex, n, re.IGNORECASE):
                            return inner.read(n)
            else:
                for n in outer.namelist():
                    if re.search(psd_regex, n, re.IGNORECASE):
                        return outer.read(n)
    except Exception as e:
        print(f"Archive lookup error ({outer_zip}, {inner_rel}): {e}")
    return None

def run_extractions():
    tasks = [
        # 1. Missing Fronts
        ('california_front.webp', 'front', 'E:/PSD/California_Driver_License_NEW-l32u8n.zip', None, r'California_Driver_License_NEW\.psd'),
        ('florida_front.webp', 'front', 'E:/PSD/DL-FL-NEW-0i8hf5.zip', None, r'DL FL NEW\.psd'),
        ('alabama_front.webp', 'front', 'E:/PSD/Alabama-Driving-License-ahq5kk.zip', None, r'DL AL\(front and back\)\.psd'),
        ('arizona_front.webp', 'front', 'E:/PSD/Arizona-Driver-License-d9lnyg.zip', None, r'Arizonal Dl front & Back\.psd'),
        ('arkansas_front.webp', 'front', 'E:/PSD/Arkansas_Driver_License_NEW-1200-DPI-ol8iaz.zip', None, r'Arkansas_Driver_License_NEW 1200 DPI\.psd'),
        ('georgia_front.webp', 'front', 'E:/PSD/Georgia-Driver-License-V2-rqxlfo.zip', None, r'Georgia dl front & back\.psd'),
        ('idaho_front.webp', 'front', 'E:/PSD/Idaho-Driver-License-5oc4os.zip', None, r'DL ID\.psd'),
        ('manitoba_front.webp', 'front', 'E:/PSD/MANITOBA_DL-uph2nf.zip', None, r'MANOTOBA_FRONT\.psd'),
        ('saskatchewan_front.webp', 'front', 'E:/PSD/SASKATCHEWAN_DL-bf3qtw.zip', None, r'Sakatchewan DL Front\.psd'),
        ('ontario_front.webp', 'front', 'E:/PSD/NEW/ID - DL.zip', None, r'Canada - Ontario/1-1 Front\.psd'),
        ('quebec_front.webp', 'front', 'E:/PSD/NEW/ID - DL.zip', None, r'Canada - Quebec/Quebec Front\.psd'),

        # 2. Clean Canadian Backs (without sample text)
        ('ontario_back.webp', 'back', 'E:/PSD/NEW/ID - DL.zip', None, r'Canada - Ontario/1-2a Back for cards with magnetic stripe\.psd'),
        ('saskatchewan_back.webp', 'back', 'E:/PSD/SASKATCHEWAN_DL-bf3qtw.zip', None, r'Sakatchewan DL Back\.psd'),
        ('nova_scotia_back.webp', 'back', 'E:/PSD/Nova-Scotia-Driver-License-bbxpgz.zip', None, r'Nova Scotia\.psd'),
        ('quebec_back.webp', 'back', 'E:/PSD/NEW/ID - DL.zip', None, r'Canada - Quebec/quebec back\.psd'),
    ]

    for filename, side, outer, inner, pat in tasks:
        out_path = os.path.join(CARD_DIR, filename)
        print(f"Processing {filename} ({side})...")
        psd_bytes = extract_from_archive(outer, inner, pat)
        if not psd_bytes:
            print(f"  -> File not found in archive: {outer}")
            continue
        img = extract_clean_psd(psd_bytes, target_side=side)
        if img:
            img.save(out_path, format='WEBP', quality=95)
            print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")
        else:
            print(f"  -> Failed to composite {filename}")

    # 3. Authentic Specimen Artwork for MRZ Passport / Travel ID
    specimens = [
        ('us_passport_specimen.webp', 'E:/PSD/China Passport/USA Passport new.psd', (800, 1100)),
        ('de_id_specimen.webp', 'E:/PSD/NEW/ID - DL.zip', (856, 540), r'\+id_deu\.psd'),
    ]
    
    print("\nProcessing Specimen Artwork for MRZ...")
    for item in specimens:
        fname = item[0]
        out_path = os.path.join(MRZ_DIR, fname)
        if len(item) == 3: # Direct file
            src, sz = item[1], item[2]
            if os.path.exists(src):
                try:
                    psd = PSDImage.open(src)
                    for l in psd:
                        if any(k in l.name.lower() for k in ['photo', 'signature', 'edit your data']):
                            l.visible = False
                    comp = psd.composite()
                    if comp:
                        if comp.mode != 'RGB': comp = comp.convert('RGB')
                        comp = comp.resize(sz, Image.Resampling.LANCZOS)
                        comp.save(out_path, format='WEBP', quality=95)
                        print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")
                except Exception as e:
                    print(f"  -> Error processing {fname}: {e}")
        elif len(item) == 4: # Archive
            src_zip, sz, pat = item[1], item[2], item[3]
            psd_bytes = extract_from_archive(src_zip, None, pat)
            if psd_bytes:
                img = extract_clean_psd(psd_bytes, target_side='front', resize_to=sz)
                if img:
                    img.save(out_path, format='WEBP', quality=95)
                    print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    run_extractions()
