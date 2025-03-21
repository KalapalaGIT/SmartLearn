import React, { useState } from "react";
import { Clock } from "lucide-react";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardsProps {
  flashcards: Flashcard[];
}

const Flashcards: React.FC<FlashcardsProps> = ({
  flashcards,
}) => {
  const [showFlashcard, setShowFlashcard] =
    useState(false);
  const [flashcardFlipped, setFlashcardFlipped] =
    useState(false);

  return (
    <div className="bg-white rounded-xl shadow">
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
                className="ml-auto bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
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
                  className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {card.front}
                    </p>
                    <p className="text-sm text-gray-500">
                      Added 2 days ago
                    </p>
                  </div>
                  <button className="border bg-white hover:bg-gray-50 px-3 py-1 rounded-lg text-sm transition-colors">
                    Edit
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button className="border bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                Import From Notes
              </button>
              <button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                Create New Flashcard
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`w-full h-64 border rounded-lg shadow-md p-6 mb-4 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                flashcardFlipped
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
                <button className="border-red-300 text-red-600 hover:bg-red-50 border bg-white px-4 py-2 rounded-lg text-center transition-colors">
                  Again
                </button>
                <button className="border-orange-300 text-orange-600 hover:bg-orange-50 border bg-white px-4 py-2 rounded-lg text-center transition-colors">
                  Hard
                </button>
                <button className="border-green-300 text-green-600 hover:bg-green-50 border bg-white px-4 py-2 rounded-lg text-center transition-colors">
                  Good
                </button>
                <button className="border-blue-300 text-blue-600 hover:bg-blue-50 border bg-white px-4 py-2 rounded-lg text-center transition-colors">
                  Easy
                </button>
              </div>
            )}

            <div className="w-full flex justify-between mt-6">
              <button
                className="border bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
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
  );
};

export default Flashcards;
