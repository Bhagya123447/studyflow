import React from "react";
import FocusSession from "./FocusSession";
import TodayTasks from "./TodayTasks";
import AIBlocks from "./AIBlocks";

export default function Dashboard(){
  return (
    <div>
      <h1>Welcome back!</h1>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:20}}>
        <div style={{padding:16, border:"1px solid #eee", borderRadius:8}}>
          <h3>Study Time Today</h3>
          <div style={{fontSize:28}}>2.5h</div>
          <p style={{color:"green"}}>↑ 12%</p>
        </div>
        <div style={{padding:16, border:"1px solid #eee", borderRadius:8}}>
          <h3>Focus Score</h3>
          <div style={{fontSize:28}}>85</div>
          <p style={{color:"green"}}>↑ 5%</p>
        </div>
        <div style={{gridColumn:"1 / -1"}}>
          <FocusSession />
        </div>
      </div>

      <h2 style={{marginTop:30}}>Today's tasks</h2>
      <TodayTasks />

      <h2 style={{marginTop:30}}>AI Insights</h2>
      <AIBlocks />
    </div>
  );
}
