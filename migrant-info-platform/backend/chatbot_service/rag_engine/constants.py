import os
from pathlib import Path

# Directory of this script, DO NOT run this file from another dir
SCRIPT_DIR = Path.cwd()

# Chatbot service root = one level up
CHATBOT_SERVICE_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, os.pardir))

RAW_DATA_DIR = os.path.join(CHATBOT_SERVICE_ROOT, 'data', 'raw')
CLEANED_DATA_DIR  = os.path.join(CHATBOT_SERVICE_ROOT, 'data', 'cleaned')

# Directories for sites in original and cleaned dirs
# SITES_DIRS = ['vmi_site', 'sodra_site', 'micenter_site']
SITES_DIRS = ['micenter_site']

# This file is in every site's directory
URL_MAP_FILENAME = 'url_map.json'

# Cleaned data json array in each of SITES_DIRS
SITE_ELEMENTS_JSON_FILENAME = "cleaned_data.json"

# Cleaned data from all HTMLs, converted to JSON
SITES_ELEMENTS_JSON_PATH = os.path.join(CLEANED_DATA_DIR, 'sites_elements.json')

# HTML cleaner
ALLOWED_TAGS = {
    *[f"h{i}" for i in range(1,7)],
    "p", "ul", "ol", "li", "br"
}

# Json cleaner
# Allows slight rewording, different word endings
SIMILAR_TEXT_THRESHOLD = 0.85

# Chunking
URL_PATTERN = r"\[https?://[^\[\]]+\]"
REPLACED_URL_MAP_PATH = os.path.join(CLEANED_DATA_DIR, "replaced_url_map.json")
MAX_TOKENS = 450
OVERLAP = 50
