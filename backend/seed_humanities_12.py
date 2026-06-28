import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "12": {
        "English": [
            ("The Last Lesson", "Flamingo"),
            ("Lost Spring", "Flamingo"),
            ("Deep Water", "Flamingo"),
            ("The Rattrap", "Flamingo"),
            ("Indigo", "Flamingo"),
            ("Poets and Pancakes", "Flamingo"),
            ("The Interview", "Flamingo"),
            ("Going Places", "Flamingo"),
            ("My Mother at Sixty-Six", "Flamingo"),
            ("Keeping Quiet", "Flamingo"),
            ("A Thing of Beauty", "Flamingo"),
            ("A Roadside Stand", "Flamingo"),
            ("Aunt Jennifer's Tigers", "Flamingo"),
            ("The Third Level", "Vistas"),
            ("The Tiger King", "Vistas"),
            ("Journey to the End of the Earth", "Vistas"),
            ("The Enemy", "Vistas"),
            ("On the Face of It", "Vistas"),
            ("Memories of Childhood", "Vistas")
        ],
        "History": [
            ("Bricks, Beads and Bones", "Themes in Indian History Part I"),
            ("Kings, Farmers and Towns", "Themes in Indian History Part I"),
            ("Kinship, Caste and Class", "Themes in Indian History Part I"),
            ("Thinkers, Beliefs and Buildings", "Themes in Indian History Part I"),
            ("Through the Eyes of Travellers", "Themes in Indian History Part II"),
            ("Bhakti-Sufi Traditions", "Themes in Indian History Part II"),
            ("An Imperial Capital: Vijayanagara", "Themes in Indian History Part II"),
            ("Peasants, Zamindars and the State", "Themes in Indian History Part II"),
            ("Colonialism and the Countryside", "Themes in Indian History Part III"),
            ("Rebels and the Raj", "Themes in Indian History Part III"),
            ("Mahatma Gandhi and the Nationalist Movement", "Themes in Indian History Part III"),
            ("Framing the Constitution", "Themes in Indian History Part III")
        ],
        "Political Science": [
            ("The End of Bipolarity", "Contemporary World Politics"),
            ("Contemporary Centres of Power", "Contemporary World Politics"),
            ("Contemporary South Asia", "Contemporary World Politics"),
            ("International Organizations", "Contemporary World Politics"),
            ("Security in the Contemporary World", "Contemporary World Politics"),
            ("Environment and Natural Resources", "Contemporary World Politics"),
            ("Globalisation", "Contemporary World Politics"),
            ("Challenges of Nation Building", "Politics in India Since Independence"),
            ("Era of One-Party Dominance", "Politics in India Since Independence"),
            ("Politics of Planned Development", "Politics in India Since Independence"),
            ("India's External Relations", "Politics in India Since Independence"),
            ("Challenges to and Restoration of the Congress System", "Politics in India Since Independence"),
            ("The Crisis of Democratic Order", "Politics in India Since Independence"),
            ("Regional Aspirations", "Politics in India Since Independence"),
            ("Recent Developments in Indian Politics", "Politics in India Since Independence")
        ],
        "Geography": [
            ("Human Geography: Nature and Scope", "Fundamentals of Human Geography"),
            ("The World Population", "Fundamentals of Human Geography"),
            ("Human Development", "Fundamentals of Human Geography"),
            ("Primary Activities", "Fundamentals of Human Geography"),
            ("Secondary Activities", "Fundamentals of Human Geography"),
            ("Tertiary and Quaternary Activities", "Fundamentals of Human Geography"),
            ("Transport and Communication", "Fundamentals of Human Geography"),
            ("International Trade", "Fundamentals of Human Geography"),
            ("Population: Distribution, Density, Growth and Composition", "India – People and Economy"),
            ("Human Settlements", "India – People and Economy"),
            ("Land Resources and Agriculture", "India – People and Economy"),
            ("Water Resources", "India – People and Economy"),
            ("Mineral and Energy Resources", "India – People and Economy"),
            ("Planning and Sustainable Development in Indian Context", "India – People and Economy"),
            ("Transport and Communication", "India – People and Economy"),
            ("International Trade", "India – People and Economy"),
            ("Geographical Perspective on Selected Issues and Problems", "India – People and Economy")
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

    classes_to_update = ["12"]
    subjects_to_update = ["English", "History", "Political Science", "Geography"]
    
    print("Removing old curriculum data for class 12 subjects...")
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
