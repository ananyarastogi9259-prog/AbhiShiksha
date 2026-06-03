import asyncio
import json
import os
from database import connect_to_mongo, close_mongo_connection, get_database

curriculum_data = [
    # Class 10 Science
    {"class_grade": "10", "subject": "Science", "chapter_number": 1, "chapter_name": "Chemical Reactions and Equations"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 2, "chapter_name": "Acids, Bases and Salts"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 3, "chapter_name": "Metals and Non-metals"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 4, "chapter_name": "Carbon and its Compounds"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 5, "chapter_name": "Life Processes"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 6, "chapter_name": "Control and Coordination"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 7, "chapter_name": "How do Organisms Reproduce?"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 8, "chapter_name": "Heredity"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 9, "chapter_name": "Light - Reflection and Refraction"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 10, "chapter_name": "The Human Eye and the Colourful World"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 11, "chapter_name": "Electricity"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 12, "chapter_name": "Magnetic Effects of Electric Current"},
    {"class_grade": "10", "subject": "Science", "chapter_number": 13, "chapter_name": "Our Environment"},

    # Class 10 Mathematics
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 1, "chapter_name": "Real Numbers"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 2, "chapter_name": "Polynomials"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 3, "chapter_name": "Pair of Linear Equations in Two Variables"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 4, "chapter_name": "Quadratic Equations"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 5, "chapter_name": "Arithmetic Progressions"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 6, "chapter_name": "Triangles"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 7, "chapter_name": "Coordinate Geometry"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 8, "chapter_name": "Introduction to Trigonometry"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 9, "chapter_name": "Some Applications of Trigonometry"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 10, "chapter_name": "Circles"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 11, "chapter_name": "Areas Related to Circles"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 12, "chapter_name": "Surface Areas and Volumes"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 13, "chapter_name": "Statistics"},
    {"class_grade": "10", "subject": "Mathematics", "chapter_number": 14, "chapter_name": "Probability"},

    # Class 11 Physics
    {"class_grade": "11", "subject": "Physics", "chapter_number": 1, "chapter_name": "Units and Measurements"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 2, "chapter_name": "Motion in a Straight Line"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 3, "chapter_name": "Motion in a Plane"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 4, "chapter_name": "Laws of Motion"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 5, "chapter_name": "Work, Energy and Power"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 6, "chapter_name": "System of Particles and Rotational Motion"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 7, "chapter_name": "Gravitation"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 8, "chapter_name": "Mechanical Properties of Solids"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 9, "chapter_name": "Mechanical Properties of Fluids"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 10, "chapter_name": "Thermal Properties of Matter"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 11, "chapter_name": "Thermodynamics"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 12, "chapter_name": "Kinetic Theory"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 13, "chapter_name": "Oscillations"},
    {"class_grade": "11", "subject": "Physics", "chapter_number": 14, "chapter_name": "Waves"},

    # Class 11 Chemistry
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 1, "chapter_name": "Some Basic Concepts of Chemistry"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 2, "chapter_name": "Structure of Atom"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 3, "chapter_name": "Classification of Elements and Periodicity in Properties"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 4, "chapter_name": "Chemical Bonding and Molecular Structure"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 5, "chapter_name": "Thermodynamics"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 6, "chapter_name": "Equilibrium"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 7, "chapter_name": "Redox Reactions"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 8, "chapter_name": "Organic Chemistry: Some Basic Principles and Techniques"},
    {"class_grade": "11", "subject": "Chemistry", "chapter_number": 9, "chapter_name": "Hydrocarbons"},

    # Class 11 Mathematics
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 1, "chapter_name": "Sets"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 2, "chapter_name": "Relations and Functions"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 3, "chapter_name": "Trigonometric Functions"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 4, "chapter_name": "Complex Numbers and Quadratic Equations"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 5, "chapter_name": "Linear Inequalities"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 6, "chapter_name": "Permutations and Combinations"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 7, "chapter_name": "Binomial Theorem"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 8, "chapter_name": "Sequence and Series"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 9, "chapter_name": "Straight Lines"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 10, "chapter_name": "Conic Sections"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 11, "chapter_name": "Introduction to Three-dimensional Geometry"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 12, "chapter_name": "Limits and Derivatives"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 13, "chapter_name": "Statistics"},
    {"class_grade": "11", "subject": "Mathematics", "chapter_number": 14, "chapter_name": "Probability"},

    # Class 11 Biology
    {"class_grade": "11", "subject": "Biology", "chapter_number": 1, "chapter_name": "The Living World"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 2, "chapter_name": "Biological Classification"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 3, "chapter_name": "Plant Kingdom"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 4, "chapter_name": "Animal Kingdom"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 5, "chapter_name": "Morphology of Flowering Plants"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 6, "chapter_name": "Anatomy of Flowering Plants"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 7, "chapter_name": "Structural Organisation in Animals"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 8, "chapter_name": "Cell: The Unit of Life"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 9, "chapter_name": "Biomolecules"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 10, "chapter_name": "Cell Cycle and Cell Division"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 11, "chapter_name": "Photosynthesis in Higher Plants"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 12, "chapter_name": "Respiration in Plants"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 13, "chapter_name": "Plant Growth and Development"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 14, "chapter_name": "Breathing and Exchange of Gases"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 15, "chapter_name": "Body Fluids and Circulation"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 16, "chapter_name": "Excretory Products and their Elimination"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 17, "chapter_name": "Locomotion and Movement"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 18, "chapter_name": "Neural Control and Coordination"},
    {"class_grade": "11", "subject": "Biology", "chapter_number": 19, "chapter_name": "Chemical Coordination and Integration"},

    # Class 12 Physics
    {"class_grade": "12", "subject": "Physics", "chapter_number": 1, "chapter_name": "Electric Charges and Fields"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 2, "chapter_name": "Electrostatic Potential and Capacitance"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 3, "chapter_name": "Current Electricity"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 4, "chapter_name": "Moving Charges and Magnetism"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 5, "chapter_name": "Magnetism and Matter"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 6, "chapter_name": "Electromagnetic Induction"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 7, "chapter_name": "Alternating Current"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 8, "chapter_name": "Electromagnetic Waves"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 9, "chapter_name": "Ray Optics and Optical Instruments"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 10, "chapter_name": "Wave Optics"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 11, "chapter_name": "Dual Nature of Radiation and Matter"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 12, "chapter_name": "Atoms"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 13, "chapter_name": "Nuclei"},
    {"class_grade": "12", "subject": "Physics", "chapter_number": 14, "chapter_name": "Semiconductor Electronics: Materials, Devices and Simple Circuits"},

    # Class 12 Chemistry
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 1, "chapter_name": "Solutions"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 2, "chapter_name": "Electrochemistry"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 3, "chapter_name": "Chemical Kinetics"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 4, "chapter_name": "The d- and f-Block Elements"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 5, "chapter_name": "Coordination Compounds"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 6, "chapter_name": "Haloalkanes and Haloarenes"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 7, "chapter_name": "Alcohols, Phenols and Ethers"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 8, "chapter_name": "Aldehydes, Ketones and Carboxylic Acids"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 9, "chapter_name": "Amines"},
    {"class_grade": "12", "subject": "Chemistry", "chapter_number": 10, "chapter_name": "Biomolecules"},

    # Class 12 Mathematics
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 1, "chapter_name": "Relations and Functions"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 2, "chapter_name": "Inverse Trigonometric Functions"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 3, "chapter_name": "Matrices"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 4, "chapter_name": "Determinants"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 5, "chapter_name": "Continuity and Differentiability"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 6, "chapter_name": "Application of Derivatives"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 7, "chapter_name": "Integrals"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 8, "chapter_name": "Application of Integrals"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 9, "chapter_name": "Differential Equations"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 10, "chapter_name": "Vector Algebra"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 11, "chapter_name": "Three Dimensional Geometry"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 12, "chapter_name": "Linear Programming"},
    {"class_grade": "12", "subject": "Mathematics", "chapter_number": 13, "chapter_name": "Probability"},

    # Class 12 Biology
    {"class_grade": "12", "subject": "Biology", "chapter_number": 1, "chapter_name": "Sexual Reproduction in Flowering Plants"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 2, "chapter_name": "Human Reproduction"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 3, "chapter_name": "Reproductive Health"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 4, "chapter_name": "Principles of Inheritance and Variation"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 5, "chapter_name": "Molecular Basis of Inheritance"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 6, "chapter_name": "Evolution"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 7, "chapter_name": "Human Health and Disease"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 8, "chapter_name": "Microbes in Human Welfare"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 9, "chapter_name": "Biotechnology: Principles and Processes"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 10, "chapter_name": "Biotechnology and its Applications"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 11, "chapter_name": "Organisms and Populations"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 12, "chapter_name": "Ecosystem"},
    {"class_grade": "12", "subject": "Biology", "chapter_number": 13, "chapter_name": "Biodiversity and Conservation"},
]

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("Failed to get database connection.")
        return
    
    print(f"Dropping existing curriculum collection...")
    await db["curriculum"].drop()
    
    print(f"Inserting {len(curriculum_data)} chapters into curriculum collection...")
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
