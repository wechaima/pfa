from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from pathlib import Path

from models import Video, Article, Course, DomainResponse
from utils import get_all_domains, get_content_by_type
from chatbot import get_answer

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chemin vers le dossier data
DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

class ChatRequest(BaseModel):
    question: str

@app.get("/domains", response_model=List[str])
async def get_domains():
    """Retourne tous les domaines disponibles"""
    return get_all_domains(DATA_DIR)

@app.get("/courses", response_model=List[Course])
async def get_all_courses():
    """Retourne tous les cours disponibles"""
    courses = []
    for domain in get_all_domains(DATA_DIR):
        domain_courses = get_content_by_type(domain, "courses", DATA_DIR)
        courses.extend(domain_courses)
    return courses

@app.get("/videos", response_model=List[Video])
async def get_all_videos():
    """Retourne toutes les vidéos disponibles"""
    videos = []
    for domain in get_all_domains(DATA_DIR):
        domain_videos = get_content_by_type(domain, "videos", DATA_DIR)
        videos.extend(domain_videos)
    return videos

@app.get("/articles", response_model=List[Article])
async def get_all_articles():
    """Retourne tous les articles disponibles"""
    articles = []
    for domain in get_all_domains(DATA_DIR):
        domain_articles = get_content_by_type(domain, "articles", DATA_DIR)
        articles.extend(domain_articles)
    return articles

@app.get("/courses/{domain}", response_model=List[Course])
async def get_courses_by_domain(domain: str):
    """Retourne les cours pour un domaine spécifique"""
    courses = get_content_by_type(domain, "courses", DATA_DIR)
    if not courses:
        raise HTTPException(status_code=404, detail="Domain not found or no courses available")
    return courses

@app.get("/videos/{domain}", response_model=List[Video])
async def get_videos_by_domain(domain: str):
    """Retourne les vidéos pour un domaine spécifique"""
    videos = get_content_by_type(domain, "videos", DATA_DIR)
    if not videos:
        raise HTTPException(status_code=404, detail="Domain not found or no videos available")
    return videos

@app.get("/articles/{domain}", response_model=List[Article])
async def get_articles_by_domain(domain: str):
    """Retourne les articles pour un domaine spécifique"""
    articles = get_content_by_type(domain, "articles", DATA_DIR)
    if not articles:
        raise HTTPException(status_code=404, detail="Domain not found or no articles available")
    return articles

@app.get("/domain/{domain}", response_model=DomainResponse)
async def get_domain_content(domain: str):
    """Retourne tout le contenu (cours, vidéos, articles) pour un domaine spécifique"""
    courses = get_content_by_type(domain, "courses", DATA_DIR)
    videos = get_content_by_type(domain, "videos", DATA_DIR)
    articles = get_content_by_type(domain, "articles", DATA_DIR)
    
    if not any([courses, videos, articles]):
        raise HTTPException(status_code=404, detail="Domain not found or no content available")
    
    return DomainResponse(
        domain=domain,
        courses=courses,
        videos=videos,
        articles=articles
    )

@app.get("/course/{course_id}", response_model=Course)
async def get_course_details(course_id: str):
    """Retourne les détails d'un cours spécifique par son ID"""
    for domain in get_all_domains(DATA_DIR):
        courses = get_content_by_type(domain, "courses", DATA_DIR)
        for course in courses:
            if course.id == course_id:
                return course
    raise HTTPException(status_code=404, detail="Course not found")

@app.get("/video/{video_id}", response_model=Video)
async def get_video_details(video_id: str):
    """Retourne les détails d'une vidéo spécifique par son ID"""
    for domain in get_all_domains(DATA_DIR):
        videos = get_content_by_type(domain, "videos", DATA_DIR)
        for video in videos:
            if video.id == video_id:
                return video
    raise HTTPException(status_code=404, detail="Video not found")

@app.get("/article/{article_id}", response_model=Article)
async def get_article_details(article_id: str):
    """Retourne les détails d'un article spécifique par son ID"""
    for domain in get_all_domains(DATA_DIR):
        articles = get_content_by_type(domain, "articles", DATA_DIR)
        for article in articles:
            if article.id == article_id:
                return article
    raise HTTPException(status_code=404, detail="Article not found")

@app.post("/chat")
async def chat_endpoint(data: ChatRequest):
    """Endpoint pour le chatbot"""
    return get_answer(data.question)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)