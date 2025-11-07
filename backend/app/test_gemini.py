import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env from backend root
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")
print("Loaded key:", api_key[:10] if api_key else "None")

try:
    genai.configure(api_key=api_key)

    # ✅ use the latest working model from your list
    model = genai.GenerativeModel("models/gemini-2.5-flash")

    response = model.generate_content("Say Hello, Gemini!")
    print("✅ Gemini response:", response.text)
except Exception as e:
    print("❌ Gemini error:", e)
