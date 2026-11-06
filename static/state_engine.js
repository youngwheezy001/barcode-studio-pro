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
        "default_dd": "NONE"
      },
      {
        "slug": "AL_2022",
        "label": "Alabama (2022)",
        "rev_header": "Rev. 26/04/2022 (0403)",
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
        "default_dd": "NONE"
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
      }
    ]
  },
  "Colorado": {
    "is_canada": false,
    "parent_name": "Colorado",
    "base_code": "CA",
    "revisions": [
      {
        "slug": "CA_2024",
        "label": "Colorado (2015)",
        "rev_header": "Rev. 2024 (1001)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "Veriscan"
        ],
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
      },
      {
        "slug": "CO_2015",
        "label": "Colorado (2015)",
        "rev_header": "Rev. 10/30/2015)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "default_dd": ""
      },
      {
        "slug": "CO_2022",
        "label": "Colorado (2022)",
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
        "has_audit": true,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 03/16/2017 & 05/01/2019 & 03/01/2020)",
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
        "default_dd": ""
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
        "rev_header": "Rev. 07/01/2015)",
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
        "default_dd": ""
      },
      {
        "slug": "GA_2019",
        "label": "Georgia (2019)",
        "rev_header": "Rev. 01/02/2019)",
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "rev_header": "Rev. 12/10/2012)",
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 10/10/2008)",
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
        "default_dd": ""
      },
      {
        "slug": "NV_2021",
        "label": "Nevada (2021)",
        "rev_header": "Rev. 05/24/2021 (1000)",
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": false,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 07/09/2018)",
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 01/26/2016)",
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 01/01/2018)",
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
        "default_dd": ""
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
        "rev_header": "Rev. 06/29/2017)",
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "rev_header": "Rev. 10/10/2016 (0800)",
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
        "default_dd": ""
      },
      {
        "slug": "TX_2020",
        "label": "Texas (2022)",
        "rev_header": "Rev. 02/23/2020 (0900)",
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
        "default_dd": ""
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
        "rev_header": "Rev. 04/15/2016 (0800)",
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
        "default_dd": ""
      },
      {
        "slug": "UT_2021",
        "label": "Utah (2021)",
        "rev_header": "Rev. 06/01/2021 (1000)",
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
        "default_dd": ""
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
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "default_dd": ""
      }
    ]
  },
  "Washington DC": {
    "is_canada": false,
    "parent_name": "Washington DC",
    "base_code": "WA",
    "revisions": [
      {
        "slug": "WA_2025",
        "label": "Washington DC",
        "rev_header": "Rev. 02/18/2025 (0901)",
        "scanners": [
          "Scandit",
          "Show-Me ID",
          "FIDScan",
          "Veriscan"
        ],
        "has_icn": false,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": true,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "has_icn": true,
        "has_dd": true,
        "has_weight_range": false,
        "has_audit": false,
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        "default_dd": ""
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
        'inputIsRealID': 'aamva-realid'
    };

    function getTargetElement(id) {
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
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(12);
}



function FL_calculate_ICN() {
    getTargetElement("inputICN").value = "0100" + getRandomNumericString(12);
}



function FL_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = getRandomLetter() + getRandomNumericString(2) 
    + issueDate.slice(-2) + issueDate.slice(0, 2) + issueDate.slice(2, 4) + getRandomNumericString(4);
}



/*
$$$$$$ $$$$$ $$  $$  $$$$   $$$$ 
  $$   $$     $$$$  $$  $$ $$
  $$   $$$$    $$   $$$$$$  $$$$
  $$   $$     $$$$  $$  $$     $$
  $$   $$$$$ $$  $$ $$  $$  $$$$
*/

// ======== TEXAS (TX) ======== //



function TX_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}



function TX_calculate_DD_improved() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    year = issueDate.slice(-2)
    month = issueDate.slice(0,2)
    day = issueDate.slice(2,4)

    console.log(day)

    getTargetElement("inputDD").value = '006' + year[0] + '9' + year[1] + '8' + month[0] + '0' + month[1] + '5' + day[0] + '0' + day[1] + getRandomNumericString(6);
}




function TX_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(20);
}



function TX_2016_calculate_ICN() {
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

    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2)) - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 1)
    
    // Get year, month, and day part from the date
    var year = issueDateDATE.toLocaleString("default", { year: "numeric" });
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = year + month + day;

    getTargetElement("inputICN").value = documentNumber + "  " + formattedDate;
}



function TX_2020_calculate_ICN() {
    getTargetElement("inputICN").value = "10000" + getRandomNumericString(6);
}


/*
$$$$$$ $$     $$     $$$$$$ $$  $$  $$$$  $$$$$$  $$$$
  $$   $$     $$       $$   $$$ $$ $$  $$   $$   $$
  $$   $$     $$       $$   $$ $$$ $$  $$   $$    $$$$
  $$   $$     $$       $$   $$  $$ $$  $$   $$       $$
$$$$$$ $$$$$$ $$$$$$ $$$$$$ $$  $$  $$$$  $$$$$$  $$$$
*/

// ================== ILLINOIS (IL) ================= //



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
    getTargetElement('inputDocumentNumber').value = "WDL" + random_string + "B";
}



function WA_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 12) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    var auditInfo = getTargetElement("inputAudit").value;
    if (auditInfo.length != 13) {
        showInputDataAlert("DD calculation error. Incorrect audit information!")
        return;
    }

    getTargetElement("inputDD").value = documentNumber + auditInfo;
}



function WA_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputAudit").value = getRandomLetter()
    + issueDate.slice(0,2) + issueDate.slice(2,4) + issueDate.slice(-2) + "98" + getRandomNumericString(4);
}



function WA_calculate_AUDIT_with_P() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Audit information calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputAudit").value = 'P' + issueDate.slice(0,2) + issueDate.slice(2,4) + issueDate.slice(-2) + getRandomNumericString(6);
}


/*
_$$$$_ $$$$$ _$$$$_ $$$$$_ _$$$$_ $$$$$$ _$$$$_     _$$$$_ _$$$$_ __$$ _$$$$_
$$____ $$___ $$__$$ $$__$$ $$____ __$$__ $$__$$     $$__$$ $$__$$ $$$$ $$__$$
$$_$$$ $$$$_ $$__$$ $$$$$_ $$_$$$ __$$__ $$$$$$     ___$$_ $$__$$ __$$ _$$$$$
$$__$$ $$___ $$__$$ $$__$$ $$__$$ __$$__ $$__$$     _$$___ $$__$$ __$$ ____$$
_$$$$_ $$$$$ _$$$$_ $$__$$ _$$$$_ $$$$$$ $$__$$     $$$$$$ _$$$$_ __$$ _$$$$_
*/


// ============================= GEORGIA (GA) ============================ //




function GA_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "0" + getRandomNumericString(8);
}



function GA_calculate_ICN() {
    getTargetElement("inputICN").value = "1000" + getRandomNumericString(7);
}



function GA_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(11) + "00" + getRandomNumericString(5);
}



function GA_calculate_ICN_2015() {
    getTargetElement("inputICN").value = "2" + getRandomNumericString(9) + "100401";
}



function GA_calculate_DD_2015() {

    var icn = getTargetElement("inputICN").value;
    if (icn.length != 16) {
        showInputDataAlert("DD calculation error. Incorrect ICN!")
        return;
    }

    getTargetElement("inputDD").value = icn.slice(0, -2) +  getRandomNumericString(4);
}



/*
 $$$$  $$  $$ $$$$$$  $$$$
$$  $$ $$  $$   $$   $$  $$
$$  $$ $$$$$$   $$   $$  $$
$$  $$ $$  $$   $$   $$  $$
 $$$$  $$  $$ $$$$$$  $$$$
*/


// ===== OHIO (OH) ===== //




function OH_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomLetter() + getRandomNumericString(6);
}



function OH_calculate_ICN() {
    getTargetElement("inputICN").value = getRandomLetter() + getRandomNumericString(8);
}



function OH_calculate_DD() {
    getTargetElement("inputDD").value = "0" + getRandomNumericString(7) + "0";
}



/*
 $$$$   $$$$  $$      $$$$  $$$$$   $$$$  $$$$$   $$$$
$$  $$ $$  $$ $$     $$  $$ $$  $$ $$  $$ $$  $$ $$  $$
$$     $$  $$ $$     $$  $$ $$$$$  $$$$$$ $$  $$ $$  $$
$$  $$ $$  $$ $$     $$  $$ $$  $$ $$  $$ $$  $$ $$  $$
 $$$$   $$$$  $$$$$$  $$$$  $$  $$ $$  $$ $$$$$   $$$$
*/


// ================== COLORADO (CO) ================= //




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
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}



function PA_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputICN").value = "02500" + getRandomNumericString(6) + issueDate.slice(-2) + getRandomNumericString(3);
}



function PA_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(-2) + getNumberOfDaysFromBeginnigOfYear(issueDate)+ getRandomNumericString(10) + "00000" + getRandomNumericString(5);
}


/*
$$  $$  $$$$  $$$$$  $$$$$$ $$  $$     $$$$   $$$$  $$$$$   $$$$  $$     $$$$$$ $$  $$  $$$$
$$$ $$ $$  $$ $$  $$   $$   $$  $$    $$  $$ $$  $$ $$  $$ $$  $$ $$       $$   $$$ $$ $$  $$
$$ $$$ $$  $$ $$$$$    $$   $$$$$$    $$     $$$$$$ $$$$$  $$  $$ $$       $$   $$ $$$ $$$$$$
$$  $$ $$  $$ $$  $$   $$   $$  $$    $$  $$ $$  $$ $$  $$ $$  $$ $$       $$   $$  $$ $$  $$
$$  $$  $$$$  $$  $$   $$   $$  $$     $$$$  $$  $$ $$  $$  $$$$  $$$$$$ $$$$$$ $$  $$ $$  $$
*/


// ================================== NORTH CAROLINA (NC) ================================= //




function NC_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "00000" + getRandomNumericString(7);
}



function NC_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 12) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "NC"
    + getRandomLetterAndDigit() + getRandomLetterAndDigit() + getRandomLetterAndDigit() + getRandomLetterAndDigit() + "01";
}



function NC_calculate_DD() {
    getTargetElement("inputDD").value = "001" + getRandomNumericString(7);
}



/*
$$   $  $$$$   $$$$   $$$$   $$$$   $$$$  $$  $$ $$  $$  $$$$  $$$$$ $$$$$$ $$$$$$  $$$$
$$$ $$ $$  $$ $$     $$     $$  $$ $$  $$ $$  $$ $$  $$ $$     $$      $$     $$   $$
$$ $ $ $$$$$$  $$$$   $$$$  $$$$$$ $$     $$$$$$ $$  $$  $$$$  $$$$    $$     $$    $$$$
$$   $ $$  $$     $$     $$ $$  $$ $$  $$ $$  $$ $$  $$     $$ $$      $$     $$       $$
$$   $ $$  $$  $$$$   $$$$  $$  $$  $$$$  $$  $$  $$$$   $$$$  $$$$$   $$     $$    $$$$
*/




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
    const ui = getCalcUi(btn)
    if (ui.btn.classList.contains("loading")) return;

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        ui.showTemp(ui.err);
        return;
    }
    ui.setLoading(true);

    const hh = Math.floor(Math.random() * 3) + 12; // 12–14
    const mm = Math.floor(Math.random() * 60);
    const ss = Math.floor(Math.random() * 60);

    const timeCode =
      String(hh).padStart(2, "0") +
      String(mm).padStart(2, "0") +
      String(ss).padStart(2, "0");

    try {
        getTargetElement("inputDD").value = issueDate.slice(-2) + issueDate.slice(0,2) + issueDate.slice(2,4) 
            + timeCode + "01" + "MV" + getRandomLetter() + getRandomDigit();
        ui.showTemp(ui.ok);
    } catch(e) {
        ui.showTemp(ui.err);
    } finally {
        ui.setLoading(false);
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
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function OR_calculate_ICN() {
    getTargetElement("inputICN").value = "AA" + getRandomNumericString(7);
}



function OR_calculate_DD() {
    getTargetElement("inputDD").value = "200"  + getRandomNumericString(6);
}



/*
$$  $$ $$$$$ $$  $$  $$$$  $$$$$   $$$$
$$$ $$ $$    $$  $$ $$  $$ $$  $$ $$  $$
$$ $$$ $$$$  $$  $$ $$$$$$ $$  $$ $$$$$$
$$  $$ $$     $$$$  $$  $$ $$  $$ $$  $$
$$  $$ $$$$$   $$   $$  $$ $$$$$  $$  $$
*/




function NV_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "1" + getRandomNumericString(9);
}



function NV_calculate_ICN() {
    getTargetElement("inputICN").value = "0015" + getRandomNumericString(7) + "01";
}



function NV_2021_calculate_ICN() {
    getTargetElement("inputICN").value = "0019" + getRandomNumericString(7) + "01";
}


async function NV_calculate_DD(btn) {
    const ui = getCalcUi(btn)
    if (ui.btn.classList.contains("loading")) return;

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        ui.showTemp(ui.err);
        return;
    }

    const isoDate = issueDate.slice(4, 8) + "-" + issueDate.slice(0, 2) + "-" + issueDate.slice(2, 4);

    ui.setLoading(true);
    try {
        const resp = await fetch(
            `/api/v1/codes/nv/dd?date=${encodeURIComponent(isoDate)}`,
            { headers: { Accept: "text/plain" } }
        );

        if (!resp.ok) throw new Error(String(resp.status));

        const code = (await resp.text()).trim();
        if (!/^[0-9A-Z]{21}$/.test(code)) throw new Error("bad code");

        const out = getTargetElement("inputDD");
        if (out) out.value = code;

        ui.showTemp(ui.ok);
    } catch (e) {
        console.error(e);
        showInputDataAlert("Code request error. Cannot calculate ICN now.");
        ui.showTemp(ui.err);
    } finally {
        ui.setLoading(false);
    }
}



/*
$$  $$ $$$$$ $$   $    $$  $$  $$$$  $$$$$  $$  $$
$$$ $$ $$    $$   $     $$$$  $$  $$ $$  $$ $$ $$
$$ $$$ $$$$  $$ $ $      $$   $$  $$ $$$$$  $$$$
$$  $$ $$    $$$$$$      $$   $$  $$ $$  $$ $$ $$
$$  $$ $$$$$  $$ $$      $$    $$$$  $$  $$ $$  $$
*/




function NY_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "7" + getRandomNumericString(8);
}




function NY_calculate_DD() {
    s = ""
    for (var i = 0; i < 8; i++) { s += getRandomLetterAndDigit(); }
    getTargetElement("inputDD").value = s + "06";
}



/*
$$   $  $$$$  $$$$$$ $$  $$ $$$$$
$$$ $$ $$  $$   $$   $$$ $$ $$
$$ $ $ $$$$$$   $$   $$ $$$ $$$$
$$   $ $$  $$   $$   $$  $$ $$
$$   $ $$  $$ $$$$$$ $$  $$ $$$$$
*/




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
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("Document number calculation error. Incorrect birth date!")
        return;
    }

    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!")
        return;
    }

    lastName += "XX"

    getTargetElement('inputDocumentNumber').value = lastName.slice(0,3).toUpperCase() + birthDate.slice(-2) + getRandomNumericString(4);
}



function ND_calculate_ICN() {
    getTargetElement("inputICN").value = "034001" + getRandomNumericString(10);
}



function ND_2023_calculate_ICN() {
    getTargetElement("inputICN").value = "05100" + getRandomNumericString(11);
}



function ND_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var height = getTargetElement("inputHeight").value;
    if (!height) {
        showInputDataAlert("DD calculation error. Incorrect height!")
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
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

    var sex = getTargetElement("inputSex").value
    if (!sex) {
        showInputDataAlert("DD calculation error. Incorrect Sex!")
    }

    sex_digit = sex == "M" ? "5" : "1"

    getTargetElement('inputDD').value = birthDate.slice(-2, -1) + documentNumber + lastName[0] + firstName[0]
        + sex_digit + "2" + expiryDate.slice(-1)  + expiryDate.slice(2,4) + getRandomLetter().toLowerCase() + getRandomLetter() + height + "NDZ";
}



function ND_2023_calculate_DD() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    var height = getTargetElement("inputHeight").value;
    if (!height) {
        showInputDataAlert("DD calculation error. Incorrect height!")
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
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

    var sex = getTargetElement("inputSex").value
    if (!sex) {
        showInputDataAlert("DD calculation error. Incorrect Sex!")
    }

    sex_digit = sex == "M" ? "5" : "1"

    getTargetElement('inputDD').value = birthDate.slice(-2, -1) + documentNumber + lastName[0] + firstName[0]
        + sex_digit + "2" + expiryDate.slice(-1)  + expiryDate.slice(2,4) + getRandomLetter().toLowerCase() + getRandomLetter() + height + "YDZ";
}



function ND_calculate_optionNumber() {
    getTargetElement('inputOption').value = getRandomNumericString(3);
}



/*
$$  $$ $$$$$ $$$$$  $$$$$   $$$$   $$$$  $$  $$  $$$$
$$$ $$ $$    $$  $$ $$  $$ $$  $$ $$     $$ $$  $$  $$
$$ $$$ $$$$  $$$$$  $$$$$  $$$$$$  $$$$  $$$$   $$$$$$
$$  $$ $$    $$  $$ $$  $$ $$  $$     $$ $$ $$  $$  $$
$$  $$ $$$$$ $$$$$  $$  $$ $$  $$  $$$$  $$  $$ $$  $$
*/



function NE_calculate_documentNumber() {
    const alphabet = "ABCEGHV";

    getTargetElement('inputDocumentNumber').value = alphabet[Math.floor(Math.random() * alphabet.length)] + getRandomNumericString(8);
}



function NE_2021_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "NETYCO01";
    NE_2021_calculate_DD()
}



function NE_2021_calculate_DD() {
    var icn = getTargetElement("inputICN").value;
    if (icn.length != 17) {
        showInputDataAlert("DD calculation error. Incorrect ICN!")
        return;
    }

    getTargetElement("inputDD").value = "054" + icn + getRandomNumericString(5);
}




function NE_calculate_ICN() {
    getTargetElement("inputICN").value = "0540000" + getRandomNumericString(4) + "00000";
    getTargetElement("inputDD").value = getTargetElement("inputICN").value;
}



function NE_calculate_DD() {
    var icn = getTargetElement("inputICN").value;
    if (icn.length != 16) {
        showInputDataAlert("DD calculation error. Incorrect ICN!")
        return;
    }

    getTargetElement("inputDD").value = icn;
}



/*
$$  $$ $$$$$ $$   $     $$  $$  $$$$  $$   $ $$$$$   $$$$  $$  $$ $$$$$$ $$$$$  $$$$$
$$$ $$ $$    $$   $     $$  $$ $$  $$ $$$ $$ $$  $$ $$     $$  $$   $$   $$  $$ $$
$$ $$$ $$$$  $$ $ $     $$$$$$ $$$$$$ $$ $ $ $$$$$   $$$$  $$$$$$   $$   $$$$$  $$$$
$$  $$ $$    $$$$$$     $$  $$ $$  $$ $$   $ $$         $$ $$  $$   $$   $$  $$ $$
$$  $$ $$$$$  $$ $$     $$  $$ $$  $$ $$   $ $$      $$$$  $$  $$ $$$$$$ $$  $$ $$$$$
*/





function NH_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "NHL" + getRandomNumericString(8);
}



function NH_calculate_ICN() {
    getTargetElement("inputICN").value = "0" + getRandomNumericString(7);
    getTargetElement("inputDD").value = getTargetElement("inputICN").value;
}



function NH_calculate_DD() {
    var icn = getTargetElement("inputICN").value;
    if (icn.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect ICN!")
        return;
    }

    getTargetElement("inputDD").value = icn;
}



/*
 $$$$   $$$$  $$  $$ $$$$$$ $$  $$     $$$$   $$$$  $$$$$   $$$$  $$     $$$$$$ $$  $$  $$$$
$$     $$  $$ $$  $$   $$   $$  $$    $$  $$ $$  $$ $$  $$ $$  $$ $$       $$   $$$ $$ $$  $$
 $$$$  $$  $$ $$  $$   $$   $$$$$$    $$     $$$$$$ $$$$$  $$  $$ $$       $$   $$ $$$ $$$$$$
    $$ $$  $$ $$  $$   $$   $$  $$    $$  $$ $$  $$ $$  $$ $$  $$ $$       $$   $$  $$ $$  $$
 $$$$   $$$$   $$$$    $$   $$  $$     $$$$  $$  $$ $$  $$  $$$$  $$$$$$ $$$$$$ $$  $$ $$  $$
*/




function SC_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "10" + getRandomNumericString(7);
}



function SC_calculate_DD() {
    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect expiry date!")
        return;
    }

    getTargetElement("inputDD").value = getRandomNumericString(8)
        + expiryDate.slice(0,2) + expiryDate.slice(-2) + getNumberOfDaysFromBeginnigOfYear(expiryDate)
        + getRandomNumericString(4);
}



/*
$$$$$$ $$$$$ $$  $$ $$  $$ $$$$$  $$$$   $$$$  $$$$$ $$$$$
  $$   $$    $$$ $$ $$$ $$ $$    $$     $$     $$    $$
  $$   $$$$  $$ $$$ $$ $$$ $$$$   $$$$   $$$$  $$$$  $$$$
  $$   $$    $$  $$ $$  $$ $$        $$     $$ $$    $$
  $$   $$$$$ $$  $$ $$  $$ $$$$$  $$$$   $$$$  $$$$$ $$$$$
*/

// ========================== Nennessee (TN) =========================== //




function TN_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomInt(2).toString() + getRandomNumericString(8);
}



function TN_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputICN").value = issueDate.slice(-2) + getNumberOfDaysFromBeginnigOfYear(issueDate) + getRandomNumericString(9) + "0101"
}



function TN_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = getRandomNumericString(2) + "0"
     + issueDate.slice(-2) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomNumericString(7);
}




function TN_calculate_REAL_ID(alert) {
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

      var comparisonDate = new Date(2019, 6, 1);

      if (inputDateObject >= comparisonDate) {
        getTargetElement("inputIsRealID").value = "F";
      } else {
        getTargetElement("inputIsRealID").value = "N";
      }
}


/*
$$  $$ $$$$$$ $$$$$   $$$$  $$$$$$ $$  $$ $$$$$$  $$$$
$$  $$   $$   $$  $$ $$       $$   $$$ $$   $$   $$  $$
$$  $$   $$   $$$$$  $$ $$$   $$   $$ $$$   $$   $$$$$$
 $$$$    $$   $$  $$ $$  $$   $$   $$  $$   $$   $$  $$
  $$   $$$$$$ $$  $$  $$$$  $$$$$$ $$  $$ $$$$$$ $$  $$
*/


// ========================== VIRGINIA (VA) =========================== //




function VA_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(8);
}



function VA_calculate_ICN() {
    getTargetElement("inputICN").value = "0060101" + getRandomNumericString(9);
}



function VA_calculate_DD() {
    getTargetElement("inputDD").value = "0" + getRandomNumericString(8);
}


/*
$$   $  $$$$  $$$$$  $$  $$ $$      $$$$  $$  $$ $$$$$
$$$ $$ $$  $$ $$  $$  $$$$  $$     $$  $$ $$$_$$ $$  $$
$$ $ $ $$$$$$ $$$$$    $$   $$     $$$$$$ $$ $$$ $$  $$
$$   $ $$  $$ $$  $$   $$   $$     $$  $$ $$  $$ $$  $$
$$   $ $$  $$ $$  $$   $$   $$$$$$_$$  $$ $$  $$ $$$$$
*/



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
        showInputDataAlert("Document number calculation error. Incorrect birth date!")
        return;
    }

    getTargetElement('inputDocumentNumber').value = CalculateDL(lastName, middleName, firstName, birthDate, "MI");
}



function MI_calculate_ICN() {
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect birth date!")
        return;
    }

    var expiryDate = getTargetElement("inputExpiryDate").value;
    if (expiryDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect expiry date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 17) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber.replace(/\s/g, '')
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
    number = CalculateDL(lastName, middleName, firstName, birthDate, "NJ");
    rand = getRandomNumericString(4);

    getTargetElement('inputDocumentNumber').value = number.replace("????", rand).replace(/\s/g, '');

}



function NJ_2020_calculate_ICN() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!")
        return;
    }

    var random_data = "";
    for (var i = 0; i < 9; i++) { random_data += getRandomLetterAndDigit(); }
    random_data += "NJ"
    random_data += getRandomNumericString(2)


    getTargetElement("inputICN").value = lastName[0] + random_data + "SL01"
}



function NJ_2020_calculate_DD() {

    var option1 = getTargetElement("inputOption1").value;
    if (!option1) {
        showInputDataAlert("DD calculation error. Incorrect option 1!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate));
    console.log(days)

    getTargetElement("inputDD").value = option1.slice(-2) + issueDate.slice(-4) + ("00" + days.toString()).slice(-3)
     + "0000" + getRandomNumericString(4);
}


/*
$$   $ $$$$$$  $$$$   $$$$   $$$$  $$  $$  $$$$  $$$$$$ $$  $$
$$   $   $$   $$     $$  $$ $$  $$ $$$ $$ $$       $$   $$$ $$
$$ $ $   $$    $$$$  $$     $$  $$ $$ $$$  $$$$    $$   $$ $$$
$$$$$$   $$       $$ $$  $$ $$  $$ $$  $$     $$   $$   $$  $$
 $$ $$ $$$$$$  $$$$   $$$$   $$$$  $$  $$  $$$$  $$$$$$ $$  $$
*/



function WI_calculate_documentNumber() {
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

    getTargetElement('inputDocumentNumber').value = CalculateDL(lastName, middleName, firstName, birthDate, "WI");
}



function WI_calculate_ICN() {
    getTargetElement("inputICN").value = "0130100" + getRandomNumericString(9);
}



function WI_calculate_DD() {
    var lastName = getTargetElement("inputLastName").value;
    if (!lastName) {
        showInputDataAlert("Document number calculation error. Incorrect Last name!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = "OT" + lastName[0].toUpperCase() + getRandomLetter() + getRandomLetter()
    + issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + sample(["10", "15"]) + getRandomNumericString(6);
}

/*
$$  $$ $$$$$$  $$$$  $$  $$
$$  $$   $$   $$  $$ $$  $$
$$  $$   $$   $$$$$$ $$$$$$
$$  $$   $$   $$  $$ $$  $$
 $$$$    $$   $$  $$ $$  $$
*/




function UT_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "1" + getRandomNumericString(8);
}



function UT_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "UT" 
    + getRandomDigit()+ getRandomDigit()  + "SL01";
}



function UT_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(8);
}



function UT_2016_calculate_REAL_ID(alert) {
    console.log('run')
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

      if (inputDateObject >= comparisonDate) {
        getTargetElement("inputIsRealID").value = "F";
      } else {
        getTargetElement("inputIsRealID").value = "N";
      }
}

/*
 $$$$  $$$$$  $$  $$  $$$$  $$  $$  $$$$   $$$$   $$$$
$$  $$ $$  $$ $$ $$  $$  $$ $$$ $$ $$     $$  $$ $$
$$$$$$ $$$$$  $$$$   $$$$$$ $$ $$$  $$$$  $$$$$$  $$$$
$$  $$ $$  $$ $$ $$  $$  $$ $$  $$     $$ $$  $$     $$
$$  $$ $$  $$ $$  $$ $$  $$ $$  $$  $$$$  $$  $$  $$$$
*/




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
    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("Document number calculation error. Incorrect birth date!")
        return;
    }

    getTargetElement('inputDocumentNumber').value = birthDate.slice(0,2) + getRandomNumericString(3) + birthDate.slice(-4) + "41" + birthDate.slice(3,5);
}



function MT_calculate_ICN() {

    var data1 = ""
    for (var i = 0; i < 6; i++) { data1 += getRandomLetterAndDigit(); }

    getTargetElement("inputICN").value = "1100" + getRandomDigit() + data1 + "FMT" + getRandomLetterAndDigit() + getRandomLetter() + getRandomLetter() + "001";
}



function MT_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomNumericString(12);
}

/*
$$$$$$ $$  $$ $$$$$  $$$$$$  $$$$  $$  $$  $$$$
  $$   $$$ $$ $$  $$   $$   $$  $$ $$$ $$ $$  $$
  $$   $$ $$$ $$  $$   $$   $$$$$$ $$ $$$ $$$$$$
  $$   $$  $$ $$  $$   $$   $$  $$ $$  $$ $$  $$
$$$$$$ $$  $$ $$$$$  $$$$$$ $$  $$ $$  $$ $$  $$
*/




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
    getTargetElement('inputDocumentNumber').value = "0" + getRandomNumericString(8);
}



function NM_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 9) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = documentNumber + "01";
}



function NM_calculate_DD() {
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
$$$$$  $$  $$  $$$$  $$$$$  $$$$$    $$$$$$  $$$$  $$      $$$$  $$  $$ $$$$$
$$  $$ $$  $$ $$  $$ $$  $$ $$         $$   $$     $$     $$  $$ $$$ $$ $$  $$
$$$$$  $$$$$$ $$  $$ $$  $$ $$$$       $$    $$$$  $$     $$$$$$ $$ $$$ $$  $$
$$  $$ $$  $$ $$  $$ $$  $$ $$         $$       $$ $$     $$  $$ $$  $$ $$  $$
$$  $$ $$  $$  $$$$  $$$$$  $$$$$    $$$$$$  $$$$  $$$$$$ $$  $$ $$  $$ $$$$$
*/




function RI_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function RI_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 7 && documentNumber.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputICN").value = "O" + documentNumber + "RI" + getRandomLetter() + getRandomLetter() + "TL01";
}



function RI_calculate_DD() {

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var issue_year = parseInt(issueDate.slice(-4));

    if (issue_year > 2017) {
        getTargetElement("inputDD").value = getRandomNumericString(6);
    } else {
        var documentNumber = getTargetElement("inputDocumentNumber").value;
        if (documentNumber.length != 7) {
            showInputDataAlert("ICN calculation error. Incorrect document number!")
            return;
        }
        getTargetElement("inputDD").value = documentNumber + issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomNumericString(6);
    }
}



function RI_calculate_DD_2022() {
    getTargetElement("inputDD").value = getRandomNumericString(7);
}


/*
$$   $  $$$$   $$$$  $$  $$ $$$$$$ $$  $$  $$$$  $$$$$$  $$$$  $$  $$      $$$$$   $$$$
$$   $ $$  $$ $$     $$  $$   $$   $$$ $$ $$       $$   $$  $$ $$$ $$      $$  $$ $$  $$
$$ $ $ $$$$$$  $$$$  $$$$$$   $$   $$ $$$ $$ $$$   $$   $$  $$ $$ $$$      $$  $$ $$
$$$$$$ $$  $$     $$ $$  $$   $$   $$  $$ $$  $$   $$   $$  $$ $$  $$      $$  $$ $$  $$
 $$ $$ $$  $$  $$$$  $$  $$ $$$$$$ $$  $$  $$$$    $$    $$$$  $$  $$      $$$$$   $$$$
*/




function DC_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function DC_calculate_AUDIT() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var issueDateDATE = new Date(parseInt(issueDate.slice(-4)), parseInt(issueDate.slice(0, 2))  - 1, parseInt(issueDate.slice(2, 4)));
    issueDateDATE.setDate(issueDateDATE.getDate() + 5)


    // Get year, month, and day part from the date
    var year = issueDateDATE.toLocaleString("default", { year: "2-digit" });
    var month = issueDateDATE.toLocaleString("default", { month: "2-digit" });
    var day = issueDateDATE.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    var formattedDate = month + day + issueDate.slice(-4);

    getTargetElement("inputAudit").value = formattedDate + "_" + getRandomNumericString(6) + "_" + getRandomDigit() + "_" + getRandomNumericString(3);
}



function DC_calculate_DD() {
    getTargetElement("inputDD").value = getRandomNumericString(8);
}


/*
$$      $$$$  $$  $$ $$$$$$  $$$$  $$$$$$  $$$$  $$  $$  $$$$
$$     $$  $$ $$  $$   $$   $$       $$   $$  $$ $$$ $$ $$  $$
$$     $$  $$ $$  $$   $$    $$$$    $$   $$$$$$ $$ $$$ $$$$$$
$$     $$  $$ $$  $$   $$       $$   $$   $$  $$ $$  $$ $$  $$
$$$$$$  $$$$   $$$$  $$$$$$  $$$$  $$$$$$ $$  $$ $$  $$ $$  $$
*/



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
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + "1" + getRandomNumericString(8);
}



function MO_2020_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + "0" + getRandomNumericString(8);
}



function MO_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 10) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 1;

    getTargetElement("inputICN").value = issueDate.slice(-2) + ("00" + days.toString()).slice(-3) + documentNumber + "0101"
}



function MO_2020_calculate_ICN() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("ICN calculation error. Incorrect issue date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 10) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    days = parseInt(getNumberOfDaysFromBeginnigOfYear(issueDate)) + 2;

    getTargetElement("inputICN").value = issueDate.slice(-2) + ("00" + days.toString()).slice(-3) + documentNumber + "0101"
}



function MO_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 10) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(-2) + documentNumber.slice(1, 4) + getNumberOfDaysFromBeginnigOfYear(issueDate) + "00" + getRandomNumericString(2);
}



function MO_2020_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement("inputDD").value = issueDate.slice(-2) + "14" + getRandomNumericString(4) + "00" + getRandomNumericString(2);
}


/*
$$  $$  $$$$  $$  $$  $$$$   $$$$   $$$$
$$ $$  $$  $$ $$$ $$ $$     $$  $$ $$
$$$$   $$$$$$ $$ $$$  $$$$  $$$$$$  $$$$
$$ $$  $$  $$ $$  $$     $$ $$  $$     $$
$$  $$ $$  $$ $$  $$  $$$$  $$  $$  $$$$
*/



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
    getTargetElement('inputDocumentNumber').value = "11" + getRandomNumericString(7);
}



function WY_calculate_ICN() {
    var v = "100003" + getRandomNumericString(3) + "7";
    getTargetElement('inputICN').value = v;
    getTargetElement('inputDD').value = v;

}



function WY_calculate_DD() {
    var v = "100003" + getRandomNumericString(3) + "7";
    getTargetElement('inputICN').value = v;
    getTargetElement('inputDD').value = v;
}


/*
 $$$$   $$$$  $$  $$ $$$$$$ $$  $$     $$$$$   $$$$  $$  $$  $$$$  $$$$$$  $$$$
$$     $$  $$ $$  $$   $$   $$  $$     $$  $$ $$  $$ $$ $$  $$  $$   $$   $$  $$
 $$$$  $$  $$ $$  $$   $$   $$$$$$     $$  $$ $$$$$$ $$$$   $$  $$   $$   $$$$$$
    $$ $$  $$ $$  $$   $$   $$  $$     $$  $$ $$  $$ $$ $$  $$  $$   $$   $$  $$
  $$$$  $$$$   $$$$    $$   $$  $$     $$$$$  $$  $$ $$  $$  $$$$    $$   $$  $$
*/



function SD_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = "01" + getRandomNumericString(6);
}



function SD_calculate_ICN() {
    getTargetElement('inputICN').value = "042000" + getRandomNumericString(10);
}



function SD_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    getTargetElement('inputDD').value = documentNumber + issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomNumericString(7);
}

/*
$$  $$ $$$$$ $$  $$ $$$$$$ $$  $$  $$$$  $$  $$ $$  $$
$$ $$  $$    $$$ $$   $$   $$  $$ $$  $$ $$ $$   $$$$
$$$$   $$$$  $$ $$$   $$   $$  $$ $$     $$$$     $$
$$ $$  $$    $$  $$   $$   $$  $$ $$  $$ $$ $$    $$
$$  $$ $$$$$ $$  $$   $$    $$$$   $$$$  $$  $$   $$
*/



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
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + "08" + getRandomNumericString(7);
}



function OK_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 10) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement('inputICN').value = documentNumber + "OK" +  getRandomLetterAndDigit() + getRandomLetterAndDigit() + "SL01";
}



function OK_calculate_DOE(diff) {

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("Date of expiry calculation error. Incorrect issue date!")
        return;
    }

    day = get_last_day_of_month(issueDate)

    year = parseInt(issueDate.slice(-4)) + diff
    console.log(year)

    getTargetElement('inputExpiryDate').value =  issueDate.slice(0,2) + day.toString() + year

}



function OK_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 10) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
        return;
    }

    getTargetElement('inputDD').value = documentNumber + birthDate.slice(0,4) + birthDate.slice(-2) + issueDate.slice(0,4) + issueDate.slice(-2) + "R";
}



function OK_calculate_REAL_ID(alert) {
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

      var comparisonDate = new Date(2020, 3, 30);

      if (inputDateObject >= comparisonDate) {
        getTargetElement("inputIsRealID").value = "F";
      } else {
        getTargetElement("inputIsRealID").value = "N";
      }
}


/*
$$$$$  $$$$$ $$      $$$$  $$   $  $$$$  $$$$$  $$$$$
$$  $$ $$    $$     $$  $$ $$   $ $$  $$ $$  $$ $$
$$  $$ $$$$  $$     $$$$$$ $$ $ $ $$$$$$ $$$$$  $$$$
$$  $$ $$    $$     $$  $$ $$$$$$ $$  $$ $$  $$ $$
$$$$$  $$$$$ $$$$$$ $$  $$  $$ $$ $$  $$ $$  $$ $$$$$
*/



function DE_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(7);
}



function DE_calculate_ICN() {
    getTargetElement('inputICN').value = "0110" + getRandomNumericString(12);
}



function DE_calculate_DD() {
    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement('inputDD').value = "L" + issueDate.slice(-4) + issueDate.slice(0,2) + issueDate.slice(2,4) + getRandomNumericString(6) + "C";
}


/*
$$  $$  $$$$  $$   $  $$$$  $$$$$$ $$$$$$
$$  $$ $$  $$ $$   $ $$  $$   $$     $$
$$$$$$ $$$$$$ $$ $ $ $$$$$$   $$     $$
$$  $$ $$  $$ $$$$$$ $$  $$   $$     $$
$$  $$ $$  $$  $$ $$ $$  $$ $$$$$$ $$$$$$
*/



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
    getTargetElement('inputDocumentNumber').value = getRandomLetter() + getRandomNumericString(6);
}



function WV_calculate_ICN() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 7) {
        showInputDataAlert("ICN calculation error. Incorrect document number!")
        return;
    }

    getTargetElement('inputICN').value = documentNumber + "WV" + getRandomLetter() + getRandomLetter() + getRandomLetter() + getRandomLetter() + "01";
}



function WV_calculate_DD() {

    var birthDate = getTargetElement("inputBrithDate").value;
    if (birthDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect birth date!")
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

    getTargetElement('inputDD').value = birthDate.slice(0,4) + birthDate.slice(-2) + lastName[0] + firstName[0] + expiryDate.slice(-2) + expiryDate.slice(0,2)
}


/*
$$  $$ $$$$$ $$$$$  $$   $  $$$$  $$  $$ $$$$$$
$$  $$ $$    $$  $$ $$$ $$ $$  $$ $$$ $$   $$
$$  $$ $$$$  $$$$$  $$ $ $ $$  $$ $$ $$$   $$
 $$$$  $$    $$  $$ $$   $ $$  $$ $$  $$   $$
  $$   $$$$$ $$  $$ $$   $  $$$$  $$  $$   $$
*/

// ========================== VERMONT (VT) =========================== //



function VT_calculate_documentNumber() {
    getTargetElement('inputDocumentNumber').value = getRandomNumericString(8);
}



function VT_calculate_DD() {
    var documentNumber = getTargetElement("inputDocumentNumber").value;
    if (documentNumber.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect document number!")
        return;
    }

    var issueDate = getTargetElement("inputIssueDate").value;
    if (issueDate.length != 8) {
        showInputDataAlert("DD calculation error. Incorrect issue date!")
        return;
    }

    getTargetElement('inputDD').value = issueDate.slice(0,4) + issueDate.slice(-2) + getRandomNumericString(4) + documentNumber;
}


    // 5. Universal State Calculator Dispatcher
    function runStateCalculation(field, stateSlug) {
        const slugClean = (stateSlug || 'AL').toUpperCase();
        const baseState = slugClean.split('_')[0];
        
        // Priority list of function name candidates
        let fnName = null;
        
        if (field === 'icn' || field === 'dck') {
            const candidates = [
                `${slugClean}_calculate_ICN`,
                `${baseState}_calculate_ICN`,
                `${slugClean}_calculate_icn`,
                `${baseState}_calculate_icn`
            ];
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'dd' || field === 'dcf') {
            const candidates = [
                `${slugClean}_calculate_DD`,
                `${baseState}_calculate_DD`,
                `${slugClean}_calculate_AUDIT`,
                `${baseState}_calculate_AUDIT`
            ];
            for (const c of candidates) {
                if (typeof window[c] === 'function') { fnName = c; break; }
            }
        } else if (field === 'id' || field === 'dl') {
            const candidates = [
                `${slugClean}_calculate_documentNumber`,
                `${baseState}_calculate_documentNumber`
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
                return true;
            } catch (err) {
                console.error(`Error running ${fnName}:`, err);
                return false;
            }
        }
        return false;
    }

    // Expose globals
    window.STATE_HIERARCHY = STATE_HIERARCHY;
    window.runStateCalculation = runStateCalculation;
    window.getTargetElement = getTargetElement;

})(window);
