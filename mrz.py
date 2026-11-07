"""
ICAO Document 9303 Machine Readable Zone (MRZ) Engine
Supports:
- TD3: Official Passports (2 lines x 44 characters)
- TD1: Identification Cards & Driver Licenses (3 lines x 30 characters)
- TD2: Travel Documents & Resident Permits (2 lines x 36 characters)
- MRV-A: Visa Type A (2 lines x 44 characters)
- MRV-B: Visa Type B (2 lines x 36 characters)
"""

import re
from datetime import datetime
from typing import Dict, Any, Tuple, Optional

WEIGHTS = [7, 3, 1]

# Comprehensive ISO 3166-1 alpha-3 mapping for ICAO travel documents
ISO_3166_COUNTRIES = {
    "USA": "United States", "CAN": "Canada", "GBR": "United Kingdom", "AUS": "Australia",
    "DEU": "Germany", "FRA": "France", "ITA": "Italy", "ESP": "Spain", "MEX": "Mexico",
    "JPN": "Japan", "KOR": "South Korea", "CHN": "China", "IND": "India", "BRA": "Brazil",
    "ARG": "Argentina", "COL": "Colombia", "CHL": "Chile", "PER": "Peru", "ZAF": "South Africa",
    "EGY": "Egypt", "NGA": "Nigeria", "KEN": "Kenya", "GHA": "Ghana", "MAR": "Morocco",
    "RUS": "Russia", "UKR": "Ukraine", "POL": "Poland", "NLD": "Netherlands", "BEL": "Belgium",
    "CHE": "Switzerland", "AUT": "Austria", "SWE": "Sweden", "NOR": "Norway", "DNK": "Denmark",
    "FIN": "Finland", "IRL": "Ireland", "PRT": "Portugal", "GRC": "Greece", "TUR": "Turkey",
    "ISR": "Israel", "ARE": "United Arab Emirates", "SAU": "Saudi Arabia", "QAT": "Qatar",
    "SGP": "Singapore", "MYS": "Malaysia", "THA": "Thailand", "IDN": "Indonesia", "PHL": "Philippines",
    "VNM": "Vietnam", "NZL": "New Zealand", "UTO": "Utopia (Test)"
}

TRANSLITERATIONS = {
    "Ä": "AE", "Ö": "OE", "Ü": "UE", "ß": "SS",
    "À": "A", "Á": "A", "Â": "A", "Ã": "A", "Å": "AA",
    "È": "E", "É": "E", "Ê": "E", "Ë": "E",
    "Ì": "I", "Í": "I", "Î": "I", "Ï": "I",
    "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ø": "OE",
    "Ù": "U", "Ú": "U", "Û": "U",
    "Ñ": "N", "Ç": "C", "Ý": "Y"
}

def get_char_value(char: str) -> int:
    """ICAO 9303 Character to integer weighting."""
    if char == "<":
        return 0
    if "0" <= char <= "9":
        return ord(char) - ord("0")
    if "A" <= char <= "Z":
        return ord(char) - ord("A") + 10
    return 0

def compute_check_digit(data: str) -> str:
    """Computes ICAO 9303 modulo-10 weighted checksum with repeat sequence 7, 3, 1."""
    total = sum(get_char_value(c) * WEIGHTS[i % 3] for i, c in enumerate(data))
    return str(total % 10)

def sanitize_mrz_text(text: str) -> str:
    """Transliterates diacritics and converts non-alphanumeric chars to standard MRZ filler '<'."""
    if not text:
        return ""
    text = text.upper()
    for orig, repl in TRANSLITERATIONS.items():
        text = text.replace(orig, repl)
    # Replace any character other than A-Z, 0-9, and < with <
    return re.sub(r"[^A-Z0-9<]", "<", text)

def pad_mrz(text: str, length: int) -> str:
    """Sanitizes and right-pads with '<' or truncates to exact length."""
    sanitized = sanitize_mrz_text(text)
    if len(sanitized) > length:
        return sanitized[:length]
    return sanitized.ljust(length, "<")

def format_date_yymmdd(dt_str: str) -> str:
    """Normalizes various date formats (DD.MM.YYYY, YYYY-MM-DD, DDMMYYYY, YYYYMMDD, YYMMDD) to 6-digit YYMMDD."""
    if not dt_str:
        return "000101"
    dt_str = str(dt_str).strip()
    m = re.match(r"^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$", dt_str)
    if m:
        day, month, year = m.groups()
        return f"{year[-2:]:0>2}{int(month):02d}{int(day):02d}"
    m = re.match(r"^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$", dt_str)
    if m:
        year, month, day = m.groups()
        return f"{year[-2:]:0>2}{int(month):02d}{int(day):02d}"
    digits = re.sub(r"\D", "", dt_str)
    if len(digits) == 8:
        if 1900 <= int(digits[:4]) <= 2100:
            return digits[2:8]
        if 1900 <= int(digits[4:]) <= 2100:
            return digits[6:8] + digits[2:4] + digits[0:2]
        return digits[2:8]
    if len(digits) == 6:
        return digits
    return digits[:6].ljust(6, "0")

def format_name_field(surname: str, given_names: str, total_len: int) -> str:
    """Formats Surname<<Given<Names<<<<... according to ICAO 9303."""
    sur = re.sub(r"\s+", "<", sanitize_mrz_text(surname).replace("<", " ").strip()).replace(" ", "<")
    giv = re.sub(r"\s+", "<", sanitize_mrz_text(given_names).replace("<", " ").strip()).replace(" ", "<")
    
    if sur and giv:
        combined = f"{sur}<<{giv}"
    elif sur:
        combined = sur
    elif giv:
        combined = giv
    else:
        combined = ""
        
    return pad_mrz(combined, total_len)

# --- GENERATORS ---

def generate_td3(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    ICAO 9303 TD3 Machine Readable Passport (2 lines x 44 chars)
    Line 1: P<[ISSUER_3][SURNAME]<<[GIVEN_NAMES]...
    Line 2: [DOC_9][CHK][NAT_3][DOB_6][CHK][SEX][EXP_6][CHK][OPT_14][CHK][COMPOSITE_CHK]
    """
    raw_sub = params.get("document_subtype") or params.get("document_type_code") or params.get("DOCUMENTTYPE") or "P"
    doc_type = pad_mrz(raw_sub, 2)
    issuer = pad_mrz(params.get("country") or params.get("COUNTRY") or "USA", 3)
    surname = params.get("surname") or params.get("SURNAME") or ""
    given_names = params.get("given_names") or params.get("GIVENNAMES") or ""
    name_field = format_name_field(surname, given_names, 39)
    line1 = f"{doc_type}{issuer}{name_field}"[:44]

    raw_doc_num = params.get("document_number") or params.get("NUMBER") or "L898902C3"
    doc_num = pad_mrz(raw_doc_num, 9)
    doc_num_chk = compute_check_digit(doc_num)
    
    nationality = pad_mrz(params.get("nationality") or params.get("NATIONALITY") or issuer, 3)
    dob = format_date_yymmdd(params.get("birth_date") or params.get("DOB") or "740812")
    dob_chk = compute_check_digit(dob)
    
    sex_val = (params.get("sex") or params.get("SEX") or "M").upper()
    sex = sex_val[0] if sex_val in ["M", "F"] else "<"
    
    expiry = format_date_yymmdd(params.get("expiry_date") or params.get("DOE") or "281231")
    expiry_chk = compute_check_digit(expiry)
    
    opt_data = pad_mrz(params.get("optional1") or params.get("OPTIONALDATA1") or params.get("optional_data") or "", 14)
    opt_chk = compute_check_digit(opt_data)
    
    composite_string = f"{doc_num}{doc_num_chk}{dob}{dob_chk}{expiry}{expiry_chk}{opt_data}{opt_chk}"
    composite_chk = compute_check_digit(composite_string)
    
    line2 = f"{doc_num}{doc_num_chk}{nationality}{dob}{dob_chk}{sex}{expiry}{expiry_chk}{opt_data}{opt_chk}{composite_chk}"[:44]
    
    return {
        "format": "TD3",
        "title": "Passport (TD3)",
        "lines": [line1, line2],
        "mrz_text": f"{line1}\n{line2}",
        "metadata": {
            "line1_length": len(line1),
            "line2_length": len(line2),
            "document_number": doc_num.replace("<", ""),
            "doc_num_check": doc_num_chk,
            "dob": dob,
            "dob_check": dob_chk,
            "expiry": expiry,
            "expiry_check": expiry_chk,
            "composite_check": composite_chk,
            "issuer": issuer.replace("<", ""),
            "nationality": nationality.replace("<", "")
        }
    }

def generate_td1(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    ICAO 9303 TD1 Identification Card (3 lines x 30 chars)
    Line 1: I<[ISSUER_3][DOC_9][CHK][OPT1_15]
    Line 2: [DOB_6][CHK][SEX][EXP_6][CHK][NAT_3][OPT2_11][COMPOSITE_CHK]
    Line 3: [SURNAME]<<[GIVEN_NAMES]...
    """
    doc_type = pad_mrz(params.get("document_subtype") or params.get("document_type_code") or params.get("DOCUMENTTYPE") or "ID", 2)
    issuer = pad_mrz(params.get("country") or params.get("COUNTRY") or "USA", 3)
    raw_doc_num = params.get("document_number") or params.get("NUMBER") or "D12345678"
    doc_num = pad_mrz(raw_doc_num, 9)
    doc_num_chk = compute_check_digit(doc_num)
    opt1 = pad_mrz(params.get("optional1") or params.get("OPTIONALDATA1") or params.get("optional_data") or "", 15)
    line1 = f"{doc_type}{issuer}{doc_num}{doc_num_chk}{opt1}"[:30]

    dob = format_date_yymmdd(params.get("birth_date") or params.get("DOB") or "850520")
    dob_chk = compute_check_digit(dob)
    sex_val = (params.get("sex") or params.get("SEX") or "M").upper()
    sex = sex_val[0] if sex_val in ["M", "F"] else "<"
    expiry = format_date_yymmdd(params.get("expiry_date") or params.get("DOE") or "300520")
    expiry_chk = compute_check_digit(expiry)
    nationality = pad_mrz(params.get("nationality") or params.get("NATIONALITY") or issuer, 3)
    opt2 = pad_mrz(params.get("optional2") or params.get("OPTIONALDATA2") or "", 11)
    
    # Composite string for TD1: Line 1 chars 6-30 (doc_num + chk + opt1) + Line 2 chars 1-7 (dob+chk) + chars 9-15 (exp+chk) + chars 19-29 (opt2)
    composite_string = f"{doc_num}{doc_num_chk}{opt1}{dob}{dob_chk}{expiry}{expiry_chk}{opt2}"
    composite_chk = compute_check_digit(composite_string)
    line2 = f"{dob}{dob_chk}{sex}{expiry}{expiry_chk}{nationality}{opt2}{composite_chk}"[:30]

    surname = params.get("surname") or params.get("SURNAME") or ""
    given_names = params.get("given_names") or params.get("GIVENNAMES") or ""
    line3 = format_name_field(surname, given_names, 30)[:30]

    return {
        "format": "TD1",
        "title": "ID Card / Driver License (TD1)",
        "lines": [line1, line2, line3],
        "mrz_text": f"{line1}\n{line2}\n{line3}",
        "metadata": {
            "document_number": doc_num.replace("<", ""),
            "doc_num_check": doc_num_chk,
            "dob": dob,
            "dob_check": dob_chk,
            "expiry": expiry,
            "expiry_check": expiry_chk,
            "composite_check": composite_chk,
            "issuer": issuer.replace("<", ""),
            "nationality": nationality.replace("<", "")
        }
    }

def generate_td2(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    ICAO 9303 TD2 Travel Document (2 lines x 36 chars)
    Line 1: I<[ISSUER_3][SURNAME]<<[GIVEN_NAMES]...
    Line 2: [DOC_9][CHK][NAT_3][DOB_6][CHK][SEX][EXP_6][CHK][OPT_7][COMPOSITE_CHK]
    """
    doc_type = pad_mrz(params.get("document_subtype") or params.get("document_type_code") or params.get("DOCUMENTTYPE") or "ID", 2)
    issuer = pad_mrz(params.get("country") or params.get("COUNTRY") or "USA", 3)
    surname = params.get("surname") or params.get("SURNAME") or ""
    given_names = params.get("given_names") or params.get("GIVENNAMES") or ""
    name_field = format_name_field(surname, given_names, 31)
    line1 = f"{doc_type}{issuer}{name_field}"[:36]

    raw_doc_num = params.get("document_number") or params.get("NUMBER") or "T98765432"
    doc_num = pad_mrz(raw_doc_num, 9)
    doc_num_chk = compute_check_digit(doc_num)
    nationality = pad_mrz(params.get("nationality") or params.get("NATIONALITY") or issuer, 3)
    dob = format_date_yymmdd(params.get("birth_date") or params.get("DOB") or "900101")
    dob_chk = compute_check_digit(dob)
    sex_val = (params.get("sex") or params.get("SEX") or "M").upper()
    sex = sex_val[0] if sex_val in ["M", "F"] else "<"
    expiry = format_date_yymmdd(params.get("expiry_date") or params.get("DOE") or "300101")
    expiry_chk = compute_check_digit(expiry)
    opt = pad_mrz(params.get("optional1") or params.get("OPTIONALDATA1") or params.get("optional_data") or "", 7)

    composite_string = f"{doc_num}{doc_num_chk}{dob}{dob_chk}{expiry}{expiry_chk}{opt}"
    composite_chk = compute_check_digit(composite_string)
    line2 = f"{doc_num}{doc_num_chk}{nationality}{dob}{dob_chk}{sex}{expiry}{expiry_chk}{opt}{composite_chk}"[:36]

    return {
        "format": "TD2",
        "title": "Resident Card / Travel Doc (TD2)",
        "lines": [line1, line2],
        "mrz_text": f"{line1}\n{line2}",
        "metadata": {
            "document_number": doc_num.replace("<", ""),
            "doc_num_check": doc_num_chk,
            "dob": dob,
            "dob_check": dob_chk,
            "expiry": expiry,
            "expiry_check": expiry_chk,
            "composite_check": composite_chk,
            "issuer": issuer.replace("<", ""),
            "nationality": nationality.replace("<", "")
        }
    }

def generate_mrv_a(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    ICAO 9303 Visa Type A (2 lines x 44 chars)
    Line 1: V<[ISSUER_3][SURNAME]<<[GIVEN_NAMES]...
    Line 2: [DOC_9][CHK][NAT_3][DOB_6][CHK][SEX][EXP_6][CHK][OPT_16] (No composite check)
    """
    raw_sub = params.get("document_subtype") or params.get("document_type_code") or params.get("DOCUMENTTYPE") or "V"
    doc_type = pad_mrz(raw_sub, 2)
    issuer = pad_mrz(params.get("country") or params.get("COUNTRY") or "USA", 3)
    surname = params.get("surname") or params.get("SURNAME") or ""
    given_names = params.get("given_names") or params.get("GIVENNAMES") or ""
    name_field = format_name_field(surname, given_names, 39)
    line1 = f"{doc_type}{issuer}{name_field}"[:44]

    raw_doc_num = params.get("document_number") or params.get("NUMBER") or "V12345678"
    doc_num = pad_mrz(raw_doc_num, 9)
    doc_num_chk = compute_check_digit(doc_num)
    nationality = pad_mrz(params.get("nationality") or params.get("NATIONALITY") or issuer, 3)
    dob = format_date_yymmdd(params.get("birth_date") or params.get("DOB") or "800820")
    dob_chk = compute_check_digit(dob)
    sex_val = (params.get("sex") or params.get("SEX") or "M").upper()
    sex = sex_val[0] if sex_val in ["M", "F"] else "<"
    expiry = format_date_yymmdd(params.get("expiry_date") or params.get("DOE") or "260820")
    expiry_chk = compute_check_digit(expiry)
    opt = pad_mrz(params.get("optional1") or params.get("OPTIONALDATA1") or params.get("optional_data") or "", 16)
    line2 = f"{doc_num}{doc_num_chk}{nationality}{dob}{dob_chk}{sex}{expiry}{expiry_chk}{opt}"[:44]

    return {
        "format": "MRVA",
        "title": "Visa (Format A - 44ch)",
        "lines": [line1, line2],
        "mrz_text": f"{line1}\n{line2}",
        "metadata": {
            "document_number": doc_num.replace("<", ""),
            "doc_num_check": doc_num_chk,
            "dob": dob,
            "dob_check": dob_chk,
            "expiry": expiry,
            "expiry_check": expiry_chk,
            "composite_check": "N/A",
            "issuer": issuer.replace("<", ""),
            "nationality": nationality.replace("<", "")
        }
    }

def generate_mrv_b(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    ICAO 9303 Visa Type B (2 lines x 36 chars)
    Line 1: V<[ISSUER_3][SURNAME]<<[GIVEN_NAMES]...
    Line 2: [DOC_9][CHK][NAT_3][DOB_6][CHK][SEX][EXP_6][CHK][OPT_8] (No composite check)
    """
    raw_sub = params.get("document_subtype") or params.get("document_type_code") or params.get("DOCUMENTTYPE") or "V"
    doc_type = pad_mrz(raw_sub, 2)
    issuer = pad_mrz(params.get("country") or params.get("COUNTRY") or "USA", 3)
    surname = params.get("surname") or params.get("SURNAME") or ""
    given_names = params.get("given_names") or params.get("GIVENNAMES") or ""
    name_field = format_name_field(surname, given_names, 31)
    line1 = f"{doc_type}{issuer}{name_field}"[:36]

    raw_doc_num = params.get("document_number") or params.get("NUMBER") or "V98765432"
    doc_num = pad_mrz(raw_doc_num, 9)
    doc_num_chk = compute_check_digit(doc_num)
    nationality = pad_mrz(params.get("nationality") or params.get("NATIONALITY") or issuer, 3)
    dob = format_date_yymmdd(params.get("birth_date") or params.get("DOB") or "951103")
    dob_chk = compute_check_digit(dob)
    sex_val = (params.get("sex") or params.get("SEX") or "M").upper()
    sex = sex_val[0] if sex_val in ["M", "F"] else "<"
    expiry = format_date_yymmdd(params.get("expiry_date") or params.get("DOE") or "271103")
    expiry_chk = compute_check_digit(expiry)
    opt = pad_mrz(params.get("optional1") or params.get("OPTIONALDATA1") or params.get("optional_data") or "", 8)
    line2 = f"{doc_num}{doc_num_chk}{nationality}{dob}{dob_chk}{sex}{expiry}{expiry_chk}{opt}"[:36]

    return {
        "format": "MRVB",
        "title": "Visa (Format B - 36ch)",
        "lines": [line1, line2],
        "mrz_text": f"{line1}\n{line2}",
        "metadata": {
            "document_number": doc_num.replace("<", ""),
            "doc_num_check": doc_num_chk,
            "dob": dob,
            "dob_check": dob_chk,
            "expiry": expiry,
            "expiry_check": expiry_chk,
            "composite_check": "N/A",
            "issuer": issuer.replace("<", ""),
            "nationality": nationality.replace("<", "")
        }
    }

def generate_mrz(doc_type: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Master generation router based on standard format."""
    dt = (doc_type or params.get("MRZ_TYPE") or params.get("document_type") or "TD3").upper().strip()
    if dt in ["TD1", "ID"]:
        return generate_td1(params)
    elif dt in ["TD2"]:
        return generate_td2(params)
    elif dt in ["MRVA", "MRV-A", "MRV_A"]:
        return generate_mrv_a(params)
    elif dt in ["MRVB", "MRV-B", "MRV_B"]:
        return generate_mrv_b(params)
    else:  # Default to TD3 Passport
        return generate_td3(params)

# --- PARSER & CHECK DIGIT VERIFIER ---

def parse_mrz(raw_text: str) -> Dict[str, Any]:
    """
    Parses any raw MRZ string (TD1, TD2, TD3, MRVA, MRVB),
    extracts demographic fields, calculates check digits, and verifies checksum integrity.
    """
    cleaned_lines = [line.strip().upper() for line in raw_text.splitlines() if line.strip()]
    
    if not cleaned_lines:
        raise ValueError("Empty MRZ input")

    num_lines = len(cleaned_lines)
    line_len = len(cleaned_lines[0])

    # Format detection
    if num_lines == 2 and line_len == 44:
        return _parse_td3(cleaned_lines)
    elif num_lines == 3 and line_len == 30:
        return _parse_td1(cleaned_lines)
    elif num_lines == 2 and line_len == 36:
        return _parse_td2(cleaned_lines)
    else:
        # Fallback tolerance: pad or truncate lines
        if num_lines == 2 and (40 <= line_len <= 48):
            fixed_lines = [pad_mrz(cleaned_lines[0], 44), pad_mrz(cleaned_lines[1], 44)]
            return _parse_td3(fixed_lines)
        elif num_lines == 3 and (28 <= line_len <= 34):
            fixed_lines = [pad_mrz(l, 30) for l in cleaned_lines[:3]]
            return _parse_td1(fixed_lines)
        else:
            raise ValueError(f"Unrecognized MRZ layout: {num_lines} lines of length {line_len}. Expected 2x44 (TD3), 3x30 (TD1), or 2x36 (TD2).")

def _clean_name(segment: str) -> Tuple[str, str]:
    parts = segment.split("<<")
    surname = parts[0].replace("<", " ").strip() if len(parts) > 0 else ""
    given = parts[1].replace("<", " ").strip() if len(parts) > 1 else ""
    return surname, given

def _format_readable_date(yymmdd: str, is_dob: bool = False) -> Tuple[str, str]:
    if not re.match(r"^\d{6}$", yymmdd):
        return yymmdd, "Unknown"
    yy = int(yymmdd[0:2])
    mm = yymmdd[2:4]
    dd = yymmdd[4:6]
    current_yy = datetime.utcnow().year % 100
    
    if is_dob:
        century = "19" if yy > current_yy else "20"
        full_year = int(f"{century}{yy:02d}")
        age = datetime.utcnow().year - full_year
        return f"{century}{yy:02d}-{mm}-{dd}", f"{age} yrs"
    else:
        century = "20" if yy <= 70 else "19"
        full_year = int(f"{century}{yy:02d}")
        is_expired = full_year < datetime.utcnow().year or (full_year == datetime.utcnow().year and int(mm) < datetime.utcnow().month)
        status = "Expired" if is_expired else "Active"
        return f"{century}{yy:02d}-{mm}-{dd}", status

def _parse_td3(lines: list) -> Dict[str, Any]:
    l1, l2 = lines[0], lines[1]
    doc_code = l1[0:2].replace("<", "")
    country_code = l1[2:5].replace("<", "")
    country_name = ISO_3166_COUNTRIES.get(country_code, country_code)
    surname, given_names = _clean_name(l1[5:44])

    doc_num = l2[0:9].replace("<", "")
    doc_num_raw = l2[0:9]
    doc_num_chk = l2[9]
    expected_doc_chk = compute_check_digit(doc_num_raw)

    nat_code = l2[10:13].replace("<", "")
    nat_name = ISO_3166_COUNTRIES.get(nat_code, nat_code)

    dob_raw = l2[13:19]
    dob_chk = l2[19]
    expected_dob_chk = compute_check_digit(dob_raw)
    dob_readable, age_str = _format_readable_date(dob_raw, is_dob=True)

    sex_char = l2[20]
    sex_desc = "Male" if sex_char == "M" else ("Female" if sex_char == "F" else "Unspecified")

    exp_raw = l2[21:27]
    exp_chk = l2[27]
    expected_exp_chk = compute_check_digit(exp_raw)
    exp_readable, exp_status = _format_readable_date(exp_raw, is_dob=False)

    opt_raw = l2[28:42]
    opt_chk = l2[42]
    composite_chk = l2[43]
    
    composite_string = f"{doc_num_raw}{doc_num_chk}{dob_raw}{dob_chk}{exp_raw}{exp_chk}{opt_raw}{opt_chk}"
    expected_composite_chk = compute_check_digit(composite_string)

    scorecard = {
        "doc_number_valid": doc_num_chk == expected_doc_chk,
        "dob_valid": dob_chk == expected_dob_chk,
        "expiry_valid": exp_chk == expected_exp_chk,
        "composite_valid": composite_chk == expected_composite_chk,
    }
    scorecard["all_valid"] = all(scorecard.values())

    return {
        "format": "TD3",
        "document_type": "Passport" if doc_code.startswith("P") else ("Visa A" if doc_code.startswith("V") else "Travel Document"),
        "issuing_country": f"{country_code} ({country_name})",
        "country_code": country_code,
        "document_number": doc_num,
        "surname": surname,
        "given_names": given_names,
        "full_name": f"{given_names} {surname}".strip(),
        "nationality": f"{nat_code} ({nat_name})",
        "date_of_birth": dob_readable,
        "age": age_str,
        "sex": sex_desc,
        "expiry_date": exp_readable,
        "status": exp_status,
        "optional_data": opt_raw.replace("<", ""),
        "check_digits": {
            "doc_num": {"actual": doc_num_chk, "expected": expected_doc_chk, "pass": scorecard["doc_number_valid"]},
            "dob": {"actual": dob_chk, "expected": expected_dob_chk, "pass": scorecard["dob_valid"]},
            "expiry": {"actual": exp_chk, "expected": expected_exp_chk, "pass": scorecard["expiry_valid"]},
            "composite": {"actual": composite_chk, "expected": expected_composite_chk, "pass": scorecard["composite_valid"]}
        },
        "scorecard": scorecard,
        "lines": [l1, l2]
    }

def _parse_td1(lines: list) -> Dict[str, Any]:
    l1, l2, l3 = lines[0], lines[1], lines[2]
    doc_code = l1[0:2].replace("<", "")
    country_code = l1[2:5].replace("<", "")
    country_name = ISO_3166_COUNTRIES.get(country_code, country_code)
    
    doc_num_raw = l1[5:14]
    doc_num = doc_num_raw.replace("<", "")
    doc_num_chk = l1[14]
    expected_doc_chk = compute_check_digit(doc_num_raw)
    opt1 = l1[15:30]

    dob_raw = l2[0:6]
    dob_chk = l2[6]
    expected_dob_chk = compute_check_digit(dob_raw)
    dob_readable, age_str = _format_readable_date(dob_raw, is_dob=True)

    sex_char = l2[7]
    sex_desc = "Male" if sex_char == "M" else ("Female" if sex_char == "F" else "Unspecified")

    exp_raw = l2[8:14]
    exp_chk = l2[14]
    expected_exp_chk = compute_check_digit(exp_raw)
    exp_readable, exp_status = _format_readable_date(exp_raw, is_dob=False)

    nat_code = l2[15:18].replace("<", "")
    nat_name = ISO_3166_COUNTRIES.get(nat_code, nat_code)
    opt2 = l2[18:29]
    composite_chk = l2[29]

    composite_string = f"{doc_num_raw}{doc_num_chk}{opt1}{dob_raw}{dob_chk}{exp_raw}{exp_chk}{opt2}"
    expected_composite_chk = compute_check_digit(composite_string)

    surname, given_names = _clean_name(l3)

    scorecard = {
        "doc_number_valid": doc_num_chk == expected_doc_chk,
        "dob_valid": dob_chk == expected_dob_chk,
        "expiry_valid": exp_chk == expected_exp_chk,
        "composite_valid": composite_chk == expected_composite_chk,
    }
    scorecard["all_valid"] = all(scorecard.values())

    return {
        "format": "TD1",
        "document_type": "ID Card / Driver License",
        "issuing_country": f"{country_code} ({country_name})",
        "country_code": country_code,
        "document_number": doc_num,
        "surname": surname,
        "given_names": given_names,
        "full_name": f"{given_names} {surname}".strip(),
        "nationality": f"{nat_code} ({nat_name})",
        "date_of_birth": dob_readable,
        "age": age_str,
        "sex": sex_desc,
        "expiry_date": exp_readable,
        "status": exp_status,
        "optional_data": (opt1 + opt2).replace("<", ""),
        "check_digits": {
            "doc_num": {"actual": doc_num_chk, "expected": expected_doc_chk, "pass": scorecard["doc_number_valid"]},
            "dob": {"actual": dob_chk, "expected": expected_dob_chk, "pass": scorecard["dob_valid"]},
            "expiry": {"actual": exp_chk, "expected": expected_exp_chk, "pass": scorecard["expiry_valid"]},
            "composite": {"actual": composite_chk, "expected": expected_composite_chk, "pass": scorecard["composite_valid"]}
        },
        "scorecard": scorecard,
        "lines": [l1, l2, l3]
    }

def _parse_td2(lines: list) -> Dict[str, Any]:
    l1, l2 = lines[0], lines[1]
    doc_code = l1[0:2].replace("<", "")
    country_code = l1[2:5].replace("<", "")
    country_name = ISO_3166_COUNTRIES.get(country_code, country_code)
    surname, given_names = _clean_name(l1[5:36])

    doc_num_raw = l2[0:9]
    doc_num = doc_num_raw.replace("<", "")
    doc_num_chk = l2[9]
    expected_doc_chk = compute_check_digit(doc_num_raw)

    nat_code = l2[10:13].replace("<", "")
    nat_name = ISO_3166_COUNTRIES.get(nat_code, nat_code)

    dob_raw = l2[13:19]
    dob_chk = l2[19]
    expected_dob_chk = compute_check_digit(dob_raw)
    dob_readable, age_str = _format_readable_date(dob_raw, is_dob=True)

    sex_char = l2[20]
    sex_desc = "Male" if sex_char == "M" else ("Female" if sex_char == "F" else "Unspecified")

    exp_raw = l2[21:27]
    exp_chk = l2[27]
    expected_exp_chk = compute_check_digit(exp_raw)
    exp_readable, exp_status = _format_readable_date(exp_raw, is_dob=False)

    opt_raw = l2[28:35]
    composite_chk = l2[35]
    composite_string = f"{doc_num_raw}{doc_num_chk}{dob_raw}{dob_chk}{exp_raw}{exp_chk}{opt_raw}"
    expected_composite_chk = compute_check_digit(composite_string)

    scorecard = {
        "doc_number_valid": doc_num_chk == expected_doc_chk,
        "dob_valid": dob_chk == expected_dob_chk,
        "expiry_valid": exp_chk == expected_exp_chk,
        "composite_valid": composite_chk == expected_composite_chk,
    }
    scorecard["all_valid"] = all(scorecard.values())

    return {
        "format": "TD2",
        "document_type": "Resident Card / Travel Doc" if not doc_code.startswith("V") else "Visa B",
        "issuing_country": f"{country_code} ({country_name})",
        "country_code": country_code,
        "document_number": doc_num,
        "surname": surname,
        "given_names": given_names,
        "full_name": f"{given_names} {surname}".strip(),
        "nationality": f"{nat_code} ({nat_name})",
        "date_of_birth": dob_readable,
        "age": age_str,
        "sex": sex_desc,
        "expiry_date": exp_readable,
        "status": exp_status,
        "optional_data": opt_raw.replace("<", ""),
        "check_digits": {
            "doc_num": {"actual": doc_num_chk, "expected": expected_doc_chk, "pass": scorecard["doc_number_valid"]},
            "dob": {"actual": dob_chk, "expected": expected_dob_chk, "pass": scorecard["dob_valid"]},
            "expiry": {"actual": exp_chk, "expected": expected_exp_chk, "pass": scorecard["expiry_valid"]},
            "composite": {"actual": composite_chk, "expected": expected_composite_chk, "pass": scorecard["composite_valid"]}
        },
        "scorecard": scorecard,
        "lines": [l1, l2]
    }
