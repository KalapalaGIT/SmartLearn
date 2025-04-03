import React from "react";
import NotesContainer from "./components/NotesContainer";

const Notes = () => {
  // Server component that renders the client-side NotesContainer
  // In a real app, we would fetch data here and pass it to the NotesContainer
  return <NotesContainer />;
};

export default Notes;
