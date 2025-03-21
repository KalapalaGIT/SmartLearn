import React, { useState } from "react";
import {
  Clock,
  ChevronRight,
} from "lucide-react";

interface SpacedRepetitionProps {
  spacedRepetitionData: any;
  getBlockColor: (blockIndex: number) => any;
  getDaysSinceReview: (
    lastReviewDate: string
  ) => number;
  isReviewLate: (
    lastReviewDate: string,
    interval: number
  ) => boolean;
}

const SpacedRepetition: React.FC<
  SpacedRepetitionProps
> = ({
  spacedRepetitionData,
  getBlockColor,
  getDaysSinceReview,
  isReviewLate,
}) => {
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
        blocks: prev.blocks.map(
          (expanded: boolean, i: number) =>
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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Spaced Repetition System
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {
                  spacedRepetitionData.stats
                    .dueToday
                }
              </p>
              <p className="text-sm text-gray-500">
                Due Today
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {
                  spacedRepetitionData.stats
                    .completedToday
                }
              </p>
              <p className="text-sm text-gray-500">
                Completed
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {
                  spacedRepetitionData.stats
                    .streakDays
                }
              </p>
              <p className="text-sm text-gray-500">
                Day Streak
              </p>
            </div>
          </div>
        </div>

        {/* Today's Review List - Toggleable */}
        <div className="mb-8">
          <button
            onClick={() =>
              toggleSection("todaysReviews")
            }
            className="w-full flex items-center justify-between text-lg font-medium mb-4 hover:text-indigo-600 transition-colors"
          >
            <span className="flex items-center">
              <Clock className="mr-2" size={20} />
              Today's Reviews
              <span className="ml-2 px-2 py-0.5 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                {
                  spacedRepetitionData.blocks
                    .flatMap(
                      (block: any) => block.items
                    )
                    .filter(
                      (item: any) =>
                        item.status === "due"
                    ).length
                }
              </span>
            </span>
            <ChevronRight
              className={`transform transition-transform ${
                expandedSections.todaysReviews
                  ? "rotate-90"
                  : ""
              }`}
              size={20}
            />
          </button>
          {expandedSections.todaysReviews && (
            <div className="space-y-3">
              {spacedRepetitionData.blocks.flatMap(
                (
                  block: any,
                  blockIndex: number
                ) =>
                  block.items
                    .filter(
                      (item: any) =>
                        item.status === "due"
                    )
                    .map((item: any) => {
                      const daysSinceReview =
                        getDaysSinceReview(
                          item.lastReviewed
                        );
                      const isLate = isReviewLate(
                        item.lastReviewed,
                        block.interval
                      );
                      const blockColor =
                        getBlockColor(blockIndex);

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-2 h-12 rounded-full ${
                                item.confidence ===
                                "high"
                                  ? "bg-green-400"
                                  : item.confidence ===
                                    "medium"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {item.topic}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${blockColor.bg} ${blockColor.text} border ${blockColor.border}`}
                                >
                                  {block.name}
                                </span>
                                {isLate && (
                                  <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded-full">
                                    Late
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-gray-500">
                                  {item.notes}
                                </p>
                                <span className="text-xs text-gray-400">
                                  •
                                </span>
                                <p className="text-sm text-gray-500">
                                  Last reviewed:{" "}
                                  {
                                    daysSinceReview
                                  }{" "}
                                  day
                                  {daysSinceReview !==
                                  1
                                    ? "s"
                                    : ""}{" "}
                                  ago
                                </p>
                                <span className="text-xs text-gray-400">
                                  •
                                </span>
                                <p className="text-sm text-gray-500">
                                  Review interval:{" "}
                                  {block.interval}{" "}
                                  day
                                  {block.interval !==
                                  1
                                    ? "s"
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Review Now
                          </button>
                        </div>
                      );
                    })
              )}
            </div>
          )}
        </div>

        {/* Spaced Repetition Blocks - Toggleable */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            Review Blocks
          </h3>
          <div className="space-y-4">
            {spacedRepetitionData.blocks.map(
              (
                block: any,
                blockIndex: number
              ) => {
                const blockColor =
                  getBlockColor(blockIndex);
                return (
                  <div
                    key={block.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        toggleSection(blockIndex)
                      }
                      className={`w-full p-4 flex justify-between items-center border-b hover:bg-opacity-80 transition-colors ${blockColor.bg}`}
                    >
                      <div>
                        <h4
                          className={`font-medium flex items-center ${blockColor.text}`}
                        >
                          {block.name}
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${blockColor.light} ${blockColor.text}`}
                          >
                            {
                              block.items.filter(
                                (item: any) =>
                                  item.status ===
                                  "due"
                              ).length
                            }{" "}
                            due
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500">
                          Review every{" "}
                          {block.interval} day
                          {block.interval > 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm mr-2 ${blockColor.light} ${blockColor.text}`}
                        >
                          {block.items.length}{" "}
                          items
                        </span>
                        <ChevronRight
                          className={`transform transition-transform ${
                            expandedSections
                              .blocks[blockIndex]
                              ? "rotate-90"
                              : ""
                          }`}
                          size={20}
                        />
                      </div>
                    </button>
                    {expandedSections.blocks[
                      blockIndex
                    ] && (
                      <div className="divide-y">
                        {block.items.map(
                          (item: any) => (
                            <div
                              key={item.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                              <div>
                                <div className="flex items-center">
                                  <span
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      item.confidence ===
                                      "high"
                                        ? "bg-green-400"
                                        : item.confidence ===
                                          "medium"
                                        ? "bg-yellow-400"
                                        : "bg-red-400"
                                    }`}
                                  />
                                  <h5 className="font-medium">
                                    {item.topic}
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  Last reviewed:{" "}
                                  {
                                    item.lastReviewed
                                  }
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    item.status ===
                                    "due"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {item.status ===
                                  "due"
                                    ? "Due"
                                    : "Upcoming"}
                                </span>
                                {item.status ===
                                  "due" && (
                                  <button className="px-3 py-1 text-sm border border-indigo-300 text-indigo-600 rounded hover:bg-indigo-50 transition-colors">
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        )}
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
  );
};

export default SpacedRepetition;
