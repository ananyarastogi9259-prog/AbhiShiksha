import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "10": {
        "Hindi": {
            "Kshitij Bhag 2": [
                "पद",
                "राम-लक्ष्मण-परशुराम संवाद",
                "सवैया और कवित्त",
                "आत्मकथ्य",
                "उत्साह और अट नहीं रही",
                "यह दंतुरित मुस्कान और फसल",
                "छाया मत छूना",
                "कन्यादान",
                "संगतकार",
                "नेताजी का चश्मा",
                "बालगोबिन भगत",
                "लखनवी अंदाज़",
                "मानवीय करुणा की दिव्य चमक",
                "एक कहानी यह भी",
                "स्त्री शिक्षा के विरोधी कुतर्कों का खंडन",
                "नौबतखाने में इबादत",
                "संस्कृति"
            ],
            "स्पर्श भाग 2": [
                "साखी",
                "पद (मीरा)",
                "मनुष्यता",
                "पर्वत प्रदेश में पावस",
                "तोप",
                "कर चले हम फ़िदा",
                "आत्मत्राण",
                "बड़े भाई साहब",
                "डायरी का एक पन्ना",
                "तताँरा-वामीरो कथा",
                "तीसरी कसम के शिल्पकार शैलेंद्र",
                "अब कहाँ दूसरे के दुख से दुखी होने वाले",
                "पतझर में टूटी पत्तियाँ",
                "कारतूस"
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
    subjects_to_update = ["Hindi"]
    
    print("Removing old curriculum data for class 10 Hindi...")
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
