import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "9": {
        "Computer Science": [
            "Basics of Information Technology",
            "Computer System and Components",
            "Memory and Storage Devices",
            "Input and Output Devices",
            "Software and Operating Systems",
            "Computer Networking",
            "Internet and Web Services",
            "Cyber Safety and Cyber Security",
            "Multimedia Applications",
            "Word Processing (MS Word / LibreOffice Writer)",
            "Spreadsheet (MS Excel / Calc)",
            "Presentation Software (PowerPoint / Impress)",
            "Cloud Computing",
            "Digital Communication",
            "Introduction to Artificial Intelligence"
        ]
    }
}

book_names = {
    "9": {
        "Computer Science": "Information Technology - Class 9"
    }
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["9"]
    subjects_to_update = ["Computer Science"]
    
    print("Removing old curriculum data for class 9 Computer Science...")
    delete_result = await db["curriculum"].delete_many({
        "class_grade": {"$in": classes_to_update},
        "subject": {"$in": subjects_to_update}
    })
    print(f"Deleted {delete_result.deleted_count} old chapters.")
    
    chapters_to_insert = []
    
    for class_grade, subjects in new_curriculum.items():
        for subject_name, chapter_list in subjects.items():
            book_name = book_names[class_grade].get(subject_name, "")
            for i, chapter_name in enumerate(chapter_list):
                chapters_to_insert.append({
                    "class_grade": class_grade,
                    "subject": subject_name,
                    "chapter_number": i + 1,
                    "chapter_name": chapter_name,
                    "videoUrl": "",
                    "notesPdfUrl": "",
                    "quiz_available": False,
                    "book_name": book_name,
                    "animatedVideoUrl": "",
                    "interactiveActivityUrl": ""
                })

    print(f"Inserting {len(chapters_to_insert)} new chapters...")
    if chapters_to_insert:
        insert_result = await db["curriculum"].insert_many(chapters_to_insert)
        print(f"Successfully inserted {len(insert_result.inserted_ids)} new chapters.")
    
    await close_mongo_connection()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(seed())
