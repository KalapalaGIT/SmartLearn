// StudyTools.jsx
import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Award,
  Trophy,
  Calendar,
  FileText,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";
import {
  getLevelTitle,
  calculateXPForNextLevel,
  calculateProgressPercentage,
  ranks,
} from "../utils/levelSystem";
import SpacedRepetition from "../components/study-tools/SpacedRepetition";
import QuizGenerator from "../components/study-tools/QuizGenerator";
import Flashcards from "../components/study-tools/Flashcards";

const StudyTools: React.FC = () => {
  const [currentTool, setCurrentTool] = useState(
    "quiz-generator"
  );
  const [showFlashcard, setShowFlashcard] =
    useState(false);
  const [flashcardFlipped, setFlashcardFlipped] =
    useState(false);

  // Add section toggle states
  const [expandedSections, setExpandedSections] =
    useState({
      todaysReviews: true,
      blocks: Array(5).fill(false),
    });

  // Toggle section handler
  const toggleSection = (
    section: "todaysReviews" | number
  ) => {
    if (typeof section === "number") {
      setExpandedSections((prev) => ({
        ...prev,
        blocks: prev.blocks.map((expanded, i) =>
          i === section ? !expanded : expanded
        ),
      }));
    } else {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  // Add block color mapping
  const getBlockColor = (blockIndex: number) => {
    const colors = {
      bg: [
        "bg-blue-50",
        "bg-purple-50",
        "bg-pink-50",
        "bg-orange-50",
        "bg-green-50",
      ],
      text: [
        "text-blue-600",
        "text-purple-600",
        "text-pink-600",
        "text-orange-600",
        "text-green-600",
      ],
      border: [
        "border-blue-200",
        "border-purple-200",
        "border-pink-200",
        "border-orange-200",
        "border-green-200",
      ],
      light: [
        "bg-blue-100",
        "bg-purple-100",
        "bg-pink-100",
        "bg-orange-100",
        "bg-green-100",
      ],
    };
    return {
      bg: colors.bg[blockIndex],
      text: colors.text[blockIndex],
      border: colors.border[blockIndex],
      light: colors.light[blockIndex],
    };
  };

  // Add spaced repetition dummy data
  const spacedRepetitionData = {
    todaysDate: new Date(),
    blocks: [
      {
        id: 1,
        name: "Block 1",
        interval: 1,
        items: [
          {
            id: 1,
            topic: "Physics - Newton's Laws",
            lastReviewed: "2024-03-17", // 2 days ago - late for daily review
            confidence: "medium",
            status: "due",
            notes:
              "Focus on Third Law applications",
          },
          {
            id: 2,
            topic: "Math - Derivatives",
            lastReviewed: "2024-03-19", // today
            confidence: "high",
            status: "due",
            notes: "Chain rule examples",
          },
          {
            id: 3,
            topic: "Chemistry - Atomic Structure",
            lastReviewed: "2024-03-19", // reviewed today
            confidence: "high",
            status: "completed",
            notes: "Electron configuration",
          },
        ],
      },
      {
        id: 2,
        name: "Block 2",
        interval: 2,
        items: [
          {
            id: 4,
            topic: "Biology - Cell Structure",
            lastReviewed: "2024-03-16", // 3 days ago - late
            confidence: "high",
            status: "due",
            notes: "Organelle functions",
          },
          {
            id: 5,
            topic: "Literature - Shakespeare",
            lastReviewed: "2024-03-18", // 1 day ago - on schedule
            confidence: "medium",
            status: "upcoming",
            notes: "Macbeth themes",
          },
        ],
      },
      {
        id: 3,
        name: "Block 3",
        interval: 4,
        items: [
          {
            id: 6,
            topic: "Chemistry - Periodic Table",
            lastReviewed: "2024-03-14", // 5 days ago - late
            confidence: "medium",
            status: "due",
            notes:
              "Element groups and properties",
          },
          {
            id: 7,
            topic: "Physics - Wave Motion",
            lastReviewed: "2024-03-17", // 2 days ago - on schedule
            confidence: "low",
            status: "upcoming",
            notes: "Wave interference patterns",
          },
        ],
      },
      {
        id: 4,
        name: "Block 4",
        interval: 8,
        items: [
          {
            id: 8,
            topic: "Math - Integration",
            lastReviewed: "2024-03-10", // 9 days ago - late
            confidence: "medium",
            status: "due",
            notes: "Integration by parts",
          },
          {
            id: 9,
            topic: "History - World War II",
            lastReviewed: "2024-03-15", // 4 days ago - on schedule
            confidence: "high",
            status: "upcoming",
            notes: "Pacific theater events",
          },
        ],
      },
      {
        id: 5,
        name: "Block 5",
        interval: 16,
        items: [
          {
            id: 10,
            topic: "Biology - Evolution",
            lastReviewed: "2024-03-01", // 18 days ago - late
            confidence: "high",
            status: "due",
            notes: "Natural selection principles",
          },
          {
            id: 11,
            topic:
              "Computer Science - Algorithms",
            lastReviewed: "2024-03-08", // 11 days ago - on schedule
            confidence: "medium",
            status: "upcoming",
            notes:
              "Sorting algorithms complexity",
          },
        ],
      },
    ],
    stats: {
      totalItems: 11,
      dueToday: 6,
      completedToday: 1,
      streakDays: 8,
    },
  };

  // Dummy data
  const userProgress = {
    level: 7,
    xp: 3240,
    xpToNextLevel: calculateXPForNextLevel(7),
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

  const levelTitle = getLevelTitle(
    userProgress.level
  );
  const progressPercentage =
    calculateProgressPercentage(
      userProgress.xp,
      userProgress.xpToNextLevel
    );

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

  // Add helper function to calculate days since last review
  const getDaysSinceReview = (
    lastReviewDate: string
  ) => {
    const today = new Date();
    const lastReview = new Date(lastReviewDate);
    const diffTime = Math.abs(
      today.getTime() - lastReview.getTime()
    );
    return Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );
  };

  // Add helper function to check if review is late
  const isReviewLate = (
    lastReviewDate: string,
    interval: number
  ) => {
    const daysSince = getDaysSinceReview(
      lastReviewDate
    );
    return daysSince > interval;
  };

  // Tab content rendering functions
  const renderStudyTools = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Add Spaced Repetition Tool Card */}
        <div
          className={`cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow ${
            currentTool === "spaced-repetition"
              ? "border-2 border-indigo-500"
              : "border border-gray-200"
          }`}
          onClick={() =>
            setCurrentTool("spaced-repetition")
          }
        >
          <div className="pb-2">
            <div className="text-lg flex items-center">
              <RefreshCw
                className="mr-2 text-indigo-600"
                size={20}
              />
              Spaced Repetition
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Systematic review schedule
            </p>
          </div>
        </div>

        <div
          className={`cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow ${
            currentTool === "quiz-generator"
              ? "border-2 border-indigo-500"
              : "border border-gray-200"
          }`}
          onClick={() =>
            setCurrentTool("quiz-generator")
          }
        >
          <div className="pb-2">
            <div className="text-lg flex items-center">
              <Brain
                className="mr-2 text-indigo-600"
                size={20}
              />
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
          className={`cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow ${
            currentTool === "flashcards"
              ? "border-2 border-indigo-500"
              : "border border-gray-200"
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
              />
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
          className={`cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow ${
            currentTool === "learning-analytics"
              ? "border-2 border-indigo-500"
              : "border border-gray-200"
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
              />
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

      {currentTool === "spaced-repetition" && (
        <SpacedRepetition
          spacedRepetitionData={
            spacedRepetitionData
          }
          getBlockColor={getBlockColor}
          getDaysSinceReview={getDaysSinceReview}
          isReviewLate={isReviewLate}
        />
      )}

      {currentTool === "quiz-generator" && (
        <QuizGenerator
          quizQuestions={quizQuestions}
        />
      )}

      {currentTool === "flashcards" && (
        <Flashcards flashcards={flashcards} />
      )}

      {currentTool === "learning-analytics" && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4">
            <div className="text-xl font-semibold">
              Learning Analytics
            </div>
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
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mathematics</span>
                    <span>83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "83%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Biology</span>
                    <span>64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: "64%" }}
                    ></div>
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
                                style={{
                                  width: `${area.masteryLevel}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs">
                              {area.masteryLevel}%
                              mastery
                            </span>
                          </div>
                        </div>
                        <button className="ml-auto px-3 py-1 text-xs border border-orange-300 text-orange-600 rounded-lg bg-white hover:bg-orange-50 transition-colors">
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

            {/* Gamification Content */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold mb-2">
                  {userProgress.level}
                </div>
                <h3 className="font-medium">
                  {levelTitle}
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
                      style={{
                        width: `${progressPercentage}%`,
                      }}
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

            <div className="bg-white rounded-xl shadow p-6">
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
                      className={`flex items-center ${
                        rank.level <=
                        userProgress.level
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                          rank.level <=
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

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col items-center">
                <div className="text-center mb-3">
                  <h3 className="text-2xl font-bold text-orange-500">
                    {userProgress.studyStreak}{" "}
                    days
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
                      style={{
                        width: `${userProgress.dailyGoal}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1 w-full">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 rounded ${
                        i < 5
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

            <div className="bg-white rounded-xl shadow p-6">
              <div className="space-y-2">
                {leaderboard.map((user, i) => (
                  <div
                    key={i}
                    className={`flex items-center p-2 rounded-lg ${
                      i === 2
                        ? "bg-indigo-50 border border-indigo-200"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        i === 0
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

                <div className="mt-4 flex items-center p-2 rounded-lg bg-gray-50">
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
      )}
    </div>
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
            <BookOpen
              className="mr-2"
              size={24}
            />
            Study Tools
          </h2>

          <div className="space-y-6">
            {renderStudyTools()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTools;
