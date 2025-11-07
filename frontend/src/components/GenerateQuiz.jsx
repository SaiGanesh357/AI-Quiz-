import React, { useState } from "react";
import { generateQuiz } from "../services/api";

export default function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // 🔹 Generate quiz
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setQuizData(null);
    setTestStarted(false);
    setScore(null);
    setLoading(true);

    try {
      const data = await generateQuiz(url);
      if (!data || !data.quiz || data.quiz.length === 0) {
        setError(
          data?.error ||
            "No quiz questions could be generated. Please try another Wikipedia article."
        );
        setQuizData(null);
      } else {
        setQuizData(data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Start test
  const handleStartTest = () => {
    if (!userName.trim()) {
      alert("Please enter your name before starting the test.");
      return;
    }
    setTestStarted(true);
  };

  // 🔹 Record answers
  const handleOptionChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  // 🔹 Calculate score
  const handleSubmit = () => {
    if (!quizData || !quizData.quiz) return;
    let correct = 0;
    quizData.quiz.forEach((q, idx) => {
      if (
        q.answer &&
        answers[idx] &&
        q.answer.toString().toLowerCase().trim() ===
          answers[idx].toString().toLowerCase().trim()
      ) {
        correct++;
      }
    });
    setScore(correct);
  };

  // 🔹 Reset quiz
  const resetQuiz = () => {
    setTestStarted(false);
    setScore(null);
    setAnswers({});
  };

  return (
    <div className="card">
      {/* Input and Generate */}
      <form onSubmit={handleGenerate} className="form-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
        />
        <button disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* Quiz Setup Screen */}
      {quizData && !testStarted && (
        <div className="quiz-setup">
          <h2>{quizData.title || "Quiz"}</h2>

          <div className="test-setup">
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
            />
            <button onClick={handleStartTest}>Start Test</button>
          </div>

          {quizData.related_topics && quizData.related_topics.length > 0 && (
            <div className="related">
              <h4>Related topics:</h4>
              <ul>
                {quizData.related_topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quiz Questions */}
      {quizData && testStarted && quizData.quiz && quizData.quiz.length > 0 && (
        <div className="quiz-test">
          <h2>Test: {quizData.title}</h2>
          <h4>Participant: {userName}</h4>

          {quizData.quiz.map((q, idx) => (
            <div className="question-card" key={idx}>
              <div className="q-header">
                <strong>
                  {idx + 1}. {q.question}
                </strong>
              </div>

              <div className="options">
                {/* Case 1: Normal MCQ */}
                {q.options && q.options.length > 0 ? (
                  q.options.map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleOptionChange(idx, opt)}
                      />
                      {opt}
                    </label>
                  ))
                ) : q.question.toLowerCase().includes("true or false") ? (
                  // Case 2: True/False question
                  ["True", "False"].map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleOptionChange(idx, opt)}
                      />
                      {opt}
                    </label>
                  ))
                ) : (
                  // Case 3: Short answer
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    className="short-answer-input"
                    value={answers[idx] || ""}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Submit or Show Score */}
          {score === null ? (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Quiz
            </button>
          ) : (
            <div className="score-section">
              <h3>
                {userName}, your score is {score}/{quizData.quiz.length}
              </h3>

              {/* Review Answers */}
              <div className="review-section">
                <h4>Review Answers:</h4>
                {quizData.quiz.map((q, idx) => (
                  <div key={idx} className="review-item">
                    <strong>
                      {idx + 1}. {q.question}
                    </strong>
                    <p>
                      <b>Your answer:</b> {answers[idx] || "Not answered"}
                    </p>
                    {q.answer && (
                      <p>
                        <b>Correct answer:</b> {q.answer}
                      </p>
                    )}
                    {q.explanation && (
                      <p>
                        <em>Explanation: {q.explanation}</em>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={resetQuiz}>Retake Quiz</button>
            </div>
          )}
        </div>
      )}

      {/* No Questions Case */}
      {quizData && (!quizData.quiz || quizData.quiz.length === 0) && (
        <p style={{ color: "red", marginTop: "10px" }}>
          No questions were generated. Try a different article.
        </p>
      )}
    </div>
  );
}
