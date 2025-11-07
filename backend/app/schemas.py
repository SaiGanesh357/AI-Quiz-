from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any, Optional
from datetime import datetime

class GenerateRequest(BaseModel):
    url: HttpUrl

class QuizItem(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str
    difficulty: str

class CreateQuizResponse(BaseModel):
    id: int
    url: HttpUrl
    title: Optional[str]
    summary: Optional[str]
    key_entities: Optional[Dict[str, Any]]
    sections: Optional[List[str]]
    quiz: List[QuizItem]
    related_topics: List[str]
    cached: bool = False
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
