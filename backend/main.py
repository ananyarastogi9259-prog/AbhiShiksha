from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_to_mongo, close_mongo_connection, get_database, db_instance
from pydantic import BaseModel
from datetime import datetime, timezone
from firebase_setup import initialize_firebase, verify_firebase_token

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    initialize_firebase()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="AbhiShiksha Backend", lifespan=lifespan)

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with the frontend's actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
async def test_route():
    return {"message": "Backend is working"}

@app.get("/api/health/db")
async def health_check_db():
    if db_instance.client is None or db_instance.db is None:
        raise HTTPException(status_code=503, detail="Database connection is not initialized")
    
    try:
        # Ping the database
        await db_instance.client.admin.command("ping")
        return {"status": "ok", "message": "Successfully connected to MongoDB"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

class TokenVerifyRequest(BaseModel):
    idToken: str

@app.post("/api/auth/verify-token")
async def verify_token(req: TokenVerifyRequest):
    print("--- [AUTH] Request reached /api/auth/verify-token ---")
    if not req.idToken:
        print("[AUTH] No token received in request payload.")
    else:
        print(f"[AUTH] Token received (length: {len(req.idToken)}).")

    try:
        decoded_token = verify_firebase_token(req.idToken)
    except Exception as e:
        print(f"[AUTH] Exception during verify_firebase_token: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Firebase Verification Failed: {str(e)}")
    
    if not decoded_token:
        print("[AUTH] decoded_token is empty or None")
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")
    
    firebase_uid = decoded_token.get("uid")
    phone_number = decoded_token.get("phone_number")
    
    print(f"[AUTH] Extracted UID: {firebase_uid}, Phone: {phone_number}")
    
    if not firebase_uid or not phone_number:
         print("[AUTH] Incomplete token data. Missing UID or Phone Number.")
         raise HTTPException(status_code=400, detail="Incomplete token data: phone number is required.")
         
    db = get_database()
    if db is None:
        print("[AUTH] Database connection is None")
        raise HTTPException(status_code=503, detail="Database not available")
        
    users_collection = db["users"]
    expected_role = "student"
    if phone_number == "+918888888888":
        expected_role = "parent"
    elif phone_number == "+917777777777":
        expected_role = "admin"

    user = await users_collection.find_one({"firebaseUid": firebase_uid})
    
    if user:
        print(f"[AUTH] Found existing user in MongoDB: {user.get('_id')}")
        current_role = user.get("role", "student")
        
        # Force update role if it's one of our test numbers and doesn't match expected
        if current_role != expected_role and phone_number in ["+918888888888", "+917777777777"]:
            print(f"[AUTH] Updating existing user {phone_number} role to {expected_role}")
            await users_collection.update_one({"_id": user["_id"]}, {"$set": {"role": expected_role}})
            current_role = expected_role
            user["role"] = expected_role

        redirect_to = f"/{current_role}-dashboard"
        user_dict = {**user, "_id": str(user["_id"])}
        return {"success": True, "user": user_dict, "redirectTo": redirect_to}
        
    print("[AUTH] User not found in MongoDB. Creating new user...")
    # User does not exist, create new user
    new_user = {
        "firebaseUid": firebase_uid,
        "phoneNumber": phone_number,
        "role": expected_role,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    result = await users_collection.insert_one(new_user)
    print(f"[AUTH] New user created successfully with ID: {result.inserted_id}")
    new_user["_id"] = str(result.inserted_id)
    return {"success": True, "user": new_user, "redirectTo": f"/{expected_role}-dashboard"}
