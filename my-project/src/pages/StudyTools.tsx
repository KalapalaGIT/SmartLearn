// StudyTools.jsx
import React, { useState } from "react";
import { 
  BookOpen, Brain, Award, Trophy, Calendar, FileText, Star, AlertCircle, 
  RefreshCw, Check, Clock, ArrowUp, BarChart2, List, Settings 
} from "lucide-react";

const StudyTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState("quiz-generator");
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Dummy data
  const userProgress = {
    level: 7,
    title: "Knowledge Seeker",
    xp: 3240,
    xpToNextLevel: 4000,
    studyStreak: 12,
    dailyGoal: 85,
    rank: 17,
    achievements: [
      {
        id: 1,
        name: "First Quiz Ace",
        icon: <Award size={18} />,
        completed: true,
      },
      {
        id: 2,
        name: "Week Warrior",
        icon: <Calendar size={18} />,
        completed: true,
      },
      {
        id: 3,
        name: "Focus Master",
        icon: <Brain size={18} />,
        completed: false,
      },
      {
        id: 4,
        name: "Collection King",
        icon: <FileText size={18} />,
        completed: true,
      },
    ],
    weakAreas: [
      {
        subject: "Physics",
        topic: "Thermodynamics",
        masteryLevel: 42,
      },
      {
        subject: "Math",
        topic: "Calculus - Integration",
        masteryLevel: 38,
      },
      {
        subject: "Biology",
        topic: "Cell Division",
        masteryLevel: 56,
      },
    ],
    recentActivity: [
      {
        action: "Completed quiz",
        xp: 120,
        timestamp: "2 hours ago",
      },
      {
        action: "Created 10 flashcards",
        xp: 50,
        timestamp: "Yesterday",
      },
      {
        action: "Study streak bonus",
        xp: 75,
        timestamp: "Today",
      },
    ],
  };

  const quizQuestions = [
    {
      id: 1,
      question:
        "What is the law of conservation of energy?",
      options: [
        "Energy cannot be created or destroyed, only transformed",
        "Force equals mass times acceleration",
        "Energy increases with velocity squared",
        "Heat always flows from cold to hot objects",
      ],
      correct: 0,
    },
    {
      id: 2,
      question:
        "Which of the following is NOT a characteristic of mitosis?",
      options: [
        "DNA replication",
        "Chromosome condensation",
        "Reduction in chromosome number",
        "Formation of spindle fibers",
      ],
      correct: 2,
    },
    {
      id: 3,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
      correct: 1,
    },
  ];

  const flashcards = [
    {
      id: 1,
      front:
        "Define the process of cellular respiration",
      back: "The metabolic process by which cells convert nutrients into ATP, carbon dioxide, and water",
    },
    {
      id: 2,
      front:
        "What is Newton's Second Law of Motion?",
      back: "Force equals mass times acceleration (F = ma)",
    },
    {
      id: 3,
      front:
        "Explain the concept of supply and demand",
      back: "Economic model describing how the price of a good is determined by the relationship between availability (supply) and desire for the good (demand)",
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "AlexTheGreat",
      level: 12,
      xp: 8750,
      avatar: "👨‍🎓",
    },
    {
      rank: 2,
      name: "StudyQueen",
      level: 11,
      xp: 8340,
      avatar: "👩‍🔬",
    },
    {
      rank: 3,
      name: "BrainiacJ",
      level: 10,
      xp: 7820,
      avatar: "🧠",
    },
    {
      rank: 4,
      name: "PhysicsWiz",
      level: 10,
      xp: 7650,
      avatar: "⚛️",
    },
    {
      rank: 5,
      name: "MathMaster",
      level: 9,
      xp: 7200,
      avatar: "🔢",
    },
  ];

  const ranks = [
    { level: 1, title: "Beginner Scholar" },
    { level: 5, title: "Knowledge Seeker" },
    { level: 10, title: "Academic Adept" },
    { level: 15, title: "Wisdom Weaver" },
    { level: 20, title: "Learning Legend" },
    { level: 25, title: "Genius" },
  ];

  // Tab content rendering functions
  const renderStudyTools = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div
          className={`cursor-pointer p-4 rounded-lg border ${currentTool === "quiz-generator"
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200"
            }`}
          onClick={() =>
            setCurrentTool("quiz-generator")
          }
        >
          <div className="pb-2">
            <div className="text-lg flex items-center">
              <Brain className="mr-2 text-indigo-600" size={20} />{" "}
              Quiz Generator
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Create intelligent quizzes from your
              notes
            </p>
          </div>
        </div>

        <div
          className={`cursor-pointer p-4 rounded-lg border ${currentTool === "flashcards"
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200"
            }`}
          onClick={() =>
            setCurrentTool("flashcards")
          }
        >
          <div className="pb-2">
            <div className="text-lg flex items-center">
              <BookOpen
                className="mr-2 text-indigo-600"
                size={20}
              />{" "}
              Flashcards
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Spaced repetition learning system
            </p>
          </div>
        </div>

        <div
          className={`cursor-pointer p-4 rounded-lg border ${currentTool === "learning-analytics"
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200"
            }`}
          onClick={() =>
            setCurrentTool("learning-analytics")
          }
        >
          <div className="pb-2">
            <div className="text-lg flex items-center">
              <Trophy
                className="mr-2 text-indigo-600"
                size={20}
              />{" "}
              Learning Analytics
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Track progress and identify weak
              areas
            </p>
          </div>
        </div>
      </div>

      {currentTool === "quiz-generator" && (
        <div className="rounded-lg border bg-white shadow-sm p-6">
          <div className="flex flex-col space-y-1.5 mb-4">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              Physics Concepts Quiz
            </div>
            <div className="text-sm text-gray-500">
              Generated from your Physics notes
              collection
            </div>
          </div>
          <div className="space-y-4">
            {quizQuestions.map((q, index) => (
              <div
                key={q.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mr-2 mt-1 bg-indigo-100 text-indigo-700 border-indigo-200">
                    Q{index + 1}
                  </div>
                  <h3 className="font-medium">
                    {q.question}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2 pl-8">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${i === q.correct
                          ? "bg-green-100 border-green-500 text-green-600"
                          : "border-gray-300"
                          }`}
                      >
                        {i === q.correct && (
                          <Check size={12} />
                        )}
                      </div>
                      <span
                        className={
                          i === q.correct
                            ? "text-green-700"
                            : ""
                        }
                      >
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50">
                Save Quiz
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                Generate New Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {currentTool === "flashcards" && (
        <div className="border rounded-lg shadow bg-white">
          <div className="p-6 space-y-1.5">
            <h3 className="text-xl font-semibold">
              Spaced Repetition Flashcards
            </h3>
            <p className="text-sm text-gray-500">
              Study key concepts effectively with
              AI-scheduled reviews
            </p>
          </div>
          <div className="p-6 space-y-4">
            {!showFlashcard ? (
              <>
                <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                  <Clock className="text-indigo-500 mr-2" />
                  <div>
                    <h3 className="font-medium">
                      Today's review session
                    </h3>
                    <p className="text-sm text-gray-600">
                      12 cards due for review
                      (estimated 15 minutes)
                    </p>
                  </div>
                  <button
                    className="ml-auto bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md cursor-pointer"
                    onClick={() =>
                      setShowFlashcard(true)
                    }
                  >
                    Start Review
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">
                    Recently Created
                  </h3>
                  {flashcards.map((card) => (
                    <div
                      key={card.id}
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {card.front}
                        </p>
                        <p className="text-sm text-gray-500">
                          Added 2 days ago
                        </p>
                      </div>
                      <button className="border bg-white hover:bg-gray-50 px-3 py-1 rounded-md text-sm">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button className="border bg-white hover:bg-gray-50 px-4 py-2 rounded-md">
                    Import From Notes
                  </button>
                  <button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md">
                    Create New Flashcard
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className={`w-full h-64 border rounded-lg shadow-md p-6 mb-4 flex items-center justify-center cursor-pointer transition-all duration-300 ${flashcardFlipped
                    ? "bg-indigo-50"
                    : "bg-white"
                    }`}
                  onClick={() =>
                    setFlashcardFlipped(
                      !flashcardFlipped
                    )
                  }
                >
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      {!flashcardFlipped
                        ? flashcards[0].front
                        : flashcards[0].back}
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                      {!flashcardFlipped
                        ? "Click to reveal answer"
                        : "Showing answer"}
                    </p>
                  </div>
                </div>

                {flashcardFlipped && (
                  <div className="grid grid-cols-4 gap-3 w-full">
                    <button className="border-red-300 text-red-600 hover:bg-red-50 border bg-white px-4 py-2 rounded-md text-center">
                      Again
                    </button>
                    <button className="border-orange-300 text-orange-600 hover:bg-orange-50 border bg-white px-4 py-2 rounded-md text-center">
                      Hard
                    </button>
                    <button className="border-green-300 text-green-600 hover:bg-green-50 border bg-white px-4 py-2 rounded-md text-center">
                      Good
                    </button>
                    <button className="border-blue-300 text-blue-600 hover:bg-blue-50 border bg-white px-4 py-2 rounded-md text-center">
                      Easy
                    </button>
                  </div>
                )}

                <div className="w-full flex justify-between mt-6">
                  <button
                    className="border bg-white hover:bg-gray-50 px-4 py-2 rounded-md"
                    onClick={() => {
                      setShowFlashcard(false);
                      setFlashcardFlipped(false);
                    }}
                  >
                    End Session
                  </button>
                  <div className="flex items-center text-sm text-gray-500">
                    <p>Card 1 of 12</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentTool === "learning-analytics" && (
        <div className="border rounded-lg shadow bg-white p-6">
          <div className="mb-4">
            <div className="text-xl font-semibold">Learning Analytics</div>
            <div className="text-sm text-gray-500">
              Identify strengths and weaknesses in
              your learning
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">
                Knowledge Mastery by Subject
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Physics</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mathematics</span>
                    <span>83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "83%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Biology</span>
                    <span>64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "64%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                Areas Needing Focus
              </h3>
              <div className="space-y-2">
                {userProgress.weakAreas.map(
                  (area, i) => (
                    <div
                      key={i}
                      className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <AlertCircle
                          className="text-orange-500 mr-2"
                          size={18}
                        />
                        <div>
                          <p className="font-medium">
                            {area.subject}{" "}
                            {area.topic}
                          </p>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div
                                className="bg-orange-500 h-1.5 rounded-full"
                                style={{ width: `${area.masteryLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">
                              {area.masteryLevel}%
                              mastery
                            </span>
                          </div>
                        </div>
                        <button className="ml-auto px-3 py-1 text-xs border border-orange-300 text-orange-600 rounded-md bg-white hover:bg-orange-50">
                          Focus Training
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg">
                <h3 className="font-medium p-3 border-b">
                  Study Habits
                </h3>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Best Time
                      </p>
                      <p className="font-medium">
                        Mornings
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Avg. Session
                      </p>
                      <p className="font-medium">
                        42 min
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Weekly Goal
                      </p>
                      <p className="font-medium">
                        85%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Consistency
                      </p>
                      <p className="font-medium">
                        Very Good
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <h3 className="font-medium p-3 border-b">
                  Flashcard Performance
                </h3>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Cards Active
                      </p>
                      <p className="font-medium">
                        246
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Success Rate
                      </p>
                      <p className="font-medium">
                        76%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Due Today
                      </p>
                      <p className="font-medium">
                        12
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Mature Cards
                      </p>
                      <p className="font-medium">
                        142
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGamification = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg shadow bg-white">
          <div className="p-4 border-b">
            <div className="text-lg flex items-center">
              <Star className="mr-2 text-indigo-600" size={20} />{" "}
              XP & Level
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold mb-2">
                {userProgress.level}
              </div>
              <h3 className="font-medium">
                {userProgress.title}
              </h3>
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {userProgress.xp} XP
                  </span>
                  <span>
                    {userProgress.xpToNextLevel}{" "}
                    XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(userProgress.xp / userProgress.xpToNextLevel) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {userProgress.xpToNextLevel -
                  userProgress.xp}{" "}
                XP to level{" "}
                {userProgress.level + 1}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg shadow bg-white">
          <div className="p-4 border-b">
            <div className="text-lg flex items-center">
              <Trophy
                className="mr-2 text-indigo-600"
                size={20}
              />{" "}
              Rank
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                Rank #{userProgress.rank}
              </div>
              <p className="text-sm">
                Top 5% of all users
              </p>

              <div className="w-full mt-4 space-y-2">
                {ranks.map((rank, i) => (
                  <div
                    key={i}
                    className={`flex items-center ${rank.level <=
                      userProgress.level
                      ? "text-indigo-600"
                      : "text-gray-400"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 ${rank.level <=
                        userProgress.level
                        ? "bg-indigo-100"
                        : "bg-gray-100"
                        }`}
                    >
                      {rank.level <=
                        userProgress.level ? (
                        <Check size={12} />
                      ) : null}
                    </div>
                    <span className="text-sm">
                      {rank.title} (Level{" "}
                      {rank.level})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg shadow bg-white">
          <div className="p-4 border-b">
            <div className="text-lg flex items-center">
              <ArrowUp
                className="mr-2 text-indigo-600"
                size={20}
              />{" "}
              Streaks & Goals
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center">
              <div className="text-center mb-3">
                <h3 className="text-2xl font-bold text-orange-500">
                  {userProgress.studyStreak} days
                </h3>
                <p className="text-sm">
                  Current study streak
                </p>
              </div>

              <div className="w-full mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Today's goal</span>
                  <span>
                    {userProgress.dailyGoal}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${userProgress.dailyGoal}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-1 w-full">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded ${i < 5
                      ? "bg-green-400"
                      : "bg-gray-200"
                      }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last 7 days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg shadow bg-white">
          <div className="p-4 border-b">
            <div className="text-lg font-medium">Leaderboard</div>
            <div className="text-sm text-gray-500">
              How you compare to other students
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div
                  key={i}
                  className={`flex items-center p-2 rounded-md ${i === 2
                    ? "bg-indigo-50 border border-indigo-200"
                    : ""
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                        ? "bg-gray-100 text-gray-700"
                        : i === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {user.name}
                      </span>
                      <span className="text-sm">
                        {user.xp.toLocaleString()}{" "}
                        XP
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Level {user.level}
                      </span>
                      <span>#{user.rank}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center p-2 rounded-md bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3">
                  👨‍🎓
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      You
                    </span>
                    <span className="text-sm">
                      {userProgress.xp.toLocaleString()}{" "}
                      XP
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Level {userProgress.level}
                    </span>
                    <span>
                      #{userProgress.rank}
                    </span>
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
    
  export default StudyTools;
