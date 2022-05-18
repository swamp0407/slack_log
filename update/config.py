import os
from dotenv import load_dotenv
load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
MONGO_URL = os.getenv("MONGO_URL")
SHARE_FOLDER_ID = os.getenv("SHARE_FOLDER_ID")
