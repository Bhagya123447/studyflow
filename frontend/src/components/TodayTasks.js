import React from "react";
// For quick start we'll use static sample; later fetch from Firestore
const sample = [
  {id:1,title:"Javascript", status:"ES6 script ",difficulty:"hard"},
  {id:2,title:"DSA", status:"Arrays with interview questions", difficulty:"medium"},
  {id:3,title:"Java", status:"starting OOps", difficulty:"easy"},
];

export default function TodayTasks(){
  return (
    <div>
      {sample.map(t => (
        <div key={t.id} style={{display:"flex", justifyContent:"space-between", borderBottom:"1px solid #eee", padding:"8px 0"}}>
          <div>
            <strong>{t.title}</strong><div style={{fontSize:12}}>{t.status}</div>
          </div>
          <div>{t.difficulty}</div>
        </div>
      ))}
    </div>
  );
}
