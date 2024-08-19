from fastapi import FastAPI, Query
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from bson import ObjectId
from fastapi import HTTPException
import os
from os.path import join, dirname
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

dotenv_path = join(dirname(__file__), '../', '.env')
load_dotenv(dotenv_path)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins
)

MONGO_URI = os.environ.get("MONGO_URI") or "mongodb+srv://tony_hunt:tony_hunt@cluster0.qgblr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = os.environ.get("DATABASE_NAME") or "kimo_db"
COLLECTION_NAME = os.environ.get("COLLECTION_NAME") or "course"

# MONGO_URI="mongodb://localhost:27017"
# DATABASE_NAME="course_database"
# COLLECTION_NAME="courses"

# print(MONGO_URI, DATABASE_NAME, COLLECTION_NAME)

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
courses_collection = db[COLLECTION_NAME]

@app.get("/courses")
async def get_courses(
    sort_by: str = Query("name", enum=["name", "date", "total_upvotes", "total_downvotes"]),
    domain: Optional[str] = None
):
    sort_field = {"name": "name", "date": "date", "total_upvotes": "total_upvotes", "total_downvotes": "total_downvotes"}[sort_by]
    sort_order = -1 if sort_by in ["date", "total_upvotes", "total_downvotes"] else 1

    filter_query = {}
    if domain:
        filter_query["domain"] = domain

    courses_cursor = courses_collection.find(filter_query).sort(sort_field, sort_order)
    courses = await courses_cursor.to_list(None)
    for course in courses:
        course["_id"] = str(course["_id"]) # type: ignore
    return courses

@app.get("/courses/{course_id}")
async def get_course_overview(course_id: str):
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    course["_id"] = str(course["_id"]) # type: ignore
    return course

@app.get("/courses/{course_id}/chapters/{chapter_name}")
async def get_chapter_info(course_id: str, chapter_name: str):
    course = await courses_collection.find_one({"_id": ObjectId(course_id), "chapters.name": chapter_name})
    if course is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    chapter = next((ch for ch in course['chapters'] if ch['name'] == chapter_name), None) # type: ignore
    return chapter

@app.post("/courses/{course_id}/chapters/{chapter_name}/vote")
async def vote_chapter(course_id: str, chapter_name: str, vote: int):
    if vote not in [-1, 1]:
        raise HTTPException(status_code=400, detail="Vote must be either -1 or 1")

    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    chapter_found = None
    for chapter in course["chapters"]: # type: ignore
        if chapter["name"] == chapter_name:
            if vote == 1:
                chapter['upvotes'] = chapter.get('upvotes', 0) + 1
            elif vote == -1:
                chapter['downvotes'] = chapter.get('downvotes', 0) + 1
            chapter_found = chapter
            break

    if chapter_found is None:
        raise HTTPException(status_code=404, detail="Chapter not found")

    total_upvotes = 0
    total_downvotes = 0
    for chapter in course['chapters']: # type: ignore
        total_upvotes += chapter.get('upvotes', 0)
        total_downvotes += chapter.get('downvotes', 0)

    await courses_collection.update_one(
        {"_id": ObjectId(course_id)},
        {
            "$set": {
                "chapters": course['chapters'], # type: ignore
                "total_upvotes": total_upvotes,
                "total_downvotes": total_downvotes
            }
        }
    )

    return {
        "chapter_votes": {
            "upvotes": chapter_found.get('upvotes', 0),
            "downvotes": chapter_found.get('downvotes', 0)
        },
        "course_votes": {
            "total_upvotes": total_upvotes,
            "total_downvotes": total_downvotes
        }
    }

@app.get("/courses/domain/all")
async def get_all_courses_domains():
    courses = await courses_collection.find().to_list(None)
    
    domains = set()
    for course in courses:
        domains.update(course.get("domain", []))

    return domains

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)