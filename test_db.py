import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def run():
    client = AsyncIOMotorClient('mongodb://localhost:27017/')
    db = client['abhishiksha']
    count = await db['curriculum'].count_documents({"class_grade": "1"})
    print(f"Count of class_grade '1': {count}")
    
    docs = await db['curriculum'].find({"class_grade": "1"}).to_list(1)
    if docs:
        print(f"Sample doc: {docs[0]}")
    else:
        print("No documents found")

if __name__ == "__main__":
    asyncio.run(run())
