import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Sidebar from "./components/Sidebar";
import StudyTools from "./pages/StudyTools";
import Calendar from "./pages/Calendar";

const App: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<string>("Dashboard");

  return (
    <div className="flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 p-4">
        {activeTab === "Dashboard" && (
          <Dashboard
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "Notes" && <Notes />}
        {activeTab === "StudyTools" && (
          <StudyTools />
        )}
        {activeTab === "Calendar" && <Calendar />}
      </div>
    </div>
  );
};

export default App;
