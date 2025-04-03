"use client";

import React, { useState } from "react";
import {
  mockCourses,
  Course,
  Collection,
  Note,
} from "../data/mockData";
import Breadcrumb from "./Breadcrumb";
import CoursesList from "./CoursesList";
import CollectionsList from "./CollectionsList";
import NotesList from "./NotesList";
import NotesEditor from "./NotesEditor";

const NotesContainer = () => {
  // State for courses and selected items
  const [courses, setCourses] =
    useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<Collection | null>(null);
  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

  // Handle course selection
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setSelectedCollection(null);
    setSelectedNote(null);
  };

  // Handle collection selection
  const handleCollectionClick = (
    collection: Collection
  ) => {
    setSelectedCollection(collection);
    setSelectedNote(null);
  };

  // Handle note selection
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  // Handle adding a new course
  const handleAddCourse = (name: string) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId =
      Math.max(0, ...courses.map((c) => c.id)) +
      1;

    // Create a new course with empty collections
    const newCourse: Course = {
      id: newId,
      name: name,
      collections: [],
    };

    // Add the new course to the courses array
    const updatedCourses = [
      ...courses,
      newCourse,
    ];
    setCourses(updatedCourses);

    // Select the newly created course
    setSelectedCourse(newCourse);
    setSelectedCollection(null);
    setSelectedNote(null);
  };

  // Handle adding a new collection
  const handleAddCollection = (name: string) => {
    if (!selectedCourse) return;

    // Generate a new ID
    const newId =
      Math.max(
        0,
        ...selectedCourse.collections.map(
          (c) => c.id
        )
      ) + 1;

    // Create a new collection with empty notes
    const newCollection: Collection = {
      id: newId,
      name: name,
      notes: [],
    };

    // Add the new collection to the selected course
    const updatedCourse = {
      ...selectedCourse,
      collections: [
        ...selectedCourse.collections,
        newCollection,
      ],
    };

    // Update the courses array
    const updatedCourses = courses.map((course) =>
      course.id === selectedCourse.id
        ? updatedCourse
        : course
    );

    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);
    setSelectedCollection(newCollection);
    setSelectedNote(null);
  };

  // Handle adding a new note
  const handleAddNote = (title: string) => {
    if (!selectedCourse || !selectedCollection)
      return;

    // Generate a new ID
    const newId =
      Math.max(
        0,
        ...selectedCollection.notes.map(
          (n) => n.id
        )
      ) + 1;

    // Create a new note
    const newNote: Note = {
      id: newId,
      title: title,
    };

    // Add the new note to the selected collection
    const updatedCollection = {
      ...selectedCollection,
      notes: [
        ...selectedCollection.notes,
        newNote,
      ],
    };

    // Update the selected course with the updated collection
    const updatedCourse = {
      ...selectedCourse,
      collections: selectedCourse.collections.map(
        (collection) =>
          collection.id === selectedCollection.id
            ? updatedCollection
            : collection
      ),
    };

    // Update the courses array
    const updatedCourses = courses.map((course) =>
      course.id === selectedCourse.id
        ? updatedCourse
        : course
    );

    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);
    setSelectedCollection(updatedCollection);
    setSelectedNote(newNote);
  };

  // Reset breadcrumb navigation
  const resetToHome = () => {
    setSelectedCourse(null);
    setSelectedCollection(null);
    setSelectedNote(null);
  };

  // Reset to course level
  const resetToCourse = () => {
    setSelectedCollection(null);
    setSelectedNote(null);
  };

  // Reset to collection level
  const resetToCollection = () => {
    setSelectedNote(null);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        selectedCourse={selectedCourse}
        selectedCollection={selectedCollection}
        selectedNote={selectedNote}
        resetToHome={resetToHome}
        resetToCourse={resetToCourse}
        resetToCollection={resetToCollection}
      />

      {/* Folders */}
      <div className="flex space-x-5">
        {/* Courses Section - Always visible */}
        <CoursesList
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseSelect={handleCourseClick}
          onAddCourse={handleAddCourse}
        />

        {/* Collections Section - Visible only when a course is selected */}
        {selectedCourse && (
          <CollectionsList
            collections={
              selectedCourse.collections
            }
            selectedCollection={
              selectedCollection
            }
            onCollectionSelect={
              handleCollectionClick
            }
            onAddCollection={handleAddCollection}
          />
        )}

        {/* Notes Section - Visible only when a collection is selected */}
        {selectedCollection && (
          <NotesList
            notes={selectedCollection.notes}
            selectedNote={selectedNote}
            onNoteSelect={handleNoteClick}
            onAddNote={handleAddNote}
          />
        )}
      </div>

      {/* Text Editor */}
      <NotesEditor
        selectedNote={selectedNote}
        selectedCollectionExists={
          !!selectedCollection
        }
        selectedCourseExists={!!selectedCourse}
      />
    </div>
  );
};

export default NotesContainer;
