import {
  Calendar,
  Clock,
  BarChart2,
} from "lucide-react";
import {
  getLevelTitle,
  calculateXPForNextLevel,
  calculateProgressPercentage,
} from "../utils/levelSystem";

// Sample data
const upcomingEvents = [
  {
    id: 1,
    title: "Biology Exam",
    date: "Mar 15",
    priority: "high",
    type: "exam",
  },
  {
    id: 2,
    title: "History Paper",
    date: "Mar 10",
    priority: "medium",
    type: "assignment",
  },
  {
    id: 3,
    title: "Math Quiz",
    date: "Mar 5",
    priority: "medium",
    type: "quiz",
  },
  {
    id: 4,
    title: "Physics Lab",
    date: "Mar 8",
    priority: "low",
    type: "lab",
  },
];

const todayPlan = [
  {
    id: 1,
    time: "9:00 AM",
    task: "Review Biology Chapter 5",
    duration: 45,
    completed: true,
  },
  {
    id: 2,
    time: "10:00 AM",
    task: "Math Practice Problems",
    duration: 60,
    completed: false,
  },
  {
    id: 3,
    time: "1:00 PM",
    task: "History Research",
    duration: 90,
    completed: false,
  },
  {
    id: 4,
    time: "3:00 PM",
    task: "Physics Formulas Review",
    duration: 30,
    completed: false,
  },
];

const progressData = [
  { subject: "Biology", progress: 75 },
  { subject: "History", progress: 60 },
  { subject: "Mathematics", progress: 45 },
  { subject: "Physics", progress: 80 },
];

const userProgress = {
  level: 12,
  xp: 650,
  xpToNextLevel: calculateXPForNextLevel(12),
};

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
}) => {
  const levelTitle = getLevelTitle(
    userProgress.level
  );
  const progressPercentage =
    calculateProgressPercentage(
      userProgress.xp,
      userProgress.xpToNextLevel
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              SmartLearnAI
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full">
                {levelTitle}
              </span>
              <div className="flex items-center">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-600">
                  {userProgress.xp}/
                  {userProgress.xpToNextLevel} XP
                </span>
              </div>
              <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-medium">
                  JS
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard
          </h2>

          <div className="grid grid-cols-12 gap-6">
            {/* Calendar View */}
            <div className="col-span-8 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar
                    className="mr-2"
                    size={20}
                  />
                  Calendar & Deadlines
                </h3>
                <button
                  onClick={() =>
                    setActiveTab("Calendar")
                  }
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Full Calendar
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b">
                  {[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                  ].map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-sm font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {Array.from({ length: 35 }).map(
                    (_, i) => {
                      const day = i - 3; // Adjust to start with previous month
                      const isCurrentMonth =
                        day > 0 && day <= 28;
                      const hasEvent = [
                        5, 8, 10, 15,
                      ].includes(day);

                      return (
                        <div
                          key={i}
                          className={`h-24 p-1 border-r border-b relative ${
                            isCurrentMonth
                              ? "bg-white"
                              : "bg-gray-50"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              isCurrentMonth
                                ? "text-gray-800"
                                : "text-gray-400"
                            } ${
                              day === 5
                                ? "font-bold text-indigo-600"
                                : ""
                            }`}
                          >
                            {day > 0
                              ? day
                              : 31 + day}
                          </span>

                          {hasEvent && (
                            <div
                              className={`mt-1 p-1 text-xs rounded ${
                                day === 5
                                  ? "bg-red-100 text-red-800"
                                  : day === 15
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {day === 5
                                ? "Math Quiz"
                                : day === 8
                                ? "Physics Lab"
                                : day === 10
                                ? "History Paper"
                                : "Biology Exam"}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Today's Study Plan */}
            <div className="col-span-4 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Clock
                  className="mr-2"
                  size={20}
                />
                Today's Study Plan
              </h3>

              <div className="space-y-4">
                {todayPlan.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="mt-1 mr-3"
                      readOnly
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span
                          className={`font-medium ${
                            item.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {item.task}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.time}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.duration} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                Regenerate Plan
              </button>
            </div>

            {/* Upcoming Deadlines */}
            <div className="col-span-4 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Upcoming Deadlines
              </h3>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        event.priority === "high"
                          ? "bg-red-500"
                          : event.priority ===
                            "medium"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due {event.date}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded capitalize bg-gray-100 text-gray-800">
                      {event.type}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium">
                View All Deadlines
              </button>
            </div>

            {/* Progress Tracking */}
            <div className="col-span-8 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Subject Progress
              </h3>

              <div className="space-y-4">
                {progressData.map((subject) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {subject.subject}
                      </span>
                      <span className="text-sm text-gray-500">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          subject.progress > 75
                            ? "bg-green-500"
                            : subject.progress >
                              50
                            ? "bg-blue-500"
                            : subject.progress >
                              25
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${subject.progress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                    <BarChart2
                      className="text-indigo-600"
                      size={24}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      AI Insight
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You're making great progress
                      in Physics and Biology!
                      Consider allocating more
                      time to Mathematics where
                      your retention rate has
                      dropped by 12% in the last
                      week.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
