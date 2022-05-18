import os
from dotenv import load_dotenv
load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
MONGO_URL = os.getenv("MONGO_URL")
workspace_name = os.getenv("workspace_name")
workspace_domain = os.getenv("workspace_domain")
