from fastapi import FastAPI, HTTPException, Depends
from .db import get_db, engine
from . import models, scraper, llm, crud
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# create tables (auto)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Wiki Quiz Generator (SQLite)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate")
def generate(data: dict):
    url = data.get("url")
    title, full_text = scraper.extract_wikipedia_text(url)

    if not full_text:
        return {
            "title": title or "Unknown",
            "quiz": [],
            "error": "Failed to extract content from Wikipedia. Please check the URL or try another article."
        }

    # Generate quiz using Gemini
    quiz_data = llm.generate_quiz_from_text(title or url, full_text)

    return {
        "title": title,
        "quiz": quiz_data.get("quiz", []),
        "related_topics": quiz_data.get("related_topics", []),
        "error": quiz_data.get("error", None)
    }



@app.get("/api/history")
def history(limit: int = 50, db: Session = Depends(get_db)):
    quizzes = crud.list_quizzes(db, limit=limit)
    out = []
    for q in quizzes:
        art = db.query(models.Article).filter(models.Article.id == q.article_id).first()
        out.append({
            "quiz_id": q.id,
            "article_title": art.title if art else None,
            "url": art.url if art else None,
            "created_at": q.created_at.isoformat() if q.created_at else None,
        })
    return out

@app.get("/api/quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    q = crud.get_quiz(db, quiz_id)
    if not q:
        raise HTTPException(status_code=404, detail="Quiz not found")
    art = db.query(models.Article).filter(models.Article.id == q.article_id).first()
    return {
        "quiz_id": q.id,
        "article": {
            "id": art.id if art else None,
            "url": art.url if art else None,
            "title": art.title if art else None,
            "sections": art.sections if art else None,
            "summary": art.summary if art else None,
        },
        "quiz": q.quiz_json,
        "created_at": q.created_at.isoformat() if q.created_at else None
    }
