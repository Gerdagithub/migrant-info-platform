import os
from pathlib import Path
from dotenv import load_dotenv

# Directory of this script, DO NOT run this file from another dir
SCRIPT_DIR = Path.cwd()

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')
CHATBOT_SERVICE_ROOT = os.getenv("CHATBOT_SERVICE_ROOT")

RAW_DATA_DIR = os.path.join(CHATBOT_SERVICE_ROOT, 'data', 'raw')
CLEANED_DATA_DIR = os.path.join(CHATBOT_SERVICE_ROOT, 'data', 'cleaned')
EMBEDDINGS_DATA_DIR = os.path.join(CHATBOT_SERVICE_ROOT, 'data', 'embeddings')

# Directories for sites in original and cleaned dirs
# SITES_DIRS = ['vmi_site', 'sodra_site', 'micenter_site']
SITES_DIRS = ['micenter_site']

# This file is in every site's directory
URL_MAP_FILENAME = 'url_map.json'

# Cleaned data json array in each of SITES_DIRS
SITE_ELEMENTS_JSON_FILENAME = "cleaned_data.json"

# Cleaned data from all HTMLs, converted to JSON
SITES_ELEMENTS_JSON_PATH = os.path.join(CLEANED_DATA_DIR, 'sites_elements.json')
SAVED_TEXTS_PATH = os.path.join(CLEANED_DATA_DIR, 'saved_texts.json')
MERGED_SITES_PATH = os.path.join(CLEANED_DATA_DIR, 'merged_sites.json')

# HTML cleaner
ALLOWED_TAGS = {
    *[f"h{i}" for i in range(1,7)],
    "p", "ul", "ol", "li", "br"
}

# Json cleaner
# Allows slight rewording, different word endings
SIMILAR_TEXT_THRESHOLD = 0.85

# Chunking
URL_PATTERN = r"\[([^\[\]]+)\]"
REPLACED_URL_MAP_PATH = os.path.join(EMBEDDINGS_DATA_DIR, "replaced_url_map.json")
SITES_ELEMENTS_WITH_REPLACED_URLS_PATH = os.path.join(EMBEDDINGS_DATA_DIR, "sites_elements_with_replaced_urls.json")
TOKENIZING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
MAX_TOKENS = 490
OVERLAP = 90

# Embedding
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
FAISS_INDEX_PATH = os.path.join(EMBEDDINGS_DATA_DIR, 'chatbot_index.faiss')
FAISS_METADATA_PATH = os.path.join(EMBEDDINGS_DATA_DIR, 'metadata.pkl')

# LLM
MAX_TOKENS_LLM = 2048
LLM_MODEL = "google/gemma-7b-it"
