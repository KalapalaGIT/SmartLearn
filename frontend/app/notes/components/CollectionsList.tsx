"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { Collection } from "../data/mockData";

interface CollectionsListProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onCollectionSelect: (
    collection: Collection
  ) => void;
  onAddCollection?: (name: string) => void; // Optional for future implementation
}

const CollectionsList: React.FC<
  CollectionsListProps
> = ({
  collections,
  selectedCollection,
  onCollectionSelect,
  onAddCollection,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [
    newCollectionName,
    setNewCollectionName,
  ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when isAdding becomes true
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddCollection = () => {
    if (
      newCollectionName.trim() &&
      onAddCollection
    ) {
      onAddCollection(newCollectionName.trim());
      setNewCollectionName("");
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
      handleAddCollection();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewCollectionName("");
    }
  };

  const startAddingCollection = () => {
    setIsAdding(true);
  };

  return (
    <div className="section">
      <h1 className="sectionHeader">
        Collections
      </h1>

      {collections.length === 0 && !isAdding ? (
        <div className="p-4 text-center text-gray-500">
          <p>No collections yet.</p>
          <p className="text-sm">
            Add a new collection to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {collections.map((collection) => (
            <li
              key={collection.id}
              onClick={() =>
                onCollectionSelect(collection)
              }
              className={`cursor-pointer p-2 rounded hover:bg-base-300 ${
                selectedCollection?.id ===
                collection.id
                  ? "bg-base-300"
                  : ""
              }`}
            >
              {collection.name}
            </li>
          ))}

          {/* New collection input field that appears in the list */}
          {isAdding && (
            <li className="p-2 rounded bg-base-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter collection name"
                className="input input-bordered input-sm w-full"
                value={newCollectionName}
                onChange={(e) =>
                  setNewCollectionName(
                    e.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                onBlur={handleAddCollection}
              />
            </li>
          )}
        </ul>
      )}

      <button
        className="btn btn-primary mt-4 w-full"
        onClick={startAddingCollection}
        disabled={isAdding}
      >
        Add new collection
      </button>
    </div>
  );
};

export default CollectionsList;
