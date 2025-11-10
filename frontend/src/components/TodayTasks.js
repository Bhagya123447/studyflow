import React from "react";

const sample = [
  {id:1,title:"Complete React tutorial", description:"Learn hooks and state management", date:"Oct 29", time:"60 min", difficulty:"High"},
  {id:2,title:"Review TypeScript basics", description:"Focus on types and interfaces", date:"Oct 30", time:"45 min", difficulty:"Medium"},
];

export default function TodayTasks(){
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Today's Tasks</h2>
        <button style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 15px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '5px' }}>+</span> Add Task
        </button>
      </div>

      <div>
        {sample.map(t => (
          <div key={t.id} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '15px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'flex-start',
            borderLeft: t.difficulty === 'High' ? '5px solid #dc3545' : (t.difficulty === 'Medium' ? '5px solid #ffc107' : '5px solid #28a745') // visual cue for difficulty
          }}>
            <input type="checkbox" style={{ marginRight: '15px', marginTop: '5px', transform: 'scale(1.2)' }} />
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '18px', color: '#333' }}>{t.title}</strong>
                <span style={{
                  backgroundColor: t.difficulty === 'High' ? '#dc3545' : (t.difficulty === 'Medium' ? '#ffc107' : '#28a745'),
                  color: 'white',
                  borderRadius: '15px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>{t.difficulty}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>{t.description}</div>
              <div style={{ fontSize: '12px', color: '#777', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '15px' }}>🗓️ {t.date}</span>
                <span>⏰ {t.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}