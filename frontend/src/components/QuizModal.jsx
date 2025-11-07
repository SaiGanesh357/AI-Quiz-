import React from "react";

export default function QuizModal({data, onClose}){
  const quiz = data.quiz.quiz || data.quiz;
  const article = data.article || {};
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>{article.title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {quiz.map((q, idx)=>(
            <div className="question-card" key={idx}>
              <strong>{idx+1}. {q.question}</strong>
              <ol type="A">
                {q.options.map((opt,i)=> <li key={i}>{opt}</li>)}
              </ol>
              <div>Answer: <strong>{q.answer}</strong></div>
              <div>{q.explanation}</div>
              <div className="difficulty">{q.difficulty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
