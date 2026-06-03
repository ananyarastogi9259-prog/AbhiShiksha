import asyncio
import json
import os
from database import connect_to_mongo, close_mongo_connection, get_database

curriculum_data = []

# Helper to generate chapters quickly for a subject
def generate_chapters(class_grade, subject, chapter_names):
    return [
        {
            "class_grade": class_grade,
            "subject": subject,
            "chapter_number": i + 1,
            "chapter_name": name,
            "videoUrl": "",
            "notesPdfUrl": "",
            "quiz_available": False
        }
        for i, name in enumerate(chapter_names)
    ]

# CLASS 6
class_6_maths = [
    "Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas",
    "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling",
    "Mensuration", "Algebra", "Ratio and Proportion"
]
class_6_science = [
    "Components of Food", "Sorting Materials into Groups", "Separation of Substances", "Getting to Know Plants",
    "Body Movements", "The Living Organisms — Characteristics and Habitats", "Motion and Measurement of Distances",
    "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Air Around Us"
]
class_6_english = [
    "Who Did Patrick's Homework?", "How the Dog Found Himself a New Master!", "Taro's Reward",
    "An Indian – American Woman in Space: Kalpana Chawla", "A Different Kind of School",
    "Who I Am", "Fair Play", "A Game of Chance"
]
class_6_social_science = [
    # History
    "What, Where, How and When?", "From Hunting-Gathering to Growing Food", "In the Earliest Cities",
    "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas",
    "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims",
    "New Empires and Kingdoms",
    # Geography
    "The Earth in the Solar System", "Globe: Latitudes and Longitudes", "Motions of the Earth",
    "Maps", "Major Domains of the Earth", "Major Landforms of the Earth", "Our Country - India",
    "India: Climate, Vegetation and Wildlife",
    # Civics
    "Understanding Diversity", "Diversity and Discrimination", "What is Government?",
    "Key Elements of a Democratic Government", "Panchayati Raj", "Rural Administration",
    "Urban Administration", "Rural Livelihoods"
]
class_6_hindi = [
    "वह चिड़िया जो", "बचपन", "नादान दोस्त", "चाँद से थोड़ी-सी गप्पें", "अक्षरों का महत्व",
    "पार नज़र के", "साथी हाथ बढ़ाना", "ऐसे-ऐसे", "टिकट अलबम", "झाँसी की रानी",
    "जो देखकर भी नहीं देखते", "संसार पुस्तक है", "मैं सबसे छोटी होऊँ", "लोकगीत"
]

curriculum_data.extend(generate_chapters("6", "Mathematics", class_6_maths))
curriculum_data.extend(generate_chapters("6", "Science", class_6_science))
curriculum_data.extend(generate_chapters("6", "English", class_6_english))
curriculum_data.extend(generate_chapters("6", "Social Science", class_6_social_science))
curriculum_data.extend(generate_chapters("6", "Hindi", class_6_hindi))

# CLASS 7
class_7_maths = [
    "Integers", "Fractions and Decimals", "Data Handling", "Simple Equations",
    "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles",
    "Comparing Quantities", "Rational Numbers", "Practical Geometry",
    "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers"
]
class_7_science = [
    "Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat",
    "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations of Animals to Climate",
    "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants",
    "Reproduction in Plants", "Motion and Time"
]
class_7_english = [
    "Three Questions", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes That Made Trees Bloom",
    "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire: Friend and Foe"
]
class_7_social_science = [
    "Tracing Changes Through A Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans",
    "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons",
    "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine", "Environment",
    "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Natural Vegetation and Wildlife",
    "Human Environment-Settlement, Transport and Communication", "On Equality", "Role of the Government in Health",
    "How the State Government Works", "Growing up as Boys and Girls", "Women Change the World",
    "Understanding Media", "Understanding Advertising", "Markets Around Us"
]
class_7_hindi = [
    "हम पंछी उन्मुक्त गगन के", "दादी माँ", "हिमालय की बेटियां", "कठपुतली", "मिठाईवाला",
    "रक्त और हमारा शरीर", "पापा खो गए", "शाम - एक किसान", "चिड़िया की बच्ची", "अपूर्व अनुभव",
    "रहीम की दोहे", "कंचा", "एक तिनका", "खानपान की बदलती तस्वीर", "नीलकंठ"
]

curriculum_data.extend(generate_chapters("7", "Mathematics", class_7_maths))
curriculum_data.extend(generate_chapters("7", "Science", class_7_science))
curriculum_data.extend(generate_chapters("7", "English", class_7_english))
curriculum_data.extend(generate_chapters("7", "Social Science", class_7_social_science))
curriculum_data.extend(generate_chapters("7", "Hindi", class_7_hindi))

# CLASS 8
class_8_maths = [
    "Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals",
    "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots",
    "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes",
    "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions"
]
class_8_science = [
    "Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics",
    "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame",
    "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals",
    "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound"
]
class_8_english = [
    "The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past",
    "Bepin Choudhury's Lapse of Memory", "The Summit Within", "This is Jody's Fawn",
    "A Visit to Cambridge", "A Short Monsoon Diary"
]
class_8_social_science = [
    "How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age",
    "When People Rebel 1857 and After", "Weavers, Iron Smelters and Factory Owners", "Civilising the 'Native', Educating the Nation",
    "Women, Caste and Reform", "Resources", "Land, Soil, Water, Natural Vegetation and Wildlife Resources",
    "Mineral and Power Resources", "Agriculture", "Industries", "The Indian Constitution",
    "Understanding Secularism", "Why Do We Need a Parliament?", "Understanding Laws", "Judiciary",
    "Understanding Our Criminal Justice System", "Understanding Marginalisation", "Confronting Marginalisation"
]
class_8_hindi = [
    "ध्वनि", "लाख की चूड़ियाँ", "बस की यात्रा", "दीवानों की हस्ती", "चिट्ठियों की अनूठी दुनिया",
    "भगवान के डाकिए", "क्या निराश हुआ जाए", "यह सबसे कठिन समय नहीं", "कबीर की साखियाँ", "कामचोर",
    "जब सिनेमा ने बोलना सीखा", "सुदामा चरित", "जहाँ पहिया है"
]

curriculum_data.extend(generate_chapters("8", "Mathematics", class_8_maths))
curriculum_data.extend(generate_chapters("8", "Science", class_8_science))
curriculum_data.extend(generate_chapters("8", "English", class_8_english))
curriculum_data.extend(generate_chapters("8", "Social Science", class_8_social_science))
curriculum_data.extend(generate_chapters("8", "Hindi", class_8_hindi))

# CLASS 9
class_9_maths = [
    "Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables",
    "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals",
    "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula"
]
class_9_science = [
    "Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules",
    "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms",
    "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"
]
class_9_english = [
    "The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind",
    "The Snake and the Mirror", "My Childhood", "Packing", "Reach for the Top", "The Bond of Love"
]
class_9_social_science = [
    "The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler",
    "Forest Society and Colonialism", "Pastoralists in the Modern World", "India - Size and Location",
    "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population",
    "What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions",
    "Democratic Rights", "The Story of Village Palampur", "People as Resource", "Poverty as a Challenge",
    "Food Security in India"
]
class_9_hindi = [
    "दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "साँवले सपनों की याद", "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया",
    "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना", "साखियाँ एवं सबद", "वाख", "सवैये",
    "कैदी और कोकिला", "ग्राम श्री"
]

curriculum_data.extend(generate_chapters("9", "Mathematics", class_9_maths))
curriculum_data.extend(generate_chapters("9", "Science", class_9_science))
curriculum_data.extend(generate_chapters("9", "English", class_9_english))
curriculum_data.extend(generate_chapters("9", "Social Science", class_9_social_science))
curriculum_data.extend(generate_chapters("9", "Hindi", class_9_hindi))


async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to get database connection.")
        return
    
    print(f"Inserting {len(curriculum_data)} chapters for Classes 6-9 into curriculum collection...")
    # Add empty resources
    for doc in curriculum_data:
        doc["videoUrl"] = ""
        doc["notesPdfUrl"] = ""
        doc["quiz_available"] = False
        
    result = await db["curriculum"].insert_many(curriculum_data)
    print(f"Successfully inserted {len(result.inserted_ids)} chapters.")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed())
