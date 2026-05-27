import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "production")
KUBECONFIG = os.getenv("KUBECONFIG", "")
IS_LOCAL = ENV == "local"
