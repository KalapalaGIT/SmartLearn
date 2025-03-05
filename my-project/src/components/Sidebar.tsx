// Dashboard
import { BarChart2, BookOpen, List, Award, Settings } from 'lucide-react';
import Dashboard from '../pages/Dashboard';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <div className="w-16 bg-indigo-700 flex flex-col items-center py-8">
    <div className="w-16 bg-indigo-700 flex flex-col items-center py-8">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-8">
      <span className="text-indigo-700 font-bold text-xl">S</span>
    </div>
    <div className="flex flex-col items-center space-y-8">
      <button 
        className={`p-2 rounded-lg ${activeTab === "Dashboard" ? "bg-indigo-600" : ""}`}
        onClick={() => setActiveTab("Dashboard")}
      >
        <BarChart2 className="text-white" size={20} />
      </button>
      <button 
        className={`p-2 rounded-lg ${activeTab === "Notes" ? "bg-indigo-600" : ""}`}
        onClick={() => setActiveTab("Notes")}
      >
        <BookOpen className="text-white" size={20} />
      </button>
      <button 
        className={`p-2 rounded-lg ${activeTab === "StudyTools" ? "bg-indigo-600" : ""}`}
        onClick={() => setActiveTab("StudyTools")}
      >
        <List className="text-white" size={20} />
      </button>
      <button 
        className={`p-2 rounded-lg ${activeTab === "achievements" ? "bg-indigo-600" : ""}`}
        onClick={() => setActiveTab("achievements")}
      >
        <Award className="text-white" size={20} />
      </button>
      <button 
        className={`p-2 rounded-lg ${activeTab === "settings" ? "bg-indigo-600" : ""}`}
        onClick={() => setActiveTab("settings")}
      >
        <Settings className="text-white" size={20} />
      </button>
    </div>
  </div>
  </div>
);

export default Sidebar;
