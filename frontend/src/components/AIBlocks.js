import React from "react";
export default function AIBlocks(){
  const blocks = [
    {title:"Peak Focus Time", desc:"Recommended time when you are most productive"},
    {title:"Energy Pattern", desc:"How long you remain focused before losing interest"},
    {title:"Task Prioritizer", desc:"AI-suggested order (coming soon)"},
    {title:"Study Suggestions", desc:"Small tips based on your history"},
  ];
  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:4}}>
      {blocks.map(b => (
        <div key={b.title} style={{padding:6, border:"1px solid #eee", borderRadius:8}}>
          <h4>{b.title}</h4>
          <p style={{fontSize:16, color:"#666"}}>{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
