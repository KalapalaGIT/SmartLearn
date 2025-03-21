import { useState, useEffect } from "react";
import {
  Search,
  FolderPlus,
  Upload,
  MoreHorizontal,
  Star,
  FilePlus,
  Pencil,
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  getLevelTitle,
  calculateXPForNextLevel,
  calculateProgressPercentage,
} from "../utils/levelSystem";
import {
  Collection,
  Note,
  CreateCollectionDto,
  CreateNoteDto,
} from "../types/notes";
import {
  getCollections,
  createCollection,
  deleteCollection,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notesApi";
import RichTextEditor from "../components/RichTextEditor";

const userProgress = {
  level: 12,
  xp: 650,
  xpToNextLevel: calculateXPForNextLevel(12),
};

const Notes: React.FC = () => {
  const [collections, setCollections] = useState<
    Collection[]
  >([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<string | null>(null);
  const [
    selectedSubCollection,
    setSelectedSubCollection,
  ] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] =
    useState<string | null>(null);
  const [searchQuery, setSearchQuery] =
    useState("");
  const [
    expandedCollections,
    setExpandedCollections,
  ] = useState<Set<string>>(new Set());
  const [
    isCreatingCollection,
    setIsCreatingCollection,
  ] = useState(false);
  const [
    newCollectionName,
    setNewCollectionName,
  ] = useState("");
  const [isCreatingNote, setIsCreatingNote] =
    useState(false);
  const [newNoteTitle, setNewNoteTitle] =
    useState("");
  const [
    isCreatingSubCollection,
    setIsCreatingSubCollection,
  ] = useState(false);
  const [
    newSubCollectionName,
    setNewSubCollectionName,
  ] = useState("");
  const [
    isDeletingCollection,
    setIsDeletingCollection,
  ] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    collectionId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    collectionId: null,
  });
  const [noteContextMenu, setNoteContextMenu] =
    useState<{
      visible: boolean;
      x: number;
      y: number;
      noteId: string | null;
    }>({
      visible: false,
      x: 0,
      y: 0,
      noteId: null,
    });
  const [isDeletingNote, setIsDeletingNote] =
    useState<string | null>(null);

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (selectedSubCollection) {
      loadNotes(selectedSubCollection);
    } else if (selectedCollection) {
      loadNotes(selectedCollection);
    } else {
      loadNotes();
    }
  }, [selectedCollection, selectedSubCollection]);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu((prev) => ({
        ...prev,
        visible: false,
      }));
      setNoteContextMenu((prev) => ({
        ...prev,
        visible: false,
      }));
    };
    document.addEventListener(
      "click",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error(
        "Failed to load collections:",
        error
      );
    }
  };

  const loadNotes = async (
    collectionId?: string
  ) => {
    try {
      const data = await getNotes(collectionId);
      setNotes(data);
    } catch (error) {
      console.error(
        "Failed to load notes:",
        error
      );
    }
  };

  const handleCreateCollection = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const data: CreateCollectionDto = {
        name: newCollectionName,
        color: getCollectionColor(
          newCollectionName
        ),
      };
      await createCollection(data);
      await loadCollections();
      setNewCollectionName("");
      setIsCreatingCollection(false);
    } catch (error) {
      console.error(
        "Failed to create collection:",
        error
      );
    }
  };

  const handleCreateSubCollection = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (
      !newSubCollectionName.trim() ||
      !selectedCollection
    )
      return;

    try {
      const data: CreateCollectionDto = {
        name: newSubCollectionName,
        color: getCollectionColor(
          newSubCollectionName
        ),
        parentId: selectedCollection,
      };
      await createCollection(data);
      await loadCollections();
      setNewSubCollectionName("");
      setIsCreatingSubCollection(false);
    } catch (error) {
      console.error(
        "Failed to create sub-collection:",
        error
      );
    }
  };

  const handleCreateNote = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (
      !newNoteTitle.trim() ||
      (!selectedCollection &&
        !selectedSubCollection)
    )
      return;

    try {
      const data: CreateNoteDto = {
        title: newNoteTitle,
        content: "",
        collectionId:
          selectedSubCollection ||
          selectedCollection ||
          "",
      };
      const newNote = await createNote(data);
      await loadNotes(
        selectedSubCollection ||
          selectedCollection ||
          undefined
      );
      setNewNoteTitle("");
      setIsCreatingNote(false);
      setSelectedNote(newNote.id);
    } catch (error) {
      console.error(
        "Failed to create note:",
        error
      );
    }
  };

  const toggleCollection = (
    collectionId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    const newExpanded = new Set(
      expandedCollections
    );
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const getCollectionColor = (
    name: string
  ): string => {
    const colors: string[] = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A1",
      "#FFC300",
      "#6A33FF",
    ];

    if (!name) return "#6B7280";

    let hash = 0;
    const cleanedName = name.trim().toLowerCase();

    for (let i = 0; i < cleanedName.length; i++) {
      hash =
        cleanedName.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const getCollectionPath = (
    collectionId: string
  ): string => {
    const findCollectionPath = (
      collections: Collection[],
      targetId: string,
      path: string[] = []
    ): string[] | null => {
      for (const collection of collections) {
        if (collection.id === targetId) {
          return [...path, collection.name];
        }
        if (collection.subCollections) {
          const found = findCollectionPath(
            collection.subCollections,
            targetId,
            [...path, collection.name]
          );
          if (found) return found;
        }
      }
      return null;
    };

    const path = findCollectionPath(
      collections,
      collectionId
    );
    return path ? path.join(" / ") : "";
  };

  const handleDeleteCollection = async (
    collectionId: string
  ) => {
    try {
      await deleteCollection(collectionId);
      await loadCollections();
      // Clear selection if deleted collection was selected
      if (selectedCollection === collectionId) {
        setSelectedCollection(null);
      }
      if (
        selectedSubCollection === collectionId
      ) {
        setSelectedSubCollection(null);
      }
      setIsDeletingCollection(null);
    } catch (error) {
      console.error(
        "Failed to delete collection:",
        error
      );
    }
  };

  const handleDeleteNote = async (
    noteId: string
  ) => {
    try {
      await deleteNote(noteId);
      await loadNotes(
        selectedSubCollection ||
          selectedCollection ||
          undefined
      );
      if (selectedNote === noteId) {
        setSelectedNote(null);
      }
      setIsDeletingNote(null);
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );
    }
  };

  const handleNoteContentUpdate = async (
    content: string
  ) => {
    if (!selectedNote) return;

    try {
      const note = notes.find(
        (n) => n.id === selectedNote
      );
      if (!note) return;

      await updateNote(selectedNote, { content });
      await loadNotes(
        selectedSubCollection ||
          selectedCollection ||
          undefined
      );
    } catch (error) {
      console.error(
        "Failed to update note content:",
        error
      );
    }
  };

  const renderCollection = (
    collection: Collection,
    level: number = 0
  ) => {
    const hasSubCollections =
      collection.subCollections &&
      collection.subCollections.length > 0;
    const isExpanded = expandedCollections.has(
      collection.id
    );
    const isSelected =
      selectedCollection === collection.id ||
      selectedSubCollection === collection.id;
    const isSubCollection = level > 0;
    const isDeleting =
      isDeletingCollection === collection.id;

    return (
      <div
        key={collection.id}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="relative">
          <button
            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${
              isSelected
                ? "bg-indigo-50 border-l-4 border-indigo-500"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasSubCollections) {
                toggleCollection(
                  collection.id,
                  e
                );
              }

              if (isSubCollection) {
                setSelectedSubCollection(
                  collection.id
                );
                setSelectedCollection(null);
              } else {
                setSelectedCollection(
                  collection.id
                );
                setSelectedSubCollection(null);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                collectionId: collection.id,
              });
            }}
          >
            {hasSubCollections && (
              <div
                className="mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollection(
                    collection.id,
                    e
                  );
                }}
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            )}
            {!hasSubCollections && (
              <div className="mr-2 w-4" />
            )}
            <div
              className="w-3 h-3 rounded-full mr-3"
              style={{
                backgroundColor: collection.color,
              }}
            ></div>
            <span className="flex-1 text-left text-sm font-medium text-gray-700">
              {collection.name}
            </span>
            <span className="text-xs text-gray-500">
              {collection.notes}
            </span>
            {collection.starred && (
              <Star
                className="ml-2 text-yellow-400"
                size={14}
                fill="#FBBF24"
              />
            )}
          </button>

          {/* Context Menu */}
          {contextMenu.visible &&
            contextMenu.collectionId ===
              collection.id && (
              <div
                className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                style={{
                  left: contextMenu.x,
                  top: contextMenu.y,
                }}
              >
                {!isSubCollection ? (
                  <>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        // Handle create studytool
                        setContextMenu(
                          (prev) => ({
                            ...prev,
                            visible: false,
                          })
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      Create Studytool
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setSelectedCollection(
                          collection.id
                        );
                        setSelectedSubCollection(
                          null
                        );
                        setIsCreatingSubCollection(
                          true
                        );
                        setContextMenu(
                          (prev) => ({
                            ...prev,
                            visible: false,
                          })
                        );
                      }}
                    >
                      <FolderPlus
                        size={14}
                        className="mr-2"
                      />
                      Add Sub-collection
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setIsDeletingCollection(
                          collection.id
                        );
                        setContextMenu(
                          (prev) => ({
                            ...prev,
                            visible: false,
                          })
                        );
                      }}
                    >
                      <Trash2
                        size={14}
                        className="mr-2"
                      />
                      Delete Collection
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        // Handle create studytool
                        setContextMenu(
                          (prev) => ({
                            ...prev,
                            visible: false,
                          })
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      Create Studytool
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setIsDeletingCollection(
                          collection.id
                        );
                        setContextMenu(
                          (prev) => ({
                            ...prev,
                            visible: false,
                          })
                        );
                      }}
                    >
                      <Trash2
                        size={14}
                        className="mr-2"
                      />
                      Remove
                    </button>
                  </>
                )}
              </div>
            )}
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Collection
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete "
                {collection.name}" and all its
                contents? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  onClick={() =>
                    setIsDeletingCollection(null)
                  }
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                  onClick={() =>
                    handleDeleteCollection(
                      collection.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Sub-collection Input - Show when triggered by context menu */}
        {isCreatingSubCollection &&
          selectedCollection ===
            collection.id && (
            <div
              className="mt-2"
              style={{
                marginLeft: `${
                  (level + 1) * 16
                }px`,
              }}
            >
              <form
                onSubmit={
                  handleCreateSubCollection
                }
                className="mb-4"
              >
                <input
                  type="text"
                  placeholder="New sub-collection name"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newSubCollectionName}
                  onChange={(e) =>
                    setNewSubCollectionName(
                      e.target.value
                    )
                  }
                  autoFocus
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 mr-2"
                    onClick={() =>
                      setIsCreatingSubCollection(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}

        {isExpanded && (
          <div className="mt-1">
            {collection.subCollections?.map(
              (subCollection) =>
                renderCollection(
                  subCollection,
                  level + 1
                )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              SmartLearnAI
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full">
                {getLevelTitle(
                  userProgress.level
                )}
              </span>
              <div className="flex items-center">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${calculateProgressPercentage(
                        userProgress.xp,
                        userProgress.xpToNextLevel
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-600">
                  {userProgress.xp}/
                  {userProgress.xpToNextLevel} XP
                </span>
              </div>
              <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-medium">
                  JS
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Pencil className="mr-2" size={24} />
            Notes
          </h2>

          <div className="flex gap-4">
            {/* Collections Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow-sm">
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={16}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">
                      Collections
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {collections.map(
                      (collection) =>
                        renderCollection(
                          collection
                        )
                    )}

                    {/* Add Collection Button */}
                    <div className="mt-2">
                      {isCreatingCollection ? (
                        <form
                          onSubmit={
                            handleCreateCollection
                          }
                          className="mb-4"
                        >
                          <input
                            type="text"
                            placeholder="New collection name"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={
                              newCollectionName
                            }
                            onChange={(e) =>
                              setNewCollectionName(
                                e.target.value
                              )
                            }
                            autoFocus
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              className="text-sm text-gray-500 hover:text-gray-700 mr-2"
                              onClick={() =>
                                setIsCreatingCollection(
                                  false
                                )
                              }
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Create
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          className="w-full flex items-center p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 text-sm font-medium"
                          onClick={() =>
                            setIsCreatingCollection(
                              true
                            )
                          }
                        >
                          <FolderPlus
                            size={16}
                            className="mr-2"
                          />
                          Add Collection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-collections and Notes List - Only show when subcollection is selected */}
            {selectedSubCollection &&
              !selectedCollection && (
                <div className="w-80 bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {getCollectionPath(
                            selectedSubCollection
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {notes.length} notes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() =>
                            setIsCreatingSubCollection(
                              true
                            )
                          }
                        >
                          <FolderPlus size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-indigo-600">
                          <MoreHorizontal
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center"
                        onClick={() =>
                          setIsCreatingNote(true)
                        }
                      >
                        <FilePlus
                          className="mr-1"
                          size={16}
                        />
                        New Note
                      </button>
                      <button className="flex-1 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium flex items-center justify-center">
                        <Upload
                          className="mr-1"
                          size={16}
                        />
                        Import
                      </button>
                    </div>
                  </div>

                  {isCreatingNote && (
                    <form
                      onSubmit={handleCreateNote}
                      className="p-4 border-b"
                    >
                      <input
                        type="text"
                        placeholder="New note title"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newNoteTitle}
                        onChange={(e) =>
                          setNewNoteTitle(
                            e.target.value
                          )
                        }
                        autoFocus
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          className="text-sm text-gray-500 hover:text-gray-700 mr-2"
                          onClick={() =>
                            setIsCreatingNote(
                              false
                            )
                          }
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  )}

                  <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight:
                        "calc(100vh - 73px)",
                    }}
                  >
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                          selectedNote === note.id
                            ? "bg-indigo-50 border-l-4 border-indigo-500"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedNote(note.id)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {note.title}
                            </h4>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    getCollectionColor(
                                      collections.find(
                                        (c) =>
                                          c.id ===
                                          note.collectionId
                                      )?.name ||
                                        ""
                                    ),
                                }}
                              ></div>
                              <span className="text-xs text-gray-500 line-clamp-2">
                                {note.content ||
                                  "No text"}
                              </span>
                            </div>
                          </div>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNoteContextMenu({
                                visible: true,
                                x: e.clientX,
                                y: e.clientY,
                                noteId: note.id,
                              });
                            }}
                          >
                            <MoreHorizontal
                              size={16}
                            />
                          </button>
                        </div>

                        {/* Note Context Menu */}
                        {noteContextMenu.visible &&
                          noteContextMenu.noteId ===
                            note.id && (
                            <div
                              className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                              style={{
                                left: noteContextMenu.x,
                                top: noteContextMenu.y,
                              }}
                            >
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  // Handle create studytool
                                  setNoteContextMenu(
                                    (prev) => ({
                                      ...prev,
                                      visible:
                                        false,
                                    })
                                  );
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2"
                                >
                                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                </svg>
                                Create Studytool
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setIsDeletingNote(
                                    note.id
                                  );
                                  setNoteContextMenu(
                                    (prev) => ({
                                      ...prev,
                                      visible:
                                        false,
                                    })
                                  );
                                }}
                              >
                                <Trash2
                                  size={14}
                                  className="mr-2"
                                />
                                Delete Note
                              </button>
                            </div>
                          )}

                        {/* Delete Note Confirmation Modal */}
                        {isDeletingNote ===
                          note.id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Delete Note
                              </h3>
                              <p className="text-sm text-gray-500 mb-4">
                                Are you sure you
                                want to delete "
                                {note.title}"?
                                This action cannot
                                be undone.
                              </p>
                              <div className="flex justify-end space-x-3">
                                <button
                                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                                  onClick={() =>
                                    setIsDeletingNote(
                                      null
                                    )
                                  }
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                                  onClick={() =>
                                    handleDeleteNote(
                                      note.id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Note Content - Only show when note is selected and subcollection is selected */}
            {selectedNote &&
              selectedSubCollection &&
              !selectedCollection && (
                <div className="flex-1 border-l border-gray-200">
                  <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                      <h2 className="text-lg font-semibold">
                        {
                          notes.find(
                            (n) =>
                              n.id ===
                              selectedNote
                          )?.title
                        }
                      </h2>
                    </div>
                    <div className="flex-1 overflow-auto rounded-b-lg">
                      <RichTextEditor
                        content={
                          notes.find(
                            (n) =>
                              n.id ===
                              selectedNote
                          )?.content || ""
                        }
                        onChange={
                          handleNoteContentUpdate
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
