"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { Course } from "../data/mockData";

interface CoursesListProps {
  courses: Course[];
  selectedCourse: Course | null;
  onCourseSelect: (course: Course) => void;
  onAddCourse: (name: string) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  selectedCourse,
  onCourseSelect,
  onAddCourse,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCourseName, setNewCourseName] =
    useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when isAdding becomes true
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddCourse = () => {
    if (newCourseName.trim()) {
      onAddCourse(newCourseName.trim());
      setNewCourseName("");
      setIsAdding(false);
    } else if (isAdding) {
      // If empty and cancel adding
      setIsAdding(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter") {
      handleAddCourse();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewCourseName("");
    }
  };

  const startAddingCourse = () => {
    setIsAdding(true);
  };

  return (
    <div className="section">
      <h1 className="sectionHeader">Courses</h1>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course.id}
            onClick={() => onCourseSelect(course)}
            className={`cursor-pointer p-2 rounded hover:bg-base-300 ${
              selectedCourse?.id === course.id
                ? "bg-base-300"
                : ""
            }`}
          >
            {course.name}
          </li>
        ))}

        {/* New course input field that appears in the list */}
        {isAdding && (
          <li className="p-2 rounded bg-base-200">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter course name"
              className="input input-bordered input-sm w-full"
              value={newCourseName}
              onChange={(e) =>
                setNewCourseName(e.target.value)
              }
              onKeyDown={handleKeyDown}
              onBlur={handleAddCourse}
            />
          </li>
        )}
      </ul>

      <button
        className="btn btn-primary w-full mt-4"
        onClick={startAddingCourse}
        disabled={isAdding}
      >
        Add new course
      </button>
    </div>
  );
};

export default CoursesList;
