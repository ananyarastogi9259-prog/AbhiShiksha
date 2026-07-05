from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_to_mongo, close_mongo_connection, get_database, db_instance
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from firebase_setup import initialize_firebase, verify_firebase_token
from typing import Optional, List
from bson import ObjectId
from youtubesearchpython import VideosSearch

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

# --- Course Management APIs ---

class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    class_grade: str
    thumbnail: str
    status: str = "active"

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    class_grade: Optional[str] = None
    thumbnail: Optional[str] = None
    status: Optional[str] = None

class CourseResponse(CourseBase):
    id: str
    created_at: str

@app.post("/api/courses", response_model=CourseResponse)
async def create_course(course: CourseCreate):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    course_dict = course.model_dump()
    course_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db["courses"].insert_one(course_dict)
    course_dict["id"] = str(result.inserted_id)
    return course_dict

@app.get("/api/courses", response_model=List[CourseResponse])
async def get_courses():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    courses_cursor = db["courses"].find()
    courses = await courses_cursor.to_list(length=100)
    
    for course in courses:
        course["id"] = str(course.pop("_id"))
    
    return courses

@app.put("/api/courses/{course_id}", response_model=CourseResponse)
async def update_course(course_id: str, course_update: CourseUpdate):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        obj_id = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid course ID format")

    update_data = {k: v for k, v in course_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update provided")

    result = await db["courses"].update_one({"_id": obj_id}, {"$set": update_data})
    
    if result.modified_count == 0:
        # Check if course exists
        existing = await db["courses"].find_one({"_id": obj_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Course not found")
        
    updated_course = await db["courses"].find_one({"_id": obj_id})
    updated_course["id"] = str(updated_course.pop("_id"))
    return updated_course

@app.delete("/api/courses/{course_id}")
async def delete_course(course_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        obj_id = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid course ID format")

    result = await db["courses"].delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
        
    return {"message": "Course deleted successfully"}

# --- Curriculum Management APIs ---

class ChapterBase(BaseModel):
    class_grade: str
    subject: str
    chapter_number: int
    chapter_name: str
    videoUrl: str = ""
    notesPdfUrl: str = ""
    quiz_available: bool = False
    book_name: str = ""
    animatedVideoUrl: str = ""
    interactiveActivityUrl: str = ""

class ChapterCreate(ChapterBase):
    pass

class ChapterUpdate(BaseModel):
    videoUrl: Optional[str] = None
    notesPdfUrl: Optional[str] = None
    quiz_available: Optional[bool] = None
    animatedVideoUrl: Optional[str] = None
    interactiveActivityUrl: Optional[str] = None

class ChapterResponse(ChapterBase):
    id: str

@app.get("/api/curriculum/class/{class_grade}", response_model=List[ChapterResponse])
async def get_curriculum_by_class(class_grade: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    cursor = db["curriculum"].find({"class_grade": class_grade}).sort([("subject", 1), ("chapter_number", 1)])
    chapters = await cursor.to_list(length=1000)
    
    for chapter in chapters:
        chapter["id"] = str(chapter.pop("_id"))
        
    return chapters

@app.get("/api/curriculum/{class_grade}/{subject}", response_model=List[ChapterResponse])
async def get_curriculum(class_grade: str, subject: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    query = {"class_grade": class_grade, "subject": subject}
    if subject == "Social Science":
        query["subject"] = {"$in": ["History", "Geography", "Civics", "Economics"]}
        
    cursor = db["curriculum"].find(query).sort([("subject", 1), ("chapter_number", 1)])
    chapters = await cursor.to_list(length=1000)
    
    for chapter in chapters:
        chapter["id"] = str(chapter.pop("_id"))
        
    return chapters

@app.post("/api/curriculum/bulk")
async def bulk_create_curriculum(chapters: List[ChapterCreate]):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
        
    if not chapters:
        return {"inserted_count": 0}
        
    chapters_dict = [chap.model_dump() for chap in chapters]
    result = await db["curriculum"].insert_many(chapters_dict)
    return {"inserted_count": len(result.inserted_ids)}

@app.put("/api/curriculum/{chapter_id}", response_model=ChapterResponse)
async def update_chapter(chapter_id: str, chapter_update: ChapterUpdate):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
        
    try:
        obj_id = ObjectId(chapter_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid chapter ID format")

    update_data = {k: v for k, v in chapter_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update provided")

    result = await db["curriculum"].update_one({"_id": obj_id}, {"$set": update_data})
    
    if result.modified_count == 0:
        existing = await db["curriculum"].find_one({"_id": obj_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Chapter not found")
            
    updated_chapter = await db["curriculum"].find_one({"_id": obj_id})
    updated_chapter["id"] = str(updated_chapter.pop("_id"))
    return updated_chapter

# --- Video Management APIs ---

class VideoBase(BaseModel):
    classGrade: str
    stream: Optional[str] = ""
    subject: str
    book: Optional[str] = ""
    chapter: str
    videoTitle: str
    videoUrl: str
    teacherName: str = ""
    language: str = "en"
    duration: str = ""
    videoType: str = "explanation"

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: str

@app.get("/api/videos", response_model=List[VideoResponse])
async def get_videos(classGrade: str, subject: str, chapter: str, stream: str = "", book: str = ""):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    query = {
        "classGrade": classGrade,
        "subject": subject,
        "chapter": chapter
    }
    if stream:
        query["stream"] = stream
    if book:
        query["book"] = book
        
    cursor = db["chapter_videos"].find(query)
    videos = await cursor.to_list(length=100)
    
    for video in videos:
        video["id"] = str(video.pop("_id"))
        
    return videos

@app.post("/api/videos", response_model=VideoResponse)
async def create_video(video: VideoCreate):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
        
    video_dict = video.model_dump()
    result = await db["chapter_videos"].insert_one(video_dict)
    
    created_video = await db["chapter_videos"].find_one({"_id": result.inserted_id})
    created_video["id"] = str(created_video.pop("_id"))
    return created_video

@app.delete("/api/videos/{video_id}")
async def delete_video(video_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
        
    try:
        obj_id = ObjectId(video_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video ID format")
        
    result = await db["chapter_videos"].delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
        
    return {"message": "Video deleted successfully"}

@app.post("/api/videos/autofetch/{chapter_id}")
async def autofetch_videos(chapter_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
        
    try:
        obj_id = ObjectId(chapter_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid chapter ID format")
        
    # 1. Fetch chapter
    chapter = await db["curriculum"].find_one({"_id": obj_id})
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
        
    c_class = chapter.get("class_grade", "")
    c_sub = chapter.get("subject", "")
    c_name = chapter.get("chapter_name", "")
    
    # 2. Query
    query = f"NCERT Class {c_class} {c_sub} {c_name}"
    
    # 3. Search
    try:
        videos_search = VideosSearch(query, limit=15)
        results = videos_search.result()
        if not results or "result" not in results:
            return {"inserted_count": 0, "videos": []}
            
        scraped_videos = results["result"]
    except Exception as e:
        print("Search error:", e)
        return {"inserted_count": 0, "videos": []}
        
    trusted_channels = [
        "physics wallah", "magnet brains", "khan academy india", 
        "vedantu", "dear sir", "learnohub", "unacademy"
    ]
    
    scored_videos = []
    
    for v in scraped_videos:
        if v.get("type") != "video":
            continue
            
        channel_name = v.get("channel", {}).get("name", "")
        duration_str = v.get("duration", "0:00")
        view_count_str = v.get("viewCount", {"text": "0 views"}).get("text", "0")
        
        # Convert views string to number
        try:
            views = int(''.join(filter(str.isdigit, view_count_str)))
        except:
            views = 0
            
        score = 0
        
        # Priority for trusted channels
        channel_lower = channel_name.lower()
        if any(trusted in channel_lower for trusted in trusted_channels):
            score += 500
            
        # Score views
        if views > 1000000:
            score += 100
        elif views > 100000:
            score += 50
        elif views > 10000:
            score += 10
            
        # Duration preference (avoid shorts < 5m or massive streams > 2h)
        try:
            parts = duration_str.split(":")
            if len(parts) == 2:
                mins = int(parts[0])
            elif len(parts) == 3:
                mins = int(parts[0]) * 60 + int(parts[1])
            else:
                mins = 0
                
            if 5 <= mins <= 60:
                score += 50 # Good length for explanation
            elif mins < 5:
                score -= 100 # Likely a short/clip
            elif mins > 120:
                score -= 50 # Too long
        except:
            pass
            
        scored_videos.append({
            "score": score,
            "videoTitle": v.get("title", ""),
            "videoUrl": v.get("link", ""),
            "teacherName": channel_name,
            "duration": duration_str,
            "language": "hi" if "hi" in v.get("title", "").lower() or "hindi" in v.get("title", "").lower() else "en",
            "videoType": "explanation"
        })
        
    # 4. Sort and pick top 3
    scored_videos.sort(key=lambda x: x["score"], reverse=True)
    top_videos = scored_videos[:3]
    
    inserted = []
    for tv in top_videos:
        video_doc = {
            "chapter_id": chapter_id,
            "videoTitle": tv["videoTitle"],
            "videoUrl": tv["videoUrl"],
            "teacherName": tv["teacherName"],
            "language": tv["language"],
            "duration": tv["duration"],
            "videoType": tv["videoType"]
        }
        res = await db["chapter_videos"].insert_one(video_doc)
        video_doc["id"] = str(res.inserted_id)
        video_doc.pop("_id", None)
        inserted.append(video_doc)
        
    return {"inserted_count": len(inserted), "videos": inserted}
