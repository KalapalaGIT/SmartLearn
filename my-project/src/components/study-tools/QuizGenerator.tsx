import React, { useState } from "react";
import {
  Check,
  Search,
  Plus,
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  id: string;
  title: string;
  date: string;
  questions: QuizQuestion[];
}

// Dummy data for previous quizzes
const dummyQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Physics Mechanics Quiz",
    date: "2024-03-15",
    questions: [
      {
        id: 1,
        question: "What is Newton's First Law?",
        options: [
          "An object in motion stays in motion",
          "Force equals mass times acceleration",
          "Every action has an equal and opposite reaction",
          "None of the above",
        ],
        correct: 0,
      },
      // ... more questions
    ],
  },
  {
    id: "2",
    title: "Quantum Physics Quiz",
    date: "2024-03-14",
    questions: [
      {
        id: 1,
        question:
          "What is the Heisenberg Uncertainty Principle?",
        options: [
          "Energy equals mass times speed of light squared",
          "Cannot measure position and momentum simultaneously",
          "Light behaves as both wave and particle",
          "Particles can be entangled",
        ],
        correct: 1,
      },
      // ... more questions
    ],
  },
];

interface QuizGeneratorProps {
  quizQuestions: QuizQuestion[];
}

const QuizGenerator: React.FC<
  QuizGeneratorProps
> = ({ quizQuestions }) => {
  const [searchTerm, setSearchTerm] =
    useState("");
  const [selectedQuiz, setSelectedQuiz] =
    useState<Quiz | null>(null);
  const [
    showPreviousQuizzes,
    setShowPreviousQuizzes,
  ] = useState(true);

  const filteredQuizzes = dummyQuizzes.filter(
    (quiz) =>
      quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (showPreviousQuizzes) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            My Quizzes
          </h2>
          <button
            onClick={() =>
              setShowPreviousQuizzes(false)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Create New Quiz
          </button>
        </div>

        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="space-y-3">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => {
                setSelectedQuiz(quiz);
                setShowPreviousQuizzes(false);
              }}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {quiz.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {quiz.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestions = selectedQuiz
    ? selectedQuiz.questions
    : quizQuestions;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col space-y-1.5">
          <div className="text-2xl font-semibold leading-none tracking-tight">
            {selectedQuiz
              ? selectedQuiz.title
              : "Physics Concepts Quiz"}
          </div>
          <div className="text-sm text-gray-500">
            Generated from your Physics notes
            collection
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setShowPreviousQuizzes(true)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
          >
            Back to Quizzes
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Generate New Quiz
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentQuestions.map((q, index) => (
          <div
            key={q.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
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
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      i === q.correct
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
        <div className="flex justify-end">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
            Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
