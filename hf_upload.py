from huggingface_hub import HfApi
import sys

import os

print("Initializing Hugging Face API...")
token = os.getenv("HF_TOKEN")
if not token:
    print("Warning: HF_TOKEN environment variable not set.")
api = HfApi(token=token)

print("Uploading folder...")
api.upload_folder(
    folder_path=".",
    repo_id="reedontop/skin-screening-api",
    repo_type="space",
    ignore_patterns=["node_modules/**", "venv/**", ".git/**", ".husky/**", "dist/**", "__pycache__/**", "*.tmp", "hf_upload.py"]
)

print("UPLOAD COMPLETE!")
