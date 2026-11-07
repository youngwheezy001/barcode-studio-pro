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
    "TX": {
        "dd_label": "Audit Number",
        "dd_desc": "16 to 20 digit numeric audit number printed vertically on card face or back",
        "uses_icn": True,
        "icn_label": "ICN (Inventory Control Number)"
    },
    "CA": {
        "dd_label": "Audit String",
        "dd_desc": "Formatted date & audit string (e.g. 08/25/202165508/AAFD/26) embedding stock data",
        "uses_icn": False,
        "icn_label": "ICN (Embedded inside DD - Omitted in standard CA barcode)"
    },
    "FL": {
        "dd_label": "Document Discriminator",
        "dd_desc": "16-character alphanumeric DD printed on card face",
        "uses_icn": False,
        "icn_label": "ICN (Not used in FL - Omitted per AAMVA Section D.2)"
    },
    "NY": {
        "dd_label": "Document Discriminator / Doc #",
        "dd_desc": "8 to 10 alphanumeric DD printed on front lower right",
        "uses_icn": False,
        "icn_label": "ICN (Not used in NY - Omitted per AAMVA Section D.2)"
    },
    "IL": {
        "dd_label": "Item # / Control #",
        "dd_desc": "Alphanumeric control number printed on card back",
        "uses_icn": False,
        "icn_label": "ICN (Not used in IL - Omitted)"
    },
    "OH": {
        "dd_label": "Item # / Audit #",
        "dd_desc": "Numeric audit identifier printed on card back",
        "uses_icn": False,
        "icn_label": "ICN (Not used in OH - Omitted)"
    },
    "PA": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "8-digit numeric DD printed on card face",
        "uses_icn": False,
        "icn_label": "ICN (Not used in PA - Omitted)"
    },
    "CT": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Control Number (ICN)"
    },
    "WA": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "19-character alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Number (ICN)"
    },
    "AZ": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Control Number (ICN)"
    },
    "CO": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Control Number (ICN)"
    },
    "NV": {
        "dd_label": "Doc # / DD",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Stock / Inventory # (ICN)"
    },
    "MO": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Control Number (ICN)"
    },
    "TN": {
        "dd_label": "Doc # / DD",
        "dd_desc": "Alphanumeric Document Discriminator",
        "uses_icn": True,
        "icn_label": "Inventory Control Number (ICN)"
    },
    "NJ": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "17-character alphanumeric DD (Option 1 + YYYY + DOY + 0000 + 4 digits)",
        "uses_icn": True,
        "icn_label": "ICN (Inventory Control Number)"
    },
    "NJ_2020": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "17-character alphanumeric DD (Option 1 + YYYY + DOY + 0000 + 4 digits)",
        "uses_icn": True,
        "icn_label": "ICN (Inventory Control Number)"
    },
    "NM": {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": "14-character DD (MMDDYY + Office Code + 00 + 3 digits)",
        "uses_icn": True,
        "icn_label": "ICN (Inventory Control Number)"
    },
    "AL": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "AR": {"dd_label": "Doc #", "dd_desc": "Document number on lower back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "KS": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "LA": {"dd_label": "Audit #", "dd_desc": "Audit number on reverse", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "MA": {"dd_label": "DD", "dd_desc": "Document Discriminator (e.g. 08262020 REV 02222016)", "uses_icn": True, "icn_label": "ICN (Inventory Control Number)"},
    "MI": {"dd_label": "DD", "dd_desc": "Document Discriminator (Omitted/Optional)", "uses_icn": True, "icn_label": "ICN (Inventory Control Number)"},
    "MI_2024": {"dd_label": "DD", "dd_desc": "Document Discriminator (Omitted/Optional)", "uses_icn": True, "icn_label": "ICN (Inventory Control Number)"},
    "MN": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "MS": {"dd_label": "Doc #", "dd_desc": "Doc number on card front", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "NC": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "NE": {"dd_label": "Doc #", "dd_desc": "Doc number on card front", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "OR": {"dd_label": "Doc #", "dd_desc": "Doc number on card front", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "SC": {"dd_label": "Audit # / DD", "dd_desc": "19-digit numeric Document Discriminator", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "SD": {"dd_label": "DD (Document Discriminator)", "dd_desc": "23-digit Document Discriminator (DL + YYYYMMDD + 7 digits)", "uses_icn": True, "icn_label": "ICN (Inventory Control Number)"},
    "VA": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "VT": {"dd_label": "Doc #", "dd_desc": "Doc number on card front", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
    "WI": {"dd_label": "Audit #", "dd_desc": "Audit number on card back", "uses_icn": False, "icn_label": "ICN (Optional / State Specific)"},
}

for _st_code, _st_prof in STATE_AAMVA_PROFILES.items():
    _meta = STATE_IDENTIFIER_METADATA.get(_st_code, {
        "dd_label": "DD (Document Discriminator)",
        "dd_desc": f"{_st_prof.get('issuer_name', _st_code)} Document Discriminator",
        "uses_icn": False,
        "icn_label": "ICN (Optional / State Specific)"
    })
    _st_prof["dd_label"] = _meta["dd_label"]
    _st_prof["dd_desc"] = _meta["dd_desc"]
    _st_prof["uses_icn"] = _meta["uses_icn"]
    _st_prof["icn_label"] = _meta["icn_label"]


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
    
    # State-aware Document Discriminator (DD / DCF) resolution
    dcf_val = user_data.get("dcf") if user_data.get("dcf") is not None else user_data.get("document_discriminator")
    if dcf_val is not None and str(dcf_val).strip():
        dcf = str(dcf_val).strip().upper()
    else:
        st_upper = state_code.upper()
        if st_upper == "TX":
            dcf = "2407261442200188"
        elif st_upper == "CA":
            dcf = "08/25/202165508/AAFD/26"
        elif st_upper == "FL":
            dcf = "24072614422001M1"
        elif st_upper in ("NJ", "NJ_2020"):
            dcf = "WV202023900007318"
        elif st_upper == "NM":
            dcf = "08231910000123"
        elif st_upper == "MA":
            dcf = "08262020 REV 02222016"
        elif st_upper == "SC":
            dcf = "8513940203280844439"
        elif st_upper == "SD":
            dcf = f"{dl_id}202008261234567" if dl_id and len(dl_id) == 8 else "01384574202008261234567"
        else:
            dcf = "24072614422001MVI6"

    # State-aware Inventory Control Number (ICN / DCK) resolution
    dck_val = user_data.get("dck") if user_data.get("dck") is not None else user_data.get("inventory_control_number")
    if dck_val is not None and str(dck_val).strip():
        dck = str(dck_val).strip().upper()
    else:
        st_upper = state_code.upper()
        if st_upper == "CT":
            dck = f"{dl_id}CTBRRL01" if dl_id else "188892143CTBRRL01"
        elif st_upper == "WA":
            dck = "210212003666014417006801"
        elif st_upper in ("NJ", "NJ_2020"):
            dck = "DWCDQP3F98YNLD8M01"
        elif st_upper == "NM":
            dck = f"{dl_id}01" if dl_id else "01234567801"
        elif st_upper == "MA":
            dck = f"20239{dl_id}0601" if dl_id else "20239S945061490601"
        elif st_upper in ("MI", "MI_2024"):
            clean_id = dl_id.replace(" ", "") if dl_id else "M123456789012"
            dck = f"{clean_id}198001152801"
        elif st_upper == "SD":
            dck = "0420001234567890"
        elif st_upper in ("TX", "TX_2020"):
            dck = "10001846127"
        elif st_upper == "TX_2016":
            dck = f"{dl_id}  20180228" if dl_id else "94116090  20180228"
        elif profile.get("uses_icn", False):
            dck = f"{dl_id}01" if dl_id else "1001"
        else:
            dck = ""  # Omitted completely per AAMVA Section D.2
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
    
    # State-aware Document Discriminator (DD / DCF) resolution
    dcf_val = user_data.get("dcf") if user_data.get("dcf") is not None else user_data.get("document_discriminator")
    if dcf_val is not None and str(dcf_val).strip():
        dcf = str(dcf_val).strip().upper()
    else:
        st_upper = state_code.upper()
        if st_upper == "TX":
            dcf = "2407261442200188"
        elif st_upper == "CA":
            dcf = "08/25/202165508/AAFD/26"
        elif st_upper == "FL":
            dcf = "24072614422001M1"
        elif st_upper in ("NJ", "NJ_2020"):
            dcf = "WV202023900007318"
        elif st_upper == "NM":
            dcf = "08231910000123"
        elif st_upper == "MA":
            dcf = "08262020 REV 02222016"
        elif st_upper == "SC":
            dcf = "8513940203280844439"
        elif st_upper == "SD":
            dcf = f"{dl_id}202008261234567" if dl_id and len(dl_id) == 8 else "01384574202008261234567"
        else:
            dcf = "24072614422001MVI6"

    # State-aware Inventory Control Number (ICN / DCK) resolution
    dck_val = user_data.get("dck") if user_data.get("dck") is not None else user_data.get("inventory_control_number")
    if dck_val is not None and str(dck_val).strip():
        dck = str(dck_val).strip().upper()
    else:
        st_upper = state_code.upper()
        if st_upper == "CT":
            dck = f"{dl_id}CTBRRL01" if dl_id else "188892143CTBRRL01"
        elif st_upper == "WA":
            dck = "210212003666014417006801"
        elif st_upper in ("NJ", "NJ_2020"):
            dck = "DWCDQP3F98YNLD8M01"
        elif st_upper == "NM":
            dck = f"{dl_id}01" if dl_id else "01234567801"
        elif st_upper == "MA":
            dck = f"20239{dl_id}0601" if dl_id else "20239S945061490601"
        elif st_upper in ("MI", "MI_2024"):
            clean_id = dl_id.replace(" ", "") if dl_id else "M123456789012"
            dck = f"{clean_id}198001152801"
        elif st_upper == "SD":
            dck = "0420001234567890"
        elif st_upper in ("TX", "TX_2020"):
            dck = "10001846127"
        elif st_upper == "TX_2016":
            dck = f"{dl_id}  20180228" if dl_id else "94116090  20180228"
        elif profile.get("uses_icn", False):
            dck = f"{dl_id}01" if dl_id else "1001"
        else:
            dck = ""  # Omitted completely per AAMVA Section D.2
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
        f"    <element id=\"DCF\" name=\"{profile.get('dd_label', 'Document Discriminator')}\">{dcf}</element>\n"
        "    <element id=\"DCG\" name=\"Country Identification\">USA</element>\n"
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
