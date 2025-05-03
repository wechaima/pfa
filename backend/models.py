from typing import List, Optional, Union
from pydantic import BaseModel, Field

class BaseContent(BaseModel):
    id: str
    type: str
    url: str
    description: str
    keywords: List[str]

class Video(BaseContent):
    domaine: str
    titre: str
    chaine: str
    durée: str
    transcription: str



class Article(BaseContent):
    domaine: str
    titre: str
    source: str
    author: Optional[str] = None  # Rendre ce champ optionnel
    date_pub: str
    contenu: str

class Course(BaseModel):
    id: str
    title: str
    domain: str
    type: str
    author: str
    description: str
    url: str
    image: str
    content: List[dict]
    keywords: List[str]

class DomainResponse(BaseModel):
    domain: str
    courses: List[Course]
    videos: List[Video]
    articles: List[Article]