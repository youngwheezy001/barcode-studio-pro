"""
AAMVA Standards Engine & State Configuration Registry
Barcode Studio Pro - Certified AAMVA DL/ID Barcode and Scanner XML Engine

Complies with:
- AAMVA 2020 DL/ID Card Design Standard (Version 09 / Data Format 11)
- AAMVA 2016 DL/ID Card Design Standard (Version 08 / Data Format 16)
- Legacy AAMVA Specifications (Version 07, 05, 04)
"""

import re
from datetime import datetime
from typing import Dict, Any, Optional, Tuple

# Comprehensive 50-State + DC + Generic AAMVA Registry
STATE_AAMVA_PROFILES: Dict[str, Dict[str, Any]] = {
    "AL": {
        "issuer_name": "Alabama", "state_code": "AL", "iin": "636033",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 or 8 digits", "dl_regex": r"^[0-9]{7,8}$"
    },
    "AK": {
        "issuer_name": "Alaska", "state_code": "AK", "iin": "636038",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits", "dl_regex": r"^[0-9]{7}$"
    },
    "AZ": {
        "issuer_name": "Arizona", "state_code": "AZ", "iin": "636026",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "AR": {
        "issuer_name": "Arkansas", "state_code": "AR", "iin": "636028",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits (starts with 9)", "dl_regex": r"^[0-9]{9}$"
    },
    "CA": {
        "issuer_name": "California", "state_code": "CA", "iin": "636014",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": None, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 7 digits", "dl_regex": r"^[A-Z][0-9]{7}$"
    },
    "CO": {
        "issuer_name": "Colorado", "state_code": "CO", "iin": "636020",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits or 1 letter + 6 digits", "dl_regex": r"^([0-9]{9}|[A-Z][0-9]{6})$"
    },
    "CT": {
        "issuer_name": "Connecticut", "state_code": "CT", "iin": "636006",
        "aamva_version": "09", "data_format": "11", "jurver": "00",
        "v9_effective_year": 2020, "uses_offsets": True, "drop_empty_tags": True,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "DE": {
        "issuer_name": "Delaware", "state_code": "DE", "iin": "636011",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits (1-7 digits)", "dl_regex": r"^[0-9]{1,7}$"
    },
    "DC": {
        "issuer_name": "District of Columbia", "state_code": "DC", "iin": "636047",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits or 9 digits", "dl_regex": r"^([0-9]{7}|[0-9]{9})$"
    },
    "FL": {
        "issuer_name": "Florida", "state_code": "FL", "iin": "636010",
        "aamva_version": "09", "data_format": "11", "jurver": "00",
        "v9_effective_year": 2020, "uses_offsets": True, "drop_empty_tags": True,
        "dl_desc": "1 letter + 12 digits", "dl_regex": r"^[A-Z][0-9]{12}$"
    },
    "GA": {
        "issuer_name": "Georgia", "state_code": "GA", "iin": "636055",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "HI": {
        "issuer_name": "Hawaii", "state_code": "HI", "iin": "636048",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "ID": {
        "issuer_name": "Idaho", "state_code": "ID", "iin": "636041",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits or 2 letters + 6 digits + 1 letter", "dl_regex": r"^([0-9]{9}|[A-Z]{2}[0-9]{6}[A-Z])$"
    },
    "IL": {
        "issuer_name": "Illinois", "state_code": "IL", "iin": "636035",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 11 or 12 digits", "dl_regex": r"^[A-Z][0-9]{11,12}$"
    },
    "IN": {
        "issuer_name": "Indiana", "state_code": "IN", "iin": "636037",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 9 digits or 10 digits", "dl_regex": r"^([A-Z][0-9]{9}|[0-9]{10})$"
    },
    "IA": {
        "issuer_name": "Iowa", "state_code": "IA", "iin": "636019",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits or 3 digits + 2 letters + 4 digits", "dl_regex": r"^([0-9]{9}|[0-9]{3}[A-Z]{2}[0-9]{4})$"
    },
    "KS": {
        "issuer_name": "Kansas", "state_code": "KS", "iin": "636022",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "KY": {
        "issuer_name": "Kentucky", "state_code": "KY", "iin": "636040",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": None, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "LA": {
        "issuer_name": "Louisiana", "state_code": "LA", "iin": "636007",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits (starts with 00 or 01)", "dl_regex": r"^[0-9]{9}$"
    },
    "ME": {
        "issuer_name": "Maine", "state_code": "ME", "iin": "636042",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits or 8 digits", "dl_regex": r"^[0-9]{7,8}$"
    },
    "MD": {
        "issuer_name": "Maryland", "state_code": "MD", "iin": "636003",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 12 digits", "dl_regex": r"^[A-Z][0-9]{12}$"
    },
    "MA": {
        "issuer_name": "Massachusetts", "state_code": "MA", "iin": "636002",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits (starts with S) or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "MI": {
        "issuer_name": "Michigan", "state_code": "MI", "iin": "636034",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 12 digits", "dl_regex": r"^[A-Z][0-9]{12}$"
    },
    "MI_2024": {
        "issuer_name": "Michigan (2024)", "state_code": "MI", "iin": "636034",
        "aamva_version": "09", "data_format": "11", "jurver": "00",
        "v9_effective_year": 2024, "uses_offsets": True, "drop_empty_tags": True,
        "dl_desc": "1 letter + 12 digits", "dl_regex": r"^[A-Z][0-9]{12}$"
    },
    "MN": {
        "issuer_name": "Minnesota", "state_code": "MN", "iin": "636039",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 12 digits", "dl_regex": r"^[A-Z][0-9]{12}$"
    },
    "MS": {
        "issuer_name": "Mississippi", "state_code": "MS", "iin": "636050",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "MO": {
        "issuer_name": "Missouri", "state_code": "MO", "iin": "636030",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 9 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{9}|[0-9]{9})$"
    },
    "MT": {
        "issuer_name": "Montana", "state_code": "MT", "iin": "636008",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "NE": {
        "issuer_name": "Nebraska", "state_code": "NE", "iin": "636054",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits", "dl_regex": r"^[A-Z][0-9]{8}$"
    },
    "NV": {
        "issuer_name": "Nevada", "state_code": "NV", "iin": "636049",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "10 digits or 12 digits", "dl_regex": r"^([0-9]{10}|[0-9]{12})$"
    },
    "NH": {
        "issuer_name": "New Hampshire", "state_code": "NH", "iin": "636043",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "2 digits + 3 letters + 5 digits", "dl_regex": r"^[0-9]{2}[A-Z]{3}[0-9]{5}$"
    },
    "NJ": {
        "issuer_name": "New Jersey", "state_code": "NJ", "iin": "636036",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 14 digits", "dl_regex": r"^[A-Z][0-9]{14}$"
    },
    "NJ_2020": {
        "issuer_name": "New Jersey (2020)", "state_code": "NJ", "iin": "636036",
        "aamva_version": "04", "data_format": "12", "jurver": "02",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 14 digits", "dl_regex": r"^[A-Z][0-9]{14}$"
    },
    "NM": {
        "issuer_name": "New Mexico", "state_code": "NM", "iin": "636009",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "NY": {
        "issuer_name": "New York", "state_code": "NY", "iin": "636001",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "NC": {
        "issuer_name": "North Carolina", "state_code": "NC", "iin": "636004",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "8 to 12 digits", "dl_regex": r"^[0-9]{8,12}$"
    },
    "ND": {
        "issuer_name": "North Dakota", "state_code": "ND", "iin": "636032",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "3 letters + 6 digits or 9 digits", "dl_regex": r"^([A-Z]{3}[0-9]{6}|[0-9]{9})$"
    },
    "OH": {
        "issuer_name": "Ohio", "state_code": "OH", "iin": "636025",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "2 letters + 6 digits", "dl_regex": r"^[A-Z]{2}[0-9]{6}$"
    },
    "OK": {
        "issuer_name": "Oklahoma", "state_code": "OK", "iin": "636056",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 9 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{9}|[0-9]{9})$"
    },
    "OR": {
        "issuer_name": "Oregon", "state_code": "OR", "iin": "636029",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits", "dl_regex": r"^[0-9]{1,9}$"
    },
    "PA": {
        "issuer_name": "Pennsylvania", "state_code": "PA", "iin": "636024",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "8 digits", "dl_regex": r"^[0-9]{8}$"
    },
    "RI": {
        "issuer_name": "Rhode Island", "state_code": "RI", "iin": "636052",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits or 1 letter + 6 digits", "dl_regex": r"^([0-9]{7}|[A-Z][0-9]{6})$"
    },
    "SC": {
        "issuer_name": "South Carolina", "state_code": "SC", "iin": "636005",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits", "dl_regex": r"^[0-9]{9}$"
    },
    "SD": {
        "issuer_name": "South Dakota", "state_code": "SD", "iin": "636044",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "8 or 9 digits", "dl_regex": r"^[0-9]{8,9}$"
    },
    "TN": {
        "issuer_name": "Tennessee", "state_code": "TN", "iin": "636053",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "8 or 9 digits", "dl_regex": r"^[0-9]{8,9}$"
    },
    "TX": {
        "issuer_name": "Texas", "state_code": "TX", "iin": "636015",
        "aamva_version": "09", "data_format": "11", "jurver": "00",
        "v9_effective_year": 2020, "uses_offsets": True, "drop_empty_tags": True,
        "dl_desc": "8 digits", "dl_regex": r"^[0-9]{8}$"
    },
    "UT": {
        "issuer_name": "Utah", "state_code": "UT", "iin": "636045",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 digits (4 to 10 digits)", "dl_regex": r"^[0-9]{4,10}$"
    },
    "VT": {
        "issuer_name": "Vermont", "state_code": "VT", "iin": "636027",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "8 digits or 7 digits + 'A'", "dl_regex": r"^([0-9]{8}|[0-9]{7}[A-Z])$"
    },
    "VA": {
        "issuer_name": "Virginia", "state_code": "VA", "iin": "636021",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 8 digits or 9 digits", "dl_regex": r"^([A-Z][0-9]{8}|[0-9]{9})$"
    },
    "WA": {
        "issuer_name": "Washington", "state_code": "WA", "iin": "636046",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": None, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "12 alphanumeric characters (e.g. WDLYXY3PA0TB)", "dl_regex": r"^[A-Z0-9*]{12}$"
    },
    "WV": {
        "issuer_name": "West Virginia", "state_code": "WV", "iin": "636061",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "7 digits", "dl_regex": r"^[0-9]{7}$"
    },
    "WI": {
        "issuer_name": "Wisconsin", "state_code": "WI", "iin": "636031",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2021, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "1 letter + 13 digits", "dl_regex": r"^[A-Z][0-9]{13}$"
    },
    "WY": {
        "issuer_name": "Wyoming", "state_code": "WY", "iin": "636060",
        "aamva_version": "08", "data_format": "16", "jurver": "00",
        "v9_effective_year": 2022, "uses_offsets": False, "drop_empty_tags": False,
        "dl_desc": "9 or 10 digits", "dl_regex": r"^[0-9]{9,10}$"
    },
    "GENERIC": {
        "issuer_name": "Generic Standard", "state_code": "GENERIC", "iin": "636000",
        "aamva_version": "09", "data_format": "11", "jurver": "00",
        "v9_effective_year": 2020, "uses_offsets": True, "drop_empty_tags": True,
        "dl_desc": "Standard format", "dl_regex": r"^[A-Z0-9]{7,14}$"
    }
}

# State-specific identifier terminology & AAMVA standard rules:
# - DAQ (DLN): Mandatory in all jurisdictions.
# - DCF (DD): Mandatory in modern AAMVA (Audit Number in TX, Audit String in CA, DD in FL/NY/etc.).
# - DCK (ICN): Conditional/Optional. Standard in CT/WA/AZ/CO/NV/MO/TN; OMITTED in standard cards for TX/CA/FL/NY/etc.
STATE_IDENTIFIER_METADATA: Dict[str, Dict[str, Any]] = {
    "AB": {
        "label": "Alberta",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Alberta - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "0571-54946",
        "sample_audit": "",
        "sample_dl": "153574-564"
    },
    "AK": {
        "label": "Alaska",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "1000728920",
        "sample_dd": "8475992 460200826PNV-1",
        "sample_audit": "",
        "sample_dl": "7476172"
    },
    "AL": {
        "label": "Alabama (2014)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "00000000002953983401",
        "sample_dd": "NONE",
        "sample_audit": "",
        "sample_dl": "7253231"
    },
    "AL_2022": {
        "label": "Alabama (2022)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "50764683783372324201",
        "sample_dd": "NONE",
        "sample_audit": "",
        "sample_dl": "50764683"
    },
    "AR": {
        "label": "Arkansas",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0210119836604160",
        "sample_dd": "212232102 2160",
        "sample_audit": "",
        "sample_dl": "926203938"
    },
    "AZ": {
        "label": "Arizona (2014)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "16361AZ0068743540301",
        "sample_dd": "5641GS561D7977J0",
        "sample_audit": "",
        "sample_dl": "D28375514"
    },
    "AZ_2023": {
        "label": "Arizona (2023)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "48908420864",
        "sample_dd": "5641GS561D7977J0",
        "sample_audit": "",
        "sample_dl": "D28375514"
    },
    "BC": {
        "label": "British Columbia",
        "uses_icn": False,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in British Columbia - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": ""
    },
    "CA": {
        "label": "California (2017)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit String (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "21237D12345670401",
        "sample_dd": "08/25/202165508/AAFD/26",
        "sample_audit": "",
        "sample_dl": "D1234567"
    },
    "CA_2024": {
        "label": "California (2024)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit String (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "21237D12345670401",
        "sample_dd": "08/25/202165508/AAFD/26",
        "sample_audit": "",
        "sample_dl": "D1234567"
    },
    "CO": {
        "label": "Colorado (2015)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Colorado (2015) - Omitted)",
        "audit_label": "Colorado (2015) Audit Number",
        "sample_icn": "",
        "sample_dd": "5211068",
        "sample_audit": "CODL_0_082720_01876",
        "sample_dl": "316168738"
    },
    "CO_2015": {
        "label": "Colorado (2015)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Colorado (2015) - Omitted)",
        "audit_label": "Colorado (2015) Audit Number",
        "sample_icn": "",
        "sample_dd": "5211068",
        "sample_audit": "CODL_0_082720_01876",
        "sample_dl": "316168738"
    },
    "CO_2022": {
        "label": "Colorado (2022)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Colorado (2022) - Omitted)",
        "audit_label": "Colorado (2022) Audit Number",
        "sample_icn": "",
        "sample_dd": "5211068",
        "sample_audit": "CODL_0_082720_01876",
        "sample_dl": "316168738"
    },
    "CT": {
        "label": "Connecticut",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "137010702CT3ENV01",
        "sample_dd": "20082614021501MVS1",
        "sample_audit": "",
        "sample_dl": "137010702"
    },
    "DC": {
        "label": "Washington, District of Columbia",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Washington, District of Columbia - Omitted)",
        "audit_label": "Washington, District of Columbia Audit Number",
        "sample_icn": "",
        "sample_dd": "99423549",
        "sample_audit": "08312020_949312_4_672",
        "sample_dl": ""
    },
    "DE": {
        "label": "Delaware",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0110157073938301",
        "sample_dd": "L20200826649034C",
        "sample_audit": "",
        "sample_dl": "1653296"
    },
    "FL": {
        "label": "Florida",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0100385619573853",
        "sample_dd": "N322108265187",
        "sample_audit": "",
        "sample_dl": "H655435851100"
    },
    "GA": {
        "label": "Georgia (2015)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "2119423584100401",
        "sample_dd": "211942358410046350",
        "sample_audit": "",
        "sample_dl": "089007583"
    },
    "GA_2015": {
        "label": "Georgia (2015)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "2119423584100401",
        "sample_dd": "211942358410046350",
        "sample_audit": "",
        "sample_dl": "089007583"
    },
    "GA_2019": {
        "label": "Georgia (2019)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "10001308391",
        "sample_dd": "026568004260034885",
        "sample_audit": "",
        "sample_dl": "089007583"
    },
    "HI": {
        "label": "Hawaii",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "20200902_053001_2_690",
        "sample_dd": "20200826662548377772-ICWH",
        "sample_audit": "",
        "sample_dl": "H00716258"
    },
    "IA": {
        "label": "Iowa (2011)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "176ZB6504162400101",
        "sample_dd": "173604035DJ6050M150124R",
        "sample_audit": "",
        "sample_dl": "176ZB6504"
    },
    "IA_2011": {
        "label": "Iowa (2011)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "176ZB6504162400101",
        "sample_dd": "173604035DJ6050M150124R",
        "sample_audit": "",
        "sample_dl": "176ZB6504"
    },
    "IA_2017": {
        "label": "Iowa (2017)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "176ZB6504162400101",
        "sample_dd": "173604035DJ6050M150124D",
        "sample_audit": "",
        "sample_dl": "176ZB6504"
    },
    "ID": {
        "label": "Idaho (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0001700735",
        "sample_dd": "010170050042",
        "sample_audit": "",
        "sample_dl": "DX121380D"
    },
    "ID_2023": {
        "label": "Idaho (2023)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "MT942941H147175001",
        "sample_dd": "748649745263992",
        "sample_audit": "",
        "sample_dl": "DX121380D"
    },
    "IL": {
        "label": "Illinois",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Item # / Control # (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "D83877907578ILO9TL01",
        "sample_dd": "20210826494MG4931",
        "sample_audit": "",
        "sample_dl": "D83877907578"
    },
    "IN": {
        "label": "Indiana",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0370101906831627",
        "sample_dd": "08262081000337",
        "sample_audit": "",
        "sample_dl": "2739-94-6144"
    },
    "KS": {
        "label": "Kansas",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "20242K004526970101",
        "sample_dd": "72405466640DJ20240M2615AB",
        "sample_audit": "",
        "sample_dl": "K00-45-2697"
    },
    "KY": {
        "label": "Kentucy (2012)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0460017830322351",
        "sample_dd": "4372782319947690",
        "sample_audit": "",
        "sample_dl": "D82767580"
    },
    "KY_2012": {
        "label": "Kentucy (2012)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0460017830322351",
        "sample_dd": "4372782319947690",
        "sample_audit": "",
        "sample_dl": "D82767580"
    },
    "KY_2018": {
        "label": "Kentucy (2018)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0460107954698883",
        "sample_dd": "2022012288217092 01111",
        "sample_audit": "",
        "sample_dl": "D63091036"
    },
    "LA": {
        "label": "Louisiana",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Louisiana Audit Number",
        "sample_icn": "0070031972215065",
        "sample_dd": "4372782319947690",
        "sample_audit": "4174",
        "sample_dl": "007343439"
    },
    "MA": {
        "label": "Massachusetts",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "20239S945061490601",
        "sample_dd": "08262020 REV 02222016",
        "sample_audit": "",
        "sample_dl": "S94506149"
    },
    "MB": {
        "label": "Manitoba",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "519426452",
        "sample_dd": "823164527",
        "sample_audit": "",
        "sample_dl": "BA-NL-ES-L200NA"
    },
    "MD": {
        "label": "Maryland (2016 & 2019)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "1005403079",
        "sample_dd": "106143DH0",
        "sample_audit": "",
        "sample_dl": "D-000-429-000-042"
    },
    "MD_2021": {
        "label": "Maryland (2021)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "1010273942",
        "sample_dd": "329878356",
        "sample_audit": "",
        "sample_dl": "MD-10276307832"
    },
    "ME": {
        "label": "Maine",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "F2024392784510101",
        "sample_dd": "0000000000000000035222862",
        "sample_audit": "",
        "sample_dl": "9278451"
    },
    "MI": {
        "label": "Michigan (2011, 2021)",
        "uses_icn": True,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "D000429497042197001152024",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": "D 000 429 497 042"
    },
    "MI_2024": {
        "label": "Michigan (2024)",
        "uses_icn": True,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "D000429497042197001152024",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": "D 000 429 497 042"
    },
    "MN": {
        "label": "Minnesota",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "T4032232610330124301",
        "sample_dd": "00000006518117",
        "sample_audit": "",
        "sample_dl": "T403223261033"
    },
    "MO": {
        "label": "Missouri (2012)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "18239S1603164420101",
        "sample_dd": "181602380083",
        "sample_audit": "",
        "sample_dl": "S160316442"
    },
    "MO_2012": {
        "label": "Missouri (2012)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "18239S1603164420101",
        "sample_dd": "181602380083",
        "sample_audit": "",
        "sample_dl": "S160316442"
    },
    "MO_2020": {
        "label": "Missouri (2020)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "18239S1603164420101",
        "sample_dd": "201447280083",
        "sample_audit": "",
        "sample_dl": "M096115590"
    },
    "MS": {
        "label": "Mississippi (2016, 2021)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0510035326620190",
        "sample_dd": "7TMLJG3R10DJ20240M2415A",
        "sample_audit": "",
        "sample_dl": "809430018"
    },
    "MS_2023": {
        "label": "Mississippi (2023)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0510035326620190",
        "sample_dd": "7TMLJG3R10DJ20240M2415A",
        "sample_audit": "",
        "sample_dl": "809430018"
    },
    "MT": {
        "label": "Montana",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "110046MJU9PFMTLLC001",
        "sample_dd": "20200826869633619021",
        "sample_audit": "",
        "sample_dl": "0173719704151"
    },
    "NB": {
        "label": "New Brunswick",
        "uses_icn": False,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in New Brunswick - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": ""
    },
    "NC": {
        "label": "North Carolina",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "000007886015NCXR9S01",
        "sample_dd": "0015245648",
        "sample_audit": "",
        "sample_dl": "000007886015"
    },
    "ND": {
        "label": "North Dakota (2008)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0340018171565059",
        "sample_dd": "7DOE707980DJ78517vP48NDZ",
        "sample_audit": "",
        "sample_dl": "DOE707980"
    },
    "ND_2023": {
        "label": "North Dakota (2023)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0340018171565059",
        "sample_dd": "7DOE707980DJ78517vP48NDZ",
        "sample_audit": "",
        "sample_dl": "DOE707980"
    },
    "NE": {
        "label": "Nebraska (2017)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0540000357800000",
        "sample_dd": "0540000357800000",
        "sample_audit": "",
        "sample_dl": "V33627544"
    },
    "NE_2017": {
        "label": "Nebraska (2017)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0540000357800000",
        "sample_dd": "0540000357800000",
        "sample_audit": "",
        "sample_dl": "V33627544"
    },
    "NE_2021": {
        "label": "Nebraska (2021)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "B94907169NETYCO01",
        "sample_dd": "054B94907169NETYCO0165097",
        "sample_audit": "",
        "sample_dl": "B94907169"
    },
    "NH": {
        "label": "New Hampshire (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "08494818",
        "sample_dd": "08494818",
        "sample_audit": "",
        "sample_dl": "NHL10501102"
    },
    "NH_2024": {
        "label": "New Hampshire (2024)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "08494818",
        "sample_dd": "08494818",
        "sample_audit": "",
        "sample_dl": "NHL10501102"
    },
    "NJ": {
        "label": "New Jersey",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "DWCDQP3F98YNLD8M01",
        "sample_dd": "WV202023900007318",
        "sample_audit": "",
        "sample_dl": "D26229134787273"
    },
    "NJ_2020": {
        "label": "New Jersey",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "DWCDQP3F98YNLD8M01",
        "sample_dd": "WV202023900007318",
        "sample_audit": "",
        "sample_dl": "D26229134787273"
    },
    "NL": {
        "label": "Newfoundland and Labrador",
        "uses_icn": False,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Newfoundland and Labrador - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": ""
    },
    "NM": {
        "label": "New Mexico",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "03640809101",
        "sample_dd": "08231910000123",
        "sample_audit": "",
        "sample_dl": "036408091"
    },
    "NS": {
        "label": "Nova Scotia",
        "uses_icn": False,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Nova Scotia - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": ""
    },
    "NU": {
        "label": "Nunavut",
        "uses_icn": False,
        "uses_dd": False,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Nunavut - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": "",
        "sample_dl": ""
    },
    "NV": {
        "label": "Nevada (2008)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0015969352901",
        "sample_dd": "000144360705221148270",
        "sample_audit": "",
        "sample_dl": "1314295172"
    },
    "NV_2008": {
        "label": "Nevada (2008)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0015969352901",
        "sample_dd": "000144360705221148270",
        "sample_audit": "",
        "sample_dl": "1314295172"
    },
    "NV_2021": {
        "label": "Nevada (2021)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0015969352901",
        "sample_dd": "000144360705221148270",
        "sample_audit": "",
        "sample_dl": "1314295172"
    },
    "NY": {
        "label": "New York (2017)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Doc # / DD",
        "icn_label": "ICN (Not used in New York (2017) - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "C6JEH2RP06",
        "sample_audit": "",
        "sample_dl": "759547815"
    },
    "NY_2017": {
        "label": "New York (2017)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Doc # / DD",
        "icn_label": "ICN (Not used in New York (2017) - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "C6JEH2RP06",
        "sample_audit": "",
        "sample_dl": "759547815"
    },
    "NY_2022": {
        "label": "New York (2022)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Doc # / DD",
        "icn_label": "ICN (Not used in New York (2022) - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "C6JEH2RP06",
        "sample_audit": "",
        "sample_dl": "759547815"
    },
    "OH": {
        "label": "Ohio",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Item # / Audit # (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "L93259228",
        "sample_dd": "889287786",
        "sample_audit": "",
        "sample_dl": "KD298593"
    },
    "OK": {
        "label": "Oklahoma",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "S576189157OKYRSL01",
        "sample_dd": "S576189157011570082620R",
        "sample_audit": "",
        "sample_dl": "S576189157"
    },
    "ON": {
        "label": "Ontario",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "3724285",
        "sample_dd": "GC7295472",
        "sample_audit": "",
        "sample_dl": "P5718-37583-29384"
    },
    "OR": {
        "label": "Oregon",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "AA7088159",
        "sample_dd": "200117013",
        "sample_audit": "",
        "sample_dl": "8456732"
    },
    "PA": {
        "label": "Pennsylvania (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0250018505120106",
        "sample_dd": "2023967803632140000058560",
        "sample_audit": "",
        "sample_dl": "95744057"
    },
    "PA_2022": {
        "label": "Pennsylvania (2022)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0250018505120106",
        "sample_dd": "2023967803632140000058560",
        "sample_audit": "",
        "sample_dl": "95744057"
    },
    "PE": {
        "label": "Prince Edward Island",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Prince Edward Island - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "018094569",
        "sample_audit": "",
        "sample_dl": "123456"
    },
    "QC": {
        "label": "Quebec",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "3724285",
        "sample_dd": "PENX36RBU",
        "sample_audit": "",
        "sample_dl": "D5006-285648-00"
    },
    "RI": {
        "label": "Rhode Island (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "O3755008RIJTTL01",
        "sample_dd": "300283",
        "sample_audit": "",
        "sample_dl": "3755008"
    },
    "RI_2022": {
        "label": "Rhode Island (2022)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "O3755008RIJTTL01",
        "sample_dd": "4052356",
        "sample_audit": "",
        "sample_dl": "3755008"
    },
    "SC": {
        "label": "South Carolina",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit # / DD",
        "icn_label": "ICN (Not used in South Carolina - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "8513940203280844439",
        "sample_audit": "",
        "sample_dl": "107844741"
    },
    "SD": {
        "label": "South Dakota",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0420001234567890",
        "sample_dd": "01384574202008261234567",
        "sample_audit": "",
        "sample_dl": "01384574"
    },
    "SK": {
        "label": "Saskatchewan",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "F51537835",
        "sample_dd": "7496716472",
        "sample_audit": "",
        "sample_dl": "32257271"
    },
    "TN": {
        "label": "Tennessee",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "182381070085030101",
        "sample_dd": "4601808269812264",
        "sample_audit": "",
        "sample_dl": "145065024"
    },
    "TX": {
        "label": "Texas (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit Number",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "94116090  20180228",
        "sample_dd": "19193295907082813411",
        "sample_audit": "",
        "sample_dl": "24253231"
    },
    "TX_2016": {
        "label": "Texas (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit Number",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "94116090  20180228",
        "sample_dd": "19193295907082813411",
        "sample_audit": "",
        "sample_dl": "24253231"
    },
    "TX_2020": {
        "label": "Texas (2020)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Audit Number",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "10001846127",
        "sample_dd": "92334268049701405070",
        "sample_audit": "",
        "sample_dl": "24253231"
    },
    "UT": {
        "label": "Utah (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "182162827UTQ8CW01",
        "sample_dd": "32656373",
        "sample_audit": "",
        "sample_dl": "182162827"
    },
    "UT_2016": {
        "label": "Utah (2016)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "182162827UTQ8CW01",
        "sample_dd": "32656373",
        "sample_audit": "",
        "sample_dl": "182162827"
    },
    "UT_2021": {
        "label": "Utah (2021)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "182162827UTQ8CW01",
        "sample_dd": "32656373",
        "sample_audit": "",
        "sample_dl": "182162827"
    },
    "VA": {
        "label": "Virginia",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0060101096491223",
        "sample_dd": "099750996",
        "sample_audit": "",
        "sample_dl": "A37262186"
    },
    "VT": {
        "label": "Vermont",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Vermont - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "072022123412345678",
        "sample_audit": "",
        "sample_dl": "12345678"
    },
    "WA": {
        "label": "Washington (2019)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Washington (2019) - Omitted)",
        "audit_label": "Washington (2019) Audit Number",
        "sample_icn": "",
        "sample_dd": "WDL0257B93TBR082620981133",
        "sample_audit": "R082620981133",
        "sample_dl": "WDL0257B93TB"
    },
    "WA_2025": {
        "label": "Washington (2025)",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": True,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in Washington (2025) - Omitted)",
        "audit_label": "Washington (2025) Audit Number",
        "sample_icn": "",
        "sample_dd": "WDL5NHA2R3KBP082625148509",
        "sample_audit": "P082625148509",
        "sample_dl": "WDL5NHA2R3KB"
    },
    "WI": {
        "label": "Wisconsin (2015)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0130100816849209",
        "sample_dd": "OTDKF2020082610924996",
        "sample_audit": "",
        "sample_dl": "D000-4607-0015-00"
    },
    "WI_2023": {
        "label": "Wisconsin (2023)",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "0130100816849209",
        "sample_dd": "OTDKF2020082610924996",
        "sample_audit": "",
        "sample_dl": "D000-4607-0015-00"
    },
    "WV": {
        "label": "West Virginia",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "F123785WVFLOY01",
        "sample_dd": "011570DJ2601",
        "sample_audit": "",
        "sample_dl": "F123785"
    },
    "WY": {
        "label": "Wyoming",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "Inventory Control Number (ICN)",
        "audit_label": "Audit Information",
        "sample_icn": "1000038857",
        "sample_dd": "1000038857",
        "sample_audit": "",
        "sample_dl": "115919618"
    },
    "YT": {
        "label": "The Yukon",
        "uses_icn": False,
        "uses_dd": True,
        "uses_audit": False,
        "dd_label": "Document Discriminator (DD)",
        "icn_label": "ICN (Not used in The Yukon - Omitted)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "157359R0",
        "sample_audit": "",
        "sample_dl": "157379"
    },
}

for _st_code, _st_prof in STATE_AAMVA_PROFILES.items():
    _meta = STATE_IDENTIFIER_METADATA.get(_st_code) or STATE_IDENTIFIER_METADATA.get(_st_code.split('_')[0]) or {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": f"{_st_prof.get('issuer_name', _st_code)} Document Discriminator",
        "uses_icn": True,
        "uses_dd": True,
        "uses_audit": False,
        "icn_label": "ICN (Inventory Control Number)",
        "audit_label": "Audit Information",
        "sample_icn": "",
        "sample_dd": "",
        "sample_audit": ""
    }
    _st_prof["dd_label"] = _meta["dd_label"]
    _st_prof["dd_desc"] = _meta.get("dd_desc", f"{_st_prof.get('issuer_name', _st_code)} Document Discriminator")
    _st_prof["uses_icn"] = _meta["uses_icn"]
    _st_prof["uses_dd"] = _meta.get("uses_dd", True)
    _st_prof["uses_audit"] = _meta.get("uses_audit", False)
    _st_prof["icn_label"] = _meta["icn_label"]
    _st_prof["audit_label"] = _meta.get("audit_label", "Audit Information")
    _st_prof["sample_icn"] = _meta.get("sample_icn", "")
    _st_prof["sample_dd"] = _meta.get("sample_dd", "")
    _st_prof["sample_audit"] = _meta.get("sample_audit", "")


def resolve_state_identifiers(
    state_code: str,
    user_data: Dict[str, Any],
    profile: Dict[str, Any],
    dl_id: str
) -> Tuple[str, str, str]:
    clean_st = state_code.strip().upper()
    base_st = clean_st.split('_')[0]
    meta = STATE_IDENTIFIER_METADATA.get(clean_st) or STATE_IDENTIFIER_METADATA.get(base_st) or {}

    # 1. State-aware Document Discriminator (DD / DCF) resolution
    uses_dd = profile.get("uses_dd", meta.get("uses_dd", True))
    dcf_val = user_data.get("dcf") if user_data.get("dcf") is not None else user_data.get("document_discriminator")
    if dcf_val is not None and str(dcf_val).strip() and str(dcf_val).strip().upper() != "NONE":
        dcf = str(dcf_val).strip().upper()
    elif not uses_dd:
        dcf = ""  # Omitted per state specification (e.g. MI, MI_2024, Canadian provinces with no DD)
    else:
        sample_dd = meta.get("sample_dd", "")
        if clean_st == "TX":
            dcf = "2407261442200188"
        elif clean_st == "CA":
            dcf = "08/25/202165508/AAFD/26"
        elif clean_st == "FL":
            dcf = "24072614422001M1"
        elif clean_st in ("NJ", "NJ_2020"):
            dcf = "WV202023900007318"
        elif clean_st == "NM":
            dcf = "08231910000123"
        elif clean_st == "MA":
            dcf = "08262020 REV 02222016"
        elif clean_st == "SC":
            dcf = "8513940203280844439"
        elif clean_st == "SD":
            dcf = f"{dl_id}202008261234567" if dl_id and len(dl_id) == 8 else "01384574202008261234567"
        elif sample_dd:
            dcf = sample_dd
        else:
            dcf = "24072614422001MVI6"

    # 2. State-aware Inventory Control Number (ICN / DCK) resolution
    uses_icn = profile.get("uses_icn", meta.get("uses_icn", False))
    dck_val = user_data.get("dck") if user_data.get("dck") is not None else user_data.get("inventory_control_number")
    if dck_val is not None and str(dck_val).strip():
        dck = str(dck_val).strip().upper()
    elif not uses_icn:
        dck = ""  # Omitted per state specification (e.g. CO, NY, SC, VT, WA, DC)
    else:
        sample_icn = meta.get("sample_icn", "")
        if clean_st == "CT":
            dck = f"{dl_id}CTBRRL01" if dl_id else "188892143CTBRRL01"
        elif clean_st in ("NJ", "NJ_2020"):
            dck = "DWCDQP3F98YNLD8M01"
        elif clean_st == "NM":
            dck = f"{dl_id}01" if dl_id else "01234567801"
        elif clean_st == "MA":
            dck = f"20239{dl_id}0601" if dl_id else "20239S945061490601"
        elif clean_st in ("MI", "MI_2024"):
            clean_id = dl_id.replace(" ", "") if dl_id else "M123456789012"
            dck = f"{clean_id}198001152801"
        elif clean_st == "SD":
            dck = "0420001234567890"
        elif clean_st in ("TX", "TX_2020"):
            dck = "10001846127"
        elif clean_st == "TX_2016":
            dck = f"{dl_id}  20180228" if dl_id else "94116090  20180228"
        elif sample_icn:
            dck = sample_icn
        else:
            dck = f"{dl_id}01" if dl_id else "1001"

    # 3. State-aware Audit Information (Audit / DCJ) resolution
    uses_audit = profile.get("uses_audit", meta.get("uses_audit", False))
    audit_val = user_data.get("audit") if user_data.get("audit") is not None else user_data.get("audit_information")
    if audit_val is not None and str(audit_val).strip():
        audit = str(audit_val).strip().upper()
    elif not uses_audit:
        audit = ""
    else:
        sample_audit = meta.get("sample_audit", "")
        if clean_st in ("WA", "WA_2019"):
            audit = "R082620981133"
        elif clean_st == "WA_2025":
            audit = "P082625148509"
        elif clean_st in ("CO", "CO_2015", "CO_2022"):
            audit = "CODL_0_082720_01876"
        elif clean_st == "DC":
            audit = "08312020_949312_4_672"
        elif clean_st == "LA":
            audit = "4174"
        elif sample_audit:
            audit = sample_audit
        else:
            audit = "082620981133"

    return dcf, dck, audit


def parse_issue_year(date_str: Optional[str]) -> int:
    """
    Extracts the 4-digit issue year from various date string formats:
    - MMDDYYYY (e.g. '07262024' -> 2024)
    - YYYY-MM-DD (e.g. '2024-07-26' -> 2024)
    - YYYYMMDD (e.g. '20240726' -> 2024)
    """
    if not date_str:
        return datetime.now().year
    
    cleaned = re.sub(r"[^0-9]", "", str(date_str))
    if len(cleaned) == 8:
        # Check MMDDYYYY: month in first 2 digits
        first2 = int(cleaned[:2])
        last4 = int(cleaned[4:])
        first4 = int(cleaned[:4])
        if 1 <= first2 <= 12 and 1950 <= last4 <= 2099:
            return last4
        elif 1950 <= first4 <= 2099:
            return first4
    elif len(cleaned) >= 4:
        cand = int(cleaned[:4])
        if 1950 <= cand <= 2099:
            return cand
            
    return datetime.now().year


def resolve_state_profile(
    state_code: str,
    issue_date: Optional[str] = None,
    requested_version: str = "AUTO"
) -> Dict[str, Any]:
    """
    Resolves the exact AAMVA specification for a given state code and issue date.
    
    If requested_version == 'AUTO':
      - Historical cards (issued prior to state's v9_effective_year or legacy) route to v08/v07.
      - Recent cards (issued on/after v9_effective_year) route to v09 (Format 11).
      - Jurisdictions remaining on v08 (e.g., WA, KY, CA) route to v08 regardless of issue year.
    If requested_version is explicitly set ('09', '08', etc.):
      - Forces that specific version and its associated data format.
    """
    clean_code = state_code.strip().upper()
    base_code = clean_code.split('_')[0]
    base = (
        STATE_AAMVA_PROFILES.get(clean_code) or 
        STATE_AAMVA_PROFILES.get(base_code) or 
        STATE_AAMVA_PROFILES["GENERIC"]
    ).copy()
    
    # Ensure revision-specific identifier metadata overrides base profile
    meta = STATE_IDENTIFIER_METADATA.get(clean_code) or STATE_IDENTIFIER_METADATA.get(base_code)
    if meta:
        base["uses_icn"] = meta.get("uses_icn", base.get("uses_icn", False))
        base["uses_dd"] = meta.get("uses_dd", base.get("uses_dd", True))
        base["uses_audit"] = meta.get("uses_audit", base.get("uses_audit", False))
        base["dd_label"] = meta.get("dd_label", base.get("dd_label", "Document Discriminator (DD)"))
        base["icn_label"] = meta.get("icn_label", base.get("icn_label", "Inventory Control Number (ICN)"))
        base["audit_label"] = meta.get("audit_label", base.get("audit_label", "Audit Information"))
        base["sample_icn"] = meta.get("sample_icn", base.get("sample_icn", ""))
        base["sample_dd"] = meta.get("sample_dd", base.get("sample_dd", ""))
        base["sample_audit"] = meta.get("sample_audit", base.get("sample_audit", ""))
    
    format_map = {
        "09": "11",
        "08": "16",
        "07": "15",
        "05": "13",
        "04": "12",
        "02": "02",
        "01": "01",
    }
    
    req_upper = (requested_version or "AUTO").strip().upper()
    if req_upper != "AUTO":
        ver = req_upper.zfill(2)
        base["aamva_version"] = ver
        base["data_format"] = format_map.get(ver, "11" if ver == "09" else "16")
        base["uses_offsets"] = (ver == "09")
        base["drop_empty_tags"] = (ver == "09")
        base["resolved_by"] = "manual"
        return base
        
    # Automatic Date-Range & State Standard Resolution
    issue_year = parse_issue_year(issue_date)
    v9_year = base.get("v9_effective_year")
    
    if v9_year is not None and issue_year >= v9_year:
        base["aamva_version"] = "09"
        base["data_format"] = "11"
        base["uses_offsets"] = True
        base["drop_empty_tags"] = True
        base["resolved_by"] = "auto_v09"
    elif issue_year >= 2016:
        base["aamva_version"] = "08"
        base["data_format"] = "16"
        base["uses_offsets"] = False
        base["drop_empty_tags"] = False
        base["resolved_by"] = "auto_v08"
    elif issue_year >= 2013:
        base["aamva_version"] = "07"
        base["data_format"] = "15"
        base["uses_offsets"] = False
        base["drop_empty_tags"] = False
        base["resolved_by"] = "auto_v07"
    else:
        base["aamva_version"] = "05"
        base["data_format"] = "13"
        base["uses_offsets"] = False
        base["drop_empty_tags"] = False
        base["resolved_by"] = "auto_v05"
        
    return base


def calculate_aamva_v9_offsets(dl_payload: str, zc_payload: Optional[str] = None) -> Dict[str, int]:
    """
    Computes exact byte positions for AAMVA subfiles.
    
    Standard Math:
    - BASE_HEADER_LENGTH = 21 ('@\\n\\x1e\\rANSI ' [9] + IIN [6] + Version [2] + JurVer [2] + Entries [2] = 21)
    - SUBFILE_ENTRY_LENGTH = 10 (Designator [2] + Offset [4] + Length [4] = 10)
    For 2 entries (DL + ZC): Total header length is 21 + (2 * 10) = 41 bytes.
    DL offset starts exactly at byte 41.
    """
    num_entries = 2 if zc_payload else 1
    base_header_len = 21 + (num_entries * 10)
    
    dl_bytes = dl_payload.encode("utf-8")
    dl_len = len(dl_bytes)
    dl_offset = base_header_len
    
    zc_offset = 0
    zc_len = 0
    if zc_payload:
        zc_bytes = zc_payload.encode("utf-8")
        zc_len = len(zc_bytes)
        zc_offset = dl_offset + dl_len
        
    return {
        "header_length": base_header_len,
        "num_entries": num_entries,
        "dl_offset": dl_offset,
        "dl_length": dl_len,
        "zc_offset": zc_offset,
        "zc_length": zc_len,
    }


def generate_aamva_payload(
    state_code: str,
    user_data: Dict[str, Any],
    version: str = "AUTO"
) -> Tuple[str, Dict[str, Any]]:
    """
    Builds the certified raw AAMVA PDF417 barcode byte stream.
    Returns (raw_stream, resolved_profile).
    """
    issue_date = user_data.get("issued", "")
    profile = resolve_state_profile(state_code, issue_date, version)
    
    first = str(user_data.get("first") or user_data.get("customer_first_name") or "").strip().upper()
    mid = str(user_data.get("mid") or user_data.get("customer_middle_name") or "").strip().upper()
    last = str(user_data.get("last") or user_data.get("customer_family_name") or "").strip().upper()
    dob = str(user_data.get("dob") or user_data.get("date_of_birth") or "").strip()
    issued = str(user_data.get("issued") or user_data.get("issue_date") or "").strip()
    exp = str(user_data.get("exp") or user_data.get("expiration_date") or "").strip()
    dl_id = str(user_data.get("id") or user_data.get("customer_id_number") or "").strip().upper()
    
    # State-aware Document Discriminator, ICN, and Audit resolution
    dcf, dck, audit = resolve_state_identifiers(state_code, user_data, profile, dl_id)
    sex = str(user_data.get("sex", "1")).strip()
    height = str(user_data.get("height", "061 IN")).strip().upper()
    eyes = str(user_data.get("eyes", "BLK")).strip().upper()
    hair = str(user_data.get("hair", "")).strip().upper()
    weight = str(user_data.get("weight", "")).strip().upper()
    street = str(user_data.get("street", "")).strip().upper()
    city = str(user_data.get("city", "")).strip().upper()
    state = str(user_data.get("state", state_code)).strip().upper()
    zip_code = str(user_data.get("zip", "")).strip()
    v_class = str(user_data.get("class", "D")).strip().upper()
    restrictions = str(user_data.get("restrictions", "NONE")).strip().upper()
    endorsements = str(user_data.get("endorsements", "NONE")).strip().upper()
    donor = str(user_data.get("donor", "1")).strip()
    suffix = str(user_data.get("suffix", "")).strip().upper()
    
    include_zc = user_data.get("include_zc", True)
    zc_field_a = str(user_data.get("zc_field_a", "0002303378" if profile["aamva_version"] == "09" else "000000000")).strip()
    zc_field_b = str(user_data.get("zc_field_b", "000000000")).strip()

    # Build DL Subfile elements
    dl_elements = []
    if dl_id: dl_elements.append(f"DAQ{dl_id}")
    if last: dl_elements.append(f"DCS{last}")
    dl_elements.append(f"DDE{'T' if len(last) > 20 else 'N'}")
    if first: dl_elements.append(f"DAC{first}")
    dl_elements.append(f"DDF{'T' if len(first) > 20 else 'N'}")
    
    if profile["drop_empty_tags"]:
        if mid: dl_elements.append(f"DAD{mid}")
    else:
        dl_elements.append(f"DAD{mid}")
    dl_elements.append(f"DDG{'T' if len(mid) > 20 else 'N'}")
    
    if suffix and suffix != "NONE":
        dl_elements.append(f"DCU{suffix}")
        
    dl_elements.append(f"DCA{v_class or 'D'}")
    dl_elements.append(f"DCB{restrictions or 'NONE'}")
    dl_elements.append(f"DCD{endorsements or 'NONE'}")
    if issued: dl_elements.append(f"DBD{issued}")
    if dob: dl_elements.append(f"DBB{dob}")
    if exp: dl_elements.append(f"DBA{exp}")
    dl_elements.append(f"DBC{sex}")
    if height: dl_elements.append(f"DAU{height}")
    if eyes: dl_elements.append(f"DAY{eyes}")
    
    if profile["drop_empty_tags"]:
        if hair: dl_elements.append(f"DAZ{hair}")
        if weight: dl_elements.append(f"DAW{weight}")
    else:
        if hair: dl_elements.append(f"DAZ{hair}")
        if weight: dl_elements.append(f"DAW{weight}")
        
    if street: dl_elements.append(f"DAG{street}")
    if city: dl_elements.append(f"DAI{city}")
    if state: dl_elements.append(f"DAJ{state}")
    if zip_code: dl_elements.append(f"DAK{zip_code}")
    if dcf: dl_elements.append(f"DCF{dcf}")
    dl_elements.append("DCGUSA")
    if audit: dl_elements.append(f"DCJ{audit}")
    if dck: dl_elements.append(f"DCK{dck}")
    dl_elements.append("DDAF")
    dl_elements.append("DDB02102017")
    dl_elements.append(f"DDK{donor}")
    
    dl_subfile = "DL" + "\n".join(dl_elements) + "\r"
    
    zc_subfile = ""
    if include_zc:
        if profile["aamva_version"] == "09":
            zc_subfile = f"ZCA{zc_field_a}\r"
        else:
            zc_subfile = f"ZCA{zc_field_a}\nB{zc_field_b}\r"
            
    offsets = calculate_aamva_v9_offsets(dl_subfile, zc_subfile if include_zc else None)
    
    num_entries = offsets["num_entries"]
    dl_offset = offsets["dl_offset"]
    dl_len = offsets["dl_length"]
    
    directory = f"DL{dl_offset:04d}{dl_len:04d}"
    if include_zc:
        zc_offset = offsets["zc_offset"]
        zc_len = offsets["zc_length"]
        directory += f"ZC{zc_offset:04d}{zc_len:04d}"
        
    iin = profile["iin"]
    ver = profile["aamva_version"]
    jurver = profile["jurver"]
    header = f"@\n\x1e\rANSI {iin}{ver}{jurver}{num_entries:02d}{directory}"
    
    full_payload = header + dl_subfile + (zc_subfile if include_zc else "")
    return full_payload, profile


def generate_scanner_xml(
    state_code: str,
    user_data: Dict[str, Any],
    version: str = "AUTO"
) -> str:
    """
    Builds the certified <AAMVA> XML scanner representation.
    """
    issue_date = user_data.get("issued", "")
    profile = resolve_state_profile(state_code, issue_date, version)
    
    first = str(user_data.get("first") or user_data.get("customer_first_name") or "").strip()
    mid = str(user_data.get("mid") or user_data.get("customer_middle_name") or "").strip()
    last = str(user_data.get("last") or user_data.get("customer_family_name") or "").strip()
    dob = str(user_data.get("dob") or user_data.get("date_of_birth") or "").strip()
    issued = str(user_data.get("issued") or user_data.get("issue_date") or "").strip()
    exp = str(user_data.get("exp") or user_data.get("expiration_date") or "").strip()
    dl_id = str(user_data.get("id") or user_data.get("customer_id_number") or "").strip().upper()
    
    # State-aware Document Discriminator, ICN, and Audit resolution
    dcf, dck, audit = resolve_state_identifiers(state_code, user_data, profile, dl_id)
    sex = str(user_data.get("sex", "1")).strip()
    height = str(user_data.get("height", "061 IN")).strip().upper()
    eyes = str(user_data.get("eyes", "BLK")).strip().upper()
    hair = str(user_data.get("hair", "")).strip().upper()
    weight = str(user_data.get("weight", "")).strip().upper()
    street = str(user_data.get("street", "")).strip()
    city = str(user_data.get("city", "")).strip()
    state = str(user_data.get("state", state_code)).strip().upper()
    zip_code = str(user_data.get("zip", "")).strip()
    v_class = str(user_data.get("class", "D")).strip().upper()
    restrictions = str(user_data.get("restrictions", "NONE")).strip().upper()
    endorsements = str(user_data.get("endorsements", "NONE")).strip().upper()
    donor = str(user_data.get("donor", "1")).strip()
    suffix = str(user_data.get("suffix", "")).strip().upper()
    
    include_zc = user_data.get("include_zc", True)
    zc_field_a = str(user_data.get("zc_field_a", "0002303378" if profile["aamva_version"] == "09" else "000000000")).strip()
    zc_field_b = str(user_data.get("zc_field_b", "000000000")).strip()

    def fmt_iso(d: str) -> str:
        if len(d) == 8:
            return f"{d[4:8]}-{d[0:2]}-{d[2:4]}"
        return d

    sex_map = {"1": "M", "2": "F", "9": "X"}
    
    # Calculate feet/inches for <user>
    user_height = height
    m = re.search(r"(\d+)", height)
    if m:
        tot_in = int(m.group(1))
        user_height = f"{tot_in // 12}'{tot_in % 12}\""

    to_title = lambda s: s.title() if s else ""
    
    user_xml = (
        "  <user>\n"
        f"    <last e=\"DCS\">{to_title(last)}</last>\n"
        f"    <first e=\"DAC\">{to_title(first)}</first>\n"
    )
    if mid or not profile["drop_empty_tags"]:
        if mid:
            user_xml += f"    <middle e=\"DAD\">{to_title(mid)}</middle>\n"
            
    user_xml += (
        f"    <dob e=\"DBB\">{fmt_iso(dob)}</dob>\n"
        f"    <eyes e=\"DAY\">{eyes}</eyes>\n"
    )
    if hair or not profile["drop_empty_tags"]:
        if hair:
            user_xml += f"    <hair e=\"DAZ\">{hair}</hair>\n"
            
    user_xml += (
        f"    <sex e=\"DBC\">{sex_map.get(sex, 'M')}</sex>\n"
        f"    <height e=\"DAU\">{user_height}</height>\n"
    )
    if weight or not profile["drop_empty_tags"]:
        if weight:
            wt_num = re.search(r"(\d+)", weight)
            wt_str = f"{wt_num.group(1)} lb" if wt_num else weight
            user_xml += f"    <weight e=\"DAW\">{wt_str}</weight>\n"
            
    user_xml += (
        f"    <street e=\"DAG\">{to_title(street)}</street>\n"
        f"    <city e=\"DAI\">{to_title(city)}</city>\n"
        f"    <state e=\"DAJ\">{state}</state>\n"
        f"    <postal e=\"DAK\">{zip_code}</postal>\n"
        "    <country e=\"DCG\">USA</country>\n"
        f"    <id e=\"DAQ\">{dl_id}</id>\n"
        f"    <issued e=\"DBD\">{fmt_iso(issued)}</issued>\n"
        f"    <expires e=\"DBA\">{fmt_iso(exp)}</expires>\n"
        "  </user>\n"
    )
    
    num_entries = 2 if include_zc else 1
    head_xml = (
        "  <head>\n"
        "    <filetype name=\"File Type\">ANSI</filetype>\n"
        f"    <format name=\"Data Format\">{profile['data_format']}</format>\n"
        f"    <issuer name=\"Issuer Identification Number\">{profile['iin']}</issuer>\n"
        f"    <state name=\"Issuer Name\">{profile['issuer_name']}</state>\n"
        f"    <st name=\"Issuer Name Abbreviated\">{state}</st>\n"
        f"    <version name=\"AAMVA Version Number\">{profile['aamva_version']}</version>\n"
        f"    <jurver name=\"Jurisdiction Version Number\">{profile['jurver']}</jurver>\n"
        f"    <entries name=\"Number of Entries\">{num_entries:02d}</entries>\n"
        "  </head>\n"
    )
    
    # Compute subfile byte length for v09 attribute emission
    # Build DL Subfile elements
    dl_elements = []
    if dl_id: dl_elements.append(f"DAQ{dl_id}")
    if last: dl_elements.append(f"DCS{last.upper()}")
    dl_elements.append(f"DDE{'T' if len(last) > 20 else 'N'}")
    if first: dl_elements.append(f"DAC{first.upper()}")
    dl_elements.append(f"DDF{'T' if len(first) > 20 else 'N'}")
    if mid: dl_elements.append(f"DAD{mid.upper()}")
    dl_elements.append(f"DDG{'T' if len(mid) > 20 else 'N'}")
    if suffix and suffix != "NONE": dl_elements.append(f"DCU{suffix}")
    dl_elements.append(f"DCA{v_class or 'D'}")
    dl_elements.append(f"DCB{restrictions or 'NONE'}")
    dl_elements.append(f"DCD{endorsements or 'NONE'}")
    if issued: dl_elements.append(f"DBD{issued}")
    if dob: dl_elements.append(f"DBB{dob}")
    if exp: dl_elements.append(f"DBA{exp}")
    dl_elements.append(f"DBC{sex}")
    if height: dl_elements.append(f"DAU{height}")
    if eyes: dl_elements.append(f"DAY{eyes}")
    if hair: dl_elements.append(f"DAZ{hair}")
    if weight: dl_elements.append(f"DAW{weight}")
    if street: dl_elements.append(f"DAG{street.upper()}")
    if city: dl_elements.append(f"DAI{city.upper()}")
    if state: dl_elements.append(f"DAJ{state.upper()}")
    if zip_code: dl_elements.append(f"DAK{zip_code}")
    if dcf: dl_elements.append(f"DCF{dcf}")
    dl_elements.append("DCGUSA")
    if audit: dl_elements.append(f"DCJ{audit}")
    if dck: dl_elements.append(f"DCK{dck}")
    dl_elements.append("DDAF")
    dl_elements.append("DDB02102017")
    dl_elements.append(f"DDK{donor}")
    
    dl_subfile = "DL" + "\n".join(dl_elements) + "\r"
    zc_subfile = f"ZCA{zc_field_a}\r" if profile["aamva_version"] == "09" else f"ZCA{zc_field_a}\nB{zc_field_b}\r"
    
    offsets = calculate_aamva_v9_offsets(dl_subfile, zc_subfile if include_zc else None)
    
    if profile["uses_offsets"]:
        dl_subfile_tag = f"  <subfile designator=\"DL\" offset=\"{offsets['dl_offset']}\" length=\"{offsets['dl_length']}\">\n"
    else:
        dl_subfile_tag = "  <subfile designator=\"DL\">\n"
        
    dl_elements_xml = (
        f"    <element id=\"DAQ\" name=\"Customer ID Number\">{dl_id}</element>\n"
        f"    <element id=\"DCS\" name=\"Customer Family Name\">{last.upper()}</element>\n"
        "    <element id=\"DDE\" name=\"Family name truncation\">N</element>\n"
        f"    <element id=\"DAC\" name=\"Driver First Name\">{first.upper()}</element>\n"
        "    <element id=\"DDF\" name=\"First name truncation\">N</element>\n"
    )
    if mid or not profile["drop_empty_tags"]:
        if mid:
            dl_elements_xml += f"    <element id=\"DAD\" name=\"Driver Middle Name or Initial\">{mid.upper()}</element>\n"
    dl_elements_xml += "    <element id=\"DDG\" name=\"Middle name truncation\">N</element>\n"
    
    if suffix and suffix != "NONE":
        dl_elements_xml += f"    <element id=\"DCU\" name=\"Name Suffix\">{suffix}</element>\n"
        
    dl_elements_xml += (
        f"    <element id=\"DCA\" name=\"Jurisdiction-specific vehicle class\">{v_class}</element>\n"
        f"    <element id=\"DCB\" name=\"Jurisdiction-specific restriction codes\">{restrictions}</element>\n"
        f"    <element id=\"DCD\" name=\"Jurisdiction-specific endorsement codes\">{endorsements}</element>\n"
        f"    <element id=\"DBD\" name=\"Document Issue Date\">{issued}</element>\n"
        f"    <element id=\"DBB\" name=\"Date of Birth\">{dob}</element>\n"
        f"    <element id=\"DBA\" name=\"Document Expiration Date\">{exp}</element>\n"
        f"    <element id=\"DBC\" name=\"Physical Description - Sex\">{sex}</element>\n"
        f"    <element id=\"DAU\" name=\"Physical Description - Height\">{height}</element>\n"
        f"    <element id=\"DAY\" name=\"Physical Description - Eye Color\">{eyes}</element>\n"
    )
    if hair or not profile["drop_empty_tags"]:
        if hair:
            dl_elements_xml += f"    <element id=\"DAZ\" name=\"Physical Description - Hair Color\">{hair}</element>\n"
    if weight or not profile["drop_empty_tags"]:
        if weight:
            dl_elements_xml += f"    <element id=\"DAW\" name=\"Physical Description - Weight\">{weight}</element>\n"
            
    dl_elements_xml += (
        f"    <element id=\"DAG\" name=\"Address - Street 1\">{street.upper()}</element>\n"
        f"    <element id=\"DAI\" name=\"Address - City\">{city.upper()}</element>\n"
        f"    <element id=\"DAJ\" name=\"Address - Jurisdiction Code\">{state.upper()}</element>\n"
        + (f"    <element id=\"DCF\" name=\"{profile.get('dd_label', 'Document Discriminator')}\">{dcf}</element>\n" if dcf else "")
        + "    <element id=\"DCG\" name=\"Country Identification\">USA</element>\n"
        + (f"    <element id=\"DCJ\" name=\"{profile.get('audit_label', 'Audit Information')}\">{audit}</element>\n" if audit else "")
        + (f"    <element id=\"DCK\" name=\"{profile.get('icn_label', 'Inventory control number')}\">{dck}</element>\n" if dck else "") +
        "    <element id=\"DDA\" name=\"Compliance Type\">F</element>\n"
        "    <element id=\"DDB\" name=\"Card Revision Date\">02102017</element>\n"
        f"    <element id=\"DDK\" name=\"Organ Donor\">{donor}</element>\n"
        "  </subfile>\n"
    )
    
    zc_xml = ""
    if include_zc:
        if profile["uses_offsets"]:
            zc_xml = (
                f"  <subfile designator=\"ZC\" offset=\"{offsets['zc_offset']}\" length=\"{offsets['zc_length']}\">\n"
                f"    <element id=\"A\" name=\"Optional field A\">{zc_field_a}</element>\n"
                "  </subfile>\n"
            )
        else:
            zc_xml = (
                "  <subfile designator=\"ZC\">\n"
                f"    <element id=\"A\" name=\"Optional field A\">{zc_field_a}</element>\n"
                f"    <element id=\"B\" name=\"Optional field B\">{zc_field_b}</element>\n"
                "  </subfile>\n"
            )
            
    return f"<AAMVA>\n{user_xml}{head_xml}{dl_subfile_tag}{dl_elements_xml}{zc_xml}</AAMVA>"
