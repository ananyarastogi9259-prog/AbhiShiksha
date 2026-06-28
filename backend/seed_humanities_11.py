import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "11": {
        "History": [
            ("From the Beginning of Time", "Themes in World History"),
            ("Writing and City Life", "Themes in World History"),
            ("An Empire Across Three Continents", "Themes in World History"),
            ("The Central Islamic Lands", "Themes in World History"),
            ("Nomadic Empires", "Themes in World History"),
            ("The Three Orders", "Themes in World History"),
            ("Changing Cultural Traditions", "Themes in World History"),
            ("Confrontation of Cultures", "Themes in World History"),
            ("The Industrial Revolution", "Themes in World History"),
            ("Displacing Indigenous Peoples", "Themes in World History"),
            ("Paths to Modernisation", "Themes in World History")
        ],
        "Political Science": [
            ("Constitution: Why and How?", "Indian Constitution at Work"),
            ("Rights in the Indian Constitution", "Indian Constitution at Work"),
            ("Election and Representation", "Indian Constitution at Work"),
            ("Executive", "Indian Constitution at Work"),
            ("Legislature", "Indian Constitution at Work"),
            ("Judiciary", "Indian Constitution at Work"),
            ("Federalism", "Indian Constitution at Work"),
            ("Local Governments", "Indian Constitution at Work"),
            ("Constitution as a Living Document", "Indian Constitution at Work"),
            ("The Philosophy of the Constitution", "Indian Constitution at Work"),
            ("Political Theory: An Introduction", "Political Theory"),
            ("Freedom", "Political Theory"),
            ("Equality", "Political Theory"),
            ("Social Justice", "Political Theory"),
            ("Rights", "Political Theory"),
            ("Citizenship", "Political Theory"),
            ("Nationalism", "Political Theory"),
            ("Secularism", "Political Theory"),
            ("Peace", "Political Theory"),
            ("Development", "Political Theory")
        ],
        "Geography": [
            ("Geography as a Discipline", "Fundamentals of Physical Geography"),
            ("The Origin and Evolution of the Earth", "Fundamentals of Physical Geography"),
            ("Interior of the Earth", "Fundamentals of Physical Geography"),
            ("Distribution of Oceans and Continents", "Fundamentals of Physical Geography"),
            ("Minerals and Rocks", "Fundamentals of Physical Geography"),
            ("Geomorphic Processes", "Fundamentals of Physical Geography"),
            ("Landforms and their Evolution", "Fundamentals of Physical Geography"),
            ("Composition and Structure of Atmosphere", "Fundamentals of Physical Geography"),
            ("Solar Radiation, Heat Balance and Temperature", "Fundamentals of Physical Geography"),
            ("Atmospheric Circulation and Weather Systems", "Fundamentals of Physical Geography"),
            ("Water in the Atmosphere", "Fundamentals of Physical Geography"),
            ("World Climate and Climate Change", "Fundamentals of Physical Geography"),
            ("Water (Oceans)", "Fundamentals of Physical Geography"),
            ("Movements of Ocean Water", "Fundamentals of Physical Geography"),
            ("Life on the Earth", "Fundamentals of Physical Geography"),
            ("Biodiversity and Conservation", "Fundamentals of Physical Geography")
        ]
    }
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["11"]
    subjects_to_update = ["History", "Political Science", "Geography"]
    
    print("Removing old curriculum data for class 11 humanities...")
    delete_result = await db["curriculum"].delete_many({
        "class_grade": {"$in": classes_to_update},
        "subject": {"$in": subjects_to_update}
    })
    print(f"Deleted {delete_result.deleted_count} old chapters.")
    
    chapters_to_insert = []
    
    for class_grade, subjects in new_curriculum.items():
        for subject_name, chapter_list in subjects.items():
            for i, (chapter_name, book_name) in enumerate(chapter_list):
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
