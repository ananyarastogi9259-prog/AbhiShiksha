import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "9": {
        "History": [
            "The French Revolution",
            "Socialism in Europe and the Russian Revolution",
            "Nazism and the Rise of Hitler",
            "Forest Society and Colonialism",
            "Pastoralists in the Modern World",
            "Peasants and Farmers",
            "History and Sport: The Story of Cricket",
            "Clothing: A Social History"
        ],
        "Geography": [
            "India – Size and Location",
            "Physical Features of India",
            "Drainage",
            "Climate",
            "Natural Vegetation and Wildlife",
            "Population"
        ],
        "Civics": [
            "What is Democracy? Why Democracy?",
            "Constitutional Design",
            "Electoral Politics",
            "Working of Institutions",
            "Democratic Rights"
        ],
        "Economics": [
            "The Story of Village Palampur",
            "People as Resource",
            "Poverty as a Challenge",
            "Food Security in India"
        ]
    },
    "10": {
        "History": [
            "The Rise of Nationalism in Europe",
            "Nationalism in India",
            "The Making of a Global World",
            "The Age of Industrialisation",
            "Print Culture and the Modern World"
        ],
        "Geography": [
            "Resources and Development",
            "Forest and Wildlife Resources",
            "Water Resources",
            "Agriculture",
            "Minerals and Energy Resources",
            "Manufacturing Industries",
            "Lifelines of National Economy"
        ],
        "Civics": [
            "Power Sharing",
            "Federalism",
            "Democracy and Diversity",
            "Gender, Religion and Caste",
            "Popular Struggles and Movements",
            "Political Parties",
            "Outcomes of Democracy",
            "Challenges to Democracy"
        ],
        "Economics": [
            "Development",
            "Sectors of the Indian Economy",
            "Money and Credit",
            "Globalisation and the Indian Economy",
            "Consumer Rights"
        ]
    }
}

book_names = {
    "9": {
        "History": "India and the Contemporary World – I",
        "Geography": "Contemporary India – I",
        "Civics": "Democratic Politics – I",
        "Economics": "Economics 9"
    },
    "10": {
        "History": "India and the Contemporary World – II",
        "Geography": "Contemporary India – II",
        "Civics": "Democratic Politics – II",
        "Economics": "Understanding Economic Development"
    }
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["9", "10"]
    subjects_to_update = ["History", "Geography", "Civics", "Economics"]
    
    print("Removing old curriculum data for classes 9-10 SST branches...")
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
