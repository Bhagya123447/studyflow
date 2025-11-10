import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CalendarPage from "./components/CalendarPage";
import TasksPage from "./components/TasksPage";
import StatsPage from "./components/StatsPage";
import AIInsights from "./components/AIInsights";
import Settings from "./components/SettingsPage";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

function App(){
  return (
    <BrowserRouter>
      <div style={{display:"flex", minHeight:"100vh"}}>
        
        <div style={{flex:1, padding:20}}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/calendar" element={<CalendarPage/>}/>
            <Route path="/tasks" element={<TasksPage/>}/>
            <Route path="/stats" element={<StatsPage/>}/>
            <Route path="/insights" element={<AIInsights/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
