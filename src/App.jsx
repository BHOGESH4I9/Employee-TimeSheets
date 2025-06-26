import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import { Navigate, Route, Routes } from 'react-router-dom';
import DailyTimesheet from './pages/DailyTimesheet/DailyTimesheet';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`main-content-wrapper flex-grow-1 ${collapsed ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/timesheet/daily" />} />
          <Route path="/timesheet/daily" element={<DailyTimesheet collapsed={collapsed} />} />
        </Routes>
      </div>
    </div>
    </>
  )
}

export default App
