import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getLevelTitle,
  calculateXPForNextLevel,
  calculateProgressPercentage,
} from "../utils/levelSystem";

const Calendar: React.FC = () => {
  const userProgress = {
    level: 12,
    xp: 650,
    xpToNextLevel: calculateXPForNextLevel(12),
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <CalendarIcon
              className="mr-2"
              size={24}
            />
            Calendar
          </h2>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              March 2024
            </h3>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-7 bg-gray-50 border-b rounded-t-2xl">
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
                  className="py-3 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: 35 }).map(
                (_, i) => {
                  const day = i - 3;
                  const isCurrentMonth =
                    day > 0 && day <= 31;
                  const hasEvent = [
                    5, 8, 10, 15,
                  ].includes(day);

                  return (
                    <div
                      key={i}
                      className={`h-32 p-2 border-r border-b relative ${
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
                        {day > 0 ? day : 31 + day}
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
      </div>
    </div>
  );
};

export default Calendar;
