import React, {useState, useRef, useEffect} from "react";

export default function FocusSession(){
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(()=>{
    if(running){
      timerRef.current = setInterval(()=> setSeconds(s => s+1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return ()=> clearInterval(timerRef.current);
  }, [running]);

  const format = s => {
    const mm = String(Math.floor(s/60)).padStart(2,"0");
    const ss = String(s%60).padStart(2,"0");
    return `${mm}:${ss}`;
  };

  return (
    <div style={{display:"grid", justifyContent:"space-between", alignItems:"center", padding:16, border:"1px solid #eee", borderRadius:8}}>
      <h3>Focus Session</h3>
      <div>
        <div style={{fontSize:40}}>{format(seconds)}</div>
      </div>
      <div>
        <button onClick={()=> setRunning(r => !r)} style={{padding:"8px 16px",marginTop:16, marginRight:10}}>
          {running ? "Stop" : "Start"}
        </button>
        <button onClick={()=> { setSeconds(0); setRunning(false); }}>Reset</button>
      </div>
    </div>
  );
}
