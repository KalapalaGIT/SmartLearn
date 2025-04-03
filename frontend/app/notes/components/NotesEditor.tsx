"use client";

import React from "react";
import { Note } from "../data/mockData";

interface NotesEditorProps {
  selectedNote: Note | null;
  selectedCollectionExists: boolean;
  selectedCourseExists: boolean;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  selectedNote,
  selectedCollectionExists,
  selectedCourseExists,
}) => {
  return (
    <div className="section mt-5">
      {selectedNote ? (
        <div>
          <h2 className="text-xl font-bold mb-2">
            {selectedNote.title}
          </h2>
          <p>Note content would go here...</p>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {selectedCollectionExists
            ? "Select a note to view or edit"
            : selectedCourseExists
            ? "Select a collection to view notes"
            : "Select a course to get started"}
        </div>
      )}
    </div>
  );
};

export default NotesEditor;
