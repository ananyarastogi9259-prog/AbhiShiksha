import asyncio
import sys
from database import connect_to_mongo, close_mongo_connection, get_database

async def run():
    await connect_to_mongo()
    db = get_database()
    if db is None:
        print("No db")
        sys.exit(1)
        
    doc = await db['curriculum'].find_one()
    print(f"Sample doc: {doc}")
    
    count_str = await db['curriculum'].count_documents({"class_grade": "1"})
    count_int = await db['curriculum'].count_documents({"class_grade": 1})
    print(f"Count with string '1': {count_str}")
    print(f"Count with integer 1: {count_int}")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run())
