import os
import sys
import io
import re
import json
import zipfile
from PIL import Image
from psd_tools import PSDImage

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.abspath('static/intl_templates')
os.makedirs(OUTPUT_DIR, exist_ok=True)

CR80_WIDTH = 1200
CR80_HEIGHT = 756  # ISO/IEC 7810 ID-1 standard aspect ratio

# International cards configuration
# country_code, name, flag, zip_file, back_psd_regex, front_psd_regex, doc_type, standard, issuer, security_features, optical_codes
INTL_CONFIG = [
    {
        "code": "UK",
        "name": "United Kingdom",
        "flag": "🇬🇧",
        "zip": "E:/PSD/UK-DL-4kj1hq.zip",
        "back_regex": r"UK DL BACK\.psd",
        "front_regex": r"UK DL FRONT\.psd",
        "doc_type": "Driving Licence (Photocard)",
        "standard": "UK Road Traffic Act 1988 • ISO/IEC 7810 ID-1",
        "issuer": "Driver and Vehicle Licensing Agency (DVLA)",
        "security_features": ["Optically Variable Ink (OVI)", "Tactile Laser Engraving", "Guilloche Pattern", "UV Fluorescent Crown"],
        "optical_codes": ["1D Code 128 (Driver Number)", "2D DataMatrix (Secure Optical Record)"]
    },
    {
        "code": "AU",
        "name": "Australia",
        "flag": "🇦🇺",
        "zip": "E:/PSD/Australia-Dl-2qkc0i.zip",
        "back_regex": r"Australia dl front & back\.psd",
        "front_regex": r"Australia dl front & back\.psd",
        "doc_type": "Driver Licence (National Standard)",
        "standard": "Austroads National ID-1 Standard",
        "issuer": "State Department of Transport / Roads & Maritime Services",
        "security_features": ["Dynamic Holographic Overlay", "Microtext Security Border", "Ghost Portrait", "Polycarbonate Substrate"],
        "optical_codes": ["2D PDF417 (Austroads Subfile)", "1D Code 39 (Card Number)"]
    },
    {
        "code": "NZ",
        "name": "New Zealand",
        "flag": "🇳🇿",
        "zip": "E:/PSD/NEW-ZEALAND-DRIVER-LEARNER-AND-LICENCE-PSD-TEMPLATE-pgvzne.zip",
        "back_regex": r"NZFULLBACK\.psd",
        "front_regex": r"nzfrontpsd\.psd",
        "doc_type": "Driver Licence / Rawa Raihana",
        "standard": "NZ Land Transport Act • ISO/IEC 7810 ID-1",
        "issuer": "Waka Kotahi NZ Transport Agency",
        "security_features": ["Silver Fern Kinegram", "Laser Perforated Ghost Image", "UV Rainbow Fluorescence", "Microprinting"],
        "optical_codes": ["1D Code 128 (Licence Number)", "2D QR / DataMatrix"]
    },
    {
        "code": "DE",
        "name": "Germany",
        "flag": "🇩🇪",
        "zip": "E:/PSD/Germany-Driver-License-mfubqg.zip",
        "back_regex": r"germany dl front & back\.psd",
        "front_regex": r"germany dl front & back\.psd",
        "doc_type": "Führerschein (EU-Kartenführerschein)",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Kraftfahrt-Bundesamt (KBA) / Fahrerlaubnisbehörde",
        "security_features": ["IDENTIGRAM Holographic Element", "Optically Variable Surface Relief", "Tactile Laser Engraved Typography", "Guilloche Fine-line Background"],
        "optical_codes": ["2D DataMatrix (KBA Registry Optical Tag)", "Machine Readable Optical Zone"]
    },
    {
        "code": "FR",
        "name": "France",
        "flag": "🇫🇷",
        "zip": "E:/PSD/France-Driver-License-rzhs3t.zip",
        "back_regex": r"France dl front & back\.psd",
        "front_regex": r"France dl front & back\.psd",
        "doc_type": "Permis de Conduire (Format Carte Bancaire)",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Agence Nationale des Titres Sécurisés (ANTS) / Ministère de l'Intérieur",
        "security_features": ["Marianne Hologram", "Tactile Laser Engraved Relief", "Micro-Textes 'RÉPUBLIQUE FRANÇAISE'", "Dual-Band UV 365nm Fluorescent Guilloche"],
        "optical_codes": ["2D 2D-Doc (CEV Barcode)", "1D Code 128 (Numéro de Dossier)"]
    },
    {
        "code": "ES",
        "name": "Spain",
        "flag": "🇪🇸",
        "zip": "E:/PSD/spain-dl-qf91sq.zip",
        "back_regex": r"SPAIN DL fr\.psd",
        "front_regex": r"SPAIN DL fr\.psd",
        "doc_type": "Permiso de Conducción",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Dirección General de Tráfico (DGT)",
        "security_features": ["Holographic Optical Variable Strip", "Laser Perforated Ghost Photo (CLI)", "Tactile Laser Date & DNI", "Ultraviolet Reactive Coat of Arms"],
        "optical_codes": ["2D PDF417 / DataMatrix", "1D Code 128 (Expediente DGT)"]
    },
    {
        "code": "IT",
        "name": "Italy",
        "flag": "🇮🇹",
        "zip": "E:/PSD/IT_DL-clcghf.zip",
        "back_regex": r"IT\.psd",
        "front_regex": r"IT\.psd",
        "doc_type": "Patente di Guida Europea",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Ministero delle Infrastrutture e dei Trasporti • Motorizzazione Civile",
        "security_features": ["Poligraphico e Zecca dello Stato DOVID Hologram", "Laser Engraved Tactile Characters", "UV 365nm Optical Fluorescence", "Security Rosette Microprint"],
        "optical_codes": ["2D DataMatrix (Archivio Nazionale Veicoli)", "1D Code 128 (Numero Patente)"]
    },
    {
        "code": "IE",
        "name": "Ireland",
        "flag": "🇮🇪",
        "zip": "E:/PSD/IRL_DL-xmetpm.zip",
        "back_regex": r"IRDL BACK\.psd",
        "front_regex": r"IRDL FRONT\.psd",
        "doc_type": "Irish Driver Licence / Ceadúnas Tiomána",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "National Driver Licence Service (NDLS) / RSA",
        "security_features": ["Shamrock Hologram Foil", "Tactile Laser Engraved Driver Number", "UV Harp Fluorescent Seal", "Guilloche Anti-Copy Screen"],
        "optical_codes": ["1D Code 128 (NDLS Reference)", "2D QR / DataMatrix Verification"]
    },
    {
        "code": "NL",
        "name": "Netherlands",
        "flag": "🇳🇱",
        "zip": "E:/PSD/NLD_DL-gvxy9d.zip",
        "back_regex": r"NL_DLB\.psd",
        "front_regex": r"NL_DL\.psd",
        "doc_type": "Nederlands Rijbewijs",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Dienst Wegverkeer (RDW)",
        "security_features": ["Clear View Window", "Multiple Laser Image (MLI / CLI)", "Kinegram Optical Variable Device", "High Resolution Microtext 'KONINKRIJK DER NEDERLANDEN'"],
        "optical_codes": ["2D DataMatrix (RDW National Register)", "1D Code 128"]
    },
    {
        "code": "PL",
        "name": "Poland",
        "flag": "🇵🇱",
        "zip": "E:/PSD/Poland-Driver-License-gda7lu.zip",
        "back_regex": r"POLAND_DL_BACK\.psd",
        "front_regex": r"POLAND_DL_FRONT\.psd",
        "doc_type": "Prawo Jazdy",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Ministerstwo Cyfryzacji / Starostwo Powiatowe",
        "security_features": ["Polska Wytwórnia Papierów Wartościowych Hologram", "Tactile Laser Numbering", "Eagle Coat of Arms UV Fluorescence", "Microprint 'RZECZPOSPOLITA POLSKA'"],
        "optical_codes": ["2D 2D-Barcode", "1D Code 128 (PESEL / Dokument)"]
    },
    {
        "code": "BE",
        "name": "Belgium",
        "flag": "🇧🇪",
        "zip": "E:/PSD/BELGIUM-DRIVER-LICENSE-m0yxdf.zip",
        "back_regex": r"DRIVER BELGIUM BACK\.psd",
        "front_regex": r"DRIVER BELGIUM\.psd",
        "doc_type": "Rijbewijs / Permis de Conduire / Führerschein",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "FOD Mobiliteit en Vervoer / SPF Mobilité et Transports",
        "security_features": ["Trilingual Security Header", "Diffractive Optically Variable Device", "Laser Engraved Photo Ghost", "UV 365nm Belgian Lion Seal"],
        "optical_codes": ["2D DataMatrix", "1D Code 128"]
    },
    {
        "code": "CZ",
        "name": "Czech Republic",
        "flag": "🇨🇿",
        "zip": "E:/PSD/Czech-Republic-Driver-License-ubgjff.zip",
        "back_regex": r"Czech Driver's License.*\.psd",
        "front_regex": r"Czech Driver's License.*\.psd",
        "doc_type": "Řidičský Průkaz",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Ministerstvo Dopravy České Republiky",
        "security_features": ["Holographic Strip with Czech Lion Motif", "Tactile Laser Engraved Typography", "Guilloche Background Pattern", "UV Dual-Tone Coat of Arms"],
        "optical_codes": ["2D PDF417 / DataMatrix", "1D Code 128"]
    },
    {
        "code": "RO",
        "name": "Romania",
        "flag": "🇷🇴",
        "zip": "E:/PSD/Romanian-DL-idwmsi.zip",
        "back_regex": r"Romania_DLback\.psd",
        "front_regex": r"Romania_DLfront\.psd",
        "doc_type": "Permis de Conducere",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Directia Regim Permise de Conducere si Inmatriculare a Vehiculelor (DRPCIV)",
        "security_features": ["DRPCIV Diffractive Optical Strip", "Laser Perforated Identity Matrix", "Fluorescent Inks under UV Light", "Fine-Line Guilloche Borders"],
        "optical_codes": ["1D Code 128 (Serie Permis)", "2D DataMatrix"]
    },
    {
        "code": "UA",
        "name": "Ukraine",
        "flag": "🇺🇦",
        "zip": "E:/PSD/Ukraine-Driver-License-jpygho.zip",
        "back_regex": r"Ukraine dl front & back\.psd",
        "front_regex": r"Ukraine dl front & back\.psd",
        "doc_type": "Посвідчення Водія (Driver's License)",
        "standard": "Vienna Convention on Road Traffic 1968 • ISO/IEC 7810 ID-1",
        "issuer": "Головний Сервісний Центр МВС України (MIA Service Center)",
        "security_features": ["Tryzub Coat of Arms Holographic Element", "Tactile Laser Personal Details", "UV Multicolored Security Fibers", "Microtext 'УКРАЇНА'"],
        "optical_codes": ["2D QR Code (Дія Diia Verification Token)", "1D Code 128"]
    },
    {
        "code": "BR",
        "name": "Brazil",
        "flag": "🇧🇷",
        "zip": "E:/PSD/Brasil-ID-x5oneu.zip",
        "back_regex": r"ID Brasilia X\.psd",
        "front_regex": r"ID Brasilia X\.psd",
        "doc_type": "Carteira de Identidade Nacional (CIN / RG)",
        "standard": "Decreto nº 10.977/2022 • ISO/IEC 7810 ID-1",
        "issuer": "Secretaria de Segurança Pública / Instituto de Identificação",
        "security_features": ["Hologram da República Federativa do Brasil", "Impressão de Segurança em Talho Doce (Intaglio)", "Tinta Óptica Variável (OVI)", "Padrões Antixérox em Microletras"],
        "optical_codes": ["2D QR Code (Padrão ICAO / Gov.br)", "Código MRZ TD1"]
    },
    {
        "code": "MX",
        "name": "Mexico",
        "flag": "🇲🇽",
        "zip": "E:/PSD/Mexico-ID-idsjop.zip",
        "back_regex": r"ID of Mexico\.psd",
        "front_regex": r"ID of Mexico\.psd",
        "doc_type": "Credencial para Votar / Identificación Oficial",
        "standard": "Instituto Nacional Electoral (INE) • ISO/IEC 7810 ID-1",
        "issuer": "Instituto Nacional Electoral (INE)",
        "security_features": ["Tinta OVI Cambiante de Color", "Elemento Ópticamente Variable (Kinegram)", "Microtexto CURP y Clave de Elector", "Fotografía Fantasma con Datos Variables"],
        "optical_codes": ["Código QR Bidimensional de Alta Densidad", "Código de Barras PDF417"]
    },
    {
        "code": "SE",
        "name": "Sweden",
        "flag": "🇸🇪",
        "zip": "E:/PSD/SWE_DL-nptqtb.zip",
        "back_regex": r"SWEDENDL_BACK\.psd",
        "front_regex": r"SWEDENDL_FRONT\.psd",
        "doc_type": "Körkort (Swedish Driving Licence)",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Transportstyrelsen (Swedish Transport Agency)",
        "security_features": ["Three Crowns Holographic Diffractive Overlay", "CLI (Changeable Laser Image) Window", "Laser Tactile Engraving", "UV 365nm Fluorescent Patterns"],
        "optical_codes": ["1D Code 128 (Referensnummer)", "2D DataMatrix Optical Check"]
    },
    {
        "code": "AT",
        "name": "Austria",
        "flag": "🇦🇹",
        "zip": "E:/PSD/AUSTRIA-DL-mogjdo.zip",
        "back_regex": r"Austria_DL_back\.psd",
        "front_regex": r"Austria_DL_Front\.psd",
        "doc_type": "Führerschein (Austrian Driving Licence)",
        "standard": "EU Directive 2006/126/EC • ISO/IEC 7810 ID-1",
        "issuer": "Bundesministerium für Inneres • Österreichische Staatsdruckerei",
        "security_features": ["OESD Kinegram Patch", "Laser Engraved Tactile Characters", "UV Dual-Color Bundesadler Seal", "Microprint 'REPUBLIK ÖSTERREICH'"],
        "optical_codes": ["2D DataMatrix (Österreichischer Zentraler Führerscheinregister)", "1D Code 128"]
    },
    {
        "code": "SG",
        "name": "Singapore",
        "flag": "🇸🇬",
        "zip": "E:/PSD/SINGAPORE_DL-4rk86c.zip",
        "back_regex": r"Singapore_DL\.psd",
        "front_regex": r"Singapore_DL\.psd",
        "doc_type": "Singapore Driving Licence",
        "standard": "Road Traffic Act • ISO/IEC 7810 ID-1",
        "issuer": "Singapore Police Force • Traffic Police Department",
        "security_features": ["Merlion Diffractive Holographic Foil", "Laser Tactile NRIC/FIN", "UV Security Guilloche Lines", "Anti-Scan Fine Screen Matrix"],
        "optical_codes": ["2D Barcode (SPF Verification)", "1D Code 39 (Licence Serial Number)"]
    },
    {
        "code": "MY",
        "name": "Malaysia",
        "flag": "🇲🇾",
        "zip": "E:/PSD/MALAYSIA-DL-dt5c1k.zip",
        "back_regex": r"BACK DL MALAY\.psd",
        "front_regex": r"Front malaysia DL\.psd",
        "doc_type": "Lesen Memandu Malaysia (High Security Photocard)",
        "standard": "Road Transport Act 1987 • ISO/IEC 7810 ID-1",
        "issuer": "Jabatan Pengangkutan Jalan (JPJ)",
        "security_features": ["JPJ Jata Negara Hologram", "Laser Tactile MyKad IC Number", "UV 365nm Security Guilloche", "Microlettering 'JABATAN PENGANGKUTAN JALAN'"],
        "optical_codes": ["2D QR Code (JPJ Portal Verification)", "1D Code 128"]
    }
]

def extract_psd(zip_path, regex_pattern):
    if not os.path.exists(zip_path):
        return None
    try:
        with zipfile.ZipFile(zip_path, 'r') as z:
            for n in z.namelist():
                if re.search(regex_pattern, n, re.IGNORECASE):
                    return z.read(n)
    except Exception as e:
        print(f"Error reading {zip_path}: {e}")
    return None

def process_and_save(data, out_path):
    try:
        psd = PSDImage.open(io.BytesIO(data))
        comp = psd.composite()
        if comp.mode != 'RGB':
            comp = comp.convert('RGB')
        res = comp.resize((CR80_WIDTH, CR80_HEIGHT), Image.Resampling.LANCZOS)
        res.save(out_path, 'WEBP', quality=85)
        print(f"  -> Saved: {os.path.basename(out_path)} ({res.size})")
        return True
    except Exception as e:
        print(f"  -> Error processing {out_path}: {e}")
        return False

def main():
    print(f"Starting International Card Extraction for {len(INTL_CONFIG)} Countries...")
    processed_catalog = []
    
    for item in INTL_CONFIG:
        code = item["code"].lower()
        print(f"Processing {item['name']} ({item['code']})...")
        
        back_out = os.path.join(OUTPUT_DIR, f"{code}_back.webp")
        front_out = os.path.join(OUTPUT_DIR, f"{code}_front.webp")
        
        back_data = extract_psd(item["zip"], item["back_regex"])
        front_data = extract_psd(item["zip"], item["front_regex"])
        
        back_ok = False
        front_ok = False
        
        if back_data:
            back_ok = process_and_save(back_data, back_out)
        if front_data:
            front_ok = process_and_save(front_data, front_out)
            
        # Fallback if only single file had front/back or if one missing
        if back_ok and not front_ok:
            # Duplicate back as front preview
            img = Image.open(back_out)
            img.save(front_out, 'WEBP', quality=85)
            front_ok = True
        elif front_ok and not back_ok:
            img = Image.open(front_out)
            img.save(back_out, 'WEBP', quality=85)
            back_ok = True
            
        catalog_entry = {
            "code": item["code"],
            "name": item["name"],
            "flag": item["flag"],
            "doc_type": item["doc_type"],
            "standard": item["standard"],
            "issuer": item["issuer"],
            "security_features": item["security_features"],
            "optical_codes": item["optical_codes"],
            "back_image": f"intl_templates/{code}_back.webp" if back_ok else None,
            "front_image": f"intl_templates/{code}_front.webp" if front_ok else None,
            "available": bool(back_ok and front_ok)
        }
        processed_catalog.append(catalog_entry)
        
    catalog_path = os.path.abspath('static/intl_cards_data.json')
    with open(catalog_path, 'w', encoding='utf-8') as f:
        json.dump(processed_catalog, f, indent=2, ensure_ascii=False)
        
    print(f"\nFinished! Extracted {len(processed_catalog)} country profiles.")
    print(f"Wrote catalogue to {catalog_path}")

if __name__ == '__main__':
    main()
