import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const data = await getHistory();
      setHistory(data);
    }
    fetchHistory();
  }, []);

  return (
    <div className="card">
      <h2>Previous Quizzes</h2>
      <ul>
        {history.length > 0 ? (
          history.map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong> - {item.date}
            </li>
          ))
        ) : (
          <p>No quiz history found.</p>
        )}
      </ul>
    </div>
  );
}
