import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Sidebar from './components/Sidebar';
import StudyTools from './pages/StudyTools';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  
  return (
    <div className='flex'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='flex-1 p-4'>
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Notes" && <Notes />}
        {activeTab === "StudyTools" && <StudyTools />}
      </div>
    </div>
    
  );
};

export default App;
