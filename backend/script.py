import json
import motor.motor_asyncio
from datetime import datetime
import os
from os.path import join, dirname
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGO_URI = os.environ.get("MONGO_URI")
DATABASE_NAME = os.environ.get("DATABASE_NAME")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME")

# MONGO_URI="mongodb://localhost:27017"
# DATABASE_NAME="course_database"
# COLLECTION_NAME="courses"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
courses_collection = db[COLLECTION_NAME]

async def create_indices():
    await courses_collection.create_index("name", unique=True)
    await courses_collection.create_index("domain")
    await courses_collection.create_index("date")
    await courses_collection.create_index("chapters.name")

async def insert_course_data():
    with open('courses.json', 'r') as file:
        courses = json.load(file)
    
    for course in courses:
        course['date'] = datetime.utcfromtimestamp(course['date'])
        
        for chapter in course['chapters']:
            chapter['upvotes'] = 0
            chapter['downvotes'] = 0
        
        course['total_upvotes'] = 0
        course['total_downvotes'] = 0
        await courses_collection.insert_one(course)

async def main():
    await create_indices()
    
    await insert_course_data()
    
    print("Data inserted successfully!")

import asyncio
asyncio.run(main())
