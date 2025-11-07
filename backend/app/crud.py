from sqlalchemy.orm import Session
from . import models
from typing import List

def get_article_by_url(db: Session, url: str):
    return db.query(models.Article).filter(models.Article.url == url).first()

def create_or_update_article(db: Session, url: str, title: str, html: str, text: str, summary: str, entities: dict, sections: List[str]):
    art = get_article_by_url(db, url)
    if art:
        art.title = title
        art.scraped_html = html
        art.extracted_text = text
        art.summary = summary
        art.key_entities = entities
        art.sections = sections
        db.add(art)
        db.commit()
        db.refresh(art)
        return art
    art = models.Article(url=url, title=title, scraped_html=html, extracted_text=text, summary=summary, key_entities=entities, sections=sections)
    db.add(art)
    db.commit()
    db.refresh(art)
    return art

def create_quiz(db: Session, article_id: int, quiz_json: dict):
    q = models.Quiz(article_id=article_id, quiz_json=quiz_json)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

def list_quizzes(db: Session, limit: int = 50):
    return db.query(models.Quiz).order_by(models.Quiz.created_at.desc()).limit(limit).all()

def get_quiz(db: Session, quiz_id: int):
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
