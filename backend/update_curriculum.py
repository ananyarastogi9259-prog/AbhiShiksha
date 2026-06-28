import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

new_curriculum = {
    "1": {
        "English": [
            "A Happy Child", "Three Little Pigs", "After a Bath", 
            "The Bubble, the Straw and the Shoe", "One Little Kitten", 
            "Lalu and Peelu", "Once I Saw a Little Bird", 
            "Mittu and the Yellow Mango", "Merry-Go-Round", "Circle",
            "If I Were an Apple", "Our Tree"
        ],
        "Hindi": [
            "Jhoola", "Aam Ki Kahani", "Aam Ki Tokri", "Patte Hi Patte", 
            "Pakodi", "Chhuk Chhuk Gaadi", "Rasoi Ghar", "Chuho! Myaun So Rahi Hai", 
            "Bandar Aur Gilahari", "Pagdi", "Patang", "Gend-Balla", 
            "Bandar Gaya Khet Mein", "Ek Budhiya", "Main Bhi"
        ],
        "Mathematics": [
            "Shapes and Space", "Numbers from One to Nine", "Addition", 
            "Subtraction", "Numbers from Ten to Twenty", "Time", 
            "Measurement", "Numbers from Twenty-One to Fifty", 
            "Data Handling", "Patterns", "Numbers", "Money", "How Many"
        ]
    },
    "2": {
        "English": [
            "First Day at School", "Haldi's Adventure", "I Am Lucky", "I Want", 
            "A Smile", "The Wind and the Sun", "Rain", "Storm in the Garden", 
            "Zoo Manners", "Funny Bunny"
        ],
        "Hindi": [
            "Oonch Neech", "Bhalu Ne Kheli Football", "Meri Kitab", 
            "Titli Aur Kali", "Mithai", "Bahut Hua", "Meri Maa", 
            "Bade Bhai Sahab", "Bulbul", "Meethi Saarangi"
        ],
        "Mathematics": [
            "What is Long, What is Round?", "Counting in Groups", 
            "How Much Can You Carry?", "Counting in Tens", "Patterns", 
            "Footprints", "Jugs and Mugs", "Tens and Ones", 
            "My Funday", "Add Our Points"
        ],
        "EVS": [
            "Looking Around Us", "My Family", "Plants Around Us", 
            "Animals Around Us", "Water", "Food We Eat", 
            "Seasons", "Safety and Good Habits"
        ]
    },
    "3": {
        "English": [
            "Good Morning", "The Magic Garden", "Bird Talk", 
            "Nina and the Baby Sparrows", "Little by Little", 
            "The Enormous Turnip", "Sea Song", "A Little Fish Story", 
            "The Balloon Man", "The Yellow Butterfly"
        ],
        "Hindi": [
            "Kakku", "Shekhibaaz Makhi", "Chand Wali Amma", "Man Karta Hai", 
            "Bahadur Bito", "Humse Sab Kehte", "Tiptipwa", "Bandar Baant", 
            "Kab Aao", "Kyonji Mal Aur Kaise Kaisaliya"
        ],
        "Mathematics": [
            "Where to Look From", "Fun with Numbers", "Give and Take", 
            "Long and Short", "Shapes and Designs", "Fun with Give and Take", 
            "Time Goes On", "Who is Heavier?", "How Many Times?", "Play with Patterns"
        ],
        "EVS": [
            "Poonam's Day Out", "The Plant Fairy", "Water O Water", 
            "Our First School", "Chhotu's House", "Foods We Eat", 
            "Saying Without Speaking", "Flying High", "It's Raining", "What Is Cooking?"
        ]
    },
    "4": {
        "English": [
            "Wake Up!", "Neha's Alarm Clock", "Noses", "The Little Fir Tree", 
            "Run!", "Nasruddin's Aim", "Why?", "Alice in Wonderland", 
            "Don't Be Afraid of the Dark", "Helen Keller"
        ],
        "Hindi": [
            "Man Ke Bhole-Bhale Badal", "Jaisa Sawaal Waisa Jawaab", 
            "Kirmich Ki Gend", "Papa Jab Bachche The", "Dost Ki Poshak", 
            "Naav Banavo", "Daan Ka Hisaab", "Kaun", "Swatantrata Ki Ore", "Thapp Roti Thapp Daal"
        ],
        "Mathematics": [
            "Building with Bricks", "Long and Short", "A Trip to Bhopal", 
            "Tick-Tick-Tick", "The Way the World Looks", "The Junk Seller", 
            "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns"
        ],
        "EVS": [
            "Going to School", "Ear to Ear", "A Day with Nandu", 
            "The Story of Amrita", "Anita and the Honeybees", "Omana's Journey", 
            "From the Window", "Reaching Grandmother's House", "Changing Families", "Hu Tu Tu Hu Tu Tu"
        ]
    },
    "5": {
        "English": [
            "Ice-Cream Man", "Wonderful Waste", "Teamwork", "Flying Together", 
            "My Shadow", "Robinson Crusoe Discovers a Footprint", "Crying", 
            "My Elder Brother", "The Lazy Frog", "Rip Van Winkle"
        ],
        "Hindi": [
            "Raakh Ki Rassi", "Khilaune Wala", "Nanha Fankar", "Jahan Chah Wahan Raah", 
            "Chitthi Ka Safar", "Dakiye Ki Kahani", "Ve Din Bhi Kya Din The", 
            "Ek Maa Ki Bebasi", "Guru Aur Chela", "Swami Ki Dadi"
        ],
        "Mathematics": [
            "The Fish Tale", "Shapes and Angles", "How Many Squares?", 
            "Parts and Wholes", "Does It Look the Same?", "Be My Multiple, I'll Be Your Factor", 
            "Can You See the Pattern?", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths"
        ],
        "EVS": [
            "Super Senses", "A Snake Charmer's Story", "From Tasting to Digesting", 
            "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", 
            "Experiments with Water", "A Treat for Mosquitoes", "Up You Go!", "Walls Tell Stories"
        ]
    }
}

book_names = {
    "English": "Marigold",
    "Hindi": "Rimjhim",
    "Mathematics": "Math-Magic",
    "EVS": "Looking Around"
}

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to connect to the database")
        sys.exit(1)

    classes_to_update = ["1", "2", "3", "4", "5"]
    
    print("Removing old curriculum data for classes 1-5...")
    delete_result = await db["curriculum"].delete_many({"class_grade": {"$in": classes_to_update}})
    print(f"Deleted {delete_result.deleted_count} old chapters.")
    
    chapters_to_insert = []
    
    for class_grade, subjects in new_curriculum.items():
        for subject_name, chapter_list in subjects.items():
            book_name = book_names.get(subject_name, "")
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
