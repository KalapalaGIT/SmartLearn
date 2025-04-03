"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { Note } from "../data/mockData";

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onAddNote?: (title: string) => void; // Optional for future implementation
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNote,
  onNoteSelect,
  onAddNote,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteTitle, setNewNoteTitle] =
    useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when isAdding becomes true
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddNote = () => {
    if (newNoteTitle.trim() && onAddNote) {
      onAddNote(newNoteTitle.trim());
      setNewNoteTitle("");
      setIsAdding(false);
    } else {
      // If empty or no handler, cancel adding
      setIsAdding(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter") {
      handleAddNote();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewNoteTitle("");
    }
  };

  const startAddingNote = () => {
    setIsAdding(true);
  };

  return (
    <div className="section">
      <h1 className="sectionHeader">Notes</h1>

      {notes.length === 0 && !isAdding ? (
        <div className="p-4 text-center text-gray-500">
          <p>No notes yet.</p>
          <p className="text-sm">
            Add a new note to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className={`cursor-pointer p-2 rounded hover:bg-base-300 ${
                selectedNote?.id === note.id
                  ? "bg-base-300"
                  : ""
              }`}
            >
              {note.title}
            </li>
          ))}

          {/* New note input field that appears in the list */}
          {isAdding && (
            <li className="p-2 rounded bg-base-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter note title"
                className="input input-bordered input-sm w-full"
                value={newNoteTitle}
                onChange={(e) =>
                  setNewNoteTitle(e.target.value)
                }
                onKeyDown={handleKeyDown}
                onBlur={handleAddNote}
              />
            </li>
          )}
        </ul>
      )}

      <button
        className="btn btn-primary mt-4 w-full"
        onClick={startAddingNote}
        disabled={isAdding}
      >
        Add new note
      </button>
    </div>
  );
};

export default NotesList;
