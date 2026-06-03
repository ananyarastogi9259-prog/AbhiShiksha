import asyncio
import json
import os
from database import connect_to_mongo, close_mongo_connection, get_database

curriculum_data = []

def generate_chapters(class_grade, subject, book_name, chapter_names):
    return [
        {
            "class_grade": class_grade,
            "subject": subject,
            "chapter_number": i + 1,
            "chapter_name": name,
            "videoUrl": "",
            "notesPdfUrl": "",
            "quiz_available": False,
            "book_name": book_name,
            "animatedVideoUrl": "",
            "interactiveActivityUrl": ""
        }
        for i, name in enumerate(chapter_names)
    ]

# CLASS 1
class_1_maths = ["Shapes and Space", "Numbers from One to Nine", "Addition", "Subtraction", "Numbers from Ten to Twenty", "Time", "Measurement", "Numbers from Twenty-one to Fifty", "Data Handling", "Patterns", "Numbers", "Money", "How Many"]
class_1_english = ["A Happy Child", "Three Little Pigs", "After a Bath", "The Bubble, the Straw, and the Shoe", "One Little Kitten", "Lalu and Peelu", "Once I Saw a Little Bird", "Mittu and the Yellow Mango", "Merry-Go-Round", "Circle"]
class_1_hindi = ["झूला", "आम की कहानी", "आम की टोकरी", "पत्ते ही पत्ते", "पकौड़ी", "छुक-छुक गाड़ी", "रसोईघर", "चूहो! म्याऊँ सो रही है", "बंदर और गिलहरी", "पगड़ी", "पतंग", "गेंद-बल्ला", "बंदर गया खेत में भाग", "एक बुढ़िया", "मैं भी", "लालू और पीलू", "चकई के चकदुम", "छोटी का कमाल", "चार चने", "भगदड़", "हलीम चला चाँद पर", "हाथी चल्लम चल्लम", "सात पूँछ का चूहा"]

curriculum_data.extend(generate_chapters("1", "Mathematics", "Math-Magic", class_1_maths))
curriculum_data.extend(generate_chapters("1", "English", "Marigold", class_1_english))
curriculum_data.extend(generate_chapters("1", "Hindi", "Rimjhim", class_1_hindi))

# CLASS 2
class_2_maths = ["What is Long, What is Round?", "Counting in Groups", "How Much Can You Carry?", "Counting in Tens", "Patterns", "Footprints", "Jugs and Mugs", "Tens and Ones", "My Funday", "Add our Points", "Lines and Lines", "Give and Take", "The Longest Step", "Birds Come, Birds Go", "How Many Ponytails?"]
class_2_english = ["First Day at School", "I am Lucky!", "A Smile", "Rain", "Zoo Manners", "Mr. Nobody", "On My Blackboard I can Draw", "I am the Music Man", "Granny Granny Please Comb my Hair", "Strange Talk"]
class_2_hindi = ["ऊँट चला", "भालू ने खेली फुटबॉल", "म्याऊँ, म्याऊँ !!", "अधिक बलवान कौन?", "दोस्त की मदद", "बहुत हुआ", "मेरी किताब", "तितली और कली", "बुलबुल", "मीठी सारंगी", "टेसू राजा बीच बाजार", "बस के नीचे बाघ", "सूरज जल्दी आना जी", "नटखट चूहा", "एक्की-दोक्की"]

curriculum_data.extend(generate_chapters("2", "Mathematics", "Math-Magic", class_2_maths))
curriculum_data.extend(generate_chapters("2", "English", "Marigold", class_2_english))
curriculum_data.extend(generate_chapters("2", "Hindi", "Rimjhim", class_2_hindi))

# CLASS 3
class_3_maths = ["Where to Look From", "Fun with Numbers", "Give and Take", "Long and Short", "Shapes and Designs", "Fun with Give and Take", "Time Goes On", "Who is Heavier?", "How Many Times?", "Play with Patterns", "Jugs and Mugs", "Can We Share?", "Smart Charts!", "Rupees and Paise"]
class_3_english = ["Good Morning", "Bird Talk", "Little by Little", "Sea Song", "The Balloon Man", "Trains", "Puppy and I", "What's in the Mailbox?", "Don't Tell", "How Creatures Move"]
class_3_hindi = ["कक्कू", "शेखीबाज़ मक्खी", "चाँद वाली अम्मा", "मन करता है", "बहादुर बित्तो", "हमसे सब कहते", "टिपटिपवा", "बंदर बाँट", "अक्ल बड़ी या भैंस", "क्योंजीमल और कैसे-कैसलिया", "मीरा बहन और बाघ", "जब मुझे साँप ने काटा", "मिर्च का मजा", "सबसे अच्छा पेड़"]
class_3_evs = ["Poonam's Day Out", "The Plant Fairy", "Water O' Water!", "Our First School", "Chhotu's House", "Foods We Eat", "Saying without Speaking", "Flying High", "It's Raining", "What is Cooking", "From Here to There", "Work We Do", "Sharing Our Feelings", "The Story of Food", "Making Pots", "Games We Play", "Here comes a Letter", "A House Like This", "Our Friends - Animals", "Drop by Drop", "Families can be Different", "Left-Right", "A Beautiful Cloth", "Web of Life"]

curriculum_data.extend(generate_chapters("3", "Mathematics", "Math-Magic", class_3_maths))
curriculum_data.extend(generate_chapters("3", "English", "Marigold", class_3_english))
curriculum_data.extend(generate_chapters("3", "Hindi", "Rimjhim", class_3_hindi))
curriculum_data.extend(generate_chapters("3", "EVS", "Looking Around", class_3_evs))

# CLASS 4
class_4_maths = ["Building with Bricks", "Long and Short", "A Trip to Bhopal", "Tick-Tick-Tick", "The Way The World Looks", "The Junk Seller", "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns", "Tables and Shares", "How Heavy? How Light?", "A Field and Fences", "Smart Charts"]
class_4_english = ["Wake Up!", "Noses", "Run!", "Why?", "Don't be Afraid of the Dark", "I Had a Little Pony", "Hiawatha", "A Watering Rhyme", "The Naughty Boy"]
class_4_hindi = ["मन के भोले-भाले बादल", "जैसा सवाल वैसा जवाब", "किरमिच की गेंद", "पापा जब बच्चे थे", "दोस्त की पोशाक", "नाव बनाओ नाव बनाओ", "दान का हिसाब", "कौन?", "स्वतंत्रता की ओर", "थप्प रोटी थप्प दाल", "पढ़क्कू की सूझ", "सुनीता की पहिया कुर्सी", "हुदहुद", "मुफ़्त ही मुफ़्त"]
class_4_evs = ["Going to School", "Ear to Ear", "A Day with Nandu", "The Story of Amrita", "Anita and the Honeybees", "Omana's Journey", "From the Window", "Reaching Grandmother's House", "Changing Families", "Hu Tu Tu, Hu Tu Tu", "The Valley of Flowers", "Changing Times", "A River's Tale", "Basva's Farm", "From Market to Home", "A Busy Month", "Nandita in Mumbai", "Too Much Water, Too Little Water", "Abdul in the Garden", "Eating Together", "Food and Fun", "The World in my Home", "Pochampalli", "Home and Abroad", "Spicy Riddles", "Defence Officer: Wahida", "Chuskit Goes to School"]

curriculum_data.extend(generate_chapters("4", "Mathematics", "Math-Magic", class_4_maths))
curriculum_data.extend(generate_chapters("4", "English", "Marigold", class_4_english))
curriculum_data.extend(generate_chapters("4", "Hindi", "Rimjhim", class_4_hindi))
curriculum_data.extend(generate_chapters("4", "EVS", "Looking Around", class_4_evs))

# CLASS 5
class_5_maths = ["The Fish Tale", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Does it Look the Same?", "Be My Multiple, I'll be Your Factor", "Can You See the Pattern?", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big? How Heavy?"]
class_5_english = ["Ice-cream Man", "Teamwork", "My Shadow", "Crying", "The Lazy Frog", "Class Discussion", "Topsy-turvy Land", "Nobody's Friend", "Sing a Song of People", "Malu Bhalu"]
class_5_hindi = ["राख की रस्सी", "फसलों के त्योहार", "खिलौनेवाला", "नन्हा फनकार", "जहाँ चाह वहाँ राह", "चिट्ठी का सफ़र", "डाकिए की कहानी, कंवरसिंह की जुबानी", "वे दिन भी क्या दिन थे", "एक माँ की बेबसी", "एक दिन की बादशाहत", "चावल की रोटियाँ", "गुरु और चेला", "स्वामी की दादी", "बाघ आया उस रात", "बिशन की दिलेरी", "पानी रे पानी", "छोटी-सी हमारी नदी", "चुनौती हिमालय की"]
class_5_evs = ["Super Senses", "A Snake Charmer's Story", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", "Experiments with Water", "A Treat for Mosquitoes", "Up You Go!", "Walls Tell Stories", "Sunita in Space", "What if it Finishes...?", "A Shelter so High!", "When the Earth Shook!", "Blow Hot, Blow Cold", "Who will do this Work?", "Across the Wall", "No Place for Us?", "A Seed tells a Farmer's Story", "Whose Forests?", "Like Father, Like Daughter", "On the Move Again"]

curriculum_data.extend(generate_chapters("5", "Mathematics", "Math-Magic", class_5_maths))
curriculum_data.extend(generate_chapters("5", "English", "Marigold", class_5_english))
curriculum_data.extend(generate_chapters("5", "Hindi", "Rimjhim", class_5_hindi))
curriculum_data.extend(generate_chapters("5", "EVS", "Looking Around", class_5_evs))

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to get database connection.")
        return
    
    print(f"Inserting {len(curriculum_data)} chapters for Classes 1-5 into curriculum collection...")
        
    result = await db["curriculum"].insert_many(curriculum_data)
    print(f"Successfully inserted {len(result.inserted_ids)} chapters.")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed())
