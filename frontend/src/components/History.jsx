import React, { useEffect, useState } from "react";
import { getHistory, getQuiz } from "../services/api";
import QuizModal from "./QuizModal";

export default function History(){
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{
    getHistory().then(setRows).catch(console.error);
  },[]);

  async function openDetails(id){
    const d = await getQuiz(id);
    setSelected(d);
  }

  return (
    <div className="card">
      <h2>Past Quizzes</h2>
      <table className="history-table">
        <thead><tr><th>Title</th><th>URL</th><th>Created</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.quiz_id}>
              <td>{r.article_title}</td>
              <td className="url-cell">{r.url}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td><button onClick={()=>openDetails(r.quiz_id)}>Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <QuizModal data={selected} onClose={()=>setSelected(null)} />}
    </div>
  )
}
