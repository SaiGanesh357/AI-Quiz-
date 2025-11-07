import os
from dotenv import load_dotenv
import google.generativeai as genai
from pathlib import Path
import json

# Load .env from backend root
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=api_key)
print("✅ Using NEW Gemini 2.5 Flash Prompt for Quiz Generation")



def generate_quiz_from_text(title: str, text: str, num_questions: int = 8):
    """Generate a diverse quiz (MCQ + T/F + short answer) from Wikipedia text using Gemini."""
    prompt = f"""
You are an expert quiz generator. Read the following Wikipedia article and create a diverse quiz.

Article Title: {title}

Article Content:
{text[:8000]}

Create {num_questions} questions of mixed types:
1. Multiple-choice (4 options, one correct)
2. True/False
3. Fill-in-the-blank or short answer

Output as strict JSON in the following format:
{{
  "quiz": [
    {{
      "type": "multiple_choice" | "true_false" | "short_answer",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],        # only for multiple-choice
      "answer": "Correct answer",
      "difficulty": "easy" | "medium" | "hard",
      "explanation": "Short explanation"
    }}
  ],
  "related_topics": ["Topic1", "Topic2", "Topic3"]
}}
Ensure factual accuracy and variety. Do NOT include section-heading questions.
"""

    model = genai.GenerativeModel("models/gemini-2.5-flash")

    response = model.generate_content(prompt)
    try:
        data = json.loads(response.text)
        return data
    except Exception:
        # Try to fix invalid JSON
        import re
        text_clean = re.sub(r"```json|```", "", response.text)
        try:
            return json.loads(text_clean)
        except:
            return {"quiz": [], "related_topics": [], "error": "Invalid JSON", "raw": response.text}


# Quick test (you can delete this)
if __name__ == "__main__":
    sample_text = "Elon Musk is a technology entrepreneur who founded SpaceX and co-founded Tesla. He was born in South Africa."
    print(json.dumps(generate_quiz_from_text("Elon Musk", sample_text), indent=2))
