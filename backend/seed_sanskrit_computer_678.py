import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "6": {
        "Sanskrit": [
            "शब्दपरिचयः – I", "शब्दपरिचयः – II", "शब्दपरिचयः – III", "विद्यालयः",
            "वृक्षाः", "समुद्रतटः", "बकस्य प्रतीकारः", "सूक्तिस्तबकः",
            "क्रीडास्पर्धा", "कृषिकाः कर्मवीराः", "पुष्पोत्सवः", "दशमः त्वम् असि",
            "विमानयानं रचयाम", "अहह आः च", "मातुलचन्द्रः", "लोकाः समस्ताः सुखिनो भवन्तु"
        ],
        "Computer Science": [
            "Introduction to Computers", "Computer Hardware", "Software and Operating System",
            "Input and Output Devices", "MS Paint", "Word Processing",
            "Internet Basics", "Cyber Safety"
        ]
    },
    "7": {
        "Sanskrit": [
            "सुभाषितानि", "दुर्वुद्धिः विनश्यति", "स्वावलम्बनम्", "हास्यबालकविसम्मेलनम्",
            "पण्डिता रमाबाई", "सदाचारः", "संकल्पः सिद्धिदायकः", "त्रिवर्णः ध्वजः",
            "अहमपि विद्यालयं गमिष्यामि", "विश्वबन्धुत्वम्", "समवायो हि दुर्जयः", "विद्याधनम्",
            "अमृतं संस्कृतम्", "अनारिकायाः जिज्ञासा", "लालनगीतम्"
        ],
        "Computer Science": [
            "Computer Memory", "Number System Basics", "MS Word Advanced",
            "PowerPoint", "Internet and Email", "HTML Basics",
            "Algorithms and Flowcharts", "Cyber Security"
        ]
    },
    "8": {
        "Sanskrit": [
            "सुभाषितानि", "बिलस्य वाणी न कदापि मे श्रुता", "डिजिटल इंडिया", "सदैव पुरतः निधेहि चरणम्",
            "कण्टकेनैव कण्टकम्", "गृहं शून्यं सुतां विना", "भारतजनताऽहम्", "संसारसागरस्य नायकाः",
            "सप्तभगिन्यः", "नीतिनवनीतम्", "सावित्रीबाई फुले", "कः रक्षति कः रक्षितः",
            "क्षितौ राजते भारतस्वर्णभूमिः"
        ],
        "Computer Science": [
            "Computer Networking", "HTML and Web Pages", "Introduction to Python",
            "AI Basics", "Database Fundamentals", "Cyber Ethics",
            "Cloud Computing", "Digital Citizenship"
        ]
    }
}

book_names = {
    "6": {"Sanskrit": "Ruchira – Prathamo Bhag", "Computer Science": "Computer Science 6"},
    "7": {"Sanskrit": "Ruchira – Dwitiyo Bhag", "Computer Science": "Computer Science 7"},
    "8": {"Sanskrit": "Ruchira – Tritiyo Bhag", "Computer Science": "Computer Science 8"},
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["6", "7", "8"]
    subjects_to_update = ["Sanskrit", "Computer Science"]
    
    print("Removing old curriculum data for classes 6-8 Sanskrit and Computer Science...")
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
