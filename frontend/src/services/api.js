import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "https://ai-quiz-f4vd.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export const generateQuiz = (url) => api.post("/generate", { url }).then(r => r.data);
export const getHistory = () => api.get("/history").then(r => r.data);
export const getQuiz = (id) => api.get(`/quiz/${id}`).then(r => r.data);

export default api;
