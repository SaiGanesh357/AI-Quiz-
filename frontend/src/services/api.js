// ✅ frontend/src/services/api.js

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://ai-quiz-xy0u.onrender.com";

// Generate quiz from Wikipedia article
export async function generateQuiz(url) {
  const response = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate quiz");
  }

  return response.json();
}

// ✅ Exported as getHistory — fixes your build issue
export async function getHistory() {
  const response = await fetch(`${BASE_URL}/api/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch quiz history");
  }

  return response.json();
}
