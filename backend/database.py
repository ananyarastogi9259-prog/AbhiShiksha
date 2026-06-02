import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "abhishiksha")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Connect to MongoDB on app startup"""
    if not MONGODB_URL:
        print("Warning: MONGODB_URL is not set in environment variables.")
        return
        
    try:
        # Add a 5 second timeout so the server doesn't hang forever
        db_instance.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        db_instance.db = db_instance.client[DATABASE_NAME]
        # Ping the database to confirm connection
        await db_instance.client.admin.command('ping')
        print(f"Connected to MongoDB database: {DATABASE_NAME}")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        # Clear the instances so health check knows it failed
        db_instance.client = None
        db_instance.db = None

async def close_mongo_connection():
    """Close MongoDB connection on app shutdown"""
    if db_instance.client is not None:
        db_instance.client.close()
        print("MongoDB connection closed")

def get_database():
    """Dependency to inject the database instance"""
    return db_instance.db
