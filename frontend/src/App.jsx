import React, { useState } from "react";
import GenerateQuiz from "./components/GenerateQuiz";
import History from "./components/History";

export default function App(){
  const [tab, setTab] = useState("generate");
  return (
    <div className="container">
      <header>
        <h1>AI Wiki Quiz Generator</h1>
        <div className="tabs">
          <button className={tab==="generate" ? "active":""} onClick={()=>setTab("generate")}>Generate Quiz</button>
          <button className={tab==="history" ? "active":""} onClick={()=>setTab("history")}>History</button>
        </div>
      </header>
      <main>
        { tab==="generate" ? <GenerateQuiz /> : <History /> }
      </main>
    </div>
  )
}
