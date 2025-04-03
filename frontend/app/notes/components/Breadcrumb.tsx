"use client";

import React from "react";
import {
  Course,
  Collection,
  Note,
} from "../data/mockData";

interface BreadcrumbProps {
  selectedCourse: Course | null;
  selectedCollection: Collection | null;
  selectedNote: Note | null;
  resetToHome: () => void;
  resetToCourse: () => void;
  resetToCollection: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  selectedCourse,
  selectedCollection,
  selectedNote,
  resetToHome,
  resetToCourse,
  resetToCollection,
}) => {
  return (
    <div className="breadcrumbs text-sm mb-4">
      <ul>
        <li>
          <a
            onClick={resetToHome}
            className="cursor-pointer"
          >
            Courses
          </a>
        </li>
        {selectedCourse && (
          <li>
            <a
              onClick={resetToCourse}
              className="cursor-pointer"
            >
              {selectedCourse.name}
            </a>
          </li>
        )}
        {selectedCollection && (
          <li>
            <a
              onClick={resetToCollection}
              className="cursor-pointer"
            >
              {selectedCollection.name}
            </a>
          </li>
        )}
        {selectedNote && (
          <li>{selectedNote.title}</li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;
