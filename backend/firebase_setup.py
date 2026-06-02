import os
import firebase_admin
from firebase_admin import credentials, auth

from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
def initialize_firebase():
    try:
        # Only initialize if not already initialized
        if not firebase_admin._apps:
            service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
            if not service_account_path:
                print("Warning: FIREBASE_SERVICE_ACCOUNT_PATH not set in .env")
                return

            # Resolve relative to the backend directory
            base_dir = os.path.dirname(os.path.abspath(__file__))
            absolute_path = os.path.join(base_dir, service_account_path)

            if os.path.exists(absolute_path):
                cred = credentials.Certificate(absolute_path)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin initialized successfully")
            else:
                print(f"Warning: Firebase service account path not found at {absolute_path}")
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {str(e)}")

def verify_firebase_token(id_token: str):
    """Verifies a Firebase ID token and returns the decoded token payload."""
    try:
        decoded_token = auth.verify_id_token(id_token)
        print(f"Firebase token verified successfully for uid: {decoded_token.get('uid')}")
        return decoded_token
    except Exception as e:
        print(f"Firebase verify_id_token Exception: {str(e)}")
        raise e
