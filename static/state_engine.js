/**
 * Barcode Studio Pro - State-Aware Multi-Revision & Calculator Engine
 * Extracted from verified AAMVA specifications & pdf417.pro generator algorithms.
 */

(function(window) {
    // 1. Structured State & Revision Hierarchy (85 profiles across 50 States + DC + 12 Provinces)
    
const STATE_HIERARCHY = {
  "Alabama": {
    "is_canada": false,
    "parent_name": "Alabama",
    "base_code": "AL",
    "revisions": [
      {
        "slug": "AL",
        "label": "Alabama (2014)",
        "rev_header": "Rev. 11/01/2014 (0401)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": true,
        "has_audit": false,
        "default_dd": "NONE",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      },
      {
        "slug": "AL_2022",
        "label": "Alabama (2022)",
        "rev_header": "Rev. 26/04/2022 (0403)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan",
          "Uscan.pro"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": true,
        "has_audit": false,
        "default_dd": "NONE",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Alaska": {
    "is_canada": false,
    "parent_name": "Alaska",
    "base_code": "AK",
    "revisions": [
      {
        "slug": "AK",
        "label": "Alaska",
        "rev_header": "Rev. 11/01/2018 (0901)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Arizona": {
    "is_canada": false,
    "parent_name": "Arizona",
    "base_code": "AZ",
    "revisions": [
      {
        "slug": "AZ",
        "label": "Arizona (2014)",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      },
      {
        "slug": "AZ_2023",
        "label": "Arizona (2023)",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Arkansas": {
    "is_canada": false,
    "parent_name": "Arkansas",
    "base_code": "AR",
    "revisions": [
      {
        "slug": "AR",
        "label": "Arkansas",
        "rev_header": "Rev. 03/01/2018 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "California": {
    "is_canada": false,
    "parent_name": "California",
    "base_code": "CA",
    "revisions": [
      {
        "slug": "CA",
        "label": "California (2017)",
        "rev_header": "Rev. 08/29/2017 (0901)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "CA_2024",
        "label": "California (2024)",
        "rev_header": "Rev. 2024 (1001)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan",
          "Regula"
        ],
        "verified": true,
        "is_new": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "has_suffix": true,
        "has_limited_term": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false
      }
    ]
  },
  "Colorado": {
    "is_canada": false,
    "parent_name": "Colorado",
    "base_code": "CO",
    "revisions": [
      {
        "slug": "CO_2015",
        "label": "Colorado (2015)",
        "rev_header": "Rev. 10/30/2015 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 5,
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "has_race": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "CO_2022",
        "label": "Colorado (2022)",
        "rev_header": "Rev 02/28/2022 (1001)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "is_new": false,
        "term_years": 5,
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "has_race": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false
      }
    ]
  },
  "Connecticut": {
    "is_canada": false,
    "parent_name": "Connecticut",
    "base_code": "CT",
    "revisions": [
      {
        "slug": "CT",
        "label": "Connecticut",
        "rev_header": "Rev. 02/10/2017 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Delaware": {
    "is_canada": false,
    "parent_name": "Delaware",
    "base_code": "DE",
    "revisions": [
      {
        "slug": "DE",
        "label": "Delaware",
        "rev_header": "Rev. 08/02/2017 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Florida": {
    "is_canada": false,
    "parent_name": "Florida",
    "base_code": "FL",
    "revisions": [
      {
        "slug": "FL",
        "label": "Florida",
        "rev_header": "(Rev. 03/16/2017 & 05/01/2019 & 03/01/2020)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "has_safe_driver": true,
        "has_revision_date": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Georgia": {
    "is_canada": false,
    "parent_name": "Georgia",
    "base_code": "GA",
    "revisions": [
      {
        "slug": "GA_2015",
        "label": "Georgia (2015)",
        "rev_header": "(Rev. 07/01/2015)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "has_country": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "GA_2019",
        "label": "Georgia (2019)",
        "rev_header": "(Rev. 01/02/2019)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "is_new": false,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "has_country": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false
      }
    ]
  },
  "Hawaii": {
    "is_canada": false,
    "parent_name": "Hawaii",
    "base_code": "HI",
    "revisions": [
      {
        "slug": "HI",
        "label": "Hawaii",
        "rev_header": "Rev. 11/12/2019)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Idaho": {
    "is_canada": false,
    "parent_name": "Idaho",
    "base_code": "ID",
    "revisions": [
      {
        "slug": "ID",
        "label": "Idaho (2016)",
        "rev_header": "Rev. 09/05/2016 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      },
      {
        "slug": "ID_2023",
        "label": "Idaho (2023)",
        "rev_header": "Rev. 01/31/2023 (1009)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Illinois": {
    "is_canada": false,
    "parent_name": "Illinois",
    "base_code": "IL",
    "revisions": [
      {
        "slug": "IL",
        "label": "Illinois",
        "rev_header": "Rev. 09/17/2015 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": true,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Indiana": {
    "is_canada": false,
    "parent_name": "Indiana",
    "base_code": "IN",
    "revisions": [
      {
        "slug": "IN",
        "label": "Indiana",
        "rev_header": "Rev. 07/24/2018 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Iowa": {
    "is_canada": false,
    "parent_name": "Iowa",
    "base_code": "IA",
    "revisions": [
      {
        "slug": "IA_2011",
        "label": "Iowa (2011)",
        "rev_header": "Rev. 07/25/2011 (0402)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      },
      {
        "slug": "IA_2017",
        "label": "Iowa (2017)",
        "rev_header": "Rev. 29/06/2017 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Kansas": {
    "is_canada": false,
    "parent_name": "Kansas",
    "base_code": "KS",
    "revisions": [
      {
        "slug": "KS",
        "label": "Kansas",
        "rev_header": "Rev. 02/24/2017)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Kentucy": {
    "is_canada": false,
    "parent_name": "Kentucy",
    "base_code": "KY",
    "revisions": [
      {
        "slug": "KY_2012",
        "label": "Kentucy (2012)",
        "rev_header": "Rev. 03/16/2012)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      },
      {
        "slug": "KY_2018",
        "label": "Kentucy (2018)",
        "rev_header": "Rev. 08/31/2018 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Louisiana": {
    "is_canada": false,
    "parent_name": "Louisiana",
    "base_code": "LA",
    "revisions": [
      {
        "slug": "LA",
        "label": "Louisiana",
        "rev_header": "Rev. 02/10/2015)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Maine": {
    "is_canada": false,
    "parent_name": "Maine",
    "base_code": "ME",
    "revisions": [
      {
        "slug": "ME",
        "label": "Maine",
        "rev_header": "Rev. 01/04/2019 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Maryland": {
    "is_canada": false,
    "parent_name": "Maryland",
    "base_code": "MD",
    "revisions": [
      {
        "slug": "MD",
        "label": "Maryland (2016 & 2019)",
        "rev_header": "Rev. 06/20/2016 & 08/26/2019)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      },
      {
        "slug": "MD_2021",
        "label": "Maryland (2021)",
        "rev_header": "Rev. 12/05/2021 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Massachusetts": {
    "is_canada": false,
    "parent_name": "Massachusetts",
    "base_code": "MA",
    "revisions": [
      {
        "slug": "MA",
        "label": "Massachusetts",
        "rev_header": "Rev. 02/22/2016 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "08262020 REV 02222016",
        "has_real_id": true,
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Michigan": {
    "is_canada": false,
    "parent_name": "Michigan",
    "base_code": "MI",
    "revisions": [
      {
        "slug": "MI",
        "label": "Michigan (2011, 2021)",
        "rev_header": "Rev. 01/21/2011 & 08/16/2021",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      },
      {
        "slug": "MI_2024",
        "label": "Michigan (2024)",
        "rev_header": "Rev. 01/02/2024",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Minnesota": {
    "is_canada": false,
    "parent_name": "Minnesota",
    "base_code": "MN",
    "revisions": [
      {
        "slug": "MN",
        "label": "Minnesota",
        "rev_header": "Rev. 10/23/2017 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Mississippi": {
    "is_canada": false,
    "parent_name": "Mississippi",
    "base_code": "MS",
    "revisions": [
      {
        "slug": "MS",
        "label": "Mississippi (2016, 2021)",
        "rev_header": "Rev. 02/22/2016 & 05/14/2021 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": false,
        "is_new": false
      },
      {
        "slug": "MS_2023",
        "label": "Mississippi (2023)",
        "rev_header": "Rev. 09/15/2023 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "verified": true,
        "is_new": false
      }
    ]
  },
  "Missouri": {
    "is_canada": false,
    "parent_name": "Missouri",
    "base_code": "MO",
    "revisions": [
      {
        "slug": "MO_2012",
        "label": "Missouri (2012)",
        "rev_header": "(Rev. 12/10/2012)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "MO_2020",
        "label": "Missouri (2020)",
        "rev_header": "Rev. 01/27/2020 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Montana": {
    "is_canada": false,
    "parent_name": "Montana",
    "base_code": "MT",
    "revisions": [
      {
        "slug": "MT",
        "label": "Montana",
        "rev_header": "Rev. 10/07/2015 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_address2": false,
        "has_weight_range": false,
        "has_audit": false,
        "has_race": false,
        "default_dd": "",
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Nebraska": {
    "is_canada": false,
    "parent_name": "Nebraska",
    "base_code": "NE",
    "revisions": [
      {
        "slug": "NE_2017",
        "label": "Nebraska (2017)",
        "rev_header": "Rev. 02/28/2017 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_race": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "is_new": false
      },
      {
        "slug": "NE_2021",
        "label": "Nebraska (2021)",
        "rev_header": "Rev. 04/05/2021 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_race": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "is_new": false
      }
    ]
  },
  "Nevada": {
    "is_canada": false,
    "parent_name": "Nevada",
    "base_code": "NV",
    "revisions": [
      {
        "slug": "NV_2008",
        "label": "Nevada (2008)",
        "rev_header": "(Rev. 10/10/2008)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_hair": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "is_new": false
      },
      {
        "slug": "NV_2021",
        "label": "Nevada (2021)",
        "rev_header": "Rev. 05/24/2021 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_hair": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "has_suffix": true,
        "is_new": false
      }
    ]
  },
  "New Hampshire": {
    "is_canada": false,
    "parent_name": "New Hampshire",
    "base_code": "NH",
    "revisions": [
      {
        "slug": "NH",
        "label": "New Hampshire (2016)",
        "rev_header": "Rev. 06/09/2016 (0801)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "NH_2024",
        "label": "New Hampshire (2024)",
        "rev_header": "Rev. 08/30/2024 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "New Jersey": {
    "is_canada": false,
    "parent_name": "New Jersey",
    "base_code": "NJ",
    "revisions": [
      {
        "slug": "NJ_2020",
        "label": "New Jersey",
        "rev_header": "Rev. 01/08/2020 (0402)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_nj_options": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "WV202023900007318",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "New Mexico": {
    "is_canada": false,
    "parent_name": "New Mexico",
    "base_code": "NM",
    "revisions": [
      {
        "slug": "NM",
        "label": "New Mexico",
        "rev_header": "Rev. 08/23/2019 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "New York": {
    "is_canada": false,
    "parent_name": "New York",
    "base_code": "NY",
    "revisions": [
      {
        "slug": "NY_2017",
        "label": "New York (2017)",
        "rev_header": "Rev. 09/28/2017 (0303)",
        "scanners": [
          "Scandit",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "NY_2022",
        "label": "New York (2022)",
        "rev_header": "Rev. 03/07/2022 (1004)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "North Carolina": {
    "is_canada": false,
    "parent_name": "North Carolina",
    "base_code": "NC",
    "revisions": [
      {
        "slug": "NC",
        "label": "North Carolina",
        "rev_header": "Rev. 10/24/2014 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_race": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "North Dakota": {
    "is_canada": false,
    "parent_name": "North Dakota",
    "base_code": "ND",
    "revisions": [
      {
        "slug": "ND",
        "label": "North Dakota (2008)",
        "rev_header": "Rev. 01/08/2014 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_option": true,
        "has_real_id": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "ND_2023",
        "label": "North Dakota (2023)",
        "rev_header": "Rev. 03/10/2023 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_option": true,
        "has_real_id": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Ohio": {
    "is_canada": false,
    "parent_name": "Ohio",
    "base_code": "OH",
    "revisions": [
      {
        "slug": "OH",
        "label": "Ohio",
        "rev_header": "Rev. 07/01/2018 (0901)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_pob": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "is_new": false
      }
    ]
  },
  "Oklahoma": {
    "is_canada": false,
    "parent_name": "Oklahoma",
    "base_code": "OK",
    "revisions": [
      {
        "slug": "OK",
        "label": "Oklahoma",
        "rev_header": "Rev. 01/13/2020 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Oregon": {
    "is_canada": false,
    "parent_name": "Oregon",
    "base_code": "OR",
    "revisions": [
      {
        "slug": "OR",
        "label": "Oregon",
        "rev_header": "(Rev. 07/09/2018)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Pennsylvania": {
    "is_canada": false,
    "parent_name": "Pennsylvania",
    "base_code": "PA",
    "revisions": [
      {
        "slug": "PA",
        "label": "Pennsylvania (2016)",
        "rev_header": "Rev. 06/07/2016 (9000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_dups": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "PA_2022",
        "label": "Pennsylvania (2022)",
        "rev_header": "Rev. 03/25/2022 (1000)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_dups": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Rhode Island": {
    "is_canada": false,
    "parent_name": "Rhode Island",
    "base_code": "RI",
    "revisions": [
      {
        "slug": "RI",
        "label": "Rhode Island (2016)",
        "rev_header": "(Rev. 01/26/2016)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": false,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "RI_2022",
        "label": "Rhode Island (2022)",
        "rev_header": "Rev. 03/01/2022 (0801)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 4,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "South Carolina": {
    "is_canada": false,
    "parent_name": "South Carolina",
    "base_code": "SC",
    "revisions": [
      {
        "slug": "SC",
        "label": "South Carolina",
        "rev_header": "(Rev. 01/01/2018)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": false,
        "has_dd": true,
        "has_race": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "8513940203280844439",
        "has_real_id": false,
        "has_address2": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "South Dakota": {
    "is_canada": false,
    "parent_name": "South Dakota",
    "base_code": "SD",
    "revisions": [
      {
        "slug": "SD",
        "label": "South Dakota",
        "rev_header": "(Rev. 06/29/2017)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "01384574202008261234567",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Tennessee": {
    "is_canada": false,
    "parent_name": "Tennessee",
    "base_code": "TN",
    "revisions": [
      {
        "slug": "TN",
        "label": "Tennessee",
        "rev_header": "Rev. 12/02/2011 (0600)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Texas": {
    "is_canada": false,
    "parent_name": "Texas",
    "base_code": "TX",
    "revisions": [
      {
        "slug": "TX_2016",
        "label": "Texas (2016)",
        "rev_header": "Rev. 05/01/2016 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_race": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "is_new": false
      },
      {
        "slug": "TX_2020",
        "label": "Texas (2020)",
        "rev_header": "Rev. 2020 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": true,
        "has_dd": true,
        "has_race": true,
        "has_suffix": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "is_new": false
      }
    ]
  },
  "Utah": {
    "is_canada": false,
    "parent_name": "Utah",
    "base_code": "UT",
    "revisions": [
      {
        "slug": "UT_2016",
        "label": "Utah (2016)",
        "rev_header": "Rev. 2016 (0800)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_real_id": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "UT_2021",
        "label": "Utah (2021)",
        "rev_header": "Rev. 2021 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Vermont": {
    "is_canada": false,
    "parent_name": "Vermont",
    "base_code": "VT",
    "revisions": [
      {
        "slug": "VT",
        "label": "Vermont",
        "rev_header": "Rev. 10/16/2018 (0902)",
        "scanners": [],
        "verified": false,
        "term_years": 4,
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Virginia": {
    "is_canada": false,
    "parent_name": "Virginia",
    "base_code": "VA",
    "revisions": [
      {
        "slug": "VA",
        "label": "Virginia",
        "rev_header": "Rev. 12/10/2008 (0300)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Washington": {
    "is_canada": false,
    "parent_name": "Washington",
    "base_code": "WA",
    "revisions": [
      {
        "slug": "WA",
        "label": "Washington (2019)",
        "rev_header": "Rev. 11/12/2019 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 6,
        "has_icn": false,
        "has_dd": true,
        "has_audit": true,
        "has_suffix": false,
        "has_weight_range": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "is_new": false
      },
      {
        "slug": "WA_2025",
        "label": "Washington (2025)",
        "rev_header": "Rev. 02/18/2025 (0901)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": false,
        "has_dd": true,
        "has_audit": true,
        "has_suffix": true,
        "has_weight_range": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "is_new": true
      }
    ]
  },
  "West Virginia": {
    "is_canada": false,
    "parent_name": "West Virginia",
    "base_code": "WV",
    "revisions": [
      {
        "slug": "WV",
        "label": "West Virginia",
        "rev_header": "Rev. 06/04/2019 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Wisconsin": {
    "is_canada": false,
    "parent_name": "Wisconsin",
    "base_code": "WI",
    "revisions": [
      {
        "slug": "WI",
        "label": "Wisconsin (2015)",
        "rev_header": "Rev. 09/01/2015 (0801)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      },
      {
        "slug": "WI_2023",
        "label": "Wisconsin (2023)",
        "rev_header": "Rev. 06/01/2023 (1002)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 8,
        "has_icn": true,
        "has_dd": true,
        "has_weight": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Wyoming": {
    "is_canada": false,
    "parent_name": "Wyoming",
    "base_code": "WY",
    "revisions": [
      {
        "slug": "WY",
        "label": "Wyoming",
        "rev_header": "Rev. 11/14/2018 (0900)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "verified": true,
        "term_years": 5,
        "has_icn": true,
        "has_dd": true,
        "has_hair": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": true,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_new": false
      }
    ]
  },
  "Alberta": {
    "is_canada": true,
    "parent_name": "Alberta",
    "base_code": "AB",
    "revisions": [
      {
        "slug": "AB",
        "label": "Alberta",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": true,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "British Columbia": {
    "is_canada": true,
    "parent_name": "British Columbia",
    "base_code": "BC",
    "revisions": [
      {
        "slug": "BC",
        "label": "British Columbia",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Manitoba": {
    "is_canada": true,
    "parent_name": "Manitoba",
    "base_code": "MB",
    "revisions": [
      {
        "slug": "MB",
        "label": "Manitoba",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "New Brunswick": {
    "is_canada": true,
    "parent_name": "New Brunswick",
    "base_code": "NB",
    "revisions": [
      {
        "slug": "NB",
        "label": "New Brunswick",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Newfoundland and Labrador": {
    "is_canada": true,
    "parent_name": "Newfoundland and Labrador",
    "base_code": "NL",
    "revisions": [
      {
        "slug": "NL",
        "label": "Newfoundland and Labrador",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Nova Scotia": {
    "is_canada": true,
    "parent_name": "Nova Scotia",
    "base_code": "NS",
    "revisions": [
      {
        "slug": "NS",
        "label": "Nova Scotia",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Nunavut": {
    "is_canada": true,
    "parent_name": "Nunavut",
    "base_code": "NU",
    "revisions": [
      {
        "slug": "NU",
        "label": "Nunavut",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Ontario": {
    "is_canada": true,
    "parent_name": "Ontario",
    "base_code": "ON",
    "revisions": [
      {
        "slug": "ON",
        "label": "Ontario",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Prince Edward Island": {
    "is_canada": true,
    "parent_name": "Prince Edward Island",
    "base_code": "PE",
    "revisions": [
      {
        "slug": "PE",
        "label": "Prince Edward Island",
        "rev_header": "Rev. ???)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": false,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Quebec": {
    "is_canada": true,
    "parent_name": "Quebec",
    "base_code": "QC",
    "revisions": [
      {
        "slug": "QC",
        "label": "Quebec",
        "rev_header": "Rev. 2015-08-01 (0401)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "Saskatchewan": {
    "is_canada": true,
    "parent_name": "Saskatchewan",
    "base_code": "SK",
    "revisions": [
      {
        "slug": "SK",
        "label": "Saskatchewan",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "The Yukon": {
    "is_canada": true,
    "parent_name": "The Yukon",
    "base_code": "YT",
    "revisions": [
      {
        "slug": "YT",
        "label": "The Yukon",
        "rev_header": "Standard Revision",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "has_suffix": false,
        "is_available": true,
        "verified": false,
        "is_new": false
      }
    ]
  },
  "District of Columbia": {
    "is_canada": false,
    "parent_name": "District of Columbia",
    "base_code": "DC",
    "revisions": [
      {
        "slug": "DC",
        "label": "Washington, District of Columbia",
        "rev_header": "",
        "scanners": [],
        "verified": false,
        "term_years": 8,
        "has_icn": false,
        "has_dd": true,
        "has_audit": true,
        "has_suffix": true,
        "has_weight": false,
        "has_weight_range": false,
        "default_dd": "",
        "has_real_id": false,
        "has_address2": false,
        "has_race": false,
        "is_new": false
      }
    ]
  }
};

    // 2. Element ID Proxy for seamless compatibility
    const ID_MAP = {
        'inputDocumentNumber': 'aamva-id',
        'inputFirstName': 'aamva-first',
        'inputLastName': 'aamva-last',
        'inputMiddleName': 'aamva-mid',
        'inputAddress': 'aamva-street',
        'inputCity': 'aamva-city',
        'inputZipCode': 'aamva-zip',
        'inputBrithDate': 'aamva-dob',
        'inputIssueDate': 'aamva-issued',
        'inputExpiryDate': 'aamva-exp',
        'inputICN': 'aamva-dck',
        'inputDD': 'aamva-dcf',
        'inputDiscriminator': 'aamva-dcf',
        'inputAudit': 'aamva-audit',
        'inputRace': 'aamva-race',
        'inputRaceCode': 'aamva-race',
        'inputDocumentClass': 'aamva-class',
        'inputSex': 'aamva-sex',
        'inputDonor': 'aamva-donor',
        'inputHeight': 'aamva-height-in',
        'inputWeight': 'aamva-weight-lb',
        'inputWeightRange': 'aamva-weight-range',
        'inputEyeColorCode': 'aamva-eyes',
        'inputHairColorCode': 'aamva-hair',
        'inputRestrictions': 'aamva-restrictions',
        'inputEndorsement': 'aamva-endorsements',
        'inputIsRealID': 'aamva-realid',
        'inputNameSuffix': 'aamva-suffix',
        'inputLimitedTerm': 'aamva-limited-term',
        'inputCountry': 'aamva-country',
        'inputSafeDriver': 'aamva-safe-driver',
        'inputRevisionDate': 'aamva-revision-date',
        'inputOption': 'aamva-nd-opt',
        'inputPOB': 'aamva-pob',
        'inputPlaceOfBirth': 'aamva-pob',
        'inputDups': 'aamva-dups',
        'inputOption1': 'aamva-nj-opt1',
        'inputOption2': 'aamva-nj-opt2',
        'inputOption3': 'aamva-nj-opt3',
        'inputOfficeCode': 'aamva-in-office',
        'inputParish': 'aamva-la-parish'
    };

    function getTargetElement(id) {
        if (id === 'inputOfficeCode') {
            const jurEl = document.getElementById('aamva-jurisdiction');
            const state = jurEl ? jurEl.value.toUpperCase().split('_')[0] : '';
            if (state === 'IN') return document.getElementById('aamva-in-office') || document.getElementById('aamva-la-office');
            if (state === 'LA') return document.getElementById('aamva-la-office') || document.getElementById('aamva-in-office');
            return document.getElementById('aamva-in-office') || document.getElementById('aamva-la-office');
        }
        if (id === 'inputParish') {
            return document.getElementById('aamva-la-parish');
        }
        const mappedId = ID_MAP[id] || id;
        return document.getElementById(mappedId) || document.getElementById(id);
    }

    // 3. Helper Functions
function get_month_number(date) {
    year = parseInt(date.slice(-4));

    if (year % 2) { return date.slice(0,2); } 

    return (parseInt(date.slice(0,2)) + 12).toString();  
}



function get_letter_corresponding_month(month) {
    letters = "ABCDEFGHIJKL";
    return letters[parseInt(month) - 1];
}



function get_last_day_of_month(date) {
	month = parseInt(date.slice(0, 2));
	year = parseInt(date.slice(-4));

    mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    mdays_leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


    if (year % 4 == 0) {
        return mdays_leap[month - 1];
    } else {
        return mdays[month - 1];
    }
}



function getNumberOfDaysFromBeginnigOfYear(date) {
	mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	mdays_leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	day = parseInt(date.slice(2, 4));
	month = parseInt(date.slice(0, 2));
	year = parseInt(date.slice(-4));
	
	total_days = day;
	for (var i = 1; i < month; i++) {
	    if (year % 4 == 0) {
		    total_days += mdays_leap[i];
	    } else {
		    total_days += mdays[i];
	    }
	}
	return ("00" + total_days).slice(-3)
}



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}



function getFormattedDate_MMDDYYYY(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + day + year;
}



function getFormattedDate_YYYYMMDD(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return year + month + day;
}



function getRandomDateByYear(minYear, maxYear) {
    minDate = new Date(minYear, 0, 1);
    maxDate = new Date(maxYear, 0, 1);

    return randomDate(minDate, maxDate);
}



function makeRandomDOB(minYear, maxYear) {
    if (!minYear) { minYear = 1965 }
    if (!maxYear) { maxYear = 1999 }
    getTargetElement('inputBrithDate').value = getFormattedDate_MMDDYYYY(getRandomDateByYear(minYear, maxYear));
}



function makeRandomDOB_CAN(minYear, maxYear) {
    if (!minYear) { minYear = 1965 }
    if (!maxYear) { maxYear = 1999 }
    getTargetElement('inputBrithDate').value = getFormattedDate_YYYYMMDD(getRandomDateByYear(minYear, maxYear));
}



function makeRandomDOI(minYear, maxYear) {
    if (!maxYear) {  maxYear = new Date().getFullYear() - 1; }

    date = getFormattedDate_MMDDYYYY(getRandomDateByYear(minYear, maxYear + 1))
    getTargetElement("inputIssueDate").value = date;

    var dateOfExpiry = getTargetElement("inputExpiryDate").value;
}



function makeRandomDOI_CAN(minYear, maxYear) {
    if (!maxYear) {  maxYear = new Date().getFullYear() - 1; }

    date = getFormattedDate_YYYYMMDD(getRandomDateByYear(minYear, maxYear + 1))
    getTargetElement("inputIssueDate").value = date;
}



function makeRandomDOE(diff) {
    var dateOfBirth = getTargetElement("inputBrithDate").value;
    if (!dateOfBirth) { 
        makeRandomDOB();
        dateOfBirth = getTargetElement("inputBrithDate").value;
    }

    if (dateOfBirth.length > 4) {
        date = dateOfBirth.slice(0,4);
    } else { return; }

    var dateOfIssue = getTargetElement("inputIssueDate").value;
    if (dateOfIssue.length == 8) { date += parseInt(dateOfIssue.slice(-4)) + diff }
    
    getTargetElement("inputExpiryDate").value = date
}



function makeRandomDOE_CAN(diff) {
    var dateOfBirth = getTargetElement("inputBrithDate").value;
    if (!dateOfBirth) {
        makeRandomDOB_CAN();
        dateOfBirth = getTargetElement("inputBrithDate").value;
    }

    if (dateOfBirth.length > 4) {
        date = dateOfBirth.slice(-4);
    } else { return; }

    var dateOfIssue = getTargetElement("inputIssueDate").value;
    if (dateOfIssue.length == 8) {
        date = (parseInt(dateOfIssue.slice(0,4)) + diff) + date
    }

    getTargetElement("inputExpiryDate").value = date
}



function makeRandomDOE_fromDOI(diff) {
    var dateOfIssue = getTargetElement("inputIssueDate").value;
    if (!dateOfIssue) { 
        makeRandomDOI(2016, 2020);
        dateOfIssue = getTargetElement("inputIssueDate").value;
    }

    date = dateOfIssue.slice(0,4);


    date += parseInt(dateOfIssue.slice(-4)) + diff
    
    getTargetElement("inputExpiryDate").value = date
}




function makeDOEformDOB() {
    var dateOfBirth = getTargetElement("inputBrithDate").value;

    if (!dateOfBirth) { return; }
    if (dateOfBirth.length > 4) { dateOfBirth = dateOfBirth.slice(0,4); }

    getTargetElement("inputExpiryDate").value = dateOfBirth
}



function makeDOEfromDOI(years) {
    var dateOfIssue = getTargetElement("inputIssueDate").value;

    if (!dateOfIssue || dateOfIssue.length != 8) { return; }

    issueYear = parseInt(dateOfIssue.slice(-4));
    expiryYear = issueYear + years;

    getTargetElement("inputExpiryDate").value = 
        getTargetElement("inputExpiryDate").value.slice(0,4) + expiryYear;
}



function makeDOEfromDOI_full(years) {
    var dateOfIssue = getTargetElement("inputIssueDate").value;

    if (!dateOfIssue || dateOfIssue.length != 8) { return; }

    issueYear = parseInt(dateOfIssue.slice(-4));
    expiryYear = issueYear + years;

    getTargetElement("inputExpiryDate").value = dateOfIssue.slice(0,4) + expiryYear;
        // getTargetElement("inputExpiryDate").value.slice(0,4) + expiryYear;
}



function makeRandomDOE_plus_day(diff) {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Expiry date calculation error. Incorrect issue date!")
        return;
    }

    var dateOfBirth = getTargetElement("inputBrithDate").value;
    if (!dateOfBirth) { 
        makeRandomDOB();
        dateOfBirth = getTargetElement("inputBrithDate").value;
    }

    var birthDateDATE = new Date(parseInt(dateOfBirth.slice(-4)), parseInt(dateOfBirth.slice(0, 2)) - 1, parseInt(dateOfBirth.slice(2, 4)));
    birthDateDATE.setDate(birthDateDATE.getDate() + 1)

    // Get year, month, and day part from the date
    var year = birthDateDATE.toLocaleString("default", { year: "2-digit" });
    var month = birthDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = birthDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = month + day + (parseInt(issueDate.slice(-4)) + diff).toString();
    
    getTargetElement("inputExpiryDate").value = formattedDate;
}



function makeRandomDOE_minus_day(diff) {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Expiry date calculation error. Incorrect issue date!")
        return;
    }

    var expiryDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2))  - 1, parseInt(issueDate.slice(2, 4)));
    expiryDateDATE.setDate(expiryDateDATE.getDate() - 1)


    // Get year, month, and day part from the date
    var year = expiryDateDATE.toLocaleString("default", { year: "2-digit" });
    var month = expiryDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = expiryDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = month + day + (parseInt(issueDate.slice(-4)) + diff).toString();

    getTargetElement("inputExpiryDate").value = formattedDate;
}



function makeRandomDOE_minus_day_key(diff) {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        return;
    }

    var expiryDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2))  - 1, parseInt(issueDate.slice(2, 4)));
    expiryDateDATE.setDate(expiryDateDATE.getDate() - 1)


    // Get year, month, and day part from the date
    var year = expiryDateDATE.toLocaleString("default", { year: "2-digit" });
    var month = expiryDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = expiryDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = month + day + (parseInt(issueDate.slice(-4)) + diff).toString();

    getTargetElement("inputExpiryDate").value = formattedDate;
}




function makeDOEformDOB_plus_day() {
    var dateOfBirth = getTargetElement("inputBrithDate").value;

    if (!dateOfBirth) { return; }

    if (dateOfBirth.length > 3) {
        dateOfBirth = dateOfBirth.slice(0,4);

        var birthDateDATE = new Date(1970, parseInt(dateOfBirth.slice(0, 2)) - 1, parseInt(dateOfBirth.slice(2, 4)));
        birthDateDATE.setDate(birthDateDATE.getDate() + 1)

        // Get year, month, and day part from the date
        var month = birthDateDATE.toLocaleString("default", { month: "2-digit" });
        var day = birthDateDATE.toLocaleString("default", { day: "2-digit" });
        dateOfBirth = month + day;
    }

    getTargetElement("inputExpiryDate").value = dateOfBirth;
}

/*
$$$$$   $$$$  $$  $$ $$$$$   $$$$  $$   $
$$  $$ $$  $$ $$$ $$ $$  $$ $$  $$ $$$ $$
$$$$$  $$$$$$ $$ $$$ $$  $$ $$  $$ $$ $ $
$$  $$ $$  $$ $$  $$ $$  $$ $$  $$ $$   $
$$  $$ $$  $$ $$  $$ $$$$$   $$$$  $$   $
*/



function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
}



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



function getRandomDigit() {
    const alphabet = "0123456789";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}



function getRandomInt2(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}



function getRandomLetterAndDigit() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Get a string of random numbers


function getRandomNumericString(len) {
    var numericString = "";
    for (var i = 0; i < len; i++) {
        numericString += getRandomDigit();
    }
    return numericString;
}

// Get a random last name from a list of the 1000 most popular US last names


function getRandomLastName() {
    const lastnames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez","Powell","Jenkins","Perry","Russell","Sullivan","Bell","Coleman","Butler","Henderson","Barnes","Gonzales","Fisher","Vasquez","Simmons","Romero","Jordan","Patterson","Alexander","Hamilton","Graham","Reynolds","Griffin","Wallace","Moreno","West","Cole","Hayes","Bryant","Herrera","Gibson","Ellis","Tran","Medina","Aguilar","Stevens","Murray","Ford","Castro","Marshall","Owens","Harrison","Fernandez","Mcdonald","Woods","Washington","Kennedy","Wells","Vargas","Henry","Chen","Freeman","Webb","Tucker","Guzman","Burns","Crawford","Olson","Simpson","Porter","Hunter","Gordon","Mendez","Silva","Shaw","Snyder","Mason","Dixon","Munoz","Hunt","Hicks","Holmes","Palmer","Wagner","Black","Robertson","Boyd","Rose","Stone","Salazar","Fox","Warren","Mills","Meyer","Rice","Schmidt","Garza","Daniels","Ferguson","Nichols","Stephens","Soto","Weaver","Ryan","Gardner","Payne","Grant","Dunn","Kelley","Spencer","Hawkins","Arnold","Pierce","Vazquez","Hansen","Peters","Santos","Hart","Bradley","Knight","Elliott","Cunningham","Duncan","Armstrong","Hudson","Carroll","Lane","Riley","Andrews","Alvarado","Ray","Delgado","Berry","Perkins","Hoffman","Johnston","Matthews","Pena","Richards","Contreras","Willis","Carpenter","Lawrence","Sandoval","Guerrero","George","Chapman","Rios","Estrada","Ortega","Watkins","Greene","Nunez","Wheeler","Valdez","Harper","Burke","Larson","Santiago","Maldonado","Morrison","Franklin","Carlson","Austin","Dominguez","Carr","Lawson","Jacobs","Obrien","Lynch","Singh","Vega","Bishop","Montgomery","Oliver","Jensen","Harvey","Williamson","Gilbert","Dean","Sims","Espinoza","Howell","Li","Wong","Reid","Hanson","Le","Mccoy","Garrett","Burton","Fuller","Wang","Weber","Welch","Rojas","Lucas","Marquez","Fields","Park","Yang","Little","Banks","Padilla","Day","Walsh","Bowman","Schultz","Luna","Fowler","Mejia","Davidson","Acosta","Brewer","May","Holland","Juarez","Newman","Pearson","Curtis","Cortez","Douglas","Schneider","Joseph","Barrett","Navarro","Figueroa","Keller","Avila","Wade","Molina","Stanley","Hopkins","Campos","Barnett","Bates","Chambers","Caldwell","Beck","Lambert","Miranda","Byrd","Craig","Ayala","Lowe","Frazier","Powers","Neal","Leonard","Gregory","Carrillo","Sutton","Fleming","Rhodes","Shelton","Schwartz","Norris","Jennings","Watts","Duran","Walters","Cohen","Mcdaniel","Moran","Parks","Steele","Vaughn","Becker","Holt","Deleon","Barker","Terry","Hale","Leon","Hail","Benson","Haynes","Horton","Miles","Lyons","Pham","Graves","Bush","Thornton","Wolfe","Warner","Cabrera","Mckinney","Mann","Zimmerman","Dawson","Lara","Fletcher","Page","Mccarthy","Love","Robles","Cervantes","Solis","Erickson","Reeves","Chang","Klein","Salinas","Fuentes","Baldwin","Daniel","Simon","Velasquez","Hardy","Higgins","Aguirre","Lin","Cummings","Chandler","Sharp","Barber","Bowen","Ochoa","Dennis","Robbins","Liu","Ramsey","Francis","Griffith","Paul","Blair","Oconnor","Cardenas","Pacheco","Cross","Calderon","Quinn","Moss","Swanson","Chan","Rivas","Khan","Rodgers","Serrano","Fitzgerald","Rosales","Stevenson","Christensen","Manning","Gill","Curry","Mclaughlin","Harmon","Mcgee","Gross","Doyle","Garner","Newton","Burgess","Reese","Walton","Blake","Trujillo","Adkins","Brady","Goodman","Roman","Webster","Goodwin","Fischer","Huang","Potter","Delacruz","Montoya","Todd","Wu","Hines","Mullins","Castaneda","Malone","Cannon","Tate","Mack","Sherman","Hubbard","Hodges","Zhang","Guerra","Wolf","Valencia","Saunders","Franco","Rowe","Gallagher","Farmer","Hammond","Hampton","Townsend","Ingram","Wise","Gallegos","Clarke","Barton","Schroeder","Maxwell","Waters","Logan","Camacho","Strickland","Norman","Person","Colon","Parsons","Frank","Harrington","Glover","Osborne","Buchanan","Casey","Floyd","Patton","Ibarra","Ball","Tyler","Suarez","Bowers","Orozco","Salas","Cobb","Gibbs","Andrade","Bauer","Conner","Moody","Escobar","Mcguire","Lloyd","Mueller","Hartman","French","Kramer","Mcbride","Pope","Lindsey","Velazquez","Norton","Mccormick","Sparks","Flynn","Yates","Hogan","Marsh","Macias","Villanueva","Zamora","Pratt","Stokes","Owen","Ballard","Lang","Brock","Villarreal","Charles","Drake","Barrera","Cain","Patrick","Pineda","Burnett","Mercado","Santana","Shepherd","Bautista","Ali","Shaffer","Lamb","Trevino","Mckenzie","Hess","Beil","Olsen","Cochran","Morton","Nash","Wilkins","Petersen","Briggs","Shah","Roth","Nicholson","Holloway","Lozano","Rangel","Flowers","Hoover","Short","Arias","Mora","Valenzuela","Bryan","Meyers","Weiss","Underwood","Bass","Greer","Summers","Houston","Carson","Morrow","Clayton","Whitaker","Decker","Yoder","Collier","Zuniga","Carey","Wilcox","Melendez","Poole","Roberson","Larsen","Conley","Davenport","Copeland","Massey","Lam","Huff","Rocha","Cameron","Jefferson","Hood","Monroe","Anthony","Pittman","Huynh","Randall","Singleton","Kirk","Combs","Mathis","Christian","Skinner","Bradford","Richard","Galvan","Wall","Boone","Kirby","Wilkinson","Bridges","Bruce","Atkinson","Velez","Meza","Roy","Vincent","York","Hodge","Villa","Abbott","Allison","Tapia","Gates","Chase","Sosa","Sweeney","Farrell","Wyatt","Dalton","Horn","Barron","Phelps","Yu","Dickerson","Heath","Foley","Atkins","Mathews","Bonilla","Acevedo","Benitez","Zavala","Hensley","Glenn","Cisneros","Harrell","Shields","Rubio","Huffman","Choi","Boyer","Garrison","Arroyo","Bond","Kane","Hancock","Callahan","Dillon","Cline","Wiggins","Grimes","Arellano","Melton","Oneill","Savage","Ho","Beltran","Pitts","Parrish","Ponce","Rich","Booth","Koch","Golden","Ware","Brennan","Mcdowell","Marks","Cantu","Humphrey","Baxter","Sawyer","Clay","Tanner","Hutchinson","Kaur","Berg","Wiley","Gilmore","Russo","Villegas","Hobbs","Keith","Wilkerson","Ahmed","Beard","Mcclain","Montes","Mata","Rosario","Vang","Walter","Henson","Oneal","Mosley","Mcclure","Beasley","Stephenson","Snow","Huerta","Preston","Vance","Barry","Johns","Eaton","Blackwell","Dyer","Prince","Macdonald","Solomon","Guevara","Stafford","English","Hurst","Woodard","Cortes","Shannon","Kemp","Nolan","Mccullough","Merritt","Murillo","Moon","Salgado","Strong","Kline","Cordova","Barajas","Roach","Rosas","Winters","Jacobson","Lester","Knox","Bullock","Kerr","Leach","Meadows","Orr","Davila","Whitehead","Pruitt","Kent","Conway","Mckee","Barr","David","Dejesus","Marin","Berger","Mcintyre","Blankenship","Gaines","Palacios","Cuevas","Bartlett","Durham","Dorsey","Mccall","Odonnell","Stein","Browning","Stout","Lowery","Sloan","Mclean","Hendricks","Calhoun","Sexton","Chung","Gentry","Hull","Duarte","Ellison","Nielsen","Gillespie","Buck","Middleton","Sellers","Leblanc","Esparza","Hardin","Bradshaw","Mcintosh","Howe","Livingston","Frost","Glass","Morse","Knapp","Herman","Stark","Bravo","Noble","Spears","Weeks","Corona","Frederick","Buckley","Mcfarland","Hebert","Enriquez","Hickman","Quintero","Randolph","Schaefer","Walls","Trejo","House","Reilly","Pennington","Michael","Conrad","Giles","Benjamin","Crosby","Fitzpatrick","Donovan","Mays","Mahoney","Valentine","Raymond","Medrano","Hahn","Mcmillan","Small","Bentley","Felix","Peck","Lucero","Boyle","Hanna","Pace","Rush","Hurley","Harding","Mcconnell","Bernal","Nava","Ayers","Everett","Ventura","Avery","Pugh","Mayer","Bender","Shepard","Mcmahon","Landry","Case","Sampson","Moses","Magana","Blackburn","Dunlap","Gould","Duffy","Vaughan","Herring","Mckay","Espinosa","Rivers","Farley","Bernard","Ashley","Friedman","Potts","Truong","Costa","Correa","Blevins","Nixon","Clements","Fry","Delarosa","Best","Benton","Lugo","Portillo","Dougherty","Crane","Haley","Phan","Villalobos","Blanchard","Horne","Finley","Quintana","Lynn","Esquivel","Bean","Dodson","Mullen","Xiong","Hayden","Cano","Levy","Huber","Richmond","Moyer","Lim","Frye","Sheppard","Mccarty","Avalos","Booker","Waller","Parra","Woodward","Jaramillo","Krueger","Rasmussen","Brandt","Peralta","Donaldson","Stuart","Faulkner","Maynard","Galindo","Coffey","Estes","Sanford","Burch","Maddox","Vo","Oconnell","Vu","Andersen","Spence","Mcpherson","Church","Schmitt","Stanton","Leal","Cherry","Compton","Dudley","Sierra","Pollard","Alfaro","Hester","Proctor","Lu","Hinton","Novak","Good","Madden","Mccann","Terrell","Jarvis","Dickson","Reyna","Cantrell","Mayo","Branch","Hendrix","Rollins","Rowland","Whitney","Duke","Odom","Daugherty","Travis","Tang","Archer"];
    return lastnames[Math.floor(Math.random() * lastnames.length)];
}

// Get a random first name from a list of the 100 most popular US first names


function getRandomFirstName(sex) {
    m_names = ["James","Robert","John","Michael","David","William","Richard","Joseph","Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob","Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Gregory","Alexander","Frank","Patrick","Raymond","Jack","Dennis","Jerry","Tyler","Aaron","Jose","Adam","Nathan","Henry","Douglas","Zachary","Peter","Kyle","Ethan","Walter","Noah","Jeremy","Christian","Keith","Roger","Terry","Gerald","Harold","Sean","Austin","Carl","Arthur","Lawrence","Dylan","Jesse","Jordan","Bryan","Billy","Joe","Bruce","Gabriel","Logan","Albert","Willie","Alan","Juan","Wayne","Elijah","Randy","Roy","Vincent","Ralph","Eugene","Russell","Bobby","Mason","Philip","Louis"];
    f_names = ["Mary","Patricia","Jennifer","Linda","Elizabeth","Barbara","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Dorothy","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather","Diane","Ruth","Julie","Olivia","Joyce","Virginia","Victoria","Kelly","Lauren","Christina","Joan","Evelyn","Judith","Megan","Andrea","Cheryl","Hannah","Jacqueline","Martha","Gloria","Teresa","Ann","Sara","Madison","Frances","Kathryn","Janice","Jean","Abigail","Alice","Julia","Judy","Sophia","Grace","Denise","Amber","Doris","Marilyn","Danielle","Beverly","Isabella","Theresa","Diana","Natalie","Brittany","Charlotte","Marie","Kayla","Alexis","Lori"];
    return (sex == "F" || sex == "f") ? (f_names[Math.floor(Math.random() * f_names.length)]) : (m_names[Math.floor(Math.random() * m_names.length)])
}

// Get a random middle name from a list of the most popular US middle names


function getRandomMiddleName(sex) {
    m_names = ["James","John","William","Thomas","David","Robert","Edward","Peter","Lee","Christopher","Alexander","Michael","Daniel"];
    f_names = ["Louise","Rose","Grace","Jane","Elizabeth","Anne","Ann","May","Mae","Marie","Mary","Amy","Catherine","Victoria","Kate"];

    return (sex == "F" || sex == "f") ? (f_names[Math.floor(Math.random() * f_names.length)]) : (m_names[Math.floor(Math.random() * m_names.length)])
}



function showInputDataAlert(msg) {
    if (typeof showToast === 'function') {
        showToast(msg, 'warning');
    } else {
        console.warn('State Calculator Alert:', msg);
    }
}

function makeRandomDOE_AL() {
    var date = "";
    var dateOfIssue = getTargetElement("inputIssueDate").value;
    if (dateOfIssue.length == 8) {
        date += dateOfIssue.slice(0, 2); // same month
        date += ("0" + (parseInt(dateOfIssue.slice(2, 4)) - 1)).slice(-2); // previos day
        date += parseInt(dateOfIssue.slice(-4)) + 4;  // year += 4
    }

    getTargetElement("inputExpiryDate").value = date
}


/*
$$$$$$ $$      $$$$  $$$$$  $$$$$$ $$$$$   $$$$ 
$$     $$     $$  $$ $$  $$   $$   $$  $$ $$  $$
$$$$   $$     $$  $$ $$$$$    $$   $$  $$ $$$$$$
$$     $$     $$  $$ $$  $$   $$   $$  $$ $$  $$
$$     $$$$$$  $$$$  $$  $$ $$$$$$ $$$$$  $$  $$
*/

// =============== FLORIDA (FL) ============== //



function AZ_makeRandomDOE() {
    var dateOfBirth = getTargetElement("inputBrithDate").value;
    if (!dateOfBirth) {
        makeRandomDOB();
        dateOfBirth = getTargetElement("inputBrithDate").value;
    }

    if (dateOfBirth.length > 4) {
        date = dateOfBirth.slice(0,4);
    } else { return; }

    var dateOfIssue = getTargetElement("inputIssueDate").value;

    dob_year = parseInt(dateOfBirth.slice(-4));
    issue_year = (dob_year + 65).toString();

    getTargetElement("inputExpiryDate").value = dateOfBirth.slice(0,4) + issue_year;
}




    // 4. State Calculation Algorithms
function CA_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputICN").value = issueDate.slice(-2)
            + getNumberOfDaysFromBeginnigOfYear(issueDate) + documentNumber + "0401";
}



function CA_calculate_DD() {

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    const suff_alphabet = ["AA", "AA", "AA"];
    suffix =  suff_alphabet[Math.floor(Math.random() * suff_alphabet.length)];

    fullIssueDate = issueDate.slice(0, 2) + "/" + issueDate.slice(2, 4) + "/" + issueDate.slice(-4);

    getTargetElement('inputDD').value = fullIssueDate + getRandomNumericString(5) + "/" + suffix + "FD/" + expiryDate.slice(-2);
}



function CA_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(7);
}


/*
$$   $ $$$$$$  $$$$   $$$$  $$$$$$  $$$$   $$$$  $$$$$$ $$$$$  $$$$$  $$$$$$
$$$ $$   $$   $$     $$       $$   $$     $$       $$   $$  $$ $$  $$   $$ 
$$ $ $   $$    $$$$   $$$$    $$    $$$$   $$$$    $$   $$$$$  $$$$$    $$ 
$$   $   $$       $$     $$   $$       $$     $$   $$   $$     $$       $$ 
$$   $ $$$$$$  $$$$   $$$$  $$$$$$  $$$$   $$$$  $$$$$$ $$     $$     $$$$$$
*/

// ========================== MISSISSIPPI (MS) =========================== //



function MS_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "80" + getRandomNumericString(7);
}



function MS_calculate_ICN() {
    getTargetElement("inputICN").value = "05100" + getRandomNumericString(6) + "23" + getRandomNumericString(3);
}



function MS_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!")
        return;
    }

    var sex = getTargetElement('inputSex').value;

    s = "";
    for(var i = 0; i < 7; i++) { s += getRandomLetterAndDigit(); }

    d = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)))).slice(-3);

    getTargetElement('inputDD').value = birthDate.slice(-2, -1) + getRandomLetter() + s + birthDate.slice(-1)
        + lastName[0] + firstName[0] + issueDate.slice(-2) + d + sex
        + expiryDate.slice(-2) + expiryDate.slice(2,4) + get_letter_corresponding_month(expiryDate.slice(0,2));
}



/*
 $$$$  $$      $$$$  $$$$$   $$$$  $$   $  $$$$ 
$$  $$ $$     $$  $$ $$  $$ $$  $$ $$$ $$ $$  $$
$$$$$$ $$     $$$$$$ $$$$$  $$$$$$ $$ $ $ $$$$$$
$$  $$ $$     $$  $$ $$  $$ $$  $$ $$   $ $$  $$
$$  $$ $$$$$$ $$  $$ $$$$$  $$  $$ $$   $ $$  $$
*/

// ============== ALABAMA (AL) ============== //



function AL_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function AL_calculate_ICN() {
    getTargetElement("inputICN").value = "0000000000" + getRandomNumericString(7) + "401";
}



function AL_2024_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}



function AL_2024_calculate_ICN() {

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    days = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 4)).slice(-3);


    getTargetElement("inputICN").value = documentNumber + getRandomNumericString(5) + issueDate.slice(-2) + days + "01";
}



function FL_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomLetter() + getRandomNumericString(12);
    }
}

function FL_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "0100" + getRandomNumericString(12);
    }
}

function FL_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262021";
        if (issueEl) issueEl.value = issueDate;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = getRandomLetter() + getRandomNumericString(2) 
            + issueDate.slice(-2) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(4);
    }
}

function TX_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = getRandomNumericString(8);
}

function TX_calculate_DD_improved() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    var year = issueDate.slice(-2);
    var month = issueDate.slice(0, 2);
    var day = issueDate.slice(2, 4);

    var el = getTargetElement("inputDD");
    if (el) el.value = '006' + year[0] + '9' + year[1] + '8' + month[0] + '0' + month[1] + '5' + day[0] + '0' + day[1] + getRandomNumericString(6);
}

function TX_calculate_DD() {
    var el = getTargetElement("inputDD");
    if (el) el.value = getRandomNumericString(20);
}

function TX_2016_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!");
        return;
    }
    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 1);
    
    var year = issueDateDATE.toLocaleString("default", { year: "numeric" });
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });
    var formattedDate = year + month + day;

    var el = getTargetElement("inputICN");
    if (el) el.value = documentNumber + "  " + formattedDate;
}

function TX_2020_calculate_ICN() {
    var el = getTargetElement("inputICN");
    if (el) el.value = "10000" + getRandomNumericString(6);
}

function IL_calculate_documentNumber() {
    var lastName = getTargetElement("inputLastName").value;
    if (lastName == '') {
        showInputDataAlert("Document number calculation error. Last Name is not specified!")
        return;
    }
    
    getTargetElement('inputDocumentNumber').value = lastName[0].toUpperCase() + getRandomNumericString(11);
}



function IL_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 12) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "IL"
     + getRandomLetter() + getRandomLetterAndDigit() + getRandomLetter() + getRandomLetter() + "01"
}




function IL_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4)
     + getRandomNumericString(3) + getRandomLetter() + getRandomLetter() + getRandomNumericString(4);
}


/*
$$   $  $$$$   $$$$  $$  $$ $$$$$$ $$  $$  $$$$  $$$$$$  $$$$  $$  $$
$$   $ $$  $$ $$     $$  $$   $$   $$$ $$ $$       $$   $$  $$ $$$ $$
$$ $ $ $$$$$$  $$$$  $$$$$$   $$   $$ $$$ $$ $$$   $$   $$  $$ $$ $$$
$$$$$$ $$  $$     $$ $$  $$   $$   $$  $$ $$  $$   $$   $$  $$ $$  $$
 $$ $$ $$  $$  $$$$  $$  $$ $$$$$$ $$  $$  $$$$    $$    $$$$  $$  $$
*/

// ================== WASHINGTON (WA) ================== //




function WA_calculate_documentNumber() {
    var random_string = "";
    for (var i = 0; i < 8; i++) { random_string += getRandomLetterAndDigit(); }
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = "WDL" + random_string + "B";
}

function WA_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 12) {
        showInputDataAlert("DD calculation error. Incorrect document number!");
        return;
    }
    var auditInfo = getTargetElement("inputAudit").value;
    if (auditInfo.length != 13) {
        showInputDataAlert("DD calculation error. Incorrect audit information!");
        return;
    }
    var el = getTargetElement("inputDD");
    if (el) el.value = documentNumber + auditInfo;
}

function WA_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!");
        return;
    }
    var el = getTargetElement("inputAudit");
    if (el) el.value = getRandomLetter() + issueDate.slice(0, 2) + issueDate.slice(2, 4) + issueDate.slice(-2) + "98" + getRandomNumericString(4);
}

function WA_calculate_AUDIT_with_P() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!");
        return;
    }
    var el = getTargetElement("inputAudit");
    if (el) el.value = 'P' + issueDate.slice(0, 2) + issueDate.slice(2, 4) + issueDate.slice(-2) + getRandomNumericString(6);
}

function GA_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "0" + getRandomNumericString(8);
    }
}

function GA_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "1000" + getRandomNumericString(7);
    }
}

function GA_calculate_DD() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = getRandomNumericString(11) + "00" + getRandomNumericString(5);
    }
}

function GA_calculate_ICN_2015() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "2" + getRandomNumericString(9) + "100401";
    }
}

function GA_calculate_DD_2015() {
    var icnEl = getTargetElement("inputICN");
    var icn = icnEl ? icnEl.value.trim() : "";
    if (icn.length != 16) {
        icn = "2" + getRandomNumericString(9) + "100401";
        if (icnEl) icnEl.value = icn;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = icn.slice(0, -2) + getRandomNumericString(4);
    }
}

function OH_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomLetter() + getRandomLetter() + getRandomNumericString(6);
    }
}

function OH_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = getRandomLetter() + getRandomNumericString(8);
    }
}

function OH_calculate_DD() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "0" + getRandomNumericString(7) + "0";
    }
}

function CO_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(9);
}



function CO_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(7);
}




function CO_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!")
        return;
    }

    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 1)

    // Get year, month, and day part from the date
    var year = issueDateDATE.toLocaleString("default", { year: "2-digit" });
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = month + day + year;

    getTargetElement("inputAudit").value = "CODL_0_" + formattedDate + "_" + getRandomNumericString(5);
}



/*
 $$$$  $$$$$  $$$$$$ $$$$$$  $$$$  $$  $$  $$$$
$$  $$ $$  $$   $$      $$  $$  $$ $$$ $$ $$  $$
$$$$$$ $$$$$    $$     $$   $$  $$ $$ $$$ $$$$$$
$$  $$ $$  $$   $$    $$    $$  $$ $$  $$ $$  $$
$$  $$ $$  $$ $$$$$$ $$$$$$  $$$$  $$  $$ $$  $$
*/

// =============== ARIZONA (AZ) ============== //



function AZ_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "D" + getRandomNumericString(8);
}



function AZ_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputICN").value = issueDate.slice(-2) + getNumberOfDaysFromBeginnigOfYear(issueDate) + "AZ00" + getRandomNumericString(7) + "0301"
}



function AZ_2023_calculate_ICN() {
    getTargetElement("inputICN").value = '48' + getRandomNumericString(9);
}



function AZ_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName.length) {
        showInputDataAlert("DD calculation error. Incorrect First name!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName.length) {
        showInputDataAlert("DD calculation error. Incorrect Last name!")
        return;
    }

    getTargetElement("inputDD").value = getRandomNumericString(4) + getRandomLetter() + getRandomLetter()
    + getRandomNumericString(3) + lastName.slice(0,1) + getRandomNumericString(4) + firstName.slice(0,1) + birthDate.slice(-1);
}


/*
$$$$$  $$$$$ $$  $$ $$  $$  $$$$  $$  $$ $$     $$  $$  $$$$  $$  $$ $$$$$$  $$$$
$$  $$ $$    $$$ $$ $$$ $$ $$      $$$$  $$     $$  $$ $$  $$ $$$ $$   $$   $$  $$
$$$$$  $$$$  $$ $$$ $$ $$$  $$$$    $$   $$     $$  $$ $$$$$$ $$ $$$   $$   $$$$$$
$$     $$    $$  $$ $$  $$     $$   $$   $$      $$$$  $$  $$ $$  $$   $$   $$  $$
$$     $$$$$ $$  $$ $$  $$  $$$$    $$   $$$$$$   $$   $$  $$ $$  $$ $$$$$$ $$  $$
*/

// ============================== PENNSYLVANIA (PA) ============================ //




function PA_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomNumericString(8);
    }
}

function PA_calculate_ICN() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "02500" + getRandomNumericString(6) + issueDate.slice(-2) + getRandomNumericString(3);
    }
}

function PA_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var days = typeof getNumberOfDaysFromBeginnigOfYear === 'function' ? getNumberOfDaysFromBeginnigOfYear(issueDate) : "239";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = issueDate.slice(-2) + days + getRandomNumericString(10) + "00000" + getRandomNumericString(5);
    }
}

function NC_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "00000" + getRandomNumericString(7);
    }
}

function NC_calculate_ICN() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl ? docEl.value.trim() : "";
    if (doc.length != 12) {
        doc = "00000" + getRandomNumericString(7);
        if (docEl) docEl.value = doc;
    }
    var rand = "";
    for (var i = 0; i < 4; i++) { rand += getRandomLetterAndDigit(); }
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = doc + "NC" + rand + "01";
    }
}

function NC_calculate_DD() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "001" + getRandomNumericString(7);
    }
}

function MA_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "S" + getRandomNumericString(8);
}



function MA_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputICN").value = issueDate.slice(-2) + getNumberOfDaysFromBeginnigOfYear(issueDate) + documentNumber + "0601";
}



function MA_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate + " REV 02222016";
}



/*
 $$$$   $$$$  $$  $$ $$  $$ $$$$$  $$$$  $$$$$$ $$$$$$  $$$$  $$  $$ $$$$$$
$$  $$ $$  $$ $$$ $$ $$$ $$ $$    $$  $$   $$     $$   $$  $$ $$  $$   $$
$$     $$  $$ $$ $$$ $$ $$$ $$$$  $$       $$     $$   $$     $$  $$   $$
$$  $$ $$  $$ $$  $$ $$  $$ $$    $$  $$   $$     $$   $$  $$ $$  $$   $$
 $$$$   $$$$  $$  $$ $$  $$ $$$$$  $$$$    $$   $$$$$$  $$$$   $$$$    $$
*/




function CT_calculate_documentNumber() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("Document number calculation error. Incorrect birth date!")
        return;
    }

    getTargetElement('inputDocumentNumber').value = get_month_number(birthDate) + getRandomNumericString(7);
}




function CT_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "CT" + getRandomDigit() + getRandomLetter() + getRandomLetter() + getRandomLetter() + "01";
}



function CT_calculate_DD(btn) {
    const ui = (typeof getCalcUi === 'function' && btn) ? getCalcUi(btn) : null;
    if (ui && ui.btn && ui.btn.classList && ui.btn.classList.contains("loading")) return;

    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "07262024";
        if (issueEl) issueEl.value = issueDate;
    }
    if (ui && ui.setLoading) ui.setLoading(true);

    const hh = Math.floor(Math.random() * 3) + 12; // 12-14
    const mm = Math.floor(Math.random() * 60);
    const ss = Math.floor(Math.random() * 60);

    const timeCode =
      String(hh).padStart(2, "0") +
      String(mm).padStart(2, "0") +
      String(ss).padStart(2, "0");

    try {
        var ddEl = getTargetElement("inputDD");
        if (ddEl) {
            ddEl.value = issueDate.slice(-2) + issueDate.slice(0,2) + issueDate.slice(2,4) 
                + timeCode + "01" + "MV" + getRandomLetter() + getRandomDigit();
        }
        if (ui && ui.showTemp && ui.ok) ui.showTemp(ui.ok);
    } catch(e) {
        if (ui && ui.showTemp && ui.err) ui.showTemp(ui.err);
    } finally {
        if (ui && ui.setLoading) ui.setLoading(false);
    }
}



/*
 $$$$  $$$$$  $$$$$  $$$$   $$$$  $$  $$
$$  $$ $$  $$ $$    $$     $$  $$ $$$ $$
$$  $$ $$$$$  $$$$  $$ $$$ $$  $$ $$ $$$
$$  $$ $$  $$ $$    $$  $$ $$  $$ $$  $$
 $$$$  $$  $$ $$$$$  $$$$   $$$$  $$  $$
*/




function OR_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomNumericString(7);
    }
}

function OR_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "AA" + getRandomNumericString(7);
    }
}

function OR_calculate_DD() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "200" + getRandomNumericString(6);
    }
}

function NV_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "1" + getRandomNumericString(9);
    }
}

function NV_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "0015" + getRandomNumericString(7) + "01";
    }
}

function NV_2021_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "0019" + getRandomNumericString(7) + "01";
    }
}

function NY_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "7" + getRandomNumericString(8);
    }
}

function NY_calculate_DD() {
    var s = "";
    for (var i = 0; i < 8; i++) { s += getRandomLetterAndDigit(); }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = s + "06";
    }
}

function ME_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function ME_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 7) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    d = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 4)).slice(-3);

    getTargetElement("inputICN").value = "F" + issueDate.slice(-2) + d + documentNumber + "0101";
}



function ME_calculate_DD() {
    getTargetElement("inputDD").value = "00000000000000000" + getRandomNumericString(8);
}



/*
$$   $ $$$$$$ $$  $$ $$  $$ $$$$$  $$$$   $$$$  $$$$$$  $$$$
$$$ $$   $$   $$$ $$ $$$ $$ $$    $$     $$  $$   $$   $$  $$
$$ $ $   $$   $$ $$$ $$ $$$ $$$$   $$$$  $$  $$   $$   $$$$$$
$$   $   $$   $$  $$ $$  $$ $$        $$ $$  $$   $$   $$  $$
$$   $ $$$$$$ $$  $$ $$  $$ $$$$$  $$$$   $$$$    $$   $$  $$
*/




function MN_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(12);
}



function MN_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 13) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    d = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 3)).slice(-3);

    getTargetElement("inputICN").value = documentNumber + "01" + d + "01";
}



function MN_calculate_DD() {
    getTargetElement("inputDD").value = "0000000" + getRandomNumericString(7);
}



/*
$$  $$  $$$$  $$$$$  $$$$$$ $$  $$      $$$$$   $$$$  $$  $$  $$$$  $$$$$$  $$$$
$$$ $$ $$  $$ $$  $$   $$   $$  $$      $$  $$ $$  $$ $$ $$  $$  $$   $$   $$  $$
$$ $$$ $$  $$ $$$$$    $$   $$$$$$      $$  $$ $$$$$$ $$$$   $$  $$   $$   $$$$$$
$$  $$ $$  $$ $$  $$   $$   $$  $$      $$  $$ $$  $$ $$ $$  $$  $$   $$   $$  $$
$$  $$  $$$$  $$  $$   $$   $$  $$      $$$$$  $$  $$ $$  $$  $$$$    $$   $$  $$
*/




function ND_calculate_documentNumber() {
    var dobEl = getTargetElement("inputBrithDate");
    var birthDate = dobEl && dobEl.value.length === 8 ? dobEl.value.trim() : "01151970";
    var lastEl = getTargetElement("inputLastName");
    var lastName = (lastEl && lastEl.value ? lastEl.value.trim() : "DOE") + "XX";
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = lastName.slice(0, 3).toUpperCase() + birthDate.slice(-2) + getRandomNumericString(4);
    }
}

function ND_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "034001" + getRandomNumericString(10);
    }
}

function ND_2023_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "05100" + getRandomNumericString(11);
    }
}

function ND_calculate_DD() {
    var dobEl = getTargetElement("inputBrithDate");
    var birthDate = dobEl && dobEl.value.length === 8 ? dobEl.value.trim() : "01151970";
    var expEl = getTargetElement("inputExpiryDate");
    var expiryDate = expEl && expEl.value.length === 8 ? expEl.value.trim() : "01152026";
    var hEl = getTargetElement("inputHeight");
    var height = hEl && hEl.value ? hEl.value.trim() : "69";
    var docEl = getTargetElement("inputDocumentNumber");
    var documentNumber = docEl && docEl.value.length === 9 ? docEl.value.trim() : "DOE707980";
    var lastEl = getTargetElement("inputLastName");
    var lastName = lastEl && lastEl.value ? lastEl.value.trim() : "DOE";
    var firstEl = getTargetElement("inputFirstName");
    var firstName = firstEl && firstEl.value ? firstEl.value.trim() : "JOHN";
    var sexEl = getTargetElement("inputSex");
    var sex = sexEl && sexEl.value ? sexEl.value.trim() : "M";
    var sex_digit = (sex === "M" || sex === "1") ? "5" : "1";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = birthDate.slice(-2, -1) + documentNumber + lastName[0].toUpperCase() + firstName[0].toUpperCase()
            + sex_digit + "2" + expiryDate.slice(-1) + expiryDate.slice(2, 4) + getRandomLetter().toLowerCase() + getRandomLetter() + height + "NDZ";
    }
}

function ND_2023_calculate_DD() {
    var dobEl = getTargetElement("inputBrithDate");
    var birthDate = dobEl && dobEl.value.length === 8 ? dobEl.value.trim() : "01151970";
    var expEl = getTargetElement("inputExpiryDate");
    var expiryDate = expEl && expEl.value.length === 8 ? expEl.value.trim() : "01152029";
    var hEl = getTargetElement("inputHeight");
    var height = hEl && hEl.value ? hEl.value.trim() : "69";
    var docEl = getTargetElement("inputDocumentNumber");
    var documentNumber = docEl && docEl.value.length === 9 ? docEl.value.trim() : "DOE707980";
    var lastEl = getTargetElement("inputLastName");
    var lastName = lastEl && lastEl.value ? lastEl.value.trim() : "DOE";
    var firstEl = getTargetElement("inputFirstName");
    var firstName = firstEl && firstEl.value ? firstEl.value.trim() : "JOHN";
    var sexEl = getTargetElement("inputSex");
    var sex = sexEl && sexEl.value ? sexEl.value.trim() : "M";
    var sex_digit = (sex === "M" || sex === "1") ? "5" : "1";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = birthDate.slice(-2, -1) + documentNumber + lastName[0].toUpperCase() + firstName[0].toUpperCase()
            + sex_digit + "2" + expiryDate.slice(-1) + expiryDate.slice(2, 4) + getRandomLetter().toLowerCase() + getRandomLetter() + height + "YDZ";
    }
}

function ND_calculate_optionNumber() {
    var optEl = getTargetElement("inputOption");
    if (optEl) {
        optEl.value = getRandomNumericString(3);
    }
}

function NE_calculate_documentNumber() {
    const alphabet = "ABCEGHV";
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = alphabet[Math.floor(Math.random() * alphabet.length)] + getRandomNumericString(8);
    }
}

function NE_2021_calculate_ICN() {
    var docEl = getTargetElement("inputDocumentNumber");
    var docNum = docEl ? docEl.value.trim() : "";
    if (docNum.length != 9) {
        NE_calculate_documentNumber();
        docNum = docEl ? docEl.value.trim() : "";
    }
    var icn = docNum + "NETYCO01";
    var icnEl = getTargetElement("inputICN");
    if (icnEl) icnEl.value = icn;
    NE_2021_calculate_DD();
}

function NE_2021_calculate_DD() {
    var icnEl = getTargetElement("inputICN");
    var icn = icnEl ? icnEl.value.trim() : "";
    if (icn.length != 17) {
        var docEl = getTargetElement("inputDocumentNumber");
        var docNum = docEl ? docEl.value.trim() : "";
        if (docNum.length != 9) {
            const alphabet = "ABCEGHV";
            docNum = alphabet[Math.floor(Math.random() * alphabet.length)] + getRandomNumericString(8);
            if (docEl) docEl.value = docNum;
        }
        icn = docNum + "NETYCO01";
        if (icnEl) icnEl.value = icn;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "054" + icn + getRandomNumericString(5);
    }
}

function NE_calculate_ICN() {
    var icn = "0540000" + getRandomNumericString(4) + "00000";
    var icnEl = getTargetElement("inputICN");
    if (icnEl) icnEl.value = icn;
    var ddEl = getTargetElement("inputDD");
    if (ddEl) ddEl.value = icn;
}

function NE_calculate_DD() {
    var icnEl = getTargetElement("inputICN");
    var icn = icnEl ? icnEl.value.trim() : "";
    if (icn.length != 16) {
        icn = "0540000" + getRandomNumericString(4) + "00000";
        if (icnEl) icnEl.value = icn;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) ddEl.value = icn;
}

function NH_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "NHL" + getRandomNumericString(8);
    }
}

function NH_calculate_ICN() {
    var icn = "0" + getRandomNumericString(7);
    var icnEl = getTargetElement("inputICN");
    if (icnEl) icnEl.value = icn;
    var ddEl = getTargetElement("inputDD");
    if (ddEl) ddEl.value = icn;
}

function NH_calculate_DD() {
    var icnEl = getTargetElement("inputICN");
    var icn = icnEl ? icnEl.value.trim() : "";
    if (icn.length != 8) {
        icn = "0" + getRandomNumericString(7);
        if (icnEl) icnEl.value = icn;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) ddEl.value = icn;
}

function SC_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "10" + getRandomNumericString(7);
    }
}

function SC_calculate_DD() {
    var expEl = getTargetElement("inputExpiryDate");
    var expiryDate = expEl && expEl.value.length === 8 ? expEl.value.trim() : "01152028";
    var rawDays = typeof getNumberOfDaysFromBeginnigOfYear === 'function' ? getNumberOfDaysFromBeginnigOfYear(expiryDate) : "015";
    var days = ("00" + rawDays).slice(-3);
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = getRandomNumericString(8) + expiryDate.slice(0, 2) + expiryDate.slice(-2) + days + getRandomNumericString(4);
    }
}

function TN_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomInt(2).toString() + getRandomNumericString(8);
    }
}

function TN_calculate_ICN() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262018";
    var days = typeof getNumberOfDaysFromBeginnigOfYear === 'function' ? getNumberOfDaysFromBeginnigOfYear(issueDate) : "238";
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = issueDate.slice(-2) + days + getRandomNumericString(9) + "0101";
    }
}

function TN_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262018";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = getRandomNumericString(2) + "0" + issueDate.slice(-2) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(7);
    }
}

function TN_calculate_REAL_ID(alert) {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262018";
    var inputDateObject = new Date(
        parseInt(issueDate.substr(4, 4), 10),
        parseInt(issueDate.substr(0, 2), 10) - 1,
        parseInt(issueDate.substr(2, 2), 10)
    );
    var comparisonDate = new Date(2019, 6, 1);
    var realEl = getTargetElement("inputIsRealID");
    if (realEl) {
        if (inputDateObject >= comparisonDate) {
            realEl.value = (realEl.tagName === 'SELECT' && realEl.querySelector('option[value="Yes"]')) ? "Yes" : "F";
        } else {
            realEl.value = (realEl.tagName === 'SELECT' && realEl.querySelector('option[value="No"]')) ? "No" : "N";
        }
    }
}

function VA_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = getRandomLetter() + getRandomNumericString(8);
}

function VA_calculate_ICN() {
    var el = getTargetElement("inputICN");
    if (el) el.value = "0060101" + getRandomNumericString(9);
}

function VA_calculate_DD() {
    var el = getTargetElement("inputDD");
    if (el) el.value = "0" + getRandomNumericString(8);
}

function MD_calculate_documentNumber() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("Document number calculation error. Incorrect First name!")
        return;
    }

    var middleName = getTargetElement("inputMiddleName").value;

    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    getTargetElement('inputDocumentNumber').value = CalculateDL(lastName, middleName, firstName, birthDate, "MD");
}



function MD_2021_calculate_documentNumber() {

    getTargetElement('inputDocumentNumber').value = "MD-" + getRandomNumericString(11);
}



function MD_calculate_ICN() {
    getTargetElement("inputICN").value = "100" + getRandomNumericString(7);
}



function MD_2021_calculate_ICN() {
    getTargetElement("inputICN").value = "1010" + getRandomNumericString(6);
}



function MD_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(6) + getRandomLetter() + getRandomLetter() + getRandomDigit();
}



function MD_2021_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(9);
}

/*
$$   $ $$$$$$  $$$$  $$  $$ $$$$$$  $$$$  $$$$  $$  $$
$$$ $$   $$   $$  $$ $$  $$   $$   $$     $$  $$ $$$ $$
$$ $ $   $$   $$     $$$$$$   $$   $$ $$$ $$$$$$ $$ $$$
$$   $   $$   $$  $$ $$  $$   $$   $$  $$ $$  $$ $$  $$
$$   $ $$$$$$  $$$$  $$  $$ $$$$$$  $$$$  $$  $$ $$  $$
*/



function MI_calculate_documentNumber() {
    var lastNameEl = getTargetElement("inputLastName");
    var firstNameEl = getTargetElement("inputFirstName");
    var birthEl = getTargetElement("inputBrithDate");
    var lastName = lastNameEl ? lastNameEl.value : "";
    var firstName = firstNameEl ? firstNameEl.value : "";
    var middleName = getTargetElement("inputMiddleName") ? getTargetElement("inputMiddleName").value : "";
    var birthDate = birthEl ? birthEl.value : "";

    if (!lastName || !firstName || birthDate.length != 8) {
        var docEl = getTargetElement('inputDocumentNumber');
        if (docEl) docEl.value = getRandomLetter() + getRandomNumericString(12);
        return;
    }

    getTargetElement('inputDocumentNumber').value = CalculateDL(lastName, middleName, firstName, birthDate, "MI");
}



function MI_calculate_ICN() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect birth date!");
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect expiry date!");
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    var cleanDoc = documentNumber.replace(/\s/g, '');
    if (cleanDoc.length != 13) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }

    getTargetElement("inputICN").value = cleanDoc
     + birthDate.slice(-4) + birthDate.slice(0,2) + birthDate.slice(2,4) + expiryDate.slice(-2) + expiryDate.slice(0,2);
}


/*
$$  $$ $$$$$ $$   $    $$$$$$ $$$$$ $$$$$   $$$$  $$$$$ $$  $$
$$$ $$ $$    $$   $        $$ $$    $$  $$ $$     $$     $$$$
$$ $$$ $$$$  $$ $ $        $$ $$$$  $$$$$   $$$$  $$$$    $$
$$  $$ $$    $$$$$$    $$  $$ $$    $$  $$     $$ $$      $$
$$  $$ $$$$$  $$ $$     $$$$  $$$$$ $$  $$  $$$$  $$$$$   $$
*/




function NJ_2020_calculate_documentNumber() {
    var lastEl = getTargetElement("inputLastName");
    var lastName = lastEl ? lastEl.value.trim() : "";
    var initial = lastName ? lastName[0].toUpperCase() : "D";
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = initial + getRandomNumericString(14);
    }
}

function NJ_2020_calculate_ICN() {
    var lastEl = getTargetElement("inputLastName");
    var lastName = lastEl ? lastEl.value.trim() : "";
    var initial = lastName ? lastName[0].toUpperCase() : "D";
    var rand = "";
    for (var i = 0; i < 13; i++) { rand += getRandomLetterAndDigit(); }
    var icn = initial + rand + "8M01";
    var icnEl = getTargetElement("inputICN");
    if (icnEl) icnEl.value = icn;
}

function NJ_2020_calculate_DD() {
    var opt1El = getTargetElement("inputOption1");
    var option1 = opt1El ? opt1El.value.trim() : "";
    if (!option1) {
        option1 = "WV";
        if (opt1El) opt1El.value = option1;
    }
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262020";
        if (issueEl) issueEl.value = issueDate;
    }
    var days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate));
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = option1.slice(-2) + issueDate.slice(-4) + ("00" + days.toString()).slice(-3) + "0000" + getRandomNumericString(4);
    }
}

function WI_calculate_documentNumber() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!");
        return;
    }
    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("Document number calculation error. Incorrect First name!");
        return;
    }
    var middleName = getTargetElement("inputMiddleName").value;
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("Document number calculation error. Incorrect birth date!");
        return;
    }
    var el = getTargetElement('inputDocumentNumber');
    if (typeof CalculateDL === 'function') {
        el.value = CalculateDL(lastName, middleName, firstName, birthDate, "WI");
    } else {
        el.value = getRandomLetter() + getRandomNumericString(13);
    }
}

function WI_calculate_ICN() {
    var el = getTargetElement("inputICN");
    if (el) el.value = "0130100" + getRandomNumericString(9);
}

function WI_calculate_DD() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    var sampleVal = (Math.random() < 0.5) ? "10" : "15";
    var el = getTargetElement("inputDD");
    if (el) el.value = "OT" + lastName[0].toUpperCase() + getRandomLetter() + getRandomLetter() + issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + sampleVal + getRandomNumericString(6);
}

function UT_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = "1" + getRandomNumericString(8);
}

function UT_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    var el = getTargetElement("inputICN");
    if (el) el.value = documentNumber + "UT" + getRandomDigit() + getRandomDigit() + "SL01";
}

function UT_calculate_DD() {
    var el = getTargetElement("inputDD");
    if (el) el.value = getRandomNumericString(8);
}

function UT_2016_calculate_REAL_ID(alert) {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        if (alert) { showInputDataAlert("REAL ID calculation error. Incorrect issue date!"); }
        return;
    }
    var inputDateObject = new Date(
        parseInt(issueDate.substr(4, 4)),
        parseInt(issueDate.substr(0, 2)) - 1,
        parseInt(issueDate.substr(2, 2))
    );
    var comparisonDate = new Date(2019, 1, 1);
    var val = (inputDateObject >= comparisonDate) ? "F" : "N";
    var el = getTargetElement("inputIsRealID");
    if (el) el.value = val;
    var aamvaRealId = getTargetElement("aamva-realid");
    if (aamvaRealId) aamvaRealId.value = (val === 'F') ? "Yes" : "No";
}

function AR_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "9" + getRandomNumericString(8);
}



function AR_calculate_ICN() {
    getTargetElement("inputICN").value = "021011" + getRandomNumericString(10);
}



function AR_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(9) + " " + getRandomNumericString(4);
}


/*
$$$$$$ $$$$$   $$$$  $$  $$  $$$$
  $$   $$  $$ $$  $$ $$  $$ $$  $$
  $$   $$  $$ $$$$$$ $$$$$$ $$  $$
  $$   $$  $$ $$  $$ $$  $$ $$  $$
$$$$$$ $$$$$  $$  $$ $$  $$  $$$$
*/



function ID_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomLetter() + getRandomNumericString(6) + getRandomLetter();
}



function ID_calculate_ICN() {
    getTargetElement("inputICN").value = "000" + getRandomNumericString(7);
}



function ID_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = "010" + issueDate.slice(-2) + getRandomNumericString(3) + "00" + getRandomNumericString(2);
}



function ID_calculate_ICN_2023() {
    getTargetElement("inputICN").value = "MT" + getRandomNumericString(6) + "H" + getRandomNumericString(6) + "001";
}



function ID_calculate_DD_2023() {
    getTargetElement("inputDD").value = getRandomNumericString(15)
}



/*
$$   $  $$$$  $$  $$ $$$$$$  $$$$  $$  $$  $$$$
$$$ $$ $$  $$ $$$ $$   $$   $$  $$ $$$ $$ $$  $$
$$ $ $ $$  $$ $$ $$$   $$   $$$$$$ $$ $$$ $$$$$$
$$   $ $$  $$ $$  $$   $$   $$  $$ $$  $$ $$  $$
$$   $  $$$$  $$  $$   $$   $$  $$ $$  $$ $$  $$
*/




function MT_calculate_documentNumber() {
    var dobEl = getTargetElement("inputBrithDate");
    var birthDate = dobEl ? dobEl.value.trim() : "";
    if (birthDate.length != 8) {
        birthDate = "01151970";
        if (dobEl) dobEl.value = birthDate;
    }
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = birthDate.slice(0, 2) + getRandomNumericString(3) + birthDate.slice(-4) + "41" + birthDate.slice(3, 5);
    }
}

function MT_calculate_ICN() {
    var data1 = "";
    for (var i = 0; i < 6; i++) { data1 += getRandomLetterAndDigit(); }
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "1100" + getRandomDigit() + data1 + "FMT" + getRandomLetterAndDigit() + getRandomLetter() + getRandomLetter() + "001";
    }
}

function MT_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262020";
        if (issueEl) issueEl.value = issueDate;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(12);
    }
}

function IN_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(4) + "-" + getRandomNumericString(2) + "-" + getRandomNumericString(4);
}



function IN_calculate_ICN() {
    getTargetElement("inputICN").value = "03701" + getRandomNumericString(11);
}



function IN_calculate_DD() {
    var issuigOfficeCode = getTargetElement("inputOfficeCode").value;
    if (issuigOfficeCode.length != 3) {
        showInputDataAlert("DD calculation error. Issuing office code!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(0,2) + issueDate.slice(2, 4) + issueDate.slice(-2) + issuigOfficeCode + "00" + getRandomNumericString(3);
}


/*
$$  $$ $$$$$ $$   $    $$   $ $$$$$ $$  $$ $$$$$$  $$$$   $$$$
$$$ $$ $$    $$   $    $$$ $$ $$     $$$$    $$   $$  $$ $$  $$
$$ $$$ $$$$  $$ $ $    $$ $ $ $$$$    $$     $$   $$     $$  $$
$$  $$ $$    $$$$$$    $$   $ $$     $$$$    $$   $$  $$ $$  $$
$$  $$ $$$$$  $$ $$    $$   $ $$$$$ $$  $$ $$$$$$  $$$$   $$$$
*/



function NM_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "0" + getRandomNumericString(8);
    }
}

function NM_calculate_ICN() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl ? docEl.value.trim() : "";
    if (doc.length != 9) {
        doc = "0" + getRandomNumericString(8);
        if (docEl) docEl.value = doc;
    }
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = doc + "01";
    }
}

function NM_calculate_DD() {
    var officeEl = getTargetElement("inputOfficeCode");
    var issuigOfficeCode = officeEl ? officeEl.value.trim() : "";
    if (issuigOfficeCode.length != 3) {
        issuigOfficeCode = "100";
        if (officeEl) officeEl.value = issuigOfficeCode;
    }

    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08232019";
        if (issueEl) issueEl.value = issueDate;
    }

    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = issueDate.slice(0,2) + issueDate.slice(2, 4) + issueDate.slice(-2) + issuigOfficeCode + "00" + getRandomNumericString(3);
    }
}


/*
$$$$$  $$  $$  $$$$  $$$$$  $$$$$    $$$$$$  $$$$  $$      $$$$  $$  $$ $$$$$
$$  $$ $$  $$ $$  $$ $$  $$ $$         $$   $$     $$     $$  $$ $$$ $$ $$  $$
$$$$$  $$$$$$ $$  $$ $$  $$ $$$$       $$    $$$$  $$     $$$$$$ $$ $$$ $$  $$
$$  $$ $$  $$ $$  $$ $$  $$ $$         $$       $$ $$     $$  $$ $$  $$ $$  $$
$$  $$ $$  $$  $$$$  $$$$$  $$$$$    $$$$$$  $$$$  $$$$$$ $$  $$ $$  $$ $$$$$
*/




function RI_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomNumericString(7);
    }
}

function RI_calculate_ICN() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl ? docEl.value.trim() : "";
    if (doc.length != 7 && doc.length != 8) {
        doc = getRandomNumericString(7);
        if (docEl) docEl.value = doc;
    }
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "0" + doc + "RI" + getRandomLetter() + getRandomLetter() + "TL01";
    }
}

function RI_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var issue_year = parseInt(issueDate.slice(-4), 10);
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        if (issue_year > 2017) {
            ddEl.value = getRandomNumericString(6);
        } else {
            var docEl = getTargetElement("inputDocumentNumber");
            var doc = docEl && docEl.value.length === 7 ? docEl.value.trim() : "3755008";
            ddEl.value = doc + issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(6);
        }
    }
}

function RI_calculate_DD_2022() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = getRandomNumericString(7);
    }
}

function DC_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = getRandomNumericString(7);
}

function DC_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit calculation error. Incorrect issue date!");
        return;
    }
    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 5);
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });
    var formattedDate = month + day + issueDate.slice(-4);

    var el = getTargetElement("inputAudit");
    if (el) el.value = formattedDate + "_" + getRandomNumericString(6) + "_" + getRandomDigit() + "_" + getRandomNumericString(3);
}

function DC_calculate_DD() {
    var el = getTargetElement("inputDD");
    if (el) el.value = getRandomNumericString(8);
}

function LA_calculate_documentNumber() {
    const alphabet = ["00", "01"];
    getTargetElement('inputDocumentNumber').value = alphabet[Math.floor(Math.random() * alphabet.length)] + getRandomNumericString(7);
}



function LA_calculate_ICN() {
    getTargetElement("inputICN").value = "00700" + getRandomNumericString(11);
}



function LA_calculate_AUDIT() {
    getTargetElement("inputAudit").value = getRandomNumericString(4);
}



function LA_calculate_OfficeCode() {
    getTargetElement("inputOfficeCode").value = "0" + getRandomInt2(21, 35).toString();
}

/*
$$   $ $$$$$$  $$$$   $$$$   $$$$  $$  $$ $$$$$  $$$$$$
$$$ $$   $$   $$     $$     $$  $$ $$  $$ $$  $$   $$
$$ $ $   $$    $$$$   $$$$  $$  $$ $$  $$ $$$$$    $$
$$   $   $$       $$     $$ $$  $$ $$  $$ $$  $$   $$
$$   $ $$$$$$  $$$$   $$$$   $$$$   $$$$  $$  $$_$$$$$$
*/



function MO_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomLetter() + "1" + getRandomNumericString(8);
    }
}

function MO_2020_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomLetter() + "0" + getRandomNumericString(8);
    }
}

function MO_calculate_ICN() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262018";
        if (issueEl) issueEl.value = issueDate;
    }
    var docEl = getTargetElement("inputDocumentNumber");
    var docNum = docEl ? docEl.value.trim() : "";
    if (docNum.length != 10) {
        docNum = getRandomLetter() + "1" + getRandomNumericString(8);
        if (docEl) docEl.value = docNum;
    }
    var days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 1;
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = issueDate.slice(-2) + ("00" + days.toString()).slice(-3) + docNum + "0101";
    }
}

function MO_2020_calculate_ICN() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262020";
        if (issueEl) issueEl.value = issueDate;
    }
    var docEl = getTargetElement("inputDocumentNumber");
    var docNum = docEl ? docEl.value.trim() : "";
    if (docNum.length != 10) {
        docNum = getRandomLetter() + "0" + getRandomNumericString(8);
        if (docEl) docEl.value = docNum;
    }
    var days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 2;
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = issueDate.slice(-2) + ("00" + days.toString()).slice(-3) + docNum + "0101";
    }
}

function MO_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262018";
        if (issueEl) issueEl.value = issueDate;
    }
    var docEl = getTargetElement("inputDocumentNumber");
    var docNum = docEl ? docEl.value.trim() : "";
    if (docNum.length != 10) {
        docNum = getRandomLetter() + "1" + getRandomNumericString(8);
        if (docEl) docEl.value = docNum;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = issueDate.slice(-2) + docNum.slice(1, 4) + getNumberOfDaysFromBeginnigOfYear(issueDate) + "00" + getRandomNumericString(2);
    }
}

function MO_2020_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262020";
        if (issueEl) issueEl.value = issueDate;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = issueDate.slice(-2) + "14" + getRandomNumericString(4) + "00" + getRandomNumericString(2);
    }
}

function KS_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "K00-" + getRandomNumericString(2) + "-" + getRandomNumericString(4);
}



function KS_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 11) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 3;

    getTargetElement("inputICN").value = issueDate.slice(-2) + ("00" + days.toString()).slice(-3) + documentNumber.replace(/-/g, '') + "0101"
}



function KS_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!")
        return;
    }

    var sex = getTargetElement('inputSex').value;

    days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 1;

    getTargetElement('inputDD').value = birthDate.slice(-2, -1) + ("00" + days.toString()).slice(-3)
        + getRandomNumericString(6) + birthDate.slice(-1) + lastName[0] + firstName[0] + issueDate.slice(-2)
        + ("00" + days.toString()).slice(-3) + sex + expiryDate.slice(-2) + expiryDate.slice(2,4)
        + get_letter_corresponding_month(expiryDate.slice(0,2)) + "B";
}


/*
$$   $ $$  $$  $$$$  $$   $ $$$$$$ $$  $$  $$$$
$$   $  $$$$  $$  $$ $$$ $$   $$   $$$ $$ $$
$$ $ $   $$   $$  $$ $$ $ $   $$   $$ $$$ $$ $$$
$$$$$$   $$   $$  $$ $$   $   $$   $$  $$ $$  $$
 $$ $$   $$    $$$$  $$   $ $$$$$$ $$  $$  $$$$
*/



function WY_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = "11" + getRandomNumericString(7);
}

function WY_calculate_ICN() {
    var v = "100003" + getRandomNumericString(3) + "7";
    var elIcn = getTargetElement('inputICN');
    if (elIcn) elIcn.value = v;
    var elDd = getTargetElement('inputDD');
    if (elDd) elDd.value = v;
}

function WY_calculate_DD() {
    var v = "100003" + getRandomNumericString(3) + "7";
    var elIcn = getTargetElement('inputICN');
    if (elIcn) elIcn.value = v;
    var elDd = getTargetElement('inputDD');
    if (elDd) elDd.value = v;
}

function SD_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = "01" + getRandomNumericString(6);
    }
}

function SD_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "042000" + getRandomNumericString(10);
    }
}

function SD_calculate_DD() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl && docEl.value.length === 8 ? docEl.value.trim() : ("01" + getRandomNumericString(6));
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = doc + issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(7);
    }
}

function KY_2012_calculate_documentNumber() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName.length) {
        showInputDataAlert("Document number calculation error. Empty Last name!")
        return;
    }

    getTargetElement('inputDocumentNumber').value = lastName[0] + getRandomNumericString(8);
}




function KY_2012_calculate_DOE(diff) {
    var dateOfBirth = getTargetElement("inputBrithDate").value;
    if (!dateOfBirth) {
        makeRandomDOB();
        dateOfBirth = getTargetElement("inputBrithDate").value;
    }

    if (dateOfBirth.length > 4) {
        date = dateOfBirth.slice(0,4);
    } else { return; }

    var dateOfIssue = getTargetElement("inputIssueDate").value;
    if (dateOfIssue.length == 8) {
        date += (parseInt(dateOfIssue.slice(-4)) + diff)
    } else { return; }


    d = new Date(date.slice(-4), date.slice(0,2), date.slice(2,4));
    d.setDate(d.getDate() + 31)
    var formattedDate = ("0" + d.getMonth()).slice(-2) + ("0" + d.getDate()).slice(-2) + d.getFullYear();

    getTargetElement("inputExpiryDate").value = formattedDate;
}



function KY_2012_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement('inputICN').value = "04600" + issueDate.slice(-2) + getRandomNumericString(9);
}



function KY_2012_calculate_DD() {
    getTargetElement('inputDD').value = "43" + getRandomNumericString(13) + "0";
}



function KY_2018_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement('inputDD').value = issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(3,5)
         + getRandomNumericString(8) + " 01111";
}




function AK_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function AK_calculate_ICN() {
    getTargetElement('inputICN').value = "1000" + getRandomNumericString(6);
}



function AK_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    const alphabet = "01";

    getTargetElement('inputDD').value = "8" + getRandomNumericString(6) + " " + getRandomNumericString(3)
     + issueDate.slice(-2) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomLetter() + getRandomLetter() + getRandomLetter()
     + "-" + alphabet[Math.floor(Math.random() * alphabet.length)];
}


/*
 $$$$  $$  $$ $$      $$$$  $$  $$  $$$$  $$   $  $$$$
$$  $$ $$ $$  $$     $$  $$ $$  $$ $$  $$ $$$ $$ $$  $$
$$  $$ $$$$   $$     $$$$$$ $$$$$$ $$  $$ $$ $ $ $$$$$$
$$  $$ $$ $$  $$     $$  $$ $$  $$ $$  $$ $$   $ $$  $$
 $$$$  $$  $$ $$$$$$ $$  $$ $$  $$  $$$$  $$   $ $$  $$
*/



function OK_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomLetter() + "08" + getRandomNumericString(7);
    }
}

function OK_calculate_ICN() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl ? docEl.value.trim() : "";
    if (doc.length != 10) {
        doc = getRandomLetter() + "08" + getRandomNumericString(7);
        if (docEl) docEl.value = doc;
    }
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = doc + "OK" + getRandomLetterAndDigit() + getRandomLetterAndDigit() + "SL01";
    }
}

function OK_calculate_DOE(diff) {
    diff = diff || 4;
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "08262020";
    if (issueDate.length !== 8) issueDate = "08262020";
    var day = typeof get_last_day_of_month === 'function' ? get_last_day_of_month(issueDate) : "31";
    var year = parseInt(issueDate.slice(-4), 10) + diff;
    var expEl = getTargetElement("inputExpiryDate");
    if (expEl) {
        expEl.value = issueDate.slice(0, 2) + day.toString() + year;
    }
}

function OK_calculate_DD() {
    var docEl = getTargetElement("inputDocumentNumber");
    var doc = docEl ? docEl.value.trim() : "";
    if (doc.length != 10) {
        doc = getRandomLetter() + "08" + getRandomNumericString(7);
        if (docEl) docEl.value = doc;
    }
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var dobEl = getTargetElement("inputBrithDate");
    var birthDate = dobEl && dobEl.value.length === 8 ? dobEl.value.trim() : "01151970";
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = doc + birthDate.slice(0, 4) + birthDate.slice(-2) + issueDate.slice(0, 4) + issueDate.slice(-2) + "R";
    }
}

function OK_calculate_REAL_ID(alert) {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl && issueEl.value.length === 8 ? issueEl.value.trim() : "08262020";
    var inputDateObject = new Date(
        parseInt(issueDate.substr(4, 4), 10),
        parseInt(issueDate.substr(0, 2), 10) - 1,
        parseInt(issueDate.substr(2, 2), 10)
    );
    var comparisonDate = new Date(2020, 3, 30);
    var realEl = getTargetElement("inputIsRealID");
    if (realEl) {
        if (inputDateObject >= comparisonDate) {
            realEl.value = (realEl.tagName === 'SELECT' && realEl.querySelector('option[value="Yes"]')) ? "Yes" : "F";
        } else {
            realEl.value = (realEl.tagName === 'SELECT' && realEl.querySelector('option[value="No"]')) ? "No" : "N";
        }
    }
}

function DE_calculate_documentNumber() {
    var docEl = getTargetElement("inputDocumentNumber");
    if (docEl) {
        docEl.value = getRandomNumericString(7);
    }
}

function DE_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = "0110" + getRandomNumericString(12);
    }
}

function DE_calculate_DD() {
    var issueEl = getTargetElement("inputIssueDate");
    var issueDate = issueEl ? issueEl.value.trim() : "";
    if (issueDate.length != 8) {
        issueDate = "08262020";
        if (issueEl) issueEl.value = issueDate;
    }
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "L" + issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(6) + "C";
    }
}

function HI_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "H00" + getRandomNumericString(6);
}



function HI_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var data = "";
    for (var i = 0; i < 6; i++) { data += getRandomDigit(); }
    for (var i = 0; i < 6; i++) { data += getRandomLetterAndDigit(); }

    getTargetElement('inputDD').value = issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + data + "-ICWH";
}



function HI_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    d = new Date(issueDate.slice(-4), issueDate.slice(0,2), issueDate.slice(2,4));
    d.setDate(d.getDate() + 6)
    var formattedDate = ("0" + d.getMonth()).slice(-2) + ("0" + d.getDate()).slice(-2) + d.getFullYear();

    getTargetElement('inputICN').value = issueDate.slice(-4) + formattedDate.slice(0,4) + "_106336_2_1" + getRandomNumericString(2);
}


/*
$$$$$$  $$$$  $$   $  $$$$
  $$   $$  $$ $$   $ $$  $$
  $$   $$  $$ $$ $ $ $$$$$$
  $$   $$  $$ $$$$$$ $$  $$
$$$$$$  $$$$   $$ $$ $$  $$
*/



function IA_2011_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(3) + getRandomLetter() + getRandomLetter() + getRandomNumericString(4);
}




function IA_2011_calculate_DD() {
    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!")
        return;
    }

    var sex = getTargetElement('inputSex').value;

    getTargetElement('inputDD').value = getRandomNumericString(9) + lastName[0] + firstName[0] + getRandomNumericString(4) + sex
        + expiryDate.slice(2,4) + expiryDate.slice(0,2) + expiryDate.slice(-2) + "R";
}




function IA_2017_calculate_DD() {
    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!")
        return;
    }

    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!")
        return;
    }

    var sex = getTargetElement('inputSex').value;

    getTargetElement('inputDD').value = getRandomNumericString(9) + lastName[0] + firstName[0] + getRandomNumericString(4) + sex
        + expiryDate.slice(2,4) + expiryDate.slice(0,2) + expiryDate.slice(-2) + "D";
}




function IA_2011_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    d = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 1)).slice(-3);

    getTargetElement('inputICN').value = documentNumber + issueDate.slice(-2) + d + "0101";
}



function IA_2017_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    d = ("00" + (parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 3)).slice(-3);

    getTargetElement('inputICN').value = documentNumber + issueDate.slice(-2) + d + "0101";
}




/*
##   #  ####  ##  ## ###### ######  ####  #####   ####
### ## ##  ## ### ##   ##     ##   ##  ## ##  ## ##  ##
## # # ###### ## ###   ##     ##   ##  ## #####  ######
##   # ##  ## ##  ##   ##     ##   ##  ## ##  ## ##  ##
##   # ##  ## ##  ## ######   ##    ####  #####  ##  ##
*/




function MB_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value =
        getRandomLetter() + getRandomLetter() + "-" +
        getRandomLetter() + getRandomLetter() + "-" +
        getRandomLetter() + getRandomLetter() + "-" +
        getRandomLetter() + getRandomNumericString(3) + getRandomLetter() + getRandomLetterAndDigit();
}



function MB_calculate_ICN() {
    getTargetElement('inputICN').value = getRandomNumericString(9);
}



function MB_calculate_DD() {
    getTargetElement('inputDD').value = getRandomNumericString(9);
}


/*
 ####   ####   ####  ##  ##  ####  ######  ####  ##  ## ##### ##   #  ####  ##  ##
##     ##  ## ##     ## ##  ##  ##   ##   ##  ## ##  ## ##    ##   # ##  ## ### ##
 ####  ######  ####  ####   ######   ##   ##     ###### ####  ## # # ###### ## ###
    ## ##  ##     ## ## ##  ##  ##   ##   ##  ## ##  ## ##    ###### ##  ## ##  ##
 ####  ##  ##  ####  ##  ## ##  ##   ##    ####  ##  ## #####  ## ## ##  ## ##  ##
*/




function SK_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}



function SK_calculate_ICN() {
    getTargetElement('inputICN').value = getRandomLetter() + getRandomNumericString(8);
}



function SK_calculate_DD() {
    getTargetElement('inputDD').value = getRandomNumericString(10);
}


/*
 ####  ##  ## ######  ####  #####  ######  ####
##  ## ### ##   ##   ##  ## ##  ##   ##   ##  ##
##  ## ## ###   ##   ###### #####    ##   ##  ##
##  ## ##  ##   ##   ##  ## ##  ##   ##   ##  ##
 ####  ##  ##   ##   ##  ## ##  ## ######  ####
*/



function ON_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(4) + "-" + getRandomNumericString(5) + "-" + getRandomNumericString(5)
}



function ON_calculate_ICN() {
    getTargetElement('inputICN').value = getRandomNumericString(7);
}



function ON_calculate_DD() {
    getTargetElement('inputDD').value = 'G' + getRandomLetter() + getRandomNumericString(7);
}


/*
 ####  ##     #####  ##### #####  ######  ####
##  ## ##     ##  ## ##    ##  ##   ##   ##  ##
###### ##     #####  ####  #####    ##   ######
##  ## ##     ##  ## ##    ##  ##   ##   ##  ##
##  ## ###### #####  ##### ##  ##   ##   ##  ##
*/




function AB_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "1" + getRandomNumericString(5) + "-" + getRandomNumericString(3);
}



function AB_calculate_DD() {
    getTargetElement('inputDD').value = "0" + getRandomNumericString(3) + "-" + getRandomNumericString(5);
}


/*
##  ## ##  ## ##  ##  ####  ##  ##
 ####  ##  ## ## ##  ##  ## ### ##
  ##   ##  ## ####   ##  ## ## ###
  ##   ##  ## ## ##  ##  ## ##  ##
  ##    ####  ##  ##  ####  ##  ##
*/



function YT_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "1" + getRandomNumericString(5);
}



function YT_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 6) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement('inputDD').value = documentNumber + "R0"
}


/*
 ####  ##  ## ##### #####  #####  ####
##  ## ##  ## ##    ##  ## ##    ##  ##
##  ## ##  ## ####  #####  ####  ##
##  ## ##  ## ##    ##  ## ##    ##  ##
 #####  ####  ##### #####  #####  ####
*/





function QC_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(4) + "-" 
    + getRandomNumericString(6) + "-" + getRandomNumericString(2);
}



function QC_calculate_DD() {
    getTargetElement('inputDD').value = "PE" + getRandomLetter() + getRandomLetter()
     + getRandomNumericString(2) + getRandomLetter() + getRandomLetter() + getRandomLetter();
}



/*
##   # #####  ####  ######    ##  ## ###### #####   ####  ###### ##  ## ######  ####
##   # ##    ##       ##      ##  ##   ##   ##  ## ##       ##   ### ##   ##   ##  ##
## # # ####   ####    ##      ##  ##   ##   #####  ## ###   ##   ## ###   ##   ######
###### ##        ##   ##       ####    ##   ##  ## ##  ##   ##   ##  ##   ##   ##  ##
 ## ## #####  ####    ##        ##   ###### ##  ##  ####  ###### ##  ## ###### ##  ##
*/

// ========================== WEST VIRGINIA (WV) =========================== //




function WV_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = getRandomLetter() + getRandomNumericString(6);
}

function WV_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 7) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    var el = getTargetElement('inputICN');
    if (el) el.value = documentNumber + "WV" + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + "01";
}

function WV_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!");
        return;
    }
    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!");
        return;
    }
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!");
        return;
    }
    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!");
        return;
    }
    var el = getTargetElement('inputDD');
    if (el) el.value = birthDate.slice(0, 4) + birthDate.slice(-2) + lastName[0] + firstName[0] + expiryDate.slice(-2) + expiryDate.slice(0, 2);
}

function VT_calculate_documentNumber() {
    var el = getTargetElement('inputDocumentNumber');
    if (el) el.value = getRandomNumericString(8);
}

function VT_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect document number!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    var el = getTargetElement('inputDD');
    if (el) el.value = issueDate.slice(0, 4) + issueDate.slice(-2) + getRandomNumericString(4) + documentNumber;
}

function NE_2021_calculate_documentNumber() {
    NE_calculate_documentNumber();
}

function NV_calculate_DD() {
    var ddEl = getTargetElement("inputDD");
    if (ddEl) {
        ddEl.value = "000" + getRandomNumericString(18);
    }
}


    // Expose all functions to window
    try { if (typeof AB_calculate_DD === 'function') window.AB_calculate_DD = AB_calculate_DD; } catch(e) {}
    try { if (typeof AB_calculate_documentNumber === 'function') window.AB_calculate_documentNumber = AB_calculate_documentNumber; } catch(e) {}
    try { if (typeof AK_calculate_DD === 'function') window.AK_calculate_DD = AK_calculate_DD; } catch(e) {}
    try { if (typeof AK_calculate_ICN === 'function') window.AK_calculate_ICN = AK_calculate_ICN; } catch(e) {}
    try { if (typeof AK_calculate_documentNumber === 'function') window.AK_calculate_documentNumber = AK_calculate_documentNumber; } catch(e) {}
    try { if (typeof AL_2024_calculate_ICN === 'function') window.AL_2024_calculate_ICN = AL_2024_calculate_ICN; } catch(e) {}
    try { if (typeof AL_2024_calculate_documentNumber === 'function') window.AL_2024_calculate_documentNumber = AL_2024_calculate_documentNumber; } catch(e) {}
    try { if (typeof AL_calculate_ICN === 'function') window.AL_calculate_ICN = AL_calculate_ICN; } catch(e) {}
    try { if (typeof AL_calculate_documentNumber === 'function') window.AL_calculate_documentNumber = AL_calculate_documentNumber; } catch(e) {}
    try { if (typeof AR_calculate_DD === 'function') window.AR_calculate_DD = AR_calculate_DD; } catch(e) {}
    try { if (typeof AR_calculate_ICN === 'function') window.AR_calculate_ICN = AR_calculate_ICN; } catch(e) {}
    try { if (typeof AR_calculate_documentNumber === 'function') window.AR_calculate_documentNumber = AR_calculate_documentNumber; } catch(e) {}
    try { if (typeof AZ_2023_calculate_ICN === 'function') window.AZ_2023_calculate_ICN = AZ_2023_calculate_ICN; } catch(e) {}
    try { if (typeof AZ_calculate_DD === 'function') window.AZ_calculate_DD = AZ_calculate_DD; } catch(e) {}
    try { if (typeof AZ_calculate_ICN === 'function') window.AZ_calculate_ICN = AZ_calculate_ICN; } catch(e) {}
    try { if (typeof AZ_calculate_documentNumber === 'function') window.AZ_calculate_documentNumber = AZ_calculate_documentNumber; } catch(e) {}
    try { if (typeof AZ_makeRandomDOE === 'function') window.AZ_makeRandomDOE = AZ_makeRandomDOE; } catch(e) {}
    try { if (typeof CA_calculate_DD === 'function') window.CA_calculate_DD = CA_calculate_DD; } catch(e) {}
    try { if (typeof CA_calculate_ICN === 'function') window.CA_calculate_ICN = CA_calculate_ICN; } catch(e) {}
    try { if (typeof CA_calculate_documentNumber === 'function') window.CA_calculate_documentNumber = CA_calculate_documentNumber; } catch(e) {}
    try { if (typeof CO_calculate_AUDIT === 'function') window.CO_calculate_AUDIT = CO_calculate_AUDIT; } catch(e) {}
    try { if (typeof CO_calculate_DD === 'function') window.CO_calculate_DD = CO_calculate_DD; } catch(e) {}
    try { if (typeof CO_calculate_documentNumber === 'function') window.CO_calculate_documentNumber = CO_calculate_documentNumber; } catch(e) {}
    try { if (typeof CT_calculate_DD === 'function') window.CT_calculate_DD = CT_calculate_DD; } catch(e) {}
    try { if (typeof CT_calculate_ICN === 'function') window.CT_calculate_ICN = CT_calculate_ICN; } catch(e) {}
    try { if (typeof CT_calculate_documentNumber === 'function') window.CT_calculate_documentNumber = CT_calculate_documentNumber; } catch(e) {}
    try { if (typeof DC_calculate_AUDIT === 'function') window.DC_calculate_AUDIT = DC_calculate_AUDIT; } catch(e) {}
    try { if (typeof DC_calculate_DD === 'function') window.DC_calculate_DD = DC_calculate_DD; } catch(e) {}
    try { if (typeof DC_calculate_documentNumber === 'function') window.DC_calculate_documentNumber = DC_calculate_documentNumber; } catch(e) {}
    try { if (typeof DE_calculate_DD === 'function') window.DE_calculate_DD = DE_calculate_DD; } catch(e) {}
    try { if (typeof DE_calculate_ICN === 'function') window.DE_calculate_ICN = DE_calculate_ICN; } catch(e) {}
    try { if (typeof DE_calculate_documentNumber === 'function') window.DE_calculate_documentNumber = DE_calculate_documentNumber; } catch(e) {}
    try { if (typeof FL_calculate_DD === 'function') window.FL_calculate_DD = FL_calculate_DD; } catch(e) {}
    try { if (typeof FL_calculate_ICN === 'function') window.FL_calculate_ICN = FL_calculate_ICN; } catch(e) {}
    try { if (typeof FL_calculate_documentNumber === 'function') window.FL_calculate_documentNumber = FL_calculate_documentNumber; } catch(e) {}
    try { if (typeof GA_calculate_DD === 'function') window.GA_calculate_DD = GA_calculate_DD; } catch(e) {}
    try { if (typeof GA_calculate_DD_2015 === 'function') window.GA_calculate_DD_2015 = GA_calculate_DD_2015; } catch(e) {}
    try { if (typeof GA_calculate_ICN === 'function') window.GA_calculate_ICN = GA_calculate_ICN; } catch(e) {}
    try { if (typeof GA_calculate_ICN_2015 === 'function') window.GA_calculate_ICN_2015 = GA_calculate_ICN_2015; } catch(e) {}
    try { if (typeof GA_calculate_documentNumber === 'function') window.GA_calculate_documentNumber = GA_calculate_documentNumber; } catch(e) {}
    try { if (typeof HI_calculate_DD === 'function') window.HI_calculate_DD = HI_calculate_DD; } catch(e) {}
    try { if (typeof HI_calculate_ICN === 'function') window.HI_calculate_ICN = HI_calculate_ICN; } catch(e) {}
    try { if (typeof HI_calculate_documentNumber === 'function') window.HI_calculate_documentNumber = HI_calculate_documentNumber; } catch(e) {}
    try { if (typeof IA_2011_calculate_DD === 'function') window.IA_2011_calculate_DD = IA_2011_calculate_DD; } catch(e) {}
    try { if (typeof IA_2011_calculate_ICN === 'function') window.IA_2011_calculate_ICN = IA_2011_calculate_ICN; } catch(e) {}
    try { if (typeof IA_2011_calculate_documentNumber === 'function') window.IA_2011_calculate_documentNumber = IA_2011_calculate_documentNumber; } catch(e) {}
    try { if (typeof IA_2017_calculate_DD === 'function') window.IA_2017_calculate_DD = IA_2017_calculate_DD; } catch(e) {}
    try { if (typeof IA_2017_calculate_ICN === 'function') window.IA_2017_calculate_ICN = IA_2017_calculate_ICN; } catch(e) {}
    try { if (typeof ID_calculate_DD === 'function') window.ID_calculate_DD = ID_calculate_DD; } catch(e) {}
    try { if (typeof ID_calculate_DD_2023 === 'function') window.ID_calculate_DD_2023 = ID_calculate_DD_2023; } catch(e) {}
    try { if (typeof ID_calculate_ICN === 'function') window.ID_calculate_ICN = ID_calculate_ICN; } catch(e) {}
    try { if (typeof ID_calculate_ICN_2023 === 'function') window.ID_calculate_ICN_2023 = ID_calculate_ICN_2023; } catch(e) {}
    try { if (typeof ID_calculate_documentNumber === 'function') window.ID_calculate_documentNumber = ID_calculate_documentNumber; } catch(e) {}
    try { if (typeof IL_calculate_DD === 'function') window.IL_calculate_DD = IL_calculate_DD; } catch(e) {}
    try { if (typeof IL_calculate_ICN === 'function') window.IL_calculate_ICN = IL_calculate_ICN; } catch(e) {}
    try { if (typeof IL_calculate_documentNumber === 'function') window.IL_calculate_documentNumber = IL_calculate_documentNumber; } catch(e) {}
    try { if (typeof IN_calculate_DD === 'function') window.IN_calculate_DD = IN_calculate_DD; } catch(e) {}
    try { if (typeof IN_calculate_ICN === 'function') window.IN_calculate_ICN = IN_calculate_ICN; } catch(e) {}
    try { if (typeof IN_calculate_documentNumber === 'function') window.IN_calculate_documentNumber = IN_calculate_documentNumber; } catch(e) {}
    try { if (typeof KS_calculate_DD === 'function') window.KS_calculate_DD = KS_calculate_DD; } catch(e) {}
    try { if (typeof KS_calculate_ICN === 'function') window.KS_calculate_ICN = KS_calculate_ICN; } catch(e) {}
    try { if (typeof KS_calculate_documentNumber === 'function') window.KS_calculate_documentNumber = KS_calculate_documentNumber; } catch(e) {}
    try { if (typeof KY_2012_calculate_DD === 'function') window.KY_2012_calculate_DD = KY_2012_calculate_DD; } catch(e) {}
    try { if (typeof KY_2012_calculate_DOE === 'function') window.KY_2012_calculate_DOE = KY_2012_calculate_DOE; } catch(e) {}
    try { if (typeof KY_2012_calculate_ICN === 'function') window.KY_2012_calculate_ICN = KY_2012_calculate_ICN; } catch(e) {}
    try { if (typeof KY_2012_calculate_documentNumber === 'function') window.KY_2012_calculate_documentNumber = KY_2012_calculate_documentNumber; } catch(e) {}
    try { if (typeof KY_2018_calculate_DD === 'function') window.KY_2018_calculate_DD = KY_2018_calculate_DD; } catch(e) {}
    try { if (typeof LA_calculate_AUDIT === 'function') window.LA_calculate_AUDIT = LA_calculate_AUDIT; } catch(e) {}
    try { if (typeof LA_calculate_ICN === 'function') window.LA_calculate_ICN = LA_calculate_ICN; } catch(e) {}
    try { if (typeof LA_calculate_OfficeCode === 'function') window.LA_calculate_OfficeCode = LA_calculate_OfficeCode; } catch(e) {}
    try { if (typeof LA_calculate_documentNumber === 'function') window.LA_calculate_documentNumber = LA_calculate_documentNumber; } catch(e) {}
    try { if (typeof MA_calculate_DD === 'function') window.MA_calculate_DD = MA_calculate_DD; } catch(e) {}
    try { if (typeof MA_calculate_ICN === 'function') window.MA_calculate_ICN = MA_calculate_ICN; } catch(e) {}
    try { if (typeof MA_calculate_documentNumber === 'function') window.MA_calculate_documentNumber = MA_calculate_documentNumber; } catch(e) {}
    try { if (typeof MB_calculate_DD === 'function') window.MB_calculate_DD = MB_calculate_DD; } catch(e) {}
    try { if (typeof MB_calculate_ICN === 'function') window.MB_calculate_ICN = MB_calculate_ICN; } catch(e) {}
    try { if (typeof MB_calculate_documentNumber === 'function') window.MB_calculate_documentNumber = MB_calculate_documentNumber; } catch(e) {}
    try { if (typeof MD_2021_calculate_DD === 'function') window.MD_2021_calculate_DD = MD_2021_calculate_DD; } catch(e) {}
    try { if (typeof MD_2021_calculate_ICN === 'function') window.MD_2021_calculate_ICN = MD_2021_calculate_ICN; } catch(e) {}
    try { if (typeof MD_2021_calculate_documentNumber === 'function') window.MD_2021_calculate_documentNumber = MD_2021_calculate_documentNumber; } catch(e) {}
    try { if (typeof MD_calculate_DD === 'function') window.MD_calculate_DD = MD_calculate_DD; } catch(e) {}
    try { if (typeof MD_calculate_ICN === 'function') window.MD_calculate_ICN = MD_calculate_ICN; } catch(e) {}
    try { if (typeof MD_calculate_documentNumber === 'function') window.MD_calculate_documentNumber = MD_calculate_documentNumber; } catch(e) {}
    try { if (typeof ME_calculate_DD === 'function') window.ME_calculate_DD = ME_calculate_DD; } catch(e) {}
    try { if (typeof ME_calculate_ICN === 'function') window.ME_calculate_ICN = ME_calculate_ICN; } catch(e) {}
    try { if (typeof ME_calculate_documentNumber === 'function') window.ME_calculate_documentNumber = ME_calculate_documentNumber; } catch(e) {}
    try { if (typeof MI_calculate_ICN === 'function') window.MI_calculate_ICN = MI_calculate_ICN; } catch(e) {}
    try { if (typeof MI_calculate_documentNumber === 'function') window.MI_calculate_documentNumber = MI_calculate_documentNumber; } catch(e) {}
    try { if (typeof MN_calculate_DD === 'function') window.MN_calculate_DD = MN_calculate_DD; } catch(e) {}
    try { if (typeof MN_calculate_ICN === 'function') window.MN_calculate_ICN = MN_calculate_ICN; } catch(e) {}
    try { if (typeof MN_calculate_documentNumber === 'function') window.MN_calculate_documentNumber = MN_calculate_documentNumber; } catch(e) {}
    try { if (typeof MO_2020_calculate_DD === 'function') window.MO_2020_calculate_DD = MO_2020_calculate_DD; } catch(e) {}
    try { if (typeof MO_2020_calculate_ICN === 'function') window.MO_2020_calculate_ICN = MO_2020_calculate_ICN; } catch(e) {}
    try { if (typeof MO_2020_calculate_documentNumber === 'function') window.MO_2020_calculate_documentNumber = MO_2020_calculate_documentNumber; } catch(e) {}
    try { if (typeof MO_calculate_DD === 'function') window.MO_calculate_DD = MO_calculate_DD; } catch(e) {}
    try { if (typeof MO_calculate_ICN === 'function') window.MO_calculate_ICN = MO_calculate_ICN; } catch(e) {}
    try { if (typeof MO_calculate_documentNumber === 'function') window.MO_calculate_documentNumber = MO_calculate_documentNumber; } catch(e) {}
    try { if (typeof MS_calculate_DD === 'function') window.MS_calculate_DD = MS_calculate_DD; } catch(e) {}
    try { if (typeof MS_calculate_ICN === 'function') window.MS_calculate_ICN = MS_calculate_ICN; } catch(e) {}
    try { if (typeof MS_calculate_documentNumber === 'function') window.MS_calculate_documentNumber = MS_calculate_documentNumber; } catch(e) {}
    try { if (typeof MT_calculate_DD === 'function') window.MT_calculate_DD = MT_calculate_DD; } catch(e) {}
    try { if (typeof MT_calculate_ICN === 'function') window.MT_calculate_ICN = MT_calculate_ICN; } catch(e) {}
    try { if (typeof MT_calculate_documentNumber === 'function') window.MT_calculate_documentNumber = MT_calculate_documentNumber; } catch(e) {}
    try { if (typeof NC_calculate_DD === 'function') window.NC_calculate_DD = NC_calculate_DD; } catch(e) {}
    try { if (typeof NC_calculate_ICN === 'function') window.NC_calculate_ICN = NC_calculate_ICN; } catch(e) {}
    try { if (typeof NC_calculate_documentNumber === 'function') window.NC_calculate_documentNumber = NC_calculate_documentNumber; } catch(e) {}
    try { if (typeof ND_2023_calculate_DD === 'function') window.ND_2023_calculate_DD = ND_2023_calculate_DD; } catch(e) {}
    try { if (typeof ND_2023_calculate_ICN === 'function') window.ND_2023_calculate_ICN = ND_2023_calculate_ICN; } catch(e) {}
    try { if (typeof ND_calculate_DD === 'function') window.ND_calculate_DD = ND_calculate_DD; } catch(e) {}
    try { if (typeof ND_calculate_ICN === 'function') window.ND_calculate_ICN = ND_calculate_ICN; } catch(e) {}
    try { if (typeof ND_calculate_documentNumber === 'function') window.ND_calculate_documentNumber = ND_calculate_documentNumber; } catch(e) {}
    try { if (typeof ND_calculate_optionNumber === 'function') window.ND_calculate_optionNumber = ND_calculate_optionNumber; } catch(e) {}
    try { if (typeof NE_2021_calculate_DD === 'function') window.NE_2021_calculate_DD = NE_2021_calculate_DD; } catch(e) {}
    try { if (typeof NE_2021_calculate_ICN === 'function') window.NE_2021_calculate_ICN = NE_2021_calculate_ICN; } catch(e) {}
    try { if (typeof NE_2021_calculate_documentNumber === 'function') window.NE_2021_calculate_documentNumber = NE_2021_calculate_documentNumber; } catch(e) {}
    try { if (typeof NE_calculate_DD === 'function') window.NE_calculate_DD = NE_calculate_DD; } catch(e) {}
    try { if (typeof NE_calculate_ICN === 'function') window.NE_calculate_ICN = NE_calculate_ICN; } catch(e) {}
    try { if (typeof NE_calculate_documentNumber === 'function') window.NE_calculate_documentNumber = NE_calculate_documentNumber; } catch(e) {}
    try { if (typeof NH_calculate_DD === 'function') window.NH_calculate_DD = NH_calculate_DD; } catch(e) {}
    try { if (typeof NH_calculate_ICN === 'function') window.NH_calculate_ICN = NH_calculate_ICN; } catch(e) {}
    try { if (typeof NH_calculate_documentNumber === 'function') window.NH_calculate_documentNumber = NH_calculate_documentNumber; } catch(e) {}
    try { if (typeof NJ_2020_calculate_DD === 'function') window.NJ_2020_calculate_DD = NJ_2020_calculate_DD; } catch(e) {}
    try { if (typeof NJ_2020_calculate_ICN === 'function') window.NJ_2020_calculate_ICN = NJ_2020_calculate_ICN; } catch(e) {}
    try { if (typeof NJ_2020_calculate_documentNumber === 'function') window.NJ_2020_calculate_documentNumber = NJ_2020_calculate_documentNumber; } catch(e) {}
    try { if (typeof NM_calculate_DD === 'function') window.NM_calculate_DD = NM_calculate_DD; } catch(e) {}
    try { if (typeof NM_calculate_ICN === 'function') window.NM_calculate_ICN = NM_calculate_ICN; } catch(e) {}
    try { if (typeof NM_calculate_documentNumber === 'function') window.NM_calculate_documentNumber = NM_calculate_documentNumber; } catch(e) {}
    try { if (typeof NV_2021_calculate_ICN === 'function') window.NV_2021_calculate_ICN = NV_2021_calculate_ICN; } catch(e) {}
    try { if (typeof NV_calculate_DD === 'function') window.NV_calculate_DD = NV_calculate_DD; } catch(e) {}
    try { if (typeof NV_calculate_ICN === 'function') window.NV_calculate_ICN = NV_calculate_ICN; } catch(e) {}
    try { if (typeof NV_calculate_documentNumber === 'function') window.NV_calculate_documentNumber = NV_calculate_documentNumber; } catch(e) {}
    try { if (typeof NY_calculate_DD === 'function') window.NY_calculate_DD = NY_calculate_DD; } catch(e) {}
    try { if (typeof NY_calculate_documentNumber === 'function') window.NY_calculate_documentNumber = NY_calculate_documentNumber; } catch(e) {}
    try { if (typeof OH_calculate_DD === 'function') window.OH_calculate_DD = OH_calculate_DD; } catch(e) {}
    try { if (typeof OH_calculate_ICN === 'function') window.OH_calculate_ICN = OH_calculate_ICN; } catch(e) {}
    try { if (typeof OH_calculate_documentNumber === 'function') window.OH_calculate_documentNumber = OH_calculate_documentNumber; } catch(e) {}
    try { if (typeof OK_calculate_DD === 'function') window.OK_calculate_DD = OK_calculate_DD; } catch(e) {}
    try { if (typeof OK_calculate_DOE === 'function') window.OK_calculate_DOE = OK_calculate_DOE; } catch(e) {}
    try { if (typeof OK_calculate_ICN === 'function') window.OK_calculate_ICN = OK_calculate_ICN; } catch(e) {}
    try { if (typeof OK_calculate_REAL_ID === 'function') window.OK_calculate_REAL_ID = OK_calculate_REAL_ID; } catch(e) {}
    try { if (typeof OK_calculate_documentNumber === 'function') window.OK_calculate_documentNumber = OK_calculate_documentNumber; } catch(e) {}
    try { if (typeof ON_calculate_DD === 'function') window.ON_calculate_DD = ON_calculate_DD; } catch(e) {}
    try { if (typeof ON_calculate_ICN === 'function') window.ON_calculate_ICN = ON_calculate_ICN; } catch(e) {}
    try { if (typeof ON_calculate_documentNumber === 'function') window.ON_calculate_documentNumber = ON_calculate_documentNumber; } catch(e) {}
    try { if (typeof OR_calculate_DD === 'function') window.OR_calculate_DD = OR_calculate_DD; } catch(e) {}
    try { if (typeof OR_calculate_ICN === 'function') window.OR_calculate_ICN = OR_calculate_ICN; } catch(e) {}
    try { if (typeof OR_calculate_documentNumber === 'function') window.OR_calculate_documentNumber = OR_calculate_documentNumber; } catch(e) {}
    try { if (typeof PA_calculate_DD === 'function') window.PA_calculate_DD = PA_calculate_DD; } catch(e) {}
    try { if (typeof PA_calculate_ICN === 'function') window.PA_calculate_ICN = PA_calculate_ICN; } catch(e) {}
    try { if (typeof PA_calculate_documentNumber === 'function') window.PA_calculate_documentNumber = PA_calculate_documentNumber; } catch(e) {}
    try { if (typeof QC_calculate_DD === 'function') window.QC_calculate_DD = QC_calculate_DD; } catch(e) {}
    try { if (typeof QC_calculate_documentNumber === 'function') window.QC_calculate_documentNumber = QC_calculate_documentNumber; } catch(e) {}
    try { if (typeof RI_calculate_DD === 'function') window.RI_calculate_DD = RI_calculate_DD; } catch(e) {}
    try { if (typeof RI_calculate_DD_2022 === 'function') window.RI_calculate_DD_2022 = RI_calculate_DD_2022; } catch(e) {}
    try { if (typeof RI_calculate_ICN === 'function') window.RI_calculate_ICN = RI_calculate_ICN; } catch(e) {}
    try { if (typeof RI_calculate_documentNumber === 'function') window.RI_calculate_documentNumber = RI_calculate_documentNumber; } catch(e) {}
    try { if (typeof SC_calculate_DD === 'function') window.SC_calculate_DD = SC_calculate_DD; } catch(e) {}
    try { if (typeof SC_calculate_documentNumber === 'function') window.SC_calculate_documentNumber = SC_calculate_documentNumber; } catch(e) {}
    try { if (typeof SD_calculate_DD === 'function') window.SD_calculate_DD = SD_calculate_DD; } catch(e) {}
    try { if (typeof SD_calculate_ICN === 'function') window.SD_calculate_ICN = SD_calculate_ICN; } catch(e) {}
    try { if (typeof SD_calculate_documentNumber === 'function') window.SD_calculate_documentNumber = SD_calculate_documentNumber; } catch(e) {}
    try { if (typeof SK_calculate_DD === 'function') window.SK_calculate_DD = SK_calculate_DD; } catch(e) {}
    try { if (typeof SK_calculate_ICN === 'function') window.SK_calculate_ICN = SK_calculate_ICN; } catch(e) {}
    try { if (typeof SK_calculate_documentNumber === 'function') window.SK_calculate_documentNumber = SK_calculate_documentNumber; } catch(e) {}
    try { if (typeof TN_calculate_DD === 'function') window.TN_calculate_DD = TN_calculate_DD; } catch(e) {}
    try { if (typeof TN_calculate_ICN === 'function') window.TN_calculate_ICN = TN_calculate_ICN; } catch(e) {}
    try { if (typeof TN_calculate_REAL_ID === 'function') window.TN_calculate_REAL_ID = TN_calculate_REAL_ID; } catch(e) {}
    try { if (typeof TN_calculate_documentNumber === 'function') window.TN_calculate_documentNumber = TN_calculate_documentNumber; } catch(e) {}
    try { if (typeof TX_2016_calculate_ICN === 'function') window.TX_2016_calculate_ICN = TX_2016_calculate_ICN; } catch(e) {}
    try { if (typeof TX_2020_calculate_ICN === 'function') window.TX_2020_calculate_ICN = TX_2020_calculate_ICN; } catch(e) {}
    try { if (typeof TX_calculate_DD === 'function') window.TX_calculate_DD = TX_calculate_DD; } catch(e) {}
    try { if (typeof TX_calculate_DD_improved === 'function') window.TX_calculate_DD_improved = TX_calculate_DD_improved; } catch(e) {}
    try { if (typeof TX_calculate_documentNumber === 'function') window.TX_calculate_documentNumber = TX_calculate_documentNumber; } catch(e) {}
    try { if (typeof UT_2016_calculate_REAL_ID === 'function') window.UT_2016_calculate_REAL_ID = UT_2016_calculate_REAL_ID; } catch(e) {}
    try { if (typeof UT_calculate_DD === 'function') window.UT_calculate_DD = UT_calculate_DD; } catch(e) {}
    try { if (typeof UT_calculate_ICN === 'function') window.UT_calculate_ICN = UT_calculate_ICN; } catch(e) {}
    try { if (typeof UT_calculate_documentNumber === 'function') window.UT_calculate_documentNumber = UT_calculate_documentNumber; } catch(e) {}
    try { if (typeof VA_calculate_DD === 'function') window.VA_calculate_DD = VA_calculate_DD; } catch(e) {}
    try { if (typeof VA_calculate_ICN === 'function') window.VA_calculate_ICN = VA_calculate_ICN; } catch(e) {}
    try { if (typeof VA_calculate_documentNumber === 'function') window.VA_calculate_documentNumber = VA_calculate_documentNumber; } catch(e) {}
    try { if (typeof VT_calculate_DD === 'function') window.VT_calculate_DD = VT_calculate_DD; } catch(e) {}
    try { if (typeof VT_calculate_documentNumber === 'function') window.VT_calculate_documentNumber = VT_calculate_documentNumber; } catch(e) {}
    try { if (typeof WA_calculate_AUDIT === 'function') window.WA_calculate_AUDIT = WA_calculate_AUDIT; } catch(e) {}
    try { if (typeof WA_calculate_AUDIT_with_P === 'function') window.WA_calculate_AUDIT_with_P = WA_calculate_AUDIT_with_P; } catch(e) {}
    try { if (typeof WA_calculate_DD === 'function') window.WA_calculate_DD = WA_calculate_DD; } catch(e) {}
    try { if (typeof WA_calculate_documentNumber === 'function') window.WA_calculate_documentNumber = WA_calculate_documentNumber; } catch(e) {}
    try { if (typeof WI_calculate_DD === 'function') window.WI_calculate_DD = WI_calculate_DD; } catch(e) {}
    try { if (typeof WI_calculate_ICN === 'function') window.WI_calculate_ICN = WI_calculate_ICN; } catch(e) {}
    try { if (typeof WI_calculate_documentNumber === 'function') window.WI_calculate_documentNumber = WI_calculate_documentNumber; } catch(e) {}
    try { if (typeof WV_calculate_DD === 'function') window.WV_calculate_DD = WV_calculate_DD; } catch(e) {}
    try { if (typeof WV_calculate_ICN === 'function') window.WV_calculate_ICN = WV_calculate_ICN; } catch(e) {}
    try { if (typeof WV_calculate_documentNumber === 'function') window.WV_calculate_documentNumber = WV_calculate_documentNumber; } catch(e) {}
    try { if (typeof WY_calculate_DD === 'function') window.WY_calculate_DD = WY_calculate_DD; } catch(e) {}
    try { if (typeof WY_calculate_ICN === 'function') window.WY_calculate_ICN = WY_calculate_ICN; } catch(e) {}
    try { if (typeof WY_calculate_documentNumber === 'function') window.WY_calculate_documentNumber = WY_calculate_documentNumber; } catch(e) {}
    try { if (typeof YT_calculate_DD === 'function') window.YT_calculate_DD = YT_calculate_DD; } catch(e) {}
    try { if (typeof YT_calculate_documentNumber === 'function') window.YT_calculate_documentNumber = YT_calculate_documentNumber; } catch(e) {}
    try { if (typeof getFormattedDate_MMDDYYYY === 'function') window.getFormattedDate_MMDDYYYY = getFormattedDate_MMDDYYYY; } catch(e) {}
    try { if (typeof getFormattedDate_YYYYMMDD === 'function') window.getFormattedDate_YYYYMMDD = getFormattedDate_YYYYMMDD; } catch(e) {}
    try { if (typeof getNumberOfDaysFromBeginnigOfYear === 'function') window.getNumberOfDaysFromBeginnigOfYear = getNumberOfDaysFromBeginnigOfYear; } catch(e) {}
    try { if (typeof getRandomDateByYear === 'function') window.getRandomDateByYear = getRandomDateByYear; } catch(e) {}
    try { if (typeof getRandomDigit === 'function') window.getRandomDigit = getRandomDigit; } catch(e) {}
    try { if (typeof getRandomFirstName === 'function') window.getRandomFirstName = getRandomFirstName; } catch(e) {}
    try { if (typeof getRandomInt === 'function') window.getRandomInt = getRandomInt; } catch(e) {}
    try { if (typeof getRandomInt2 === 'function') window.getRandomInt2 = getRandomInt2; } catch(e) {}
    try { if (typeof getRandomLastName === 'function') window.getRandomLastName = getRandomLastName; } catch(e) {}
    try { if (typeof getRandomLetter === 'function') window.getRandomLetter = getRandomLetter; } catch(e) {}
    try { if (typeof getRandomLetterAndDigit === 'function') window.getRandomLetterAndDigit = getRandomLetterAndDigit; } catch(e) {}
    try { if (typeof getRandomMiddleName === 'function') window.getRandomMiddleName = getRandomMiddleName; } catch(e) {}
    try { if (typeof getRandomNumericString === 'function') window.getRandomNumericString = getRandomNumericString; } catch(e) {}
    try { if (typeof get_last_day_of_month === 'function') window.get_last_day_of_month = get_last_day_of_month; } catch(e) {}
    try { if (typeof get_letter_corresponding_month === 'function') window.get_letter_corresponding_month = get_letter_corresponding_month; } catch(e) {}
    try { if (typeof get_month_number === 'function') window.get_month_number = get_month_number; } catch(e) {}
    try { if (typeof makeDOEformDOB === 'function') window.makeDOEformDOB = makeDOEformDOB; } catch(e) {}
    try { if (typeof makeDOEformDOB_plus_day === 'function') window.makeDOEformDOB_plus_day = makeDOEformDOB_plus_day; } catch(e) {}
    try { if (typeof makeDOEfromDOI === 'function') window.makeDOEfromDOI = makeDOEfromDOI; } catch(e) {}
    try { if (typeof makeDOEfromDOI_full === 'function') window.makeDOEfromDOI_full = makeDOEfromDOI_full; } catch(e) {}
    try { if (typeof makeRandomDOB === 'function') window.makeRandomDOB = makeRandomDOB; } catch(e) {}
    try { if (typeof makeRandomDOB_CAN === 'function') window.makeRandomDOB_CAN = makeRandomDOB_CAN; } catch(e) {}
    try { if (typeof makeRandomDOE === 'function') window.makeRandomDOE = makeRandomDOE; } catch(e) {}
    try { if (typeof makeRandomDOE_AL === 'function') window.makeRandomDOE_AL = makeRandomDOE_AL; } catch(e) {}
    try { if (typeof makeRandomDOE_CAN === 'function') window.makeRandomDOE_CAN = makeRandomDOE_CAN; } catch(e) {}
    try { if (typeof makeRandomDOE_fromDOI === 'function') window.makeRandomDOE_fromDOI = makeRandomDOE_fromDOI; } catch(e) {}
    try { if (typeof makeRandomDOE_minus_day === 'function') window.makeRandomDOE_minus_day = makeRandomDOE_minus_day; } catch(e) {}
    try { if (typeof makeRandomDOE_minus_day_key === 'function') window.makeRandomDOE_minus_day_key = makeRandomDOE_minus_day_key; } catch(e) {}
    try { if (typeof makeRandomDOE_plus_day === 'function') window.makeRandomDOE_plus_day = makeRandomDOE_plus_day; } catch(e) {}
    try { if (typeof makeRandomDOI === 'function') window.makeRandomDOI = makeRandomDOI; } catch(e) {}
    try { if (typeof makeRandomDOI_CAN === 'function') window.makeRandomDOI_CAN = makeRandomDOI_CAN; } catch(e) {}
    try { if (typeof randomDate === 'function') window.randomDate = randomDate; } catch(e) {}
    try { if (typeof sample === 'function') window.sample = sample; } catch(e) {}
    try { if (typeof showInputDataAlert === 'function') window.showInputDataAlert = showInputDataAlert; } catch(e) {}

    // Specific Version Aliases
    try {
        if (typeof AL_2024_calculate_ICN === 'function') window.AL_2022_calculate_ICN = AL_2024_calculate_ICN;
        if (typeof AL_2024_calculate_documentNumber === 'function') window.AL_2022_calculate_documentNumber = AL_2024_calculate_documentNumber;
        if (typeof AZ_calculate_documentNumber === 'function') window.AZ_2023_calculate_documentNumber = AZ_calculate_documentNumber;
        if (typeof AZ_calculate_DD === 'function') window.AZ_2023_calculate_DD = AZ_calculate_DD;
        if (typeof CA_calculate_documentNumber === 'function') window.CA_2024_calculate_documentNumber = CA_calculate_documentNumber;
        if (typeof CA_calculate_ICN === 'function') window.CA_2024_calculate_ICN = CA_calculate_ICN;
        if (typeof CA_calculate_DD === 'function') window.CA_2024_calculate_DD = CA_calculate_DD;
        if (typeof CO_calculate_documentNumber === 'function') {
            window.CO_2015_calculate_documentNumber = CO_calculate_documentNumber;
            window.CO_2022_calculate_documentNumber = CO_calculate_documentNumber;
        }
        if (typeof CO_calculate_AUDIT === 'function') {
            window.CO_2015_calculate_AUDIT = CO_calculate_AUDIT;
            window.CO_2022_calculate_AUDIT = CO_calculate_AUDIT;
        }
        if (typeof CO_calculate_DD === 'function') {
            window.CO_2015_calculate_DD = CO_calculate_DD;
            window.CO_2022_calculate_DD = CO_calculate_DD;
        }
        if (typeof GA_calculate_documentNumber === 'function') {
            window.GA_2015_calculate_documentNumber = GA_calculate_documentNumber;
            window.GA_2019_calculate_documentNumber = GA_calculate_documentNumber;
        }
        if (typeof GA_calculate_ICN_2015 === 'function') window.GA_2015_calculate_ICN = GA_calculate_ICN_2015;
        if (typeof GA_calculate_DD_2015 === 'function') window.GA_2015_calculate_DD = GA_calculate_DD_2015;
        if (typeof GA_calculate_ICN === 'function') window.GA_2019_calculate_ICN = GA_calculate_ICN;
        if (typeof GA_calculate_DD === 'function') window.GA_2019_calculate_DD = GA_calculate_DD;

        if (typeof MO_calculate_documentNumber === 'function') {
            window.MO_2012_calculate_documentNumber = MO_calculate_documentNumber;
        }
        if (typeof MO_calculate_ICN === 'function') {
            window.MO_2012_calculate_ICN = MO_calculate_ICN;
        }
        if (typeof MO_calculate_DD === 'function') {
            window.MO_2012_calculate_DD = MO_calculate_DD;
        }
        if (typeof NE_calculate_documentNumber === 'function') {
            window.NE_2017_calculate_documentNumber = NE_calculate_documentNumber;
            window.NE_2021_calculate_documentNumber = NE_calculate_documentNumber;
        }
        if (typeof NE_calculate_ICN === 'function') {
            window.NE_2017_calculate_ICN = NE_calculate_ICN;
        }
        if (typeof NE_calculate_DD === 'function') {
            window.NE_2017_calculate_DD = NE_calculate_DD;
        }

        if (typeof NV_calculate_documentNumber === 'function') {
            window.NV_2008_calculate_documentNumber = NV_calculate_documentNumber;
            window.NV_2021_calculate_documentNumber = NV_calculate_documentNumber;
        }
        if (typeof NV_calculate_ICN === 'function') {
            window.NV_2008_calculate_ICN = NV_calculate_ICN;
        }
        if (typeof NV_calculate_DD === 'function') {
            window.NV_2008_calculate_DD = NV_calculate_DD;
            window.NV_2021_calculate_DD = NV_calculate_DD;
        }
        if (typeof NH_calculate_documentNumber === 'function') {
            window.NH_2024_calculate_documentNumber = NH_calculate_documentNumber;
        }
        if (typeof NH_calculate_ICN === 'function') {
            window.NH_2024_calculate_ICN = NH_calculate_ICN;
        }
        if (typeof NH_calculate_DD === 'function') {
            window.NH_2024_calculate_DD = NH_calculate_DD;
        }
        if (typeof NJ_2020_calculate_documentNumber === 'function') {
            window.NJ_calculate_documentNumber = NJ_2020_calculate_documentNumber;
        }
        if (typeof NJ_2020_calculate_ICN === 'function') {
            window.NJ_calculate_ICN = NJ_2020_calculate_ICN;
        }
        if (typeof NJ_2020_calculate_DD === 'function') {
            window.NJ_calculate_DD = NJ_2020_calculate_DD;
        }

        if (typeof NY_calculate_documentNumber === 'function') {
            window.NY_2017_calculate_documentNumber = NY_calculate_documentNumber;
            window.NY_2022_calculate_documentNumber = NY_calculate_documentNumber;
        }
        if (typeof NY_calculate_DD === 'function') {
            window.NY_2017_calculate_DD = NY_calculate_DD;
            window.NY_2022_calculate_DD = NY_calculate_DD;
        }
        if (typeof ND_calculate_documentNumber === 'function') {
            window.ND_2023_calculate_documentNumber = ND_calculate_documentNumber;
        }
        if (typeof ND_calculate_optionNumber === 'function') {
            window.ND_2023_calculate_optionNumber = ND_calculate_optionNumber;
        }

        if (typeof PA_calculate_documentNumber === 'function') {
            window.PA_2022_calculate_documentNumber = PA_calculate_documentNumber;
        }
        if (typeof PA_calculate_ICN === 'function') {
            window.PA_2022_calculate_ICN = PA_calculate_ICN;
        }
        if (typeof PA_calculate_DD === 'function') {
            window.PA_2022_calculate_DD = PA_calculate_DD;
        }
        if (typeof RI_calculate_documentNumber === 'function') {
            window.RI_2022_calculate_documentNumber = RI_calculate_documentNumber;
        }
        if (typeof RI_calculate_ICN === 'function') {
            window.RI_2022_calculate_ICN = RI_calculate_ICN;
        }
        if (typeof RI_calculate_DD_2022 === 'function') {
            window.RI_2022_calculate_DD = RI_calculate_DD_2022;
        }
    } catch(e) {}

    // 5. Universal State Calculator Dispatcher
    
// =========================================================================
// SOUNDEX & DL FORMULA TABLES (dltables.js & num_calc.js)
// =========================================================================
      var monthName = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var monthArray1_WA = ["", "B", "C", "D", "J", "K", "L", "M", "N", "O", "P", "Q", "R"];
      var monthArray2_WA = ["", "S", "T", "U", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; 
      var dayArray_WA = ["", "A", "B", "C", "D", "E", "F", "G", "H", "Z", "S", "J",
                         "K", "L", "M", "N", "W", "P", "Q", "R", "0", "1", "2", "3",
                         "4", "5", "6", "7", "8", "9", "T", "U"];

      var firstName_NJ = [
        ['AARON', '000'],
        ['ABIR', '004'],
        ['ABRAHAM', '005'],
        ['ADRIAN', '011'],
        ['ALAN', '015'],
        ['ALBERTO', '017'],
        ['ALEXANDER', '019'],
        ['ALLEN', '027'],
        ['ANDREW', '042'],
        ['ANDY', '043'],
        ['ANGELA', '043'],
        ['ANNA', '047'],
        ['ANNETTE', '050'],
        ['ANTHONY', '053'],
        ['ARIEL', '058'],
        ['BARBARA', '073'],
        ['BERNICE', '085'],
        ['BESMIR', '088'],
        ['BHARAT', '093'],
        ['BONNIE', '094'],
        ['BRIAN', '096'],
        ['BYRON', '104'],
        ['CAMDEN', '109'],
        ['CAROL', '113'],
        ['CATHERINE', '115'],
        ['CHAD', '120'],
        ['CHARLES', '120'],
        ['CHAYA', '122'],
        ['CHOO', '124'],
        ['CHRISTINA', '124'],
        ['CHRISTOPHER', '124'],
        ['CLAIRE', '126'],
        ['CLYDE', '133'],
        ['COLLEEN', '134'],
        ['CYNTHIA', '144'],
        ['DANIEL', '153'],
        ['DARREN', '156'],
        ['DAVID', '156'],
        ['DAWN', '157'],
        ['DEBORAH', '158'],
        ['DENISE', '162'],
        ['DENNIS', '163'],
        ['DIANE', '167'],
        ['DINAH', '169'],
        ['DOMINIC', '172'],
        ['DONALD', '173'],
        ['DONNA', '174'],
        ['DOROTHY', '178'],
        ['DUSTIN', '184'],
        ['DYLAN', '185'],
        ['EDMOND', '190'],
        ['EDWARD', '192'],
        ['EDWIN', '193'],
        ['EILEEN', '197'],
        ['ELIZABETH', '212'],
        ['EMILY', '224'],
        ['ERIC', '232'],
        ['ESTHER', '239'],
        ['EVA', '250'],
        ['FRANKLIN', '267'],
        ['GABRIEL', '270'],
        ['GARY', '274'],
        ['GENEVA', '276'],
        ['GERARD', '279'],
        ['GINA', '288'],
        ['GLENN', '292'],
        ['GORDON', '297'],
        ['GUSTAVO', '308'],
        ['HARRY', '316'],
        ['HAZEL', '319'],
        ['HEATHER', '320'],
        ['HYOSOON', '353'],
        ['IRA', '364'],
        ['ISHA', '374'],
        ['ISMAEL', '375'],
        ['IVONNE', '378'],
        ['JACK', '380'],
        ['JACLYN', '381'],
        ['JAMES', '383'],
        ['JANET', '384'],
        ['JASON', '388'],
        ['JAY', '390'],
        ['JAZMINE', '392'],
        ['JEANNE', '392'],
        ['JEFFREY', '393'],
        ['JENNIFER', '395'],
        ['JEROME', '396'],
        ['JERYL', '400'],
        ['JESSICA', '400'],
        ['JOANNE', '402'],
        ['JOHN', '407'],
        ['JONATHAN', '409'],
        ['JORDAN', '410'],
        ['JOSEPH', '410'],
        ['JOSHUA', '411'],
        ['JOYCE', '414'],
        ['JUAN', '415'],
        ['JUDITH', '417'],
        ['JULIAN', '420'],
        ['JUNG', '422'],
        ['KALPANA', '424'],
        ['KAMINI', '424'],
        ['KAREN', '424'],
        ['KARL', '424'],
        ['KATHERINE', '427'],
        ['KATHLEEN', '427'],
        ['KAYLEE', '429'],
        ['KENNETH', '431'],
        ['KEISHIA', '432'],
        ['KEVIN', '433'],
        ['KIERAN', '434'],
        ['KIMBERLY', '435'],
        ['KRISTIE', '437'],
        ['KRISTINA', '437'],
        ['KYLE', '438'],
        ['LAUREN', '443'],
        ['LANA', '456'],
        ['LEVARN', '465'],
        ['LI', '467'],
        ['LIAM', '467'],
        ['LILI', '469'],
        ['LOIS', '481'],
        ['LOREN', '484'],
        ['LORRAINE', '487'],
        ['LUCIE', '490'],
        ['LYNN', '500'],
        ['MACKENZ', '503'],
        ['MAHESH', '509'],
        ['MAIASIA', '510'],
        ['MARCI', '517'],
        ['MARGARET', '518'],
        ['MARIA', '519'],
        ['MARISA', '519'],
        ['MARK', '521'],
        ['MARY', '527'],
        ['MASSIMO', '528'],
        ['MATTHEW', '529'],
        ['MAURICE', '531'],
        ['MEDORA', '537'],
        ['MEGHAN', '537'],
        ['MICHAEL', '544'],
        ['MILAGROS', '547'],
        ['MILDRED', '547'],
        ['MISHEL', '549'],
        ['NANCY', '557'],
        ['NEELA', '584'],
        ['NICHOLAS', '590'],
        ['NICOLE', '591'],
        ['NIDHI', '591'],
        ['NILABEN', '592'],
        ['NIRMAL', '594'],
        ['NOAH', '594'],
        ['PATRICE', '617'],
        ['PATRICK', '617'],
        ['PETER', '625'],
        ['PHYLLIS', '629'],
        ['PIETRO', '630'],
        ['POOJA', '632'],
        ['RANDOLPH', '640'],
        ['RASHMI', '642'],
        ['RAYMOND', '643'],
        ['REBECCA', '645'],
        ['RENA', '647'],
        ['RICHARD', '655'],
        ['RITESH', '658'],
        ['ROBERT', '658'],
        ['ROBIN', '659'],
        ['ROGER', '664'],
        ['ROLANDA', '665'],
        ['RONALD', '668'],
        ['ROSINA', '672'],
        ['RUTH', '681'],
        ['RYAN', '682'],
        ['SANKET', '691'],
        ['SAPAN', '691'],
        ['SARA', '691'],
        ['SCHUYLER', '693'],
        ['SEAN', '695'],
        ['SHARON', '703'],
        ['SHAYNE', '704'],
        ['SHELLEY', '705'],
        ['SMITA', '717'],
        ['SONAK', '718'],
        ['STEPHEN', '722'],
        ['SUSAN', '727'],
        ['TAMMY', '732'],
        ['TERRENCE', '733'],
        ['TERRY', '733'],
        ['THEODORE', '738'],
        ['THOMAS', '740'],
        ['TIMOTHY', '742'],
        ['VALERIE', '761'],
        ['VELON', '763'],
        ['VICTORIA', '767'],
        ['VITO', '772'],
        ['WARREN', '778'],
        ['WILLIAM', '785'],
        ['WILSON', '785'],
        ['WOONGHI', '788'],
        ['XAVIER', '788'],
        ['YASSER', '789'],
        ['YESENIA', '789'],
        ['YOOJUNG', '790'],
        ['YVETTE', '790'],
        ['YVONNE', '790'],
      ];

      var firstName_FL_IL_WI = [
        ['Albert', '20'],
        ['Alice', '20'],
        ['Ann', '40'],
        ['Anna', '40'],
        ['Anne', '40'],
        ['Annie', '40'],
        ['Arthur', '40'],
        ['Bernard', '80'],
        ['Bette', '80'],
        ['Bettie', '80'],
        ['Betty', '80'],
        ['Carl', '120'],
        ['Catherine', '120'],
        ['Charles', '140'],
        ['Dorthy', '180'],
        ['Edward', '220'],
        ['Elizabeth', '220'],
        ['Florence', '260'],
        ['Donald', '180'],
        ['Clara', '140'],
        ['Frank', '260'],
        ['George', '300'],
        ['Grace', '300'],
        ['Harold', '340'],
        ['Harriet', '340'],
        ['Harry', '360'],
        ['Hazel', '360'],
        ['Helen', '380'],
        ['Henry', '380'],
        ['James', '440'],
        ['Jane', '440'],
        ['Jayne', '440'],
        ['Jean', '460'],
        ['Joan', '480'],
        ['John', '460'],
        ['Joseph', '480'],
        ['Margaret', '560'],
        ['Martin', '560'],
        ['Marvin', '580'],
        ['Mary', '580'],
        ['Melvin', '600'],
        ['Mildred', '600'],
        ['Patricia', '680'],
        ['Paul', '680'],
        ['Richard', '740'],
        ['Robert', '760'],
        ['Ruby', '740'],
        ['Ruth', '760'],
        ['Thelma', '820'],
        ['Thomas', '820'],
        ['Walter', '900'],
        ['Wanda', '900'],
        ['William', '920'],
        ['Wilma', '920'],
      ];

      var firstInitial_FL_IL_WI = [
        ['A', '0'],
        ['B', '60'],
        ['C', '100'],
        ['D', '160'],
        ['E', '200'],
        ['F', '240'],
        ['G', '280'],
        ['H', '320'],
        ['I', '400'],
        ['J', '420'],
        ['K', '500'],
        ['L', '520'],
        ['M', '540'],
        ['N', '620'],
        ['O', '640'],
        ['P', '660'],
        ['Q', '700'],
        ['R', '720'],
        ['S', '780'],
        ['T', '800'],
        ['U', '840'],
        ['V', '860'],
        ['W', '880'],
        ['X', '940'],
        ['Y', '960'],
        ['Z', '980']
      ];
      
      var middleInitial_FL_IL_WI = [
        ['A', '1'],
        ['B', '2'],
        ['C', '3'],
        ['D', '4'],
        ['E', '5'],
        ['F', '6'],
        ['G', '7'],
        ['H', '8'],
        ['I', '9'],
        ['J', '10'],
        ['K', '11'],
        ['L', '12'],
        ['M', '13'],
        ['N', '14'],
        ['O', '14'],
        ['P', '15'],
        ['Q', '15'],
        ['R', '16'],
        ['S', '17'],
        ['T', '18'],
        ['U', '18'],
        ['V', '18'],
        ['W', '19'],
        ['X', '19'],
        ['Y', '19'],
        ['Z', '19']
      ];

      var firstMiddleName_MD_MI_MN = [
        ['a', '027'],
        ['aa', '028'],
        ['ab', '029'],
        ['ac', '030'],
        ['ad', '031'],
        ['ae', '032'],
        ['af', '033'],
        ['ag', '034'],
        ['ah', '035'],
        ['ai', '036'],
        ['aj', '037'],
        ['ak', '038'],
        ['al', '039'],
        ['ala', '040'],
        ['alb', '041'],
        ['alc', '042'],
        ['ald', '043'],
        ['ale', '044'],
        ['alf', '045'],
        ['alg', '046'],
        ['alh', '047'],
        ['ali', '048'],
        ['alj', '049'],
        ['alk', '050'],
        ['all', '051'],
        ['alm', '052'],
        ['aln', '053'],
        ['alo', '054'],
        ['alp', '055'],
        ['alq', '056'],
        ['alr', '057'],
        ['als', '058'],
        ['alt', '059'],
        ['alu', '060'],
        ['alv', '061'],
        ['alw', '062'],
        ['alx', '063'],
        ['aly', '064'],
        ['alz', '065'],
        ['am', '066'],
        ['an', '067'],
        ['ao', '068'],
        ['ap', '069'],
        ['aq', '070'],
        ['ar', '071'],
        ['as', '072'],
        ['at', '073'],
        ['au', '074'],
        ['av', '075'],
        ['aw', '076'],
        ['ax', '077'],
        ['ay', '078'],
        ['az', '079'],

        ['b', '080'],
        ['ba', '081'],
        ['bb', '082'],
        ['bc', '083'],
        ['bd', '084'],
        ['be', '085'],
        ['bf', '086'],
        ['bg', '087'],
        ['bh', '088'],
        ['bi', '089'],
        ['bj', '090'],
        ['bk', '091'],
        ['bl', '092'],
        ['bm', '093'],
        ['bn', '094'],
        ['bo', '095'],
        ['bp', '096'],
        ['bq', '097'],
        ['br', '098'],
        ['bs', '099'],
        ['bt', '100'],
        ['bu', '101'],
        ['bv', '102'],
        ['bw', '103'],
        ['bx', '104'],
        ['by', '105'],
        ['bz', '106'],

        ['c', '107'],
        ['ca', '108'],
        ['cb', '109'],
        ['cc', '110'],
        ['cd', '111'],
        ['ce', '112'],
        ['cf', '113'],
        ['cg', '114'],
        ['ch', '115'],
        ['ci', '116'],
        ['cj', '117'],
        ['ck', '118'],
        ['cl', '119'],
        ['cm', '120'],
        ['cn', '121'],
        ['co', '122'],
        ['cp', '123'],
        ['cq', '124'],
        ['cr', '125'],
        ['cs', '126'],
        ['ct', '127'],
        ['cu', '128'],
        ['cv', '129'],
        ['cw', '130'],
        ['cx', '131'],
        ['cy', '132'],
        ['cz', '133'],

        ['d', '134'],
        ['da', '135'],
        ['db', '136'],
        ['dc', '137'],
        ['dd', '138'],
        ['de', '139'],
        ['df', '140'],
        ['dg', '141'],
        ['dh', '142'],
        ['di', '143'],
        ['dj', '144'],
        ['dk', '145'],
        ['dl', '146'],
        ['dm', '147'],
        ['dn', '148'],
        ['do', '149'],
        ['dp', '150'],
        ['dq', '151'],
        ['dr', '152'],
        ['ds', '153'],
        ['dt', '154'],
        ['du', '155'],
        ['dv', '156'],
        ['dw', '157'],
        ['dx', '158'],
        ['dy', '159'],
        ['dz', '160'],

        ['e', '161'],
        ['ea', '162'],
        ['eb', '163'],
        ['ec', '164'],
        ['ed', '165'],
        ['eda', '166'],
        ['edb', '167'],
        ['edc', '168'],
        ['edd', '169'],
        ['ede', '170'],
        ['edf', '171'],
        ['edg', '172'],
        ['edh', '173'],
        ['edi', '174'],
        ['edj', '175'],
        ['edk', '176'],
        ['edl', '177'],
        ['edm', '178'],
        ['edn', '179'],
        ['edo', '180'],
        ['edp', '181'],
        ['edq', '182'],
        ['edr', '183'],
        ['eds', '184'],
        ['edt', '185'],
        ['edu', '186'],
        ['edv', '187'],
        ['edw', '188'],
        ['edward', '189'],
        ['edx', '190'],
        ['edy', '191'],
        ['edz', '192'],
        ['ee', '193'],
        ['ef', '194'],
        ['eg', '195'],
        ['eh', '196'],
        ['ei', '197'],
        ['ej', '198'],
        ['ek', '199'],
        ['el', '200'],
        ['ela', '201'],
        ['elb', '202'],
        ['elc', '203'],
        ['eld', '204'],
        ['ele', '205'],
        ['elf', '206'],
        ['elg', '207'],
        ['elh', '208'],
        ['eli', '209'],
        ['elizabeth', '210'],
        ['elj', '211'],
        ['elk', '212'],
        ['ell', '213'],
        ['ellen', '214'],
        ['elm', '215'],
        ['eln', '216'],
        ['elo', '217'],
        ['elp', '218'],
        ['elq', '219'],
        ['elr', '220'],
        ['els', '221'],
        ['elt', '222'],
        ['elu', '223'],
        ['elv', '224'],
        ['elw', '225'],
        ['elx', '226'],
        ['ely', '227'],
        ['elz', '228'],
        ['em', '229'],
        ['en', '230'],
        ['eo', '231'],
        ['ep', '232'],
        ['eq', '233'],
        ['er', '234'],
        ['es', '235'],
        ['et', '236'],
        ['eu', '237'],
        ['ev', '238'],
        ['ew', '239'],
        ['ex', '240'],
        ['ey', '241'],
        ['ez', '242'],

        ['f', '243'],
        ['fa', '244'],
        ['fb', '245'],
        ['fc', '246'],
        ['fd', '247'],
        ['fe', '248'],
        ['ff', '249'],
        ['fg', '250'],
        ['fh', '251'],
        ['fi', '252'],
        ['fj', '253'],
        ['fk', '254'],
        ['fl', '255'],
        ['fm', '256'],
        ['fn', '257'],
        ['fo', '258'],
        ['fp', '259'],
        ['fq', '260'],
        ['fr', '261'],
        ['fs', '262'],
        ['ft', '263'],
        ['fu', '264'],
        ['fv', '265'],
        ['fw', '266'],
        ['fx', '267'],
        ['fy', '268'],
        ['fz', '269'],

        ['g', '270'],
        ['ga', '271'],
        ['gb', '272'],
        ['gc', '273'],
        ['gd', '274'],
        ['ge', '275'],
        ['gf', '276'],
        ['gg', '277'],
        ['gh', '278'],
        ['gi', '279'],
        ['gj', '280'],
        ['gk', '281'],
        ['gl', '282'],
        ['gm', '283'],
        ['gn', '284'],
        ['go', '285'],
        ['gp', '286'],
        ['gq', '287'],
        ['gr', '288'],
        ['gs', '289'],
        ['gt', '290'],
        ['gu', '291'],
        ['gv', '292'],
        ['gw', '293'],
        ['gx', '294'],
        ['gy', '295'],
        ['gz', '296'],

        ['h', '297'],
        ['ha', '298'],
        ['hb', '299'],
        ['hc', '300'],
        ['hd', '301'],
        ['he', '302'],
        ['henry', '303'],
        ['hf', '304'],
        ['hg', '305'],
        ['hh', '306'],
        ['hi', '307'],
        ['hj', '308'],
        ['hk', '309'],
        ['hl', '310'],
        ['hm', '311'],
        ['hn', '312'],
        ['ho', '313'],
        ['hp', '314'],
        ['hq', '315'],
        ['hr', '316'],
        ['hs', '317'],
        ['ht', '318'],
        ['hu', '319'],
        ['hv', '320'],
        ['hw', '321'],
        ['hx', '322'],
        ['hy', '323'],
        ['hz', '324'],

        ['i', '325'],
        ['ia', '326'],
        ['ib', '327'],
        ['ic', '328'],
        ['id', '329'],
        ['ie', '330'],
        ['if', '331'],
        ['ig', '332'],
        ['ih', '333'],
        ['ii', '334'],
        ['ij', '335'],
        ['ik', '336'],
        ['il', '337'],
        ['im', '338'],
        ['in', '339'],
        ['io', '340'],
        ['ip', '341'],
        ['iq', '342'],
        ['ir', '343'],
        ['is', '344'],
        ['it', '345'],
        ['iu', '346'],
        ['iv', '347'],
        ['iw', '348'],
        ['ix', '349'],
        ['iy', '350'],
        ['iz', '351'],

        ['j', '352'],
        ['ja', '353'],
        ['jaa', '354'],
        ['jab', '355'],
        ['jac', '356'],
        ['jad', '357'],
        ['jae', '358'],
        ['jaf', '359'],
        ['jag', '360'],
        ['jah', '361'],
        ['jai', '362'],
        ['jaj', '363'],
        ['jak', '364'],
        ['jal', '365'],
        ['jam', '366'],
        ['james', '367'],
        ['jan', '368'],
        ['jao', '369'],
        ['jap', '370'],
        ['jaq', '371'],
        ['jar', '372'],
        ['jas', '373'],
        ['jat', '374'],
        ['jau', '375'],
        ['jav', '376'],
        ['jaw', '377'],
        ['jax', '378'],
        ['jay', '379'],
        ['jaz', '380'],
        ['jb', '381'],
        ['jc', '382'],
        ['jd', '383'],
        ['je', '384'],
        ['jea', '385'],
        ['jeb', '386'],
        ['jec', '387'],
        ['jed', '388'],
        ['jee', '389'],
        ['jef', '390'],
        ['jeg', '391'],
        ['jeh', '392'],
        ['jei', '393'],
        ['jej', '394'],
        ['jek', '395'],
        ['jel', '396'],
        ['jem', '397'],
        ['jen', '398'],
        ['jeo', '399'],
        ['jep', '400'],
        ['jeq', '401'],
        ['jer', '402'],
        ['jes', '403'],
        ['jet', '404'],
        ['jeu', '405'],
        ['jev', '406'],
        ['jew', '407'],
        ['jex', '408'],
        ['jey', '409'],
        ['jez', '410'],
        ['jf', '411'],
        ['jg', '412'],
        ['jh', '413'],
        ['ji', '414'],
        ['jj', '415'],
        ['jk', '416'],
        ['jl', '417'],
        ['jm', '418'],
        ['jn', '419'],
        ['jo', '420'],
        ['joa', '421'],
        ['job', '422'],
        ['joc', '423'],
        ['jod', '424'],
        ['joe', '425'],
        ['jof', '426'],
        ['jog', '427'],
        ['joh', '428'],
        ['john', '429'],
        ['joi', '430'],
        ['joj', '431'],
        ['jok', '432'],
        ['jol', '433'],
        ['jom', '434'],
        ['jon', '435'],
        ['joo', '436'],
        ['jop', '437'],
        ['joq', '438'],
        ['jor', '439'],
        ['jos', '440'],
        ['joseph', '441'],
        ['jot', '442'],
        ['jou', '443'],
        ['jov', '444'],
        ['jow', '445'],
        ['jox', '446'],
        ['joy', '447'],
        ['joz', '448'],
        ['jp', '449'],
        ['jq', '450'],
        ['jr', '451'],
        ['js', '452'],
        ['jt', '453'],
        ['ju', '454'],
        ['jv', '455'],
        ['jw', '456'],
        ['jx', '457'],
        ['jy', '458'],
        ['jz', '459'],

        ['k', '460'],
        ['ka', '461'],
        ['kb', '462'],
        ['kc', '463'],
        ['kd', '464'],
        ['ke', '465'],
        ['kf', '466'],
        ['kg', '467'],
        ['kh', '468'],
        ['ki', '469'],
        ['kj', '470'],
        ['kk', '471'],
        ['kl', '472'],
        ['km', '473'],
        ['kn', '474'],
        ['ko', '475'],
        ['kp', '476'],
        ['kq', '477'],
        ['kr', '478'],
        ['ks', '479'],
        ['kt', '480'],
        ['ku', '481'],
        ['kv', '482'],
        ['kw', '483'],
        ['kx', '484'],
        ['ky', '485'],
        ['kz', '486'],

        ['l', '487'],
        ['la', '488'],
        ['lb', '489'],
        ['lc', '490'],
        ['ld', '491'],
        ['le', '492'],
        ['lea', '493'],
        ['leb', '494'],
        ['lec', '495'],
        ['led', '496'],
        ['lee', '497'],
        ['lef', '498'],
        ['leg', '499'],
        ['leh', '500'],
        ['lei', '501'],
        ['lej', '502'],
        ['lek', '503'],
        ['lel', '504'],
        ['lem', '505'],
        ['len', '506'],
        ['leo', '507'],
        ['lep', '508'],
        ['leq', '509'],
        ['ler', '510'],
        ['les', '511'],
        ['let', '512'],
        ['leu', '513'],
        ['lev', '514'],
        ['lew', '515'],
        ['lex', '516'],
        ['ley', '517'],
        ['lez', '518'],
        ['lf', '519'],
        ['lg', '520'],
        ['lh', '521'],
        ['li', '522'],
        ['lj', '523'],
        ['lk', '524'],
        ['ll', '525'],
        ['lm', '526'],
        ['ln', '527'],
        ['lo', '528'],
        ['loa', '529'],
        ['lob', '530'],
        ['loc', '531'],
        ['lod', '532'],
        ['loe', '533'],
        ['lof', '534'],
        ['log', '535'],
        ['loh', '536'],
        ['loi', '537'],
        ['loj', '538'],
        ['lok', '539'],
        ['lol', '540'],
        ['lom', '541'],
        ['lon', '542'],
        ['loo', '543'],
        ['lop', '544'],
        ['loq', '545'],
        ['lor', '546'],
        ['los', '547'],
        ['lot', '548'],
        ['lou', '549'],
        ['lov', '550'],
        ['low', '551'],
        ['lox', '552'],
        ['loy', '553'],
        ['loz', '554'],
        ['lp', '555'],
        ['lq', '556'],
        ['lr', '557'],
        ['ls', '558'],
        ['lt', '559'],
        ['lu', '560'],
        ['lv', '561'],
        ['lw', '562'],
        ['lx', '563'],
        ['ly', '564'],
        ['lz', '565'],

        ['m', '566'],
        ['ma', '567'],
        ['maa', '568'],
        ['mab', '569'],
        ['mac', '570'],
        ['mad', '571'],
        ['mae', '572'],
        ['maf', '573'],
        ['mag', '574'],
        ['mah', '575'],
        ['mai', '576'],
        ['maj', '577'],
        ['mak', '578'],
        ['mal', '579'],
        ['mam', '580'],
        ['man', '581'],
        ['mao', '582'],
        ['map', '583'],
        ['maq', '584'],
        ['mar', '585'],
        ['margaret', '586'],
        ['mary', '587'],
        ['mas', '588'],
        ['mat', '589'],
        ['mau', '590'],
        ['mav', '591'],
        ['maw', '592'],
        ['max', '593'],
        ['may', '594'],
        ['maz', '595'],
        ['mb', '596'],
        ['mc', '597'],
        ['md', '598'],
        ['me', '599'],
        ['mf', '600'],
        ['mg', '601'],
        ['mh', '602'],
        ['mi', '603'],
        ['mj', '604'],
        ['mk', '605'],
        ['ml', '606'],
        ['mm', '607'],
        ['mn', '608'],
        ['mo', '609'],
        ['mp', '610'],
        ['mq', '611'],
        ['mr', '612'],
        ['ms', '613'],
        ['mt', '614'],
        ['mu', '615'],
        ['mv', '616'],
        ['mw', '617'],
        ['mx', '618'],
        ['my', '619'],
        ['mz', '620'],

        ['n', '621'],
        ['na', '622'],
        ['nb', '623'],
        ['nc', '624'],
        ['nd', '625'],
        ['ne', '626'],
        ['nf', '627'],
        ['ng', '628'],
        ['nh', '629'],
        ['ni', '630'],
        ['nj', '631'],
        ['nk', '632'],
        ['nl', '633'],
        ['nm', '634'],
        ['nn', '635'],
        ['no', '636'],
        ['np', '637'],
        ['nq', '638'],
        ['nr', '639'],
        ['ns', '640'],
        ['nt', '641'],
        ['nu', '642'],
        ['nv', '643'],
        ['nw', '644'],
        ['nx', '645'],
        ['ny', '646'],
        ['nz', '647'],

        ['o', '648'],
        ['oa', '649'],
        ['ob', '650'],
        ['oc', '651'],
        ['od', '652'],
        ['oe', '653'],
        ['of', '654'],
        ['og', '655'],
        ['oh', '656'],
        ['oi', '657'],
        ['oj', '658'],
        ['ok', '659'],
        ['ol', '660'],
        ['om', '661'],
        ['on', '662'],
        ['oo', '663'],
        ['op', '664'],
        ['oq', '665'],
        ['or', '666'],
        ['os', '667'],
        ['ot', '668'],
        ['ou', '669'],
        ['ov', '670'],
        ['ow', '671'],
        ['ox', '672'],
        ['oy', '673'],
        ['oz', '674'],

        ['p', '675'],
        ['pa', '676'],
        ['pb', '677'],
        ['pc', '678'],
        ['pd', '679'],
        ['pe', '680'],
        ['pf', '681'],
        ['pg', '682'],
        ['ph', '683'],
        ['pi', '684'],
        ['pj', '685'],
        ['pk', '686'],
        ['pl', '687'],
        ['pm', '688'],
        ['pn', '689'],
        ['po', '690'],
        ['pp', '691'],
        ['pq', '692'],
        ['pr', '693'],
        ['ps', '694'],
        ['pt', '695'],
        ['pu', '696'],
        ['pv', '697'],
        ['pw', '698'],
        ['px', '699'],
        ['py', '700'],
        ['pz', '701'],

        ['q', '702'],
        ['qa', '703'],
        ['qb', '704'],
        ['qc', '705'],
        ['qd', '706'],
        ['qe', '707'],
        ['qf', '708'],
        ['qg', '709'],
        ['qh', '710'],
        ['qi', '711'],
        ['qj', '712'],
        ['qk', '713'],
        ['ql', '714'],
        ['qm', '715'],
        ['qn', '716'],
        ['qo', '717'],
        ['qp', '718'],
        ['qq', '719'],
        ['qr', '720'],
        ['qs', '721'],
        ['qt', '722'],
        ['qu', '723'],
        ['qv', '724'],
        ['qw', '725'],
        ['qx', '726'],
        ['qy', '727'],
        ['qz', '728'],

        ['r', '729'],
        ['ra', '730'],
        ['rb', '731'],
        ['rc', '732'],
        ['rd', '733'],
        ['re', '734'],
        ['rf', '735'],
        ['rg', '736'],
        ['rh', '737'],
        ['ri', '738'],
        ['rj', '739'],
        ['rk', '740'],
        ['rl', '741'],
        ['rm', '742'],
        ['rn', '743'],
        ['ro', '744'],
        ['robert', '745'],
        ['rp', '746'],
        ['rq', '747'],
        ['rr', '748'],
        ['rs', '749'],
        ['rt', '750'],
        ['ru', '751'],
        ['rv', '752'],
        ['rw', '753'],
        ['rx', '754'],
        ['ry', '755'],
        ['rz', '756'],

        ['s', '757'],
        ['sa', '758'],
        ['sb', '759'],
        ['sc', '760'],
        ['sd', '761'],
        ['se', '762'],
        ['sf', '763'],
        ['sg', '764'],
        ['sh', '765'],
        ['si', '766'],
        ['sj', '767'],
        ['sk', '768'],
        ['sl', '769'],
        ['sm', '770'],
        ['sn', '771'],
        ['so', '772'],
        ['sp', '773'],
        ['sq', '774'],
        ['sr', '775'],
        ['ss', '776'],
        ['st', '777'],
        ['su', '778'],
        ['sv', '779'],
        ['sw', '780'],
        ['sx', '781'],
        ['sy', '782'],
        ['sz', '783'],

        ['t', '784'],
        ['ta', '785'],
        ['tb', '786'],
        ['tc', '787'],
        ['td', '788'],
        ['te', '789'],
        ['tf', '790'],
        ['tg', '791'],
        ['th', '792'],
        ['ti', '793'],
        ['tj', '794'],
        ['tk', '795'],
        ['tl', '796'],
        ['tm', '797'],
        ['tn', '798'],
        ['to', '799'],
        ['tp', '800'],
        ['tq', '801'],
        ['tr', '802'],
        ['ts', '803'],
        ['tt', '804'],
        ['tu', '805'],
        ['tv', '806'],
        ['tw', '807'],
        ['tx', '808'],
        ['ty', '809'],
        ['tz', '810'],

        ['u', '811'],
        ['ua', '812'],
        ['ub', '813'],
        ['uc', '814'],
        ['ud', '815'],
        ['ue', '816'],
        ['uf', '817'],
        ['ug', '818'],
        ['uh', '819'],
        ['ui', '820'],
        ['uj', '821'],
        ['uk', '822'],
        ['ul', '823'],
        ['um', '824'],
        ['un', '825'],
        ['uo', '826'],
        ['up', '827'],
        ['uq', '828'],
        ['ur', '829'],
        ['us', '830'],
        ['ut', '831'],
        ['uu', '832'],
        ['uv', '833'],
        ['uw', '834'],
        ['ux', '835'],
        ['uy', '836'],
        ['uz', '837'],

        ['v', '838'],
        ['va', '839'],
        ['vb', '840'],
        ['vc', '841'],
        ['vd', '842'],
        ['ve', '843'],
        ['vf', '844'],
        ['vg', '845'],
        ['vh', '846'],
        ['vi', '847'],
        ['vj', '848'],
        ['vk', '849'],
        ['vl', '850'],
        ['vm', '851'],
        ['vn', '852'],
        ['vo', '853'],
        ['vp', '854'],
        ['vq', '855'],
        ['vr', '856'],
        ['vs', '857'],
        ['vt', '858'],
        ['vu', '859'],
        ['vv', '860'],
        ['vw', '861'],
        ['vx', '862'],
        ['vy', '863'],
        ['vz', '864'],

        ['w', '865'],
        ['wa', '866'],
        ['wb', '867'],
        ['wc', '868'],
        ['wd', '869'],
        ['we', '870'],
        ['wf', '871'],
        ['wg', '872'],
        ['wh', '873'],
        ['wi', '874'],
        ['wia', '875'],
        ['wib', '876'],
        ['wic', '877'],
        ['wid', '878'],
        ['wie', '879'],
        ['wif', '880'],
        ['wig', '881'],
        ['wih', '882'],
        ['wii', '883'],
        ['wij', '884'],
        ['wik', '885'],
        ['wil', '886'],
        ['william', '887'],
        ['wim', '888'],
        ['win', '889'],
        ['wio', '890'],
        ['wip', '891'],
        ['wiq', '892'],
        ['wir', '893'],
        ['wis', '894'],
        ['wit', '895'],
        ['wiu', '896'],
        ['wiv', '897'],
        ['wiw', '898'],
        ['wix', '899'],
        ['wiy', '900'],
        ['wiz', '901'],
        ['wj', '902'],
        ['wk', '903'],
        ['wl', '904'],
        ['wm', '905'],
        ['wn', '906'],
        ['wo', '907'],
        ['wp', '908'],
        ['wq', '909'],
        ['wr', '910'],
        ['ws', '911'],
        ['wt', '912'],
        ['wu', '913'],
        ['wv', '914'],
        ['ww', '915'],
        ['wx', '916'],
        ['wy', '917'],
        ['wz', '918'],

        ['x', '919'],
        ['xa', '920'],
        ['xb', '921'],
        ['xc', '922'],
        ['xd', '923'],
        ['xe', '924'],
        ['xf', '925'],
        ['xg', '926'],
        ['xh', '927'],
        ['xi', '928'],
        ['xj', '929'],
        ['xk', '930'],
        ['xl', '931'],
        ['xm', '932'],
        ['xn', '933'],
        ['xo', '934'],
        ['xp', '935'],
        ['xq', '936'],
        ['xr', '937'],
        ['xs', '938'],
        ['xt', '939'],
        ['xu', '940'],
        ['xv', '941'],
        ['xw', '942'],
        ['xx', '943'],
        ['xy', '944'],
        ['xz', '945'],

        ['y', '946'],
        ['ya', '947'],
        ['yb', '948'],
        ['yc', '949'],
        ['yd', '950'],
        ['ye', '951'],
        ['yf', '952'],
        ['yg', '953'],
        ['yh', '954'],
        ['yi', '955'],
        ['yj', '956'],
        ['yk', '957'],
        ['yl', '958'],
        ['ym', '959'],
        ['yn', '960'],
        ['yo', '961'],
        ['yp', '962'],
        ['yq', '963'],
        ['yr', '964'],
        ['ys', '965'],
        ['yt', '966'],
        ['yu', '967'],
        ['yv', '968'],
        ['yw', '969'],
        ['yx', '970'],
        ['yy', '971'],
        ['yz', '972'],

        ['z', '973'],
        ['za', '974'],
        ['zb', '975'],
        ['zc', '976'],
        ['zd', '977'],
        ['ze', '978'],
        ['zf', '979'],
        ['zg', '980'],
        ['zh', '981'],
        ['zi', '982'],
        ['zj', '983'],
        ['zk', '984'],
        ['zl', '985'],
        ['zm', '986'],
        ['zn', '987'],
        ['zo', '988'],
        ['zp', '989'],
        ['zq', '990'],
        ['zr', '991'],
        ['zs', '992'],
        ['zt', '993'],
        ['zu', '994'],
        ['zv', '995'],
        ['zw', '996'],
        ['zx', '997'],
        ['zy', '998'],
        ['zz', '999']
      ];

      var middleName_MD_MI_MN = [
        ['a', '001'],
        ['b', '002'],
        ['c', '003'],
        ['d', '004'],
        ['e', '005'],
        ['f', '006'],
        ['g', '007'],
        ['h', '008'],
        ['i', '009'],
        ['j', '010'],
        ['k', '011'],
        ['l', '012'],
        ['m', '013'],
        ['n', '014'],
        ['o', '015'],
        ['p', '016'],
        ['q', '017'],
        ['r', '018'],
        ['s', '019'],
        ['t', '020'],
        ['u', '021'],
        ['v', '022'],
        ['w', '023'],
        ['x', '024'],
        ['y', '025'],
        ['z', '026'],
      ];

      var dob_MD_MI_MN = [

        // format is mmdd, where dd of 00 means no day specifed

        ['0100', '001'],
        ['0101', '002'],
        ['0102', '007'],
        ['0103', '010'],
        ['0104', '012'],
        ['0105', '017'],
        ['0106', '020'],
        ['0107', '022'],
        ['0108', '025'],
        ['0109', '027'],
        ['0110', '030'],
        ['0111', '032'],
        ['0112', '035'],
        ['0113', '037'],
        ['0114', '040'],
        ['0115', '042'],
        ['0116', '045'],
        ['0117', '047'],
        ['0118', '050'],
        ['0119', '052'],
        ['0120', '055'],
        ['0121', '057'],
        ['0122', '060'],
        ['0123', '062'],
        ['0124', '065'],
        ['0125', '067'],
        ['0126', '070'],
        ['0127', '072'],
        ['0128', '075'],
        ['0129', '077'],
        ['0130', '080'],
        ['0131', '082'],

        ['0200', '085'],
        ['0201', '086'],
        ['0202', '088'],
        ['0203', '091'],
        ['0204', '093'],
        ['0205', '096'],
        ['0206', '098'],
        ['0207', '101'],
        ['0208', '103'],
        ['0209', '106'],
        ['0210', '108'],
        ['0211', '111'],
        ['0212', '113'],
        ['0213', '116'],
        ['0214', '118'],
        ['0215', '121'],
        ['0216', '123'],
        ['0217', '126'],
        ['0218', '128'],
        ['0219', '131'],
        ['0220', '133'],
        ['0221', '136'],
        ['0222', '138'],
        ['0223', '141'],
        ['0224', '143'],
        ['0225', '146'],
        ['0226', '148'],
        ['0227', '151'],
        ['0228', '153'],
        ['0229', '156'],

        ['0300', '158'],
        ['0301', '159'],
        ['0302', '162'],
        ['0303', '164'],
        ['0304', '167'],
        ['0305', '169'],
        ['0306', '172'],
        ['0307', '174'],
        ['0308', '177'],
        ['0309', '182'],
        ['0310', '184'],
        ['0311', '187'],
        ['0312', '189'],
        ['0313', '192'],
        ['0314', '194'],
        ['0315', '197'],
        ['0316', '199'],
        ['0317', '202'],
        ['0318', '204'],
        ['0319', '207'],
        ['0320', '227'],
        ['0321', '229'],
        ['0322', '232'],
        ['0323', '234'],
        ['0324', '237'],
        ['0325', '239'],
        ['0326', '242'],
        ['0327', '244'],
        ['0328', '247'],
        ['0329', '249'],
        ['0330', '252'],
        ['0331', '254'],

        ['0400', '257'],
        ['0401', '258'],
        ['0402', '260'],
        ['0403', '263'],
        ['0404', '265'],
        ['0405', '268'],
        ['0406', '270'],
        ['0407', '273'],
        ['0408', '275'],
        ['0409', '278'],
        ['0410', '280'],
        ['0411', '283'],
        ['0412', '285'],
        ['0413', '288'],
        ['0414', '290'],
        ['0415', '293'],
        ['0416', '295'],
        ['0417', '298'],
        ['0418', '300'],
        ['0419', '303'],
        ['0420', '305'],
        ['0421', '308'],
        ['0422', '310'],
        ['0423', '313'],
        ['0424', '315'],
        ['0425', '318'],
        ['0426', '320'],
        ['0427', '323'],
        ['0428', '325'],
        ['0429', '328'],
        ['0430', '330'],

        ['0500', '333'],
        ['0501', '334'],
        ['0502', '336'],
        ['0503', '339'],
        ['0504', '341'],
        ['0505', '344'],
        ['0506', '346'],
        ['0507', '349'],
        ['0508', '351'],
        ['0509', '354'],
        ['0510', '356'],
        ['0511', '359'],
        ['0512', '361'],
        ['0513', '364'],
        ['0514', '366'],
        ['0515', '369'],
        ['0516', '371'],
        ['0517', '374'],
        ['0518', '376'],
        ['0519', '379'],
        ['0520', '381'],
        ['0521', '384'],
        ['0522', '386'],
        ['0523', '389'],
        ['0524', '391'],
        ['0525', '394'],
        ['0526', '396'],
        ['0527', '399'],
        ['0528', '401'],
        ['0529', '404'],
        ['0530', '406'],
        ['0531', '409'],

        ['0600', '411'],
        ['0601', '412'],
        ['0602', '415'],
        ['0603', '417'],
        ['0604', '420'],
        ['0605', '422'],
        ['0606', '425'],
        ['0607', '427'],
        ['0608', '430'],
        ['0609', '432'],
        ['0610', '435'],
        ['0611', '437'],
        ['0612', '440'],
        ['0613', '442'],
        ['0614', '445'],
        ['0615', '447'],
        ['0616', '450'],
        ['0617', '452'],
        ['0618', '467'],
        ['0619', '470'],
        ['0620', '472'],
        ['0621', '475'],
        ['0622', '477'],
        ['0623', '480'],
        ['0624', '482'],
        ['0625', '497'],
        ['0626', '500'],
        ['0627', '502'],
        ['0628', '505'],
        ['0629', '507'],
        ['0630', '517'],

        ['0700', '520'],
        ['0701', '521'],
        ['0702', '523'],
        ['0703', '526'],
        ['0704', '528'],
        ['0705', '534'],
        ['0706', '537'],
        ['0707', '539'],
        ['0708', '542'],
        ['0709', '544'],
        ['0710', '547'],
        ['0711', '549'],
        ['0712', '552'],
        ['0713', '554'],
        ['0714', '557'],
        ['0715', '559'],
        ['0716', '562'],
        ['0717', '564'],
        ['0718', '567'],
        ['0719', '569'],
        ['0720', '572'],
        ['0721', '574'],
        ['0722', '577'],
        ['0723', '579'],
        ['0724', '582'],
        ['0725', '584'],
        ['0726', '587'],
        ['0727', '589'],
        ['0728', '592'],
        ['0729', '594'],
        ['0730', '597'],
        ['0731', '599'],

        ['0800', '602'],
        ['0801', '603'],
        ['0802', '605'],
        ['0803', '608'],
        ['0804', '610'],
        ['0805', '613'],
        ['0806', '615'],
        ['0807', '618'],
        ['0808', '620'],
        ['0809', '623'],
        ['0810', '625'],
        ['0811', '628'],
        ['0812', '630'],
        ['0813', '633'],
        ['0814', '635'],
        ['0815', '638'],
        ['0816', '640'],
        ['0817', '643'],
        ['0818', '645'],
        ['0819', '648'],
        ['0820', '650'],
        ['0821', '653'],
        ['0822', '655'],
        ['0823', '658'],
        ['0824', '660'],
        ['0825', '663'],
        ['0826', '665'],
        ['0827', '668'],
        ['0828', '670'],
        ['0829', '673'],
        ['0830', '675'],
        ['0831', '678'],

        ['0900', '680'],
        ['0901', '681'],
        ['0902', '684'],
        ['0903', '686'],
        ['0904', '689'],
        ['0905', '691'],
        ['0906', '694'],
        ['0907', '696'],
        ['0908', '699'],
        ['0909', '701'],
        ['0910', '704'],
        ['0911', '706'],
        ['0912', '709'],
        ['0913', '711'],
        ['0914', '714'],
        ['0915', '716'],
        ['0916', '719'],
        ['0917', '721'],
        ['0918', '724'],
        ['0919', '726'],
        ['0920', '729'],
        ['0921', '731'],
        ['0922', '734'],
        ['0923', '736'],
        ['0924', '739'],
        ['0925', '741'],
        ['0926', '744'],
        ['0927', '746'],
        ['0928', '749'],
        ['0929', '751'],
        ['0930', '754'],

        ['1000', '756'],
        ['1001', '757'],
        ['1002', '760'],
        ['1003', '762'],
        ['1004', '765'],
        ['1005', '767'],
        ['1006', '770'],
        ['1007', '772'],
        ['1008', '775'],
        ['1009', '777'],
        ['1010', '780'],
        ['1011', '782'],
        ['1012', '785'],
        ['1013', '787'],
        ['1014', '790'],
        ['1015', '792'],
        ['1016', '797'],
        ['1017', '800'],
        ['1018', '802'],
        ['1019', '807'],
        ['1020', '810'],
        ['1021', '812'],
        ['1022', '815'],
        ['1023', '817'],
        ['1024', '820'],
        ['1025', '822'],
        ['1026', '825'],
        ['1027', '827'],
        ['1028', '830'],
        ['1029', '832'],
        ['1030', '835'],
        ['1031', '837'],

        ['1100', '840'],
        ['1101', '841'],
        ['1102', '843'],
        ['1103', '846'],
        ['1104', '848'],
        ['1105', '851'],
        ['1106', '853'],
        ['1107', '856'],
        ['1108', '858'],
        ['1109', '861'],
        ['1110', '863'],
        ['1111', '866'],
        ['1112', '868'],
        ['1113', '871'],
        ['1114', '873'],
        ['1115', '876'],
        ['1116', '878'],
        ['1117', '881'],
        ['1118', '883'],
        ['1119', '886'],
        ['1120', '888'],
        ['1121', '891'],
        ['1122', '893'],
        ['1123', '896'],
        ['1124', '898'],
        ['1125', '901'],
        ['1126', '903'],
        ['1127', '906'],
        ['1128', '908'],
        ['1129', '911'],
        ['1130', '913'],

        ['1200', '916'],
        ['1201', '917'],
        ['1202', '919'],
        ['1203', '922'],
        ['1204', '924'],
        ['1205', '927'],
        ['1206', '929'],
        ['1207', '932'],
        ['1208', '934'],
        ['1209', '937'],
        ['1210', '939'],
        ['1211', '942'],
        ['1212', '944'],
        ['1213', '947'],
        ['1214', '949'],
        ['1215', '952'],
        ['1216', '954'],
        ['1217', '957'],
        ['1218', '959'],
        ['1219', '962'],
        ['1220', '964'],
        ['1221', '967'],
        ['1222', '969'],
        ['1223', '972'],
        ['1224', '974'],
        ['1225', '977'],
        ['1226', '983'],
        ['1227', '985'],
        ['1228', '990'],
        ['1229', '993'],
        ['1230', '995'],
        ['1231', '998']
      ]

      var middleInitial_NJ = [
        ['', '00'],
        ['A', '61'],
        ['B', '62'],
        ['C', '63'],
        ['D', '64'],
        ['E', '65'],
        ['F', '66'],
        ['G', '67'],
        ['H', '68'],
        ['I', '69'],
        ['J', '71'],
        ['K', '72'],
        ['L', '73'],
        ['M', '74'],
        ['N', '75'],
        ['O', '76'],
        ['P', '77'],
        ['Q', '78'],
        ['R', '79'],
        ['S', '82'],
        ['T', '83'],
        ['U', '84'],
        ['V', '85'],
        ['W', '86'],
        ['X', '87'],
        ['Y', '88'],
        ['Z', '89']
      ]

      var eyeColor_NJ_ANSI = [
        ['?', '0'],
        ['BLK', '1'],
        ['BRO', '2'],
        ['GRY', '3'],
        ['BLU', '4'],
        ['HAZ', '5'],
        ['GRN', '6'],
        ['BLK', '7'],
        ['?', '8'],
        ['PNK', '9']
      ]

      var eyeColor_NJ = [
        ['?', '0'],
        ['Black', '1'],
        ['Brown', '2'],
        ['Grey', '3'],
        ['Blue', '4'],
        ['Hazel', '5'],
        ['Green', '6'],
        ['Black', '7'],
        ['?', '8'],
        ['Pink', '9']
      ]


function CalculateDL(lastname, middlename, firstname, dob, state) {
    valid = true; // true until we learn otherwise
    var lastName = lastname.toLowerCase();
    var firstName = firstname.toLowerCase();
    var middleName = middlename.toLowerCase();
    var month = dob.slice(0,2);
    var day = dob.slice(2,4);

    console.log(lastName)
    console.log(firstName)
    console.log(middleName)
    console.log(month)
    console.log(day)
    console.log()
    console.log()

    var lastCode = amerSoundex(lastName, true);
    if (lastCode == "") {
      lastCode = "0000"; // so that initial display of license doesn't look strange
    }

    var firstCode = "000";
    var middleCode = "000";
    var dobCode = "000";

    // MARYLAND, MICHIGAN, MINNESOTA

    if (state == "MD" || state == "MI" || state == "MN") {

      var fullyCoded = "";
      var firstUnused = "";

      // encode first and middle name

      for (var i=firstMiddleName_MD_MI_MN.length-1; i>=0; i--) { // start from end to get longest match
        var target = firstMiddleName_MD_MI_MN[i][0].toLowerCase();
        if (target.length > firstName.length) {
          continue;
        }
        if (firstName.substr(0, target.length) == target) {
          firstCode = String(firstMiddleName_MD_MI_MN[i][1]);
          fullyCoded = (firstName == target);
          if (!fullyCoded) {
            firstUnused = firstName.charAt(target.length);
          }
          break;
        }
      }
      while (firstCode.length < 3) {
        firstCode = "0" + firstCode;
      }

      if (middleName != "") {
        for (var i=firstMiddleName_MD_MI_MN.length-1; i>=0; i--) { // start from end to get longest match
          var target = firstMiddleName_MD_MI_MN[i][0].toLowerCase();
          if (target.length > middleName.length) {
            continue;
          }
          if (middleName.substr(0, target.length) == target) {
            middleCode = String(firstMiddleName_MD_MI_MN[i][1]);
            break;
          }
        }
      } else { // middle name is blank
        if (fullyCoded) {
          middleCode = "000";
        } else {
          for (var i=0; i<middleName_MD_MI_MN.length; i++) {
            if (middleName_MD_MI_MN[i][0] == firstUnused) {
              middleCode = String(middleName_MD_MI_MN[i][1]);
              break;
            }
          }
        }
      }
      while (middleCode.length < 3) {
        middleCode = "0" + middleCode;
      }

      // encode date of birth

      if (month != "00") { // don't encode dob if no month is specified
        var dob = month + day;
        for (var i=0; i<dob_MD_MI_MN.length; i++) {
          if (dob_MD_MI_MN[i][0] == dob) {
            dobCode = String(dob_MD_MI_MN[i][1]);
            break;
          }
        }
      }
      while (dobCode.length < 3) {
        dobCode = "0" + dobCode;
      }

      //getTargetElement('license').innerHTML = lastCode + "-" + firstCode + "-" + middleCode + "-" + dobCode;
      if (state == "MI") {
        return lastCode[0] + " " + lastCode.slice(-3) + " " + firstCode + " " + middleCode + " " + dobCode;
      } else if (state == "MD") {
        return lastCode[0] + "-" + lastCode.slice(-3) + "-" + firstCode + "-" + middleCode + "-" + dobCode;
      } else if (state == "MN") {
        return lastCode + firstCode + middleCode + dobCode;
      }


    // FLORIDA, ILLINOIS, WISCONSIN

    } else if (state == "FL" || state == "IL" || state == "WI") {

      // encode first and middle name

      if (firstName.length == 0) {
        firstCode = 0;
      } else {
        var found = false;
        for (var i=0; i<firstName_FL_IL_WI.length; i++) {
          if (firstName_FL_IL_WI[i][0].toLowerCase() == firstName) {
            firstCode = firstName_FL_IL_WI[i][1];
             found = true;
            break;
          }
        }
        if (!found) { // exact name was not found, go by the initial
          var firstInitial = firstName.charAt(0).toLowerCase();
          for (var i=0; i<firstInitial_FL_IL_WI.length; i++) {
            if (firstInitial_FL_IL_WI[i][0].toLowerCase() == firstInitial) {
              firstCode = firstInitial_FL_IL_WI[i][1];
              break;
            }
          }
        }
      }
      if (middleName.length == 0) {
        middleCode = "";
      } else {
        var middleInitial = middleName.charAt(0).toLowerCase();
        for (var i=0; i<middleInitial_FL_IL_WI.length; i++) {
          if (middleInitial_FL_IL_WI[i][0].toLowerCase() == middleInitial) {
            middleCode = middleInitial_FL_IL_WI[i][1];
            break;
          }
        }
      }
      firstCode = String(firstCode - (-middleCode));
      while (firstCode.length < 3) {
        firstCode = "0" + firstCode;
      }

      // encode year

      var yearCode = dob.slice(-2);
      console.log(yearCode)
      
      // encode dob and gender

      var multiplier = 0;
      var genderCode = 0;
      if (state == "FL" || state == "WI") {
        multiplier = 40;
        if (getTargetElement("inputSex") == "F") {
          genderCode = 500;
        }
      } else if (state == "IL") {
        multiplier = 31;
        if (getTargetElement("inputSex") == "F") {
          genderCode = 600;
        }
      }
      var dobCode = String((month-1)*multiplier - (-day) - (-genderCode));
      while (dobCode.length < 3) {
        dobCode = "0" + dobCode;
      }

      // format the license

      if (state == "FL") {
        getTargetElement('license').innerHTML =
          lastCode + "-" + firstCode + "-" + yearCode + "-" + dobCode + "-?";
      } else if (state == "IL") {
        getTargetElement('license').innerHTML =
          lastCode + "-" + firstCode + yearCode.charAt(0) + "-" + yearCode.charAt(1) + dobCode;
      } else if (state == "WI") {
          return lastCode + "-" + firstCode + yearCode.charAt(0) + "-" + yearCode.charAt(1) + dobCode + "-00";
      }

      // WASHINGTON

    } else if (state == "WA") {

      // encode name

      lastCode = lastName.toUpperCase();
      while (lastCode.length < 5) {
        lastCode += "*";
      }
      lastCode = lastCode.substr(0, 5);

      if (firstName == "") {
        firstCode = "*";
      } else {
        firstCode = firstName.charAt(0).toUpperCase();
      }

      if (middleName == "") {
        middleCode = "*";
      } else {
        middleCode = middleName.charAt(0).toUpperCase();
      }

      // encode dob
      
      var year = dob.slice(-4);
      console.log(year)
      year = year.substr(year.length - 2); // gets the last two digits of the year
      var yearCode = 100 - year;
      yearCode = "0" + yearCode; // so that it is at least two characters long
      yearCode = yearCode.substr(yearCode.length - 2); // so that year 00 doesn't give 100

      var monthCode1 = monthArray1_WA[Number(month)];
      var monthCode2 = monthArray2_WA[Number(month)];

      var dayCode = dayArray_WA[Number(day)];

      var license1 =
        lastCode + firstCode + middleCode + yearCode + monthCode1 + dayCode;
      var license2 =
        lastCode + firstCode + middleCode + yearCode + monthCode2 + dayCode;
      
      // compute checksum

      var checksum1 = 0;
      var checksum2 = 0;
      for (var i=0; i<license1.length; i++) { // both license1 and license2 are the same length
        if (i%2 == 1) {
          checksum1 = checksum1 - ChecksumDigit_WA(license1.charAt(i));              
          checksum2 = checksum2 - ChecksumDigit_WA(license2.charAt(i));              
        } else {
          checksum1 = checksum1 - (-ChecksumDigit_WA(license1.charAt(i)));              
          checksum2 = checksum2 - (-ChecksumDigit_WA(license2.charAt(i)));              
        }
      }
      checksum1 = checksum1 % 10;
      checksum2 = checksum2 % 10;

      license1 = license1.substr(0, 9) + checksum1 + license1.substr(9);
      license2 = license2.substr(0, 9) + checksum2 + license2.substr(9);

      getTargetElement('license').innerHTML = license1;
      getTargetElement('license2').innerHTML = license2;

    // NEW HAMPSHIRE

    } else if (state == "NH") {

      if (lastName == "") {
        lastCode = "00";
      } else if (lastName.length == 1) {
        lastCode = lastName.charAt(0) + "0";
      } else {
        lastCode = lastName.charAt(0) + lastName.charAt(lastName.length - 1);
      }
      if (firstName == "") {
        firstCode = "0";
      } else {
        firstCode = firstName.charAt(0);
      }
      var monthCode = month;
      var yearCode = dob.slice(-4);
      console.log(yearCode)
      yearCode = yearCode.substr(yearCode.length - 2);
      var dayCode = day;

      getTargetElement('license').innerHTML = monthCode + lastCode + firstCode + yearCode + dayCode + "?";

    // NEW JERSEY

    } else if (state == "NJ") {

      if (lastName == "") {
        lastCode = "?????";
      } else {
        lastCode = lastName.charAt(0).toUpperCase() + "????";
      }

      if (firstName.length == 0) {
        firstCode = "???";
      } else {
        var found = false;
        for (var i=0; i<firstName_NJ.length; i++) {
          if (firstName_NJ[i][0].toLowerCase() == firstName) {
            firstCode = firstName_NJ[i][1];
            found = true;
            break;
          }
        }
        if (!found) { // exact name was not found
          firstCode = "???";
        }
      }

      var middleInitial = "";
      if (middleName != "") {
        middleInitial = middleName.charAt(0).toUpperCase();
      }
      var middleInitialCode = "";
      for (var i=0; i<middleInitial_NJ.length; i++) {
        if (middleInitial_NJ[i][0] == middleInitial) {
          middleInitialCode = middleInitial_NJ[i][1];
          break;
        }
      }
      var monthCode = month;
      if (getTargetElement("inputSex") == "F") {
        monthCode = String(50 + Number(monthCode));
      }
      var yearCode = dob.slice(-2);
      var eyeColor = getTargetElement("inputEyeColorCode").value;
      console.log("EYE COLOR:")
      console.log(eyeColor)
      var eyeColorCode = "??";
      for (var i=0; i<eyeColor_NJ.length; i++) {
        if (eyeColor_NJ_ANSI[i][0] == eyeColor) {
          eyeColorCode = eyeColor_NJ_ANSI[i][1];
          break;
        }
      }

      console.log("eyeColorCode",eyeColorCode)
      console.log("yearCode",yearCode)
      console.log("monthCode",monthCode)
      console.log("middleInitialCode",middleInitialCode)
      console.log("firstCode",firstCode)
      
      return lastCode + " " + firstCode + middleInitialCode + " " + monthCode + yearCode + eyeColorCode;

    } else {
      alert("invalid state 2");
    }
}



// provide alternate entry point so that dm.js and soundex.js can be called the same way
function getSoundex(input, strictRules) {
    return amerSoundex(input, strictRules);
  }
  
  function amerSoundex(input, strictRules) {
    var result = "";
    var lastcode = "";
    var first = true;
    for (var i=0; i<input.length; i++) {
      var ch = input.charAt(i).toLowerCase();
      if (ch < 'a' || ch > 'z') {
        continue;
      }
      switch (ch) {
        case 'b':
        case 'f':
        case 'p':
        case 'v':
          if (lastcode != "1") {
            result += "1";
            lastcode = "1";
          }
          break;
        case 'c':
        case 'g':
        case 'j':
        case 'k':
        case 'q':
        case 's':
        case 'x':
        case 'z':
          if (lastcode != "2") {
            result += "2";
            lastcode = "2";
          }
          break;
        case 'd':
        case 't':
          if (lastcode != "3") {
            result += "3";
            lastcode = "3";
          }
          break;
        case 'l':
          if (lastcode != "4") {
            result += "4";
            lastcode = "4";
          }
          break;
        case 'm':
        case 'n':
          if (lastcode != "5") {
            result += "5";
            lastcode = "5";
          }
          break;
        case 'r':
          if (lastcode != "6") {
            result += "6";
            lastcode = "6";
          }
          break;
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u':
        case 'y':
          lastcode = "";
          break;
        case 'w':
        case 'h':
          if (!strictRules) {
            lastcode = "";
          }
          break;
      }
      if (first) {
        result = input.charAt(i).toUpperCase();
        first = false;
      }
      if (result.length >= 4) {
        break;
      }
    }
    if (result.length == 1) {
      result += "000";
    } else if (result.length == 2) {
      result += "00";
    } else if (result.length == 3) {
      result += "0";
    }
    return result;
  }
  

// =========================================================================
// FINAL BATCH STATE GENERATOR FUNCTIONS (TX, UT, VT, VA, WA, DC, WV, WI, WY)
// =========================================================================

// --- TEXAS ---
function TX_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}

function TX_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(20);
}

function TX_calculate_DD_improved() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    var year = issueDate.slice(-2);
    var month = issueDate.slice(0, 2);
    var day = issueDate.slice(2, 4);

    getTargetElement("inputDD").value = '006' + year[0] + '9' + year[1] + '8' + month[0] + '0' + month[1] + '5' + day[0] + '0' + day[1] + getRandomNumericString(6);
}

function TX_2016_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!");
        return;
    }
    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 1);
    
    var year = issueDateDATE.toLocaleString("default", { year: "numeric" });
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });
    var formattedDate = year + month + day;

    getTargetElement("inputICN").value = documentNumber + "  " + formattedDate;
}

function TX_2020_calculate_ICN() {
    getTargetElement("inputICN").value = "10000" + getRandomNumericString(6);
}

// --- UTAH ---
function UT_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "1" + getRandomNumericString(8);
}

function UT_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(8);
}

function UT_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    getTargetElement("inputICN").value = documentNumber + "UT" + getRandomDigit() + getRandomDigit() + "SL01";
}

function UT_2016_calculate_REAL_ID(alert) {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        if (alert) { showInputDataAlert("REAL ID calculation error. Incorrect issue date!"); }
        return;
    }
    var inputDateObject = new Date(
        parseInt(issueDate.substr(4, 4)),
        parseInt(issueDate.substr(0, 2)) - 1,
        parseInt(issueDate.substr(2, 2))
    );
    var comparisonDate = new Date(2019, 1, 1);
    var val = (inputDateObject >= comparisonDate) ? "F" : "N";
    var el = getTargetElement("inputIsRealID");
    if (el) {
        el.value = val;
    }
    var aamvaRealId = getTargetElement("aamva-realid");
    if (aamvaRealId) {
        aamvaRealId.value = (val === 'F') ? "Yes" : "No";
    }
}

// --- VERMONT ---
function VT_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}

function VT_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect document number!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    getTargetElement('inputDD').value = issueDate.slice(0, 4) + issueDate.slice(-2) + getRandomNumericString(4) + documentNumber;
}

// --- VIRGINIA ---
function VA_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(8);
}

function VA_calculate_DD() {
    getTargetElement("inputDD").value = "0" + getRandomNumericString(8);
}

function VA_calculate_ICN() {
    getTargetElement("inputICN").value = "0060101" + getRandomNumericString(9);
}

// --- WASHINGTON ---
function WA_calculate_documentNumber() {
    var random_string = "";
    for (var i = 0; i < 8; i++) { random_string += getRandomLetterAndDigit(); }
    getTargetElement('inputDocumentNumber').value = "WDL" + random_string + "B";
}

function WA_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!");
        return;
    }
    getTargetElement("inputAudit").value = getRandomLetter() + issueDate.slice(0, 2) + issueDate.slice(2, 4) + issueDate.slice(-2) + "98" + getRandomNumericString(4);
}

function WA_calculate_AUDIT_with_P() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!");
        return;
    }
    getTargetElement("inputAudit").value = 'P' + issueDate.slice(0, 2) + issueDate.slice(2, 4) + issueDate.slice(-2) + getRandomNumericString(6);
}

function WA_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 12) {
        showInputDataAlert("DD calculation error. Incorrect document number!");
        return;
    }
    var auditInfo = getTargetElement("inputAudit").value;
    if (auditInfo.length != 13) {
        showInputDataAlert("DD calculation error. Incorrect audit information!");
        return;
    }
    getTargetElement("inputDD").value = documentNumber + auditInfo;
}

// --- WASHINGTON DC ---
function DC_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}

function DC_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(8);
}

function DC_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit calculation error. Incorrect issue date!");
        return;
    }
    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 5);
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });
    var formattedDate = month + day + issueDate.slice(-4);

    getTargetElement("inputAudit").value = formattedDate + "_" + getRandomNumericString(6) + "_" + getRandomDigit() + "_" + getRandomNumericString(3);
}

// --- WEST VIRGINIA ---
function WV_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(6);
}

function WV_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!");
        return;
    }
    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!");
        return;
    }
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!");
        return;
    }
    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("DD calculation error. Incorrect First name!");
        return;
    }
    getTargetElement('inputDD').value = birthDate.slice(0, 4) + birthDate.slice(-2) + lastName[0] + firstName[0] + expiryDate.slice(-2) + expiryDate.slice(0, 2);
}

function WV_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 7) {
        showInputDataAlert("ICN calculation error. Incorrect document number!");
        return;
    }
    getTargetElement('inputICN').value = documentNumber + "WV" + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + "01";
}

// --- WISCONSIN ---
function WI_calculate_documentNumber() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!");
        return;
    }
    var firstName = getTargetElement("inputFirstName").value;
    if (!firstName) {
        showInputDataAlert("Document number calculation error. Incorrect First name!");
        return;
    }
    var middleName = getTargetElement("inputMiddleName").value;
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("Document number calculation error. Incorrect birth date!");
        return;
    }
    if (typeof CalculateDL === 'function') {
        getTargetElement('inputDocumentNumber').value = CalculateDL(lastName, middleName, firstName, birthDate, "WI");
    } else {
        getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(13);
    }
}

function WI_calculate_DD() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("DD calculation error. Incorrect Last name!");
        return;
    }
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!");
        return;
    }
    var sampleVal = (Math.random() < 0.5) ? "10" : "15";
    getTargetElement("inputDD").value = "OT" + lastName[0].toUpperCase() + getRandomLetter() + getRandomLetter()
    + issueDate.slice(-4) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + sampleVal + getRandomNumericString(6);
}

function WI_calculate_ICN() {
    getTargetElement("inputICN").value = "0130100" + getRandomNumericString(9);
}

// --- WYOMING ---
function WY_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "11" + getRandomNumericString(7);
}

function WY_calculate_DD() {
    var v = "100003" + getRandomNumericString(3) + "7";
    getTargetElement('inputICN').value = v;
    getTargetElement('inputDD').value = v;
}

function WY_calculate_ICN() {
    var v = "100003" + getRandomNumericString(3) + "7";
    getTargetElement('inputICN').value = v;
    getTargetElement('inputDD').value = v;
}


function runStateCalculation(field, stateSlug) {
        const slugClean = (stateSlug || 'AL').toUpperCase();
        const baseState = slugClean.split('_')[0];
        
        let fnName = null;
        
        const revInfo = (typeof getRevisionInfo === 'function') ? getRevisionInfo(slugClean) : null;
        
        const NO_ICN_SET = new Set([
            'CO', 'CO_2015', 'CO_2022',
            'DC',
            'NY', 'NY_2017', 'NY_2022',
            'SC',
            'VT',
            'WA', 'WA_2019', 'WA_2025',
            'AB', 'BC', 'NB', 'NL', 'NS', 'NU', 'PE', 'YT'
        ]);

        const NO_DD_SET = new Set([
            'MI', 'MI_2024',
            'NM',
            'BC', 'NB', 'NL', 'NS', 'NU'
        ]);

        if (field === 'icn' || field === 'dck') {
            if (NO_ICN_SET.has(slugClean) || NO_ICN_SET.has(baseState) || (revInfo && revInfo.has_icn === false)) {
                const icnEl = getTargetElement('inputICN');
                if (icnEl) icnEl.value = '';
                return true;
            }
            const candidates = [
                (slugClean === 'GA_2015' ? 'GA_calculate_ICN_2015' : null),
                (slugClean === 'GA_2019' ? 'GA_calculate_ICN' : null),
                (slugClean === 'AL_2022' ? 'AL_2024_calculate_ICN' : null),
                (slugClean.startsWith('KY') ? 'KY_2012_calculate_ICN' : null),
                `${slugClean}_calculate_ICN`,
                `${baseState}_calculate_ICN`,
                `${slugClean}_calculate_icn`,
                `${baseState}_calculate_icn`
            ].filter(Boolean);
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'dd' || field === 'dcf') {
            if (NO_DD_SET.has(slugClean) || NO_DD_SET.has(baseState) || (revInfo && revInfo.has_dd === false)) {
                const ddEl = getTargetElement('inputDD');
                if (ddEl) ddEl.value = '';
                return true;
            }
            const candidates = [
                (slugClean === 'GA_2015' ? 'GA_calculate_DD_2015' : null),
                (slugClean === 'GA_2019' ? 'GA_calculate_DD' : null),
                `${slugClean}_calculate_DD`,
                `${baseState}_calculate_DD`,
                `${slugClean}_calculate_AUDIT`,
                `${baseState}_calculate_AUDIT`
            ].filter(Boolean);
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'audit' || field === 'dcj') {
            const hasAudit = (revInfo && revInfo.has_audit === true) || (slugClean === 'DC' || baseState === 'CO' || baseState === 'WA' || baseState === 'LA');
            if (!hasAudit) {
                const auditEl = getTargetElement('inputAudit');
                if (auditEl) auditEl.value = '';
                return true;
            }
            const candidates = [
                (slugClean === 'WA_2025' ? 'WA_calculate_AUDIT_with_P' : null),
                `${slugClean}_calculate_AUDIT`,
                `${baseState}_calculate_AUDIT`,
                `${slugClean}_calculate_audit`,
                `${baseState}_calculate_audit`
            ].filter(Boolean);
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'id' || field === 'dl' || field === 'doc') {
            const candidates = [
                `${slugClean}_calculate_documentNumber`,
                (slugClean === 'AL_2022' ? 'AL_2024_calculate_documentNumber' : null),
                `${baseState}_calculate_documentNumber`
            ].filter(Boolean);
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'exp' || field === 'doe') {
            if (slugClean === 'AL_2022' || slugClean === 'AL_2024') {
                if (typeof window.makeDOEfromDOI_full === 'function') {
                    window.makeDOEfromDOI_full(4);
                    return true;
                }
            } else if (slugClean === 'AL') {
                if (typeof window.makeRandomDOE_AL === 'function') {
                    window.makeRandomDOE_AL();
                    return true;
                }
            } else if (slugClean === 'AZ' || slugClean === 'AZ_2023') {
                if (typeof window.AZ_makeRandomDOE === 'function') {
                    window.AZ_makeRandomDOE();
                    return true;
                }
            } else if (slugClean === 'CT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'MA') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('MI')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'MA') {
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                } else if (slugClean.startsWith('MI')) {
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                } else if (slugClean === 'NM') {
                if (typeof window.makeRandomDOE_minus_day === 'function') {
                    window.makeRandomDOE_minus_day(8);
                    return true;
                }
            } else if (slugClean.startsWith('NY') || slugClean === 'NC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('ND')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'OH') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'OK') {
                if (typeof window.OK_calculate_DOE === 'function') {
                    window.OK_calculate_DOE(4);
                    return true;
                }
            } else if (slugClean === 'OR') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('PA')) {
                if (typeof window.makeRandomDOE_plus_day === 'function') {
                    window.makeRandomDOE_plus_day(4);
                    return true;
                }
            } else if (slugClean === 'RI') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'RI_2022') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'SC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'SD') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'TN') {
                if (typeof window.makeRandomDOE_fromDOI === 'function') {
                    window.makeRandomDOE_fromDOI(8);
                    return true;
                }
            } else if (slugClean.startsWith('TX')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'UT_2016') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'UT_2021' || slugClean === 'UT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'VT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'VA') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WA') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'WA_2025') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'DC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WV') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('WI')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WY') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('NV')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('NH')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('NJ')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean.startsWith('MO') || slugClean === 'MT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean.startsWith('NE')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('CA') || slugClean.startsWith('CO')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'AK' || slugClean === 'AR' || slugClean === 'DE' || slugClean === 'FL' || slugClean.startsWith('GA')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            }
        } else if (field === 'issued' || field === 'doi') {
            if (slugClean === 'AL_2022' || slugClean === 'AL_2024') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeDOEfromDOI_full === 'function') {
                        window.makeDOEfromDOI_full(4);
                    }
                    return true;
                }
            } else if (slugClean === 'AL') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE_AL === 'function') {
                        window.makeRandomDOE_AL();
                    }
                    return true;
                }
            } else if (slugClean === 'CA') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'CA_2024') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2025);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'CO_2015') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2017);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'CO_2022') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2022);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'CT') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'DE' || slugClean === 'FL') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'GA_2015') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2016, 2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'GA_2019') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'AK') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'AZ') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2015);
                    if (typeof window.AZ_makeRandomDOE === 'function') window.AZ_makeRandomDOE();
                    return true;
                }
            } else if (slugClean === 'AZ_2023') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.AZ_makeRandomDOE === 'function') window.AZ_makeRandomDOE();
                    return true;
                }
            } else if (slugClean === 'MA') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2017);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    if (typeof window.MA_calculate_DD === 'function') window.MA_calculate_DD();
                    if (typeof window.MA_calculate_ICN === 'function') window.MA_calculate_ICN();
                    return true;
                }
            } else if (slugClean === 'MI') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2021);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'MI_2024') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2024);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'NM') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE_minus_day === 'function') window.makeRandomDOE_minus_day(8);
                    return true;
                }
            } else if (slugClean === 'NY_2017') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2017);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'NY_2022' || slugClean === 'NY') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2022);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'NC') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2016);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'ND') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'ND_2023') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'OH') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'OK') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.OK_calculate_REAL_ID === 'function') window.OK_calculate_REAL_ID();
                    if (typeof window.OK_calculate_DOE === 'function') window.OK_calculate_DOE(4);
                    return true;
                }
            } else if (slugClean === 'OR') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'PA') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2017);
                    if (typeof window.makeRandomDOE_plus_day === 'function') window.makeRandomDOE_plus_day(4);
                    return true;
                }
            } else if (slugClean === 'PA_2022') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeRandomDOE_plus_day === 'function') window.makeRandomDOE_plus_day(4);
                    return true;
                }
            } else if (slugClean === 'RI') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'RI_2022') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'SC') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'SD') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'TN') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2016);
                    if (typeof window.TN_calculate_REAL_ID === 'function') window.TN_calculate_REAL_ID();
                    if (typeof window.makeRandomDOE_fromDOI === 'function') window.makeRandomDOE_fromDOI(8);
                    return true;
                }
            } else if (slugClean === 'TX_2016') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'TX_2020' || slugClean === 'TX') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2021);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'UT_2016') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.UT_2016_calculate_REAL_ID === 'function') window.UT_2016_calculate_REAL_ID();
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'UT_2021' || slugClean === 'UT') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'VT') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2022);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'VA') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2017);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WA') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'WA_2025') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2025);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'DC') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2019);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WV') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WI') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2016);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WI_2023') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2023);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WY') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'NV_2008') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'NV_2021') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2021);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'NH') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'NH_2024') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2024);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'NJ_2020') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'MO_2012') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'MO_2020') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'MT') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'NE_2017') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2020);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'NE_2021') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2021);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'AR') {
                if (typeof window.makeRandomDOI === 'function') {
                    window.makeRandomDOI(2018);
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                    return true;
                }
            }
        } else if (field === 'dob') {
            if (typeof window.makeRandomDOB === 'function') {
                window.makeRandomDOB();
                if (slugClean === 'AZ' || slugClean === 'AZ_2023') {
                    if (typeof window.AZ_makeRandomDOE === 'function') window.AZ_makeRandomDOE();
                } else if (slugClean === 'CT') {
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(6);
                } else if (slugClean === 'NM') {
                if (typeof window.makeRandomDOE_minus_day === 'function') {
                    window.makeRandomDOE_minus_day(8);
                    return true;
                }
            } else if (slugClean.startsWith('NY') || slugClean === 'NC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('ND')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'OH') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'OK') {
                if (typeof window.OK_calculate_DOE === 'function') {
                    window.OK_calculate_DOE(4);
                    return true;
                }
            } else if (slugClean === 'OR') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('PA')) {
                if (typeof window.makeRandomDOE_plus_day === 'function') {
                    window.makeRandomDOE_plus_day(4);
                    return true;
                }
            } else if (slugClean === 'RI') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'RI_2022') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'SC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'SD') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'TN') {
                if (typeof window.makeRandomDOE_fromDOI === 'function') {
                    window.makeRandomDOE_fromDOI(8);
                    return true;
                }
            } else if (slugClean.startsWith('TX')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'UT_2016') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'UT_2021' || slugClean === 'UT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'VT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean === 'VA') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WA') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean === 'WA_2025') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean === 'DC') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WV') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('WI')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean === 'WY') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('NV')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(8);
                    return true;
                }
            } else if (slugClean.startsWith('NH')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('NJ')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(4);
                    return true;
                }
            } else if (slugClean.startsWith('MO') || slugClean === 'MT') {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(6);
                    return true;
                }
            } else if (slugClean.startsWith('NE')) {
                if (typeof window.makeRandomDOE === 'function') {
                    window.makeRandomDOE(5);
                    return true;
                }
            } else if (slugClean.startsWith('CA') || slugClean.startsWith('CO')) {
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(5);
                } else if (slugClean === 'AK' || slugClean === 'AR' || slugClean === 'DE' || slugClean === 'FL' || slugClean.startsWith('GA')) {
                    if (typeof window.makeRandomDOE === 'function') window.makeRandomDOE(8);
                }
                return true;
            }
        } else if (field === 'option' || field === 'opt') {
            const candidates = [
                `${slugClean}_calculate_optionNumber`,
                `${baseState}_calculate_optionNumber`
            ];
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'real_id') {
            const candidates = [
                `${slugClean}_calculate_REAL_ID`,
                `${baseState}_calculate_REAL_ID`
            ];
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        }

        if (fnName && typeof window[fnName] === 'function') {
            try {
                window[fnName]();
            } catch (err) {
                console.error(`Error running ${fnName}:`, err);
            }
        }

        // Authentic fallback from reference demographic defaults if empty
        const defaults = (typeof getStateDemographicDefaults === 'function') ? getStateDemographicDefaults(slugClean) : null;
        if (field === 'icn' || field === 'dck') {
            const el = getTargetElement('inputICN');
            if (el && !el.value && defaults && defaults.sample_icn && (!revInfo || revInfo.has_icn !== false)) {
                el.value = defaults.sample_icn;
                return true;
            }
            return !!(el && el.value);
        } else if (field === 'dd' || field === 'dcf') {
            const el = getTargetElement('inputDD');
            if (el && !el.value && defaults && defaults.sample_dd && (!revInfo || revInfo.has_dd !== false)) {
                el.value = defaults.sample_dd;
                return true;
            }
            return !!(el && el.value);
        } else if (field === 'audit' || field === 'dcj') {
            const el = getTargetElement('inputAudit');
            if (el && !el.value && defaults && defaults.sample_audit && (revInfo && revInfo.has_audit)) {
                el.value = defaults.sample_audit;
                return true;
            }
            return !!(el && el.value);
        }
        return true;
    }

    // Expose globals
    
        // Final batch aliases
        if (typeof TX_calculate_DD_improved === 'function') {
            window.TX_calculate_DD = TX_calculate_DD_improved;
            window.TX_2016_calculate_DD = TX_calculate_DD_improved;
            window.TX_2020_calculate_DD = TX_calculate_DD_improved;
        }
        if (typeof TX_calculate_documentNumber === 'function') {
            window.TX_2016_calculate_documentNumber = TX_calculate_documentNumber;
            window.TX_2020_calculate_documentNumber = TX_calculate_documentNumber;
        }
        if (typeof UT_calculate_documentNumber === 'function') {
            window.UT_2016_calculate_documentNumber = UT_calculate_documentNumber;
            window.UT_2021_calculate_documentNumber = UT_calculate_documentNumber;
        }
        if (typeof UT_calculate_DD === 'function') {
            window.UT_2016_calculate_DD = UT_calculate_DD;
            window.UT_2021_calculate_DD = UT_calculate_DD;
        }
        if (typeof UT_calculate_ICN === 'function') {
            window.UT_2016_calculate_ICN = UT_calculate_ICN;
            window.UT_2021_calculate_ICN = UT_calculate_ICN;
        }
        if (typeof WA_calculate_documentNumber === 'function') {
            window.WA_2025_calculate_documentNumber = WA_calculate_documentNumber;
        }
        if (typeof WA_calculate_DD === 'function') {
            window.WA_2025_calculate_DD = WA_calculate_DD;
        }
        if (typeof WA_calculate_AUDIT_with_P === 'function') {
            window.WA_2025_calculate_AUDIT = WA_calculate_AUDIT_with_P;
        }
        if (typeof WI_calculate_documentNumber === 'function') {
            window.WI_2023_calculate_documentNumber = WI_calculate_documentNumber;
        }
        if (typeof WI_calculate_DD === 'function') {
            window.WI_2023_calculate_DD = WI_calculate_DD;
        }
        if (typeof WI_calculate_ICN === 'function') {
            window.WI_2023_calculate_ICN = WI_calculate_ICN;
        }
        window.VT_calculate_ICN = function() { var el = getTargetElement('inputICN'); if (el) el.value = ''; };
        window.WA_calculate_ICN = function() { var el = getTargetElement('inputICN'); if (el) el.value = ''; };
        window.WA_2025_calculate_ICN = function() { var el = getTargetElement('inputICN'); if (el) el.value = ''; };
        window.DC_calculate_ICN = function() { var el = getTargetElement('inputICN'); if (el) el.value = ''; };
        window.MI_2024_calculate_documentNumber = MI_calculate_documentNumber;
        window.MI_2024_calculate_ICN = MI_calculate_ICN;

        
    // =========================================================================
    // CERTIFIED REFERENCE DEMOGRAPHIC DEFAULTS (86 Jurisdictions / Revisions)
    // Extracted directly from reference specifications (pdf417.pro)
    // =========================================================================
    const STATE_DEMOGRAPHIC_DEFAULTS = {
  "AL": {
    "street": "3704 3RD PL NE",
    "city": "Center Point",
    "zip": "352151400",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "realid": "F",
    "sample_dl": "7253231",
    "sample_icn": "00000000002953983401",
    "sample_dd": "NONE",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AL_2022": {
    "street": "3704 3RD PL NE",
    "city": "Center Point",
    "zip": "352151400",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "realid": "F",
    "sample_dl": "50764683",
    "sample_icn": "50764683783372324201",
    "sample_dd": "NONE",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AK": {
    "street": "3201 Legacy Dr",
    "city": "Anchorage",
    "zip": "995162765",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "realid": "F",
    "sample_dl": "7476172",
    "sample_icn": "1000728920",
    "sample_dd": "8475992 460200826PNV-1",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AZ": {
    "street": "4248 S Red Rock St",
    "city": "Gilbert",
    "zip": "85297",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "D28375514",
    "sample_icn": "16361AZ0068743540301",
    "sample_dd": "5641GS561D7977J0",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AR": {
    "street": "707 Fairway Cir",
    "city": "Springdale",
    "zip": "727641027",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "926203938",
    "sample_icn": "0210119836604160",
    "sample_dd": "212232102 2160",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "CA": {
    "street": "516 Anson Ct",
    "city": "Ronhert Park",
    "zip": "875420000",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "D1234567",
    "sample_icn": "21237D12345670401",
    "sample_dd": "08/25/202165508/AAFD/26",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "CA_2024": {
    "street": "516 Anson Ct",
    "city": "Ronhert Park",
    "zip": "875420000",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "D1234567",
    "sample_icn": "21237D12345670401",
    "sample_dd": "08/25/202165508/AAFD/26",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "CO_2015": {
    "street": "435 N 35th Ave",
    "city": "Greeley",
    "zip": "80634",
    "class": "R",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "316168738",
    "sample_icn": "",
    "sample_dd": "5211068",
    "sample_audit": "CODL_0_082720_01876",
    "has_icn": false,
    "has_dd": true,
    "has_audit": true
  },
  "CO_2022": {
    "street": "2913 W 17th St",
    "city": "Greeley",
    "zip": "806346807",
    "class": "R",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "316168738",
    "sample_icn": "",
    "sample_dd": "5211068",
    "sample_audit": "CODL_0_082720_01876",
    "has_icn": false,
    "has_dd": true,
    "has_audit": true
  },
  "CT": {
    "street": "229 Wintonbury Ave",
    "city": "Bloomfield",
    "zip": "060021949",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "137010702",
    "sample_icn": "137010702CT3ENV01",
    "sample_dd": "20082614021501MVS1",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "DE": {
    "street": "132 Widgeon Way",
    "city": "Bridgeville",
    "zip": "199332421",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "1653296",
    "sample_icn": "0110157073938301",
    "sample_dd": "L20200826649034C",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "DC": {
    "street": "1424 Carrollsburg Pl SW",
    "city": "Washington",
    "zip": "20024-4102",
    "class": "D",
    "restrictions": "0",
    "endorsements": "O",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_icn": "",
    "sample_dd": "99423549",
    "sample_audit": "08312020_949312_4_672",
    "has_icn": false,
    "has_dd": true,
    "has_audit": true
  },
  "FL": {
    "street": "24044 SW 109THPATH",
    "city": "Homestead",
    "zip": "330325131",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "sample_dl": "H655435851100",
    "sample_icn": "0100385619573853",
    "sample_dd": "N322108265187",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "GA_2015": {
    "street": "5485 Copperfield Ct NW",
    "city": "Lilburn",
    "zip": "300475809",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "089007583",
    "sample_icn": "2119423584100401",
    "sample_dd": "211942358410046350",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "GA_2019": {
    "street": "5485 Copperfield Ct NW",
    "city": "Lilburn",
    "zip": "30047-5809",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "089007583",
    "sample_icn": "10001308391",
    "sample_dd": "026568004260034885",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "HI": {
    "street": "1413 Hoohulu St",
    "city": "Pearl City",
    "zip": "96782",
    "class": "3",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "H00716258",
    "sample_icn": "20200902_053001_2_690",
    "sample_dd": "20200826662548377772-ICWH",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "IL": {
    "street": "5620 Pebblebeach Dr",
    "city": "Hanover Park",
    "zip": "60133",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "realid": "F",
    "sample_dl": "D83877907578",
    "sample_icn": "D83877907578ILO9TL01",
    "sample_dd": "20210826494MG4931",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "IN": {
    "street": "144 Pine View Dr",
    "city": "Carmel",
    "zip": "46032",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "2739-94-6144",
    "sample_icn": "0370101906831627",
    "sample_dd": "08262081000337",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MA": {
    "street": "105 New Estate Rd",
    "city": "Littleton",
    "zip": "014601131",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "S94506149",
    "sample_icn": "20239S945061490601",
    "sample_dd": "08262020 REV 02222016",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MI": {
    "street": "1040 Southlawn Ave",
    "city": "East Lansing",
    "zip": "488233041",
    "class": "O",
    "sex": "M",
    "realid": "F",
    "sample_dl": "D 000 429 497 042",
    "sample_icn": "D000429497042197001152024",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": false,
    "has_audit": false
  },
  "MI_2024": {
    "street": "1040 Southlawn Ave",
    "city": "East Lansing",
    "zip": "488233041",
    "class": "O",
    "sex": "M",
    "realid": "F",
    "sample_dl": "D 000 429 497 042",
    "sample_icn": "D000429497042197001152024",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": false,
    "has_audit": false
  },
  "NJ_2020": {
    "street": "5 Willow Spring Dr",
    "city": "Morristown",
    "zip": "079602832",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "opt1": "WV",
    "opt2": "REN",
    "opt3": "24.00",
    "sample_dl": "D26229134787273",
    "sample_icn": "DWCDQP3F98YNLD8M01",
    "sample_dd": "WV202023900007318",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NM": {
    "street": "10801 Hagen Rd NE",
    "city": "Albuquerque",
    "zip": "87111",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "036408091",
    "sample_icn": "03640809101",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": false,
    "has_audit": false
  },
  "NY_2017": {
    "street": "710 Hubbell Rd",
    "city": "Churchville",
    "zip": "144289335",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "759547815",
    "sample_icn": "",
    "sample_dd": "C6JEH2RP06",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "OH": {
    "street": "1101 W Forest Rd",
    "city": "Lakewood",
    "zip": "441071040",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "KD298593",
    "sample_icn": "L93259228",
    "sample_dd": "889287786",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "PA_2022": {
    "street": "857 Chandlee Dr",
    "city": "West Chester",
    "zip": "19382",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "95744057",
    "sample_icn": "0250018505120106",
    "sample_dd": "2023967803632140000058560",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "SC": {
    "street": "619 Bucks Trail",
    "city": "Longs",
    "zip": "295688906",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "107844741",
    "sample_icn": "",
    "sample_dd": "8513940203280844439",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "SD": {
    "street": "320 W Chapelwood Dr",
    "city": "Brandon",
    "zip": "570052115",
    "class": "1",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "01384574",
    "sample_icn": "0420001234567890",
    "sample_dd": "01384574202008261234567",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "TN": {
    "street": "219 Gresham Ln",
    "city": "Murfreesboro",
    "zip": "371294127",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "145065024",
    "sample_icn": "182381070085030101",
    "sample_dd": "4601808269812264",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "TX_2016": {
    "street": "609 E Clare St",
    "city": "Beeville",
    "zip": "78102",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "24253231",
    "sample_icn": "94116090  20180228",
    "sample_dd": "19193295907082813411",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "TX_2020": {
    "street": "609 E Clare St",
    "city": "Beeville",
    "zip": "781024321",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "24253231",
    "sample_icn": "10001846127",
    "sample_dd": "92334268049701405070",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "WA": {
    "street": "29810 224th Ave SE",
    "city": "Kent",
    "zip": "980106509",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "WDL0257B93TB",
    "sample_icn": "",
    "sample_dd": "WDL0257B93TBR082620981133",
    "sample_audit": "R082620981133",
    "has_icn": false,
    "has_dd": true,
    "has_audit": true
  },
  "WA_2025": {
    "street": "29810 224th Ave SE",
    "city": "Kent",
    "zip": "980106509",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "WDL5NHA2R3KB",
    "sample_icn": "",
    "sample_dd": "WDL5NHA2R3KBP082625148509",
    "sample_audit": "P082625148509",
    "has_icn": false,
    "has_dd": true,
    "has_audit": true
  },
  "WI": {
    "street": "W169N10741 Redwood Ln",
    "city": "Germantown",
    "zip": "530223971",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "D000-4607-0015-00",
    "sample_icn": "0130100816849209",
    "sample_dd": "OTDKF2020082610924996",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AZ_2023": {
    "street": "4248 S Red Rock St",
    "city": "Gilbert",
    "zip": "852974501",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "D28375514",
    "sample_icn": "48908420864",
    "sample_dd": "5641GS561D7977J0",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "ID": {
    "street": "1341 W Ann Taylor St",
    "city": "Meridian",
    "zip": "836464074",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "realid": "F",
    "sample_dl": "DX121380D",
    "sample_icn": "0001700735",
    "sample_dd": "010170050042",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "ID_2023": {
    "street": "1341 W Ann Taylor St",
    "city": "Meridian",
    "zip": "836464074",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "DX121380D",
    "sample_icn": "MT942941H147175001",
    "sample_dd": "748649745263992",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "IA_2011": {
    "street": "7779 Cottonwood Ln",
    "city": "West Des Moines",
    "zip": "50266",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "realid": "N",
    "sample_dl": "176ZB6504",
    "sample_icn": "176ZB6504162400101",
    "sample_dd": "173604035DJ6050M150124R",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "IA_2017": {
    "street": "200 Mulberry Blvd",
    "city": "Ames",
    "zip": "50010",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "176ZB6504",
    "sample_icn": "176ZB6504162400101",
    "sample_dd": "173604035DJ6050M150124D",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "KS": {
    "street": "12727 W 100th St",
    "city": "Lenexa",
    "zip": "66215",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "K00-45-2697",
    "sample_icn": "20242K004526970101",
    "sample_dd": "72405466640DJ20240M2615AB",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "KY_2012": {
    "street": "535 Ashcreek Rd",
    "city": "Paducah",
    "zip": "42001",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "D82767580",
    "sample_icn": "0460017830322351",
    "sample_dd": "4372782319947690",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "KY_2018": {
    "street": "2069 Belmont Dr",
    "city": "Lexington",
    "zip": "40516",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "D63091036",
    "sample_icn": "0460107954698883",
    "sample_dd": "2022012288217092 01111",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "LA": {
    "street": "1016 Sewell St",
    "city": "Slidell",
    "zip": "70461",
    "class": "E",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "007343439",
    "sample_icn": "0070031972215065",
    "sample_dd": "4372782319947690",
    "sample_audit": "4174",
    "has_icn": true,
    "has_dd": true,
    "has_audit": true
  },
  "ME": {
    "street": "52 Gardner St",
    "city": "Patten",
    "zip": "04765",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BR",
    "hair": "BR",
    "sample_dl": "9278451",
    "sample_icn": "F2024392784510101",
    "sample_dd": "0000000000000000035222862",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MD": {
    "street": "2125 Haven Oak Ct",
    "city": "Abingdon",
    "zip": "21009",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "D-000-429-000-042",
    "sample_icn": "1005403079",
    "sample_dd": "106143DH0",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MD_2021": {
    "street": "1242 Colonial Park Dr",
    "city": "Severn",
    "zip": "211444416",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "MD-10276307832",
    "sample_icn": "1010273942",
    "sample_dd": "329878356",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MN": {
    "street": "4102 Beaver Dam Rd",
    "city": "Eagan",
    "zip": "551222123",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "T403223261033",
    "sample_icn": "T4032232610330124301",
    "sample_dd": "00000006518117",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MS": {
    "street": "7504 Oak Cir W",
    "city": "Ocean Springs",
    "zip": "395648019",
    "class": "R",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "809430018",
    "sample_icn": "0510035326620190",
    "sample_dd": "7TMLJG3R10DJ20240M2415A",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MS_2023": {
    "street": "7504 Oak Cir W",
    "city": "Ocean Springs",
    "zip": "395648019",
    "class": "R",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "809430018",
    "sample_icn": "0510035326620190",
    "sample_dd": "7TMLJG3R10DJ20240M2415A",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MO_2012": {
    "street": "132 Cranberry R",
    "city": "Billings",
    "zip": "65610",
    "class": "F",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "S160316442",
    "sample_icn": "18239S1603164420101",
    "sample_dd": "181602380083",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MO_2020": {
    "street": "132 Cranberry R",
    "city": "Billings",
    "zip": "65610",
    "class": "E",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "N",
    "sample_dl": "M096115590",
    "sample_icn": "18239S1603164420101",
    "sample_dd": "201447280083",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "MT": {
    "street": "665 5th Ave W N",
    "city": "Kalispell",
    "zip": "59901",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "0173719704151",
    "sample_icn": "110046MJU9PFMTLLC001",
    "sample_dd": "20200826869633619021",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NE_2017": {
    "street": "1801 N 31st St",
    "city": "Lincoln",
    "zip": "68503",
    "class": "O",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "V33627544",
    "sample_icn": "0540000357800000",
    "sample_dd": "0540000357800000",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NE_2021": {
    "street": "1801 N 31st St",
    "city": "Lincoln",
    "zip": "685031514",
    "class": "O",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "B94907169",
    "sample_icn": "B94907169NETYCO01",
    "sample_dd": "054B94907169NETYCO0165097",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NV_2008": {
    "street": "9833 Babys Breath Ct",
    "city": "Las Vegas",
    "zip": "891837132",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BROWN",
    "sample_dl": "1314295172",
    "sample_icn": "0015969352901",
    "sample_dd": "000144360705221148270",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NV_2021": {
    "street": "9833 Babys Breath Ct",
    "city": "Las Vegas",
    "zip": "891837132",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "1314295172",
    "sample_icn": "0015969352901",
    "sample_dd": "000144360705221148270",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NH": {
    "street": "102 Center Rd",
    "city": "Weare",
    "zip": "032814605",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "NHL10501102",
    "sample_icn": "08494818",
    "sample_dd": "08494818",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NH_2024": {
    "street": "102 Center Rd",
    "city": "Weare",
    "zip": "032814605",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "NHL10501102",
    "sample_icn": "08494818",
    "sample_dd": "08494818",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NY_2022": {
    "street": "710 Hubbell Rd",
    "city": "Churchville",
    "zip": "144289335",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "759547815",
    "sample_icn": "",
    "sample_dd": "C6JEH2RP06",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "NC": {
    "street": "110 Lemons St",
    "city": "Stoneville",
    "zip": "270488702",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "000007886015",
    "sample_icn": "000007886015NCXR9S01",
    "sample_dd": "0015245648",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "ND": {
    "street": "815 13th Ave W",
    "city": "Williston",
    "zip": "58801",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "DOE707980",
    "sample_icn": "0340018171565059",
    "sample_dd": "7DOE707980DJ78517vP48NDZ",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "ND_2023": {
    "street": "815 13th Ave W",
    "city": "Williston",
    "zip": "588014618",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "DOE707980",
    "sample_icn": "0340018171565059",
    "sample_dd": "7DOE707980DJ78517vP48NDZ",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "OK": {
    "street": "1927 N Broadway Ave",
    "city": "Shawnee",
    "zip": "748043721",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "realid": "F",
    "sample_dl": "S576189157",
    "sample_icn": "S576189157OKYRSL01",
    "sample_dd": "S576189157011570082620R",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "OR": {
    "street": "679 S Birch St",
    "city": "Sisters",
    "zip": "97759",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "8456732",
    "sample_icn": "AA7088159",
    "sample_dd": "200117013",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "PA": {
    "street": "857 Chandlee Dr",
    "city": "West Chester",
    "zip": "19382",
    "class": "C",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "95744057",
    "sample_icn": "0250018505120106",
    "sample_dd": "2023967803632140000058560",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "RI": {
    "street": "24 Rimwood Dr",
    "city": "Smithfield",
    "zip": "02917",
    "class": "10",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "3755008",
    "sample_icn": "O3755008RIJTTL01",
    "sample_dd": "300283",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "RI_2022": {
    "street": "24 Rimwood Dr",
    "city": "Smithfield",
    "zip": "02917",
    "class": "10",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "3755008",
    "sample_icn": "O3755008RIJTTL01",
    "sample_dd": "4052356",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "UT_2016": {
    "street": "555 E Elm St",
    "city": "Layton",
    "zip": "84041",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "182162827",
    "sample_icn": "182162827UTQ8CW01",
    "sample_dd": "32656373",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "UT_2021": {
    "street": "555 E Elm St",
    "city": "Layton",
    "zip": "840414307",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "182162827",
    "sample_icn": "182162827UTQ8CW01",
    "sample_dd": "32656373",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "VT": {
    "street": "62 Charlotte Rd",
    "city": "Hinesburg",
    "zip": "05461",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "12345678",
    "sample_icn": "",
    "sample_dd": "072022123412345678",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "VA": {
    "street": "1401 Wesanne Ln",
    "city": "Midlothian",
    "zip": "231143171",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "A37262186",
    "sample_icn": "0060101096491223",
    "sample_dd": "099750996",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "WV": {
    "street": "2402 9th Ave",
    "city": "Huntington",
    "zip": "25703",
    "class": "E",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "F123785",
    "sample_icn": "F123785WVFLOY01",
    "sample_dd": "011570DJ2601",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "WI_2023": {
    "street": "W169N10741 Redwood Ln",
    "city": "Germantown",
    "zip": "530223971",
    "class": "D",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "D000-4607-0015-00",
    "sample_icn": "0130100816849209",
    "sample_dd": "OTDKF2020082610924996",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "WY": {
    "street": "2412 E 12th St",
    "city": "Cheyenne",
    "zip": "82001",
    "class": "NONE",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "115919618",
    "sample_icn": "1000038857",
    "sample_dd": "1000038857",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "AB": {
    "street": "452 Scimitar Bay NW",
    "city": "Calgary",
    "zip": "T3L 1S7",
    "class": "5",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "153574-564",
    "sample_icn": "",
    "sample_dd": "0571-54946",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "BC": {
    "street": "1240 Douglas St",
    "city": "Victoria",
    "zip": "V8W 2E7",
    "class": "5",
    "height": "175",
    "weight": "75",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "sample_dl": "1234567",
    "sample_icn": "",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": false,
    "has_audit": false
  },
  "MB": {
    "street": "708 Alfred Ave",
    "city": "Winnipeg",
    "zip": "R2W 1Y8",
    "class": "5F",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "BA-NL-ES-L200NA",
    "sample_icn": "519426452",
    "sample_dd": "823164527",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "NB": {
    "street": "364 York St",
    "city": "Fredericton",
    "zip": "E3B 3P7",
    "class": "5",
    "height": "175",
    "weight": "75",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "sample_dl": "1234567",
    "sample_icn": "",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": false,
    "has_audit": false
  },
  "NL": {
    "street": "100 Water St",
    "city": "St. John's",
    "zip": "A1C 1A4",
    "class": "5",
    "height": "175",
    "weight": "75",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "sample_dl": "A123456789",
    "sample_icn": "",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": false,
    "has_audit": false
  },
  "NS": {
    "street": "1800 Argyle St",
    "city": "Halifax",
    "zip": "B3J 3N8",
    "class": "5",
    "height": "175",
    "weight": "75",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "sample_dl": "SMITH123456789",
    "sample_icn": "",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": false,
    "has_audit": false
  },
  "NU": {
    "street": "922 Mivvik St",
    "city": "Iqaluit",
    "zip": "X0A 0H0",
    "class": "5",
    "height": "175",
    "weight": "75",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "sample_dl": "123456",
    "sample_icn": "",
    "sample_dd": "",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": false,
    "has_audit": false
  },
  "ON": {
    "street": "482 Thorndale Dr",
    "city": "Waterloo",
    "zip": "N2T 1W5",
    "class": "G",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "P5718-37583-29384",
    "sample_icn": "3724285",
    "sample_dd": "GC7295472",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "PE": {
    "street": "374 Queen St",
    "city": "Charlottetown",
    "zip": "C1A 4C8",
    "class": "5",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "69",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "hair": "BRO",
    "sample_dl": "123456",
    "sample_icn": "",
    "sample_dd": "018094569",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  },
  "QC": {
    "street": "251 Rue St Paul",
    "city": "Saint-Tite",
    "zip": "G0X 3H0",
    "class": "5 6A",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "D5006-285648-00",
    "sample_icn": "3724285",
    "sample_dd": "PENX36RBU",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "SK": {
    "street": "28 Morris Dr",
    "city": "Saskatoon",
    "zip": "S7L 3T9",
    "class": "5",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "32257271",
    "sample_icn": "F51537835",
    "sample_dd": "7496716472",
    "sample_audit": "",
    "has_icn": true,
    "has_dd": true,
    "has_audit": false
  },
  "YT": {
    "street": "10 Hanna Crescent",
    "city": "Whitehorse",
    "zip": "Y1A 6H9",
    "class": "7",
    "restrictions": "NONE",
    "endorsements": "NONE",
    "height": "175",
    "weight": "169",
    "sex": "M",
    "eyes": "BRO",
    "sample_dl": "157379",
    "sample_icn": "",
    "sample_dd": "157359R0",
    "sample_audit": "",
    "has_icn": false,
    "has_dd": true,
    "has_audit": false
  }
};

    function getStateDemographicDefaults(slug) {
        if (!slug) return null;
        const s = slug.toUpperCase();
        return STATE_DEMOGRAPHIC_DEFAULTS[s] || STATE_DEMOGRAPHIC_DEFAULTS[s.split('_')[0]] || null;
    }

    window.STATE_DEMOGRAPHIC_DEFAULTS = STATE_DEMOGRAPHIC_DEFAULTS;
    window.getStateDemographicDefaults = getStateDemographicDefaults;

            
        window.QC_calculate_ICN = QC_calculate_ICN;
        if (typeof KY_2012_calculate_ICN === 'function') {
            window.KY_2018_calculate_ICN = KY_2012_calculate_ICN;
            window.KY_calculate_ICN = KY_2012_calculate_ICN;
        }
window.TX_calculate_ICN = TX_2020_calculate_ICN;
        window.TX_2020_calculate_ICN = TX_2020_calculate_ICN;
        window.TX_2016_calculate_ICN = TX_2016_calculate_ICN;
        if (typeof AL_2024_calculate_ICN === 'function') {
            window.AL_2022_calculate_ICN = AL_2024_calculate_ICN;
        }

function QC_calculate_ICN() {
    var icnEl = getTargetElement("inputICN");
    if (icnEl) {
        icnEl.value = getRandomNumericString(7);
    }
}


    // --- AUTHENTIC STATE CARD BACK METADATA (50 STATES + DC + 13 CANADIAN PROVINCES) ---
    const STATE_CARDBACK_METADATA = {
    "AL": {
        "name": "Alabama",
        "agency": "Alabama Law Enforcement Agency",
        "url": "www.alea.gov",
        "class_label": "CLASS: D-Regular Operators License",
        "disclaimer": "Property of State of Alabama • If found drop in any US mailbox • Return postage guaranteed",
        "donor": "ORGAN DONOR",
        "layout": "alabama_custom",
        "watermark": "ALABAMA",
        "rev": "Rev 11-01-2018",
        "archetype": "alabama_custom",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "top_center",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f4f4f4 100%)",
        "security_tint": "#cfc0b4"
    },
    "AK": {
        "name": "Alaska",
        "agency": "Alaska Division of Motor Vehicles",
        "url": "doa.alaska.gov/dmv",
        "class_label": "D - BASIC DRIVER, M1 - MOTORCYCLE",
        "disclaimer": "You must notify DMV of name or address change within 30 days.",
        "donor": "ANATOMICAL GIFT",
        "layout": "alaska_modern",
        "watermark": "ALASKA",
        "rev": "Rev. 09/2018",
        "archetype": "alaska_modern",
        "has_magstripe": false,
        "watermark_style": "alaska",
        "barcode_1d_pos": "top_left",
        "bg_color": "#e4f2fb",
        "bg_gradient": "linear-gradient(135deg, #e4f2fb 0%, #d5ebf7 50%, #cde5f4 100%)",
        "security_tint": "#b8d6ec"
    },
    "AZ": {
        "name": "Arizona",
        "agency": "Arizona Department of Transportation (ADOT)",
        "url": "azdot.gov/mvd",
        "class_label": "O-Operator",
        "disclaimer": "You Must Report a Change of Address Within 10 Days",
        "donor": "DONATE LIFE AZ",
        "layout": "arizona_custom",
        "watermark": "ARIZONA",
        "rev": "Rev. 03/2014",
        "archetype": "arizona_custom",
        "has_magstripe": true,
        "watermark_style": "outline",
        "barcode_1d_pos": "top_right",
        "bg_color": "#fafaf8",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #faf8f5 50%, #f4ede4 100%)",
        "security_tint": "#cfc0b4"
    },
    "AR": {
        "name": "Arkansas",
        "agency": "Arkansas Department of Finance and Administration",
        "url": "mydmv.arkansas.gov",
        "class_label": "D - Non-Commercial; <15 PASGR, including driver",
        "disclaimer": "Property of State of Arkansas • Operation of motor vehicle constitutes consent to alcohol testing",
        "donor": "ORGAN DONOR",
        "layout": "arkansas_custom",
        "watermark": "ARKANSAS",
        "rev": "Rev: 03/01/2018",
        "archetype": "arkansas_custom",
        "has_magstripe": false,
        "watermark_style": "capitol",
        "barcode_1d_pos": "right_vertical",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #fcfbfa 0%, #f6f5f2 50%, #f0eee9 100%)",
        "security_tint": "#d97745"
    },
    "CA": {
        "name": "California",
        "agency": "California Department of Motor Vehicles",
        "url": "www.dmv.ca.gov",
        "class_label": "CLASS: C - Veh w/GVWR ≤26000, No M/C",
        "disclaimer": "This license is issued as a license to drive a motor vehicle; it does not establish eligibility for employment, voter registration, or public benefits.",
        "donor": "DONATE LIFE CA",
        "layout": "california_custom",
        "watermark": "CALIFORNIA",
        "rev": "Rev 08/29/2017",
        "archetype": "california_custom",
        "has_magstripe": true,
        "watermark_style": "pier",
        "barcode_1d_pos": "top_center",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #faf7ee 0%, #f4ede1 50%, #ebe4d5 100%)",
        "security_tint": "#ded4be"
    },
    "CO": {
        "name": "Colorado",
        "agency": "Colorado Department of Revenue - DMV",
        "url": "dmv.colorado.gov",
        "class_label": "CLASS: R - Any motor vehicle with a GVWR of less than 26,001 lbs. as a single unit or in combination, designed to carry 15 or fewer passengers, including the driver, and does not carry hazardous material.",
        "disclaimer": "Previous Type: A",
        "donor": "DONOR ALLIANCE",
        "layout": "colorado_custom",
        "watermark": "COLORADO",
        "rev": "Rev. 11/2015",
        "archetype": "colorado_custom",
        "has_magstripe": true,
        "watermark_style": "capitol",
        "barcode_1d_pos": "left_vertical",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f1f4f5 100%)",
        "security_tint": "#c2d2cb"
    },
    "CO_2015": {
        "name": "Colorado",
        "agency": "Colorado Department of Revenue - DMV",
        "url": "dmv.colorado.gov",
        "class_label": "CLASS: R - Any motor vehicle with a GVWR of less than 26,001 lbs. as a single unit or in combination, designed to carry 15 or fewer passengers, including the driver, and does not carry hazardous material.",
        "disclaimer": "Previous Type: A",
        "donor": "DONOR ALLIANCE",
        "layout": "colorado_custom",
        "watermark": "COLORADO",
        "rev": "Rev. 10/30/2015",
        "archetype": "colorado_custom",
        "has_magstripe": true,
        "watermark_style": "capitol",
        "barcode_1d_pos": "left_vertical",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f1f4f5 100%)",
        "security_tint": "#c2d2cb"
    },
    "CO_2022": {
        "name": "Colorado",
        "agency": "Colorado Department of Revenue - DMV",
        "url": "dmv.colorado.gov",
        "class_label": "CLASS: R - Any motor vehicle with a GVWR of less than 26,001 lbs. as a single unit or in combination, designed to carry 15 or fewer passengers, including the driver, and does not carry hazardous material.",
        "disclaimer": "Previous Type: A",
        "donor": "DONOR ALLIANCE",
        "layout": "colorado_custom",
        "watermark": "COLORADO",
        "rev": "Rev. 02/28/2022",
        "archetype": "colorado_custom",
        "has_magstripe": true,
        "watermark_style": "capitol",
        "barcode_1d_pos": "left_vertical",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f1f4f5 100%)",
        "security_tint": "#c2d2cb"
    },
    "CT": {
        "name": "Connecticut",
        "agency": "Connecticut Department of Motor Vehicles",
        "url": "portal.ct.gov/dmv",
        "class_label": "CLASS D-Any non commercial motor",
        "disclaimer": "Property of State of Connecticut • CGS § 14-36 • Must be carried when operating motor vehicle • Return if found to DMV Wethersfield CT 06161",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "CONNECTICUT",
        "rev": "Rev. 06/2017",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9fbfb 50%, #f1f5f6 100%)",
        "security_tint": "#d0dce0"
    },
    "DE": {
        "name": "Delaware",
        "agency": "Delaware Division of Motor Vehicles",
        "url": "dmv.de.gov",
        "class_label": "CLASS:D-Operator’s vechicles <26,001 GVWR. Persons < 16 not HazMat.",
        "disclaimer": "Property of State of Delaware • Notice of change of address required within 30 days",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "DELAWARE",
        "rev": "Rev 08/02/2017 www.dmv.de.gov",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#fcfdfe",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fbfd 50%, #edf4f8 100%)",
        "security_tint": "#cadde8"
    },
    "DC": {
        "name": "District of Columbia",
        "agency": "DC Department of Motor Vehicles",
        "url": "dmv.dc.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Property of District of Columbia Government • Return postage guaranteed",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "DISTRICT OF COLUMBIA",
        "rev": "Rev. 08/2018",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8f9fb 50%, #f0f2f7 100%)",
        "security_tint": "#ccd3e0"
    },
    "FL": {
        "name": "Florida",
        "agency": "Florida Highway Safety and Motor Vehicles",
        "url": "www.flhsmv.gov",
        "class_label": "CLASS: E - Any non-commercial vehicle with a GVWR < 26,001 lbs. or any RV",
        "disclaimer": "The state of FL retains all property rights herein.",
        "donor": "DONATE LIFE FLORIDA",
        "layout": "florida_custom",
        "watermark": "FLORIDA",
        "rev": "1845 / 1895",
        "archetype": "florida_custom",
        "has_magstripe": true,
        "watermark_style": "wave_seal",
        "barcode_1d_pos": "top",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fbfb 50%, #f0f6f7 100%)",
        "security_tint": "#d0e4e7"
    },
    "GA": {
        "name": "Georgia",
        "agency": "Georgia Department of Driver Services",
        "url": "dds.georgia.gov",
        "class_label": "CLASS: C-≤ 26,000 lbs. GVWR and Trailer ≤ 10,000 lbs. All recreational vehicles included",
        "disclaimer": "Property of State of Georgia Department of Driver Services • O.C.G.A. § 40-5 • Address change required within 60 days • Return to Conyers GA 30013",
        "donor": "DONATE LIFE GEORGIA",
        "layout": "georgia_custom",
        "watermark": "GEORGIA",
        "rev": "Rev 10/22/2017",
        "archetype": "georgia_custom",
        "has_magstripe": false,
        "watermark_style": "capitol_hologram",
        "barcode_1d_pos": "top_right",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f4f4f4 100%)",
        "security_tint": "#cbd5e1"
    },
    "HI": {
        "name": "Hawaii",
        "agency": "Hawaii Department of Transportation",
        "url": "hidot.hawaii.gov",
        "class_label": "CLASS: 3",
        "disclaimer": "Property of State of Hawaii • Must be carried in personal possession when operating vehicle",
        "donor": "LEGACY OF LIFE HI",
        "layout": "type_b",
        "watermark": "HAWAII",
        "rev": "Rev. 03/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f7fbfd 50%, #eef5fa 100%)",
        "security_tint": "#cde1ef"
    },
    "ID": {
        "name": "Idaho",
        "agency": "Idaho Transportation Department",
        "url": "itd.idaho.gov",
        "class_label": "CLASS: D - Regular operator license",
        "disclaimer": "Machine readable bar codes contain no personal information other than the full legal name and the human readable information printed on the card",
        "donor": "YES IDAHO DONOR",
        "layout": "idaho_custom",
        "watermark": "IDAHO",
        "rev": "REV: 00/01/2017",
        "archetype": "idaho_custom",
        "has_magstripe": false,
        "watermark_style": "clean_optical",
        "barcode_1d_pos": "top_right",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fcfcfc 50%, #f7f7f7 100%)",
        "security_tint": "#e2e8f0"
    },
    "IL": {
        "name": "Illinois",
        "agency": "Illinois Secretary of State",
        "url": "www.ilsos.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Property of State of Illinois • 625 ILCS 5/6-118 • Notice of address change required within 10 days • Return to Secretary of State Springfield IL",
        "donor": "LIFE GOES ON ILLINOIS",
        "layout": "type_b",
        "watermark": "ILLINOIS",
        "rev": "Rev. 05/2016",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f6f8fb 50%, #edf1f7 100%)",
        "security_tint": "#cad5e6"
    },
    "IN": {
        "name": "Indiana",
        "agency": "Indiana Bureau of Motor Vehicles",
        "url": "www.in.gov/bmv",
        "class_label": "RESTRICTIONS: N-No Class A/B Pass Vehicle, E-Auto Transmission CMV, V-Med Variance Doc Req, H-Limit To Employment, Z-No Full Airbrake CMV, K-CDL Intrastate Only, T-Hazmat Prohibited, B- Corrective Lenses, 2-HTV Conditional",
        "disclaimer": "Property of State of Indiana • Report address change within 30 days",
        "donor": "DONATE LIFE INDIANA",
        "layout": "type_b",
        "watermark": "INDIANA",
        "rev": "Rev. 01/01/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fbf9f6 50%, #f5efe7 100%)",
        "security_tint": "#ded5c7"
    },
    "IA": {
        "name": "Iowa",
        "agency": "Iowa Department of Transportation",
        "url": "iowadot.gov/mvd",
        "class_label": "CLASS:",
        "disclaimer": "Property of State of Iowa • Return postage guaranteed",
        "donor": "IOWA DONOR NETWORK",
        "layout": "type_b",
        "watermark": "IOWA",
        "rev": "Rev. 01/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#fcfdfd",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9fbfb 50%, #f2f6f6 100%)",
        "security_tint": "#d2dede"
    },
    "KS": {
        "name": "Kansas",
        "agency": "Kansas Department of Revenue",
        "url": "www.ksrevenue.gov",
        "class_label": "CLASS: C",
        "disclaimer": "Property of State of Kansas • Drop in any mailbox return to Topeka KS 66612",
        "donor": "DONATE LIFE KANSAS",
        "layout": "type_b",
        "watermark": "KANSAS",
        "rev": "Rev. 06/01/2012 12/04/1989",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f8f6f5",
        "bg_gradient": "linear-gradient(180deg, #fdfcfb 0%, #f5f1ef 50%, #ebe5e2 100%)",
        "security_tint": "#d3cfcd"
    },
    "KY": {
        "name": "Kentucky",
        "agency": "Kentucky Transportation Cabinet",
        "url": "drive.ky.gov",
        "class_label": "Class: D-OPERATOR",
        "disclaimer": "Commonwealth of Kentucky • Notice of change of address required within 10 days",
        "donor": "Organ Donor Yes______ Donor’s Sig_____________________________________________ Witness ______________________________ Witness________________________________",
        "layout": "type_b",
        "watermark": "KENTUCKY",
        "rev": "Rev. 04/2019",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#fefdfd",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f2f4f5 100%)",
        "security_tint": "#d4dade"
    },
    "LA": {
        "name": "Louisiana",
        "agency": "Louisiana Office of Motor Vehicles",
        "url": "www.expresslane.org",
        "class_label": "CLASS: Driver’s license",
        "disclaimer": "in interstate commerce",
        "donor": "Donor __Y__N / Living Will__Y__N",
        "layout": "type_a",
        "watermark": "Louisiana",
        "rev": "REV 02-10-2015 08-02-1990",
        "archetype": "type_a_southern",
        "has_magstripe": true,
        "watermark_style": "script",
        "barcode_1d_pos": "top",
        "bg_color": "#ffffff",
        "bg_gradient": "#ffffff",
        "security_tint": "#dfd7c2"
    },
    "ME": {
        "name": "Maine",
        "agency": "Maine Bureau of Motor Vehicles",
        "url": "www.maine.gov/sos/bmv",
        "class_label": "CLASS: C-Single Vehicle or combination of vehicles that does not meet definition of Class A or Class B license.",
        "disclaimer": "State of Maine • Drop in any mailbox return to Station 29 Augusta ME 04333",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "MAINE",
        "rev": "Rev. 05/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8faf8 50%, #eef3ee 100%)",
        "security_tint": "#c8d7c8"
    },
    "MD": {
        "name": "Maryland",
        "agency": "Maryland Motor Vehicle Administration",
        "url": "mva.maryland.gov",
        "class_label": "CLASS: C",
        "disclaimer": "Property of State of Maryland • Not valid unless signed by licensee",
        "donor": "DONATE LIFE MARYLAND",
        "layout": "type_b",
        "watermark": "MARYLAND",
        "rev": "Rev. 06/2016",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#dad7d0",
        "bg_gradient": "linear-gradient(180deg, #faf9f7 0%, #f0ece5 50%, #e4ded4 100%)",
        "security_tint": "#c7bfb1"
    },
    "MA": {
        "name": "Massachusetts",
        "agency": "Massachusetts Registry of Motor Vehicles",
        "url": "mass.gov/rmv",
        "class_label": "CLASS -",
        "disclaimer": "Commonwealth of Massachusetts • Return postage guaranteed Boston MA 02111",
        "donor": "NEW ENGLAND DONOR SERVICES",
        "layout": "type_b",
        "watermark": "MASSACHUSETTS",
        "rev": "Rev. 03/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #f0f2f5 100%)",
        "security_tint": "#cdd3dc"
    },
    "MI": {
        "name": "Michigan",
        "agency": "Michigan Secretary of State",
        "url": "www.michigan.gov/sos",
        "class_label": "CLASS: OPERATOR",
        "disclaimer": "Property of State of Michigan • Report change of address within 10 days",
        "donor": "DONATE LIFE MICHIGAN",
        "layout": "type_b",
        "watermark": "MICHIGAN",
        "rev": "ENCODED DATA: BIRTH, EXPIRATION, REVISION & TRANSACTION DATES; DL/ID CARD #;NAME; ADDRESS;DENDER; ISSUING STATE & INVENTORY CONTROL #.",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fbfd 50%, #eff5fa 100%)",
        "security_tint": "#cbe0ef"
    },
    "MN": {
        "name": "Minnesota",
        "agency": "Minnesota Department of Public Safety",
        "url": "dps.mn.gov",
        "class_label": "CLASS: D",
        "disclaimer": "State of Minnesota Driver and Vehicle Services • Property of State of Minnesota",
        "donor": "DONATE LIFE MINNESOTA",
        "layout": "type_b",
        "watermark": "MINNESOTA",
        "rev": "Rev. 10/2018",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f7f4f0",
        "bg_gradient": "linear-gradient(180deg, #faf8f5 0%, #efeae3 50%, #e2dcd2 100%)",
        "security_tint": "#c9beaf"
    },
    "MS": {
        "name": "Mississippi",
        "agency": "Mississippi Department of Public Safety",
        "url": "www.driverservicebureau.dps.ms.gov",
        "class_label": "Class: R-Regular Operator’s License",
        "disclaimer": "Property of State of Mississippi • Drop in any US mailbox return to Jackson MS",
        "donor": "ORGAN DONOR",
        "layout": "type_a",
        "watermark": "MISSISSIPPI",
        "rev": "REV: 00/01/2017",
        "archetype": "type_a_southern",
        "has_magstripe": true,
        "watermark_style": "script",
        "barcode_1d_pos": "top",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f3f3f3 100%)",
        "security_tint": "#d2d2d2"
    },
    "MO": {
        "name": "Missouri",
        "agency": "Missouri Department of Revenue",
        "url": "dor.mo.gov",
        "class_label": "CLASS: F",
        "disclaimer": "Property of State of Missouri • Return postage guaranteed Jefferson City MO 65105",
        "donor": "DONATE LIFE MISSOURI",
        "layout": "type_a",
        "watermark": "MISSOURI",
        "rev": "Rev. 12/2019",
        "archetype": "type_a_southern",
        "has_magstripe": true,
        "watermark_style": "script",
        "barcode_1d_pos": "top",
        "bg_color": "#f5f5f5",
        "bg_gradient": "linear-gradient(180deg, #fafafa 0%, #f2f2f2 50%, #e6e6e6 100%)",
        "security_tint": "#d0d0d0"
    },
    "MT": {
        "name": "Montana",
        "agency": "Montana Motor Vehicle Division",
        "url": "mvdmt.gov",
        "class_label": "Class: D - Regular Driver",
        "disclaimer": "State of Montana Department of Justice • Property of State of Montana",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "MONTANA",
        "rev": "Rev. 02/14/2016",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fafb 50%, #f0f3f6 100%)",
        "security_tint": "#ccd5de"
    },
    "NE": {
        "name": "Nebraska",
        "agency": "Nebraska Department of Motor Vehicles",
        "url": "dmv.nebraska.gov",
        "class_label": "CLASS CODE:O- Any non-comercial vehicle except motorcycle.",
        "disclaimer": "Property of State of Nebraska • Report address change within 60 days",
        "donor": "DONATE LIFE NEBRASKA",
        "layout": "type_b",
        "watermark": "NEBRASKA",
        "rev": "Rev. 07-08-2009",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #faf9f6 50%, #f4f0e7 100%)",
        "security_tint": "#dbd4c4"
    },
    "NV": {
        "name": "Nevada",
        "agency": "Nevada Department of Motor Vehicles",
        "url": "dmv.nv.gov",
        "class_label": "CLASS: C",
        "disclaimer": "State of Nevada • Licensee must notify DMV in writing within 30 days of address change",
        "donor": "DONATE LIFE NEVADA",
        "layout": "type_b",
        "watermark": "NEVADA",
        "rev": "Rev. 09/2014",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #faf8f5 50%, #f3eee6 100%)",
        "security_tint": "#dacfc2"
    },
    "NH": {
        "name": "New Hampshire",
        "agency": "New Hampshire Division of Motor Vehicles",
        "url": "www.dmv.nh.gov",
        "class_label": "9 CLASS D-NON COMMERCIAL CLASS D",
        "disclaimer": "Property of State of New Hampshire • Return to 23 Hazen Dr Concord NH 03305",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "NEW HAMPSHIRE",
        "rev": "Rev. 07/2017",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#eef3f6",
        "bg_gradient": "linear-gradient(180deg, #f7fafc 0%, #eaf0f5 50%, #dbe6ee 100%)",
        "security_tint": "#99b4c6"
    },
    "NJ": {
        "name": "New Jersey",
        "agency": "New Jersey Motor Vehicle Commission",
        "url": "www.state.nj.us/mvc",
        "class_label": "CLASS: D",
        "disclaimer": "Property of State of New Jersey • Notice of change of address required within 7 days",
        "donor": "SHARE LIFE NJ",
        "layout": "type_b",
        "watermark": "NEW JERSEY",
        "rev": "Rev 07-23-2010",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9fbfb 50%, #f1f4f5 100%)",
        "security_tint": "#ced8db"
    },
    "NM": {
        "name": "New Mexico",
        "agency": "New Mexico Motor Vehicle Division",
        "url": "www.mvd.newmexico.gov",
        "class_label": "CLASS: D-1 veh less than 26,001 lb. GVWR. May not tow > lbs. than veh except w/class 4 equalizer hitch or 5th wheel",
        "disclaimer": "State of New Mexico Taxation and Revenue Department • Property of State of NM",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "NEW MEXICO",
        "rev": "Rev. 11/2016",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fbf9f6 50%, #f5eee4 100%)",
        "security_tint": "#dbcebe"
    },
    "NY": {
        "name": "New York",
        "agency": "NYS Department of Motor Vehicles",
        "url": "dmv.ny.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Property of NYS DMV • NYS Vehicle & Traffic Law § 504 • Address change required within 10 days • Drop in any US mailbox return to Albany NY 12228",
        "donor": "DONATE LIFE NY",
        "layout": "type_b",
        "watermark": "EXCELSIOR",
        "rev": "Rev. 03/2017",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f2f5f2",
        "bg_gradient": "linear-gradient(180deg, #f6f8f6 0%, #e9efe9 50%, #dce4dc 100%)",
        "security_tint": "#b8ccb9"
    },
    "NC": {
        "name": "North Carolina",
        "agency": "North Carolina Division of Motor Vehicles",
        "url": "www.ncdot.gov/dmv",
        "class_label": "CLASS: C-Any noncommercial single vehicle with a GVWR of less than 26,001 lbs. A vehicle towing a vehicle which has a combined GVWR of less than 26,001 lbs operated by a driver 18 yrs or older.",
        "disclaimer": "Property of State of North Carolina • N.C.G.S. 20-7 • Operating a motor vehicle implies consent to chemical tests • Return to Raleigh NC 27697",
        "donor": "DONATE LIFE NC",
        "layout": "type_b",
        "watermark": "NORTH CAROLINA",
        "rev": "Rev 10/24/2014",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fbfbfb 50%, #f5f4f2 100%)",
        "security_tint": "#d6d2cb"
    },
    "ND": {
        "name": "North Dakota",
        "agency": "North Dakota Department of Transportation",
        "url": "www.dot.nd.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Property of State of North Dakota • Report address change within 10 days",
        "donor": "DONATE LIFE ND",
        "layout": "type_b",
        "watermark": "NORTH DAKOTA",
        "rev": "Rev. 12/2017",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f3f4f4 100%)",
        "security_tint": "#d0d4d4"
    },
    "OH": {
        "name": "Ohio",
        "agency": "Ohio Bureau of Motor Vehicles",
        "url": "bmv.ohio.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Property of State of Ohio • Ohio Revised Code § 4507 • Drop in any US mailbox return to Ohio BMV PO Box 16520 Columbus OH 43216",
        "donor": "DONATE LIFE OHIO",
        "layout": "type_b",
        "watermark": "OHIO",
        "rev": "Rev. 07/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9f9fa 50%, #f2f3f5 100%)",
        "security_tint": "#d2d5dc"
    },
    "OK": {
        "name": "Oklahoma",
        "agency": "Oklahoma Department of Public Safety",
        "url": "oklahoma.gov/dps",
        "class_label": "Class D - All vehicles or combination of vehicles except Class A, B, C",
        "disclaimer": "Notify in writing, Driver License Services, P.O. Box 11415, Oklahoma City, OK 73136-0145 within 10 days of any name or address change",
        "donor": "LIFESHARE OK",
        "layout": "type_b",
        "watermark": "OKLAHOMA",
        "rev": "Rev. 04/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafaf9 50%, #f4f3f0 100%)",
        "security_tint": "#d8d5cb"
    },
    "OR": {
        "name": "Oregon",
        "agency": "Oregon Department of Transportation DMV",
        "url": "www.oregon.gov/odot/dmv",
        "class_label": "Class: C - Any single vechicle with a GVWR of not more than 26,000 pounds with propper endorsements. Any emergency vechicle operated by a firefighter.",
        "disclaimer": "Property of State of Oregon • Return postage guaranteed Salem OR 97314",
        "donor": "DONATE LIFE NW",
        "layout": "type_b",
        "watermark": "OREGON",
        "rev": "Rev. 01/2019",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f0f4f5",
        "bg_gradient": "linear-gradient(180deg, #f7fafb 0%, #ecf2f3 50%, #dfe9ea 100%)",
        "security_tint": "#c2d5d7"
    },
    "PA": {
        "name": "Pennsylvania",
        "agency": "Pennsylvania Department of Transportation",
        "url": "www.dmv.pa.gov",
        "class_label": "CLASS: C-Single/Comb < 26,001 END: None RESTR: None",
        "disclaimer": "Property of Commonwealth of Pennsylvania • Pa. Vehicle Code (Title 75) • Address change required within 15 days • Return to Harrisburg PA 17106",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "PENNSYLVANIA",
        "rev": "08/25/1972 Rev 06/07/2016",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f6f7f8",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f6f7f9 50%, #edf0f3 100%)",
        "security_tint": "#ccd3dc"
    },
    "RI": {
        "name": "Rhode Island",
        "agency": "Rhode Island Division of Motor Vehicles",
        "url": "www.dmv.ri.gov",
        "class_label": "CLASS: 10-Operator License",
        "disclaimer": "The law requires the DMV to be notified of any change of name or address within 10 days Please print change of address below in permanent int.",
        "donor": "ORGAN DONOR",
        "layout": "type_b",
        "watermark": "RHODE ISLAND",
        "rev": "Rev 01/26/2017 09/16/1985",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f5f4f2",
        "bg_gradient": "linear-gradient(180deg, #faf9f8 0%, #f3f1ee 50%, #e8e5e0 100%)",
        "security_tint": "#cdc8be"
    },
    "SC": {
        "name": "South Carolina",
        "agency": "South Carolina Department of Motor Vehicles",
        "url": "www.scdmvonline.com",
        "class_label": "CLASS: D",
        "disclaimer": "Property of State of South Carolina • Return postage guaranteed Blythewood SC 29016",
        "donor": "DONATE LIFE SC",
        "layout": "type_b",
        "watermark": "SOUTH CAROLINA",
        "rev": "Rev. 02/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f0f0f0",
        "bg_gradient": "linear-gradient(180deg, #fafafa 0%, #f2f2f2 50%, #e6e6e6 100%)",
        "security_tint": "#d1d1d1"
    },
    "SD": {
        "name": "South Dakota",
        "agency": "South Dakota Department of Public Safety",
        "url": "dps.sd.gov",
        "class_label": "CLASS: 1",
        "disclaimer": "State of South Dakota • Return if found to 118 W Capitol Ave Pierre SD 57501",
        "donor": "DONATE LIFE SD",
        "layout": "type_b",
        "watermark": "SOUTH DAKOTA",
        "rev": "Rev. 05/2016",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#eef1f3",
        "bg_gradient": "linear-gradient(180deg, #f6f8f9 0%, #ebedf0 50%, #dde2e5 100%)",
        "security_tint": "#abb2b9"
    },
    "TN": {
        "name": "Tennessee",
        "agency": "Tennessee Department of Safety",
        "url": "www.tn.gov/safety",
        "class_label": "CLASS: D",
        "disclaimer": "State of Tennessee • Notice of address change required within 10 days",
        "donor": "DONATE LIFE TN",
        "layout": "type_b",
        "watermark": "TENNESSEE",
        "rev": "Rev. 01/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f4f4f4 100%)",
        "security_tint": "#d3d3d3"
    },
    "TX": {
        "name": "Texas",
        "agency": "Texas Department of Public Safety",
        "url": "www.dps.texas.gov",
        "class_label": "CLASS: C-Single or comb veh w/ GVWR ≤ 26,000 lbs which transports placarder HAZMAT or ≥ 16 pass, including driver",
        "disclaimer": "Tex. Transp. Code § 521 • Texas Department of Public Safety • Operation of a motor vehicle constitutes consent to alcohol testing • Directive to physician / Emergency Contact",
        "donor": "DONATE LIFE TEXAS",
        "layout": "type_b",
        "watermark": "TEXAS",
        "rev": "REV: 02/23/2020",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f5f2f4",
        "bg_gradient": "linear-gradient(180deg, #faf7f8 0%, #f0e7eb 50%, #e4eaee 100%)",
        "security_tint": "#ccaebd"
    },
    "UT": {
        "name": "Utah",
        "agency": "Utah Department of Public Safety",
        "url": "dps.utah.gov",
        "class_label": "CLASS: D-ALL VECHICLES NOT REQUIRING A CDL",
        "disclaimer": "ADDRESS CHANGE: Notify in writing. Driver License Division. P.O. Box 144501, Salt Lake City, UT 04114-4001 or Online at driverlicense.utah.com any change of address within 10 days.",
        "donor": "YES UTAH DONOR",
        "layout": "type_b",
        "watermark": "UTAH",
        "rev": "Rev. 06/2016",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafaf8 50%, #f4f3ed 100%)",
        "security_tint": "#d7d4c5"
    },
    "VT": {
        "name": "Vermont",
        "agency": "Vermont Department of Motor Vehicles",
        "url": "dmv.vermont.gov",
        "class_label": "CLASS: D",
        "disclaimer": "State of Vermont • Return if found to 120 State St Montpelier VT 05603",
        "donor": "DONATE LIFE VERMONT",
        "layout": "type_b",
        "watermark": "VERMONT",
        "rev": "Rev. 04/2019",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8faf8 50%, #eef3ee 100%)",
        "security_tint": "#c9d9c9"
    },
    "VA": {
        "name": "Virginia",
        "agency": "Virginia Department of Motor Vehicles",
        "url": "www.dmv.virginia.gov",
        "class_label": "CLASS: D",
        "disclaimer": "Commonwealth of Virginia • Return postage guaranteed Richmond VA 23269",
        "donor": "DONATE LIFE VIRGINIA",
        "layout": "type_b",
        "watermark": "VIRGINIA",
        "rev": "Rev. 05/2018",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f9fbfb 50%, #f1f4f5 100%)",
        "security_tint": "#cbd7db"
    },
    "WA": {
        "name": "Washington",
        "agency": "Washington State Department of Licensing",
        "url": "www.dol.wa.gov",
        "class_label": "CLASS: DRIVER",
        "disclaimer": "Please notify the Department of Licensing within 10 days of change of address",
        "donor": "LIFECENTER NW",
        "layout": "type_b",
        "watermark": "WASHINGTON",
        "rev": "Rev. 09/2018",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f7faf8 50%, #edf4ef 100%)",
        "security_tint": "#c6dccb"
    },
    "WV": {
        "name": "West Virginia",
        "agency": "West Virginia Division of Motor Vehicles",
        "url": "transportation.wv.gov/dmv",
        "class_label": "CLASS: E",
        "disclaimer": "State of West Virginia • Report change of address within 20 days",
        "donor": "DONATE LIFE WV",
        "layout": "type_b",
        "watermark": "WEST VIRGINIA",
        "rev": "Rev. 03/2017",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f2f4f5 100%)",
        "security_tint": "#d1d8dc"
    },
    "WI": {
        "name": "Wisconsin",
        "agency": "Wisconsin Department of Transportation",
        "url": "wisconsindot.gov",
        "class_label": "CLASS:",
        "disclaimer": "State of Wisconsin • Drop in any US mailbox Madison WI 53707",
        "donor": "I refuse to make an anatomical gift",
        "layout": "type_b",
        "watermark": "WISCONSIN",
        "rev": "Rev. 09/2015",
        "archetype": "modern_optical",
        "has_magstripe": false,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#edf0f6",
        "bg_gradient": "linear-gradient(180deg, #f6f8fc 0%, #eaedf5 50%, #dbe0ee 100%)",
        "security_tint": "#b6c0db"
    },
    "WY": {
        "name": "Wyoming",
        "agency": "Wyoming Department of Transportation",
        "url": "dot.state.wy.us",
        "class_label": "CLASS: C",
        "disclaimer": "Property of State of Wyoming • Return to 5300 Bishop Blvd Cheyenne WY 82009",
        "donor": "DONOR ALLIANCE WY",
        "layout": "type_b",
        "watermark": "WYOMING",
        "rev": "Rev. 08/2018",
        "archetype": "magstripe_standard",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafaf9 50%, #f3f3f0 100%)",
        "security_tint": "#d5d5cd"
    },
    "AB": {
        "name": "Alberta",
        "agency": "Government of Alberta • Service Alberta",
        "url": "alberta.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "In accordance with Alberta law it is an offence to have more than one Driver’s Licence and you",
        "donor": "ALBERTA DONOR REGISTRY",
        "layout": "canadian",
        "watermark": "ALBERTA",
        "rev": "Rev. 2018",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#edf5f5",
        "bg_gradient": "linear-gradient(180deg, #f5fafa 0%, #eaf4f4 50%, #dceeed 100%)",
        "security_tint": "#bddada"
    },
    "BC": {
        "name": "British Columbia",
        "agency": "Insurance Corporation of British Columbia (ICBC)",
        "url": "icbc.com",
        "class_label": "CLASS: 5",
        "disclaimer": "This card remains the property of the issuing agency and must be surrendered upon request.",
        "donor": "BC TRANSPLANT",
        "layout": "canadian",
        "watermark": "BRITISH COLUMBIA",
        "rev": "Rev. 2020",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fafb 50%, #edf3f7 100%)",
        "security_tint": "#c6d9e8"
    },
    "MB": {
        "name": "Manitoba",
        "agency": "Manitoba Public Insurance (MPI)",
        "url": "mpi.mb.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Property of the Province of Manitoba • Return if found to PO Box 6300 Winnipeg MB",
        "donor": "SIGN UP FOR LIFE MB",
        "layout": "canadian",
        "watermark": "MANITOBA",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fafbfb 50%, #f1f4f5 100%)",
        "security_tint": "#cbd8dc"
    },
    "NB": {
        "name": "New Brunswick",
        "agency": "Service New Brunswick / Services Nouveau-Brunswick",
        "url": "snb.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Permis de conduire / Driver's Licence • Motor Vehicle Act / Loi sur les véhicules à moteur",
        "donor": "DON D'ORGANES / DONOR",
        "layout": "canadian",
        "watermark": "NEW BRUNSWICK",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #faf9f6 50%, #f3eee3 100%)",
        "security_tint": "#dcd4c0"
    },
    "NL": {
        "name": "Newfoundland and Labrador",
        "agency": "Digital Government and Service NL",
        "url": "gov.nl.ca/dgsnl",
        "class_label": "CLASS: 5",
        "disclaimer": "Motor Registration Division • Province of Newfoundland and Labrador • Highway Traffic Act",
        "donor": "ORGAN DONOR",
        "layout": "canadian",
        "watermark": "NEWFOUNDLAND",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f7fbfd 50%, #eef5fa 100%)",
        "security_tint": "#cbe1f0"
    },
    "NS": {
        "name": "Nova Scotia",
        "agency": "Access Nova Scotia • Registry of Motor Vehicles",
        "url": "novascotia.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Province of Nova Scotia • Return if found to PO Box 1652 Halifax NS • Motor Vehicle Act",
        "donor": "LEGACY OF LIFE NS",
        "layout": "canadian",
        "watermark": "NOVA SCOTIA",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f8fbfd 50%, #edf4f9 100%)",
        "security_tint": "#c7dcee"
    },
    "NT": {
        "name": "Northwest Territories",
        "agency": "Government of Northwest Territories • Infrastructure",
        "url": "inf.gov.nt.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Department of Infrastructure • Motor Vehicles Act • Property of Government of NWT",
        "donor": "ORGAN DONOR",
        "layout": "canadian",
        "watermark": "NWT",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#edf4f8",
        "bg_gradient": "linear-gradient(180deg, #f6fafd 0%, #ebf3f8 50%, #deecf4 100%)",
        "security_tint": "#b8d6e7"
    },
    "NU": {
        "name": "Nunavut",
        "agency": "Government of Nunavut • Community and Government Services",
        "url": "gov.nu.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Motor Vehicles Division • Nunavut Motor Vehicles Act • Property of Government of Nunavut",
        "donor": "ORGAN DONOR",
        "layout": "canadian",
        "watermark": "NUNAVUT",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#edf4f8",
        "bg_gradient": "linear-gradient(180deg, #f6fafd 0%, #ebf3f8 50%, #deecf4 100%)",
        "security_tint": "#b8d6e7"
    },
    "ON": {
        "name": "Ontario",
        "agency": "Ministère des Transports de l'Ontario / MTO",
        "url": "ontario.ca/transportation",
        "class_label": "CLASS: G",
        "disclaimer": "Highway Traffic Act • Loi sur la circulation routière • Property of the Province of Ontario • Return postage guaranteed",
        "donor": "TRILLIUM GIFT OF LIFE",
        "layout": "canadian",
        "watermark": "ONTARIO",
        "rev": "Rev. 2018",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#e8f3f4",
        "bg_gradient": "linear-gradient(180deg, #f4fafb 0%, #e4f2f3 50%, #d4eaec 100%)",
        "security_tint": "#bcd1d4"
    },
    "PE": {
        "name": "Prince Edward Island",
        "agency": "Access PEI • Highway Safety Division",
        "url": "princeedwardisland.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Province of Prince Edward Island • Highway Traffic Act • Return to Charlottetown PE",
        "donor": "ORGAN DONOR",
        "layout": "canadian",
        "watermark": "PEI",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #fbf9f8 50%, #f5eee9 100%)",
        "security_tint": "#dfd2c6"
    },
    "QC": {
        "name": "Quebec",
        "agency": "Société de l'assurance automobile du Québec (SAAQ)",
        "url": "saaq.gouv.qc.ca",
        "class_label": "CLASSE : 5",
        "disclaimer": "Code de la sécurité routière du Québec • Propriété exclusive de la SAAQ • Remettre à la SAAQ si trouvé",
        "donor": "DON D'ORGANES QUÉBEC",
        "layout": "canadian_fr",
        "watermark": "QUÉBEC",
        "rev": "Rev. 2015",
        "archetype": "canadian_fr",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#edf1fc",
        "bg_gradient": "linear-gradient(180deg, #f5f7fe 0%, #e9edfa 50%, #d9e1f6 100%)",
        "security_tint": "#c8d2f4"
    },
    "SK": {
        "name": "Saskatchewan",
        "agency": "SGI • Saskatchewan Government Insurance",
        "url": "sgi.sk.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Driver and Vehicle Licensing • Province of Saskatchewan • The Traffic Safety Act",
        "donor": "SGI ORGAN DONOR",
        "layout": "canadian",
        "watermark": "SASKATCHEWAN",
        "rev": "Rev. 2016",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#f8f8f2",
        "bg_gradient": "linear-gradient(180deg, #fdfdfa 0%, #f6f6ef 50%, #ecece1 100%)",
        "security_tint": "#dedecb"
    },
    "YT": {
        "name": "Yukon",
        "agency": "Government of Yukon • Motor Vehicles Branch",
        "url": "yukon.ca",
        "class_label": "CLASS: 5",
        "disclaimer": "Department of Highways and Public Works • Motor Vehicles Act • Property of Government of Yukon",
        "donor": "YUKON DONOR",
        "layout": "canadian",
        "watermark": "YUKON",
        "rev": "Rev. 2017",
        "archetype": "canadian",
        "has_magstripe": true,
        "watermark_style": "seal",
        "barcode_1d_pos": "bottom",
        "bg_color": "#ffffff",
        "bg_gradient": "linear-gradient(180deg, #ffffff 0%, #f7fbfd 50%, #edf5fa 100%)",
        "security_tint": "#cae0ee"
    }
};

    function getCardBackMetadata(slugOrCode) {
        if (!slugOrCode) return STATE_CARDBACK_METADATA["LA"];
        const s = slugOrCode.toUpperCase().trim();
        const base = s.split('_')[0];
        return STATE_CARDBACK_METADATA[s] || STATE_CARDBACK_METADATA[base] || STATE_CARDBACK_METADATA["LA"];
    }

    window.STATE_CARDBACK_METADATA = STATE_CARDBACK_METADATA;
    window.getCardBackMetadata = getCardBackMetadata;

    window.STATE_HIERARCHY = STATE_HIERARCHY;
    window.runStateCalculation = runStateCalculation;
    window.getTargetElement = getTargetElement;

})(window);
