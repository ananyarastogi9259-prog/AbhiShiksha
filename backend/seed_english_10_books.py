import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "10": {
        "English": {
            "First Flight": [
                "A Letter to God",
                "Nelson Mandela: Long Walk to Freedom",
                "Two Stories about Flying",
                "From the Diary of Anne Frank",
                "Glimpses of India",
                "Mijbil the Otter",
                "Madam Rides the Bus",
                "The Sermon at Benares",
                "The Proposal"
            ],
            "Footprints Without Feet (Supplementary Reader)": [
                "A Triumph of Surgery",
                "The Thief's Story",
                "The Midnight Visitor",
                "A Question of Trust",
                "Footprints without Feet",
                "The Making of a Scientist",
                "The Necklace",
                "The Hack Driver",
                "Bholi",
                "The Book That Saved The Earth"
            ]
        }
    }
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["10"]
    subjects_to_update = ["English"]
    
    print("Removing old curriculum data for class 10 English...")
    delete_result = await db["curriculum"].delete_many({
        "class_grade": {"$in": classes_to_update},
        "subject": {"$in": subjects_to_update}
    })
    print(f"Deleted {delete_result.deleted_count} old chapters.")
    
    chapters_to_insert = []
    
    for class_grade, subjects in new_curriculum.items():
        for subject_name, books in subjects.items():
            for book_name, chapter_list in books.items():
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
