import pytest
from httpx import AsyncClient
import asyncio

from ..main import app

base_url="http://localhost:8000"

@pytest.fixture(scope="session", autouse=True)
def event_loop():
    policy = asyncio.WindowsSelectorEventLoopPolicy()
    asyncio.set_event_loop_policy(policy)
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
async def test_get_courses():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.get("/courses")
    assert response.status_code == 200
    assert len(response.json()) == 4

@pytest.mark.asyncio
async def test_get_course():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.get("/courses/66c1d16d02c97fb6c28effea")
    assert response.status_code == 200
    course = response.json()
    assert course.get("name") == "Highlights of Calculus"
    assert len(course.get("chapters")) == 18
    assert "mathematics" in course.get("domain")

@pytest.mark.asyncio
async def test_get_course_overview_not_found():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.get("/courses/7r67648")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_chapter_info():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.get("/courses/66c1d16d02c97fb6c28effea/chapters/Big%20Picture%20of%20Calculus")
    assert response.status_code == 200
    chapter = response.json()
    assert chapter["name"] == "Big Picture of Calculus"

@pytest.mark.asyncio
async def test_vote_chapter_upvote():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.post("/courses/66c1d16d02c97fb6c28effea/chapters/Big%20Picture%20of%20Calculus/vote?vote=1")
    assert response.status_code == 200
    course = response.json()
    assert "chapter_votes" in course
    assert "course_votes" in course

@pytest.mark.asyncio
async def test_vote_chapter_invalid_vote():
    async with AsyncClient(app=app, base_url=base_url) as ac:
        response = await ac.post("/courses/66c1d16d02c97fb6c28effea/chapters/Big%20Picture%20of%20Calculus/vote?vote=5")
    assert response.status_code == 400