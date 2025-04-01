import React from 'react'

const Notes = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Documents</a>
          </li>
          <li>Add Document</li>
        </ul>
      </div>
      {/* Folders */}
      <div className="flex space-x-5">
        <div className="section">
          <h1 className="sectionHeader">
            Courses
          </h1>
          <ul>
            <li>Course 1</li>
            <li>Course 2</li>
            <li>Course 3</li>
          </ul>
          <button className="btn btn-primary">
            Add new
          </button>
        </div>
        <div className="section">
          <h1 className="sectionHeader">
            Collections
          </h1>
          <ul>
            <li>Collection 1</li>
            <li>Collection 2</li>
            <li>Collection 3</li>
          </ul>
          <button className="btn btn-primary">
            Add new
          </button>
        </div>
        <div className="section">
          <h1 className="sectionHeader">
            Notes
          </h1>
          <ul>
            <li>Note 1</li>
            <li>Note 2</li>
            <li>Note 3</li>
          </ul>
          <button className="btn btn-primary">
            Add new
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notes