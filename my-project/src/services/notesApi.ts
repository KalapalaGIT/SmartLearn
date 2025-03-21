import { Collection, Note, CreateCollectionDto, UpdateCollectionDto, CreateNoteDto, UpdateNoteDto } from '../types/notes';

const API_BASE_URL = '/api';

// Mock data for testing
const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Programming',
    color: '#FF5733',
    notes: 3,
    starred: false,
    subCollections: [
      {
        id: '1-1',
        name: 'Frontend',
        color: '#33FF57',
        notes: 2,
        starred: false,
        subCollections: [],
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z'
      },
      {
        id: '1-2',
        name: 'Backend',
        color: '#3357FF',
        notes: 1,
        starred: false,
        subCollections: [],
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z'
      }
    ],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'Design',
    color: '#FF33A1',
    notes: 2,
    starred: true,
    subCollections: [
      {
        id: '2-1',
        name: 'UI Design',
        color: '#FFC300',
        notes: 1,
        starred: false,
        subCollections: [],
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z'
      }
    ],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  }
];

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'React Components',
    content: 'Learn about React components and their lifecycle...',
    collectionId: '1-1',
    lastEdited: '2024-03-20T10:00:00Z',
    starred: false,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'CSS Styling',
    content: 'Understanding CSS and modern styling techniques...',
    collectionId: '1-1',
    lastEdited: '2024-03-20T10:00:00Z',
    starred: true,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '3',
    title: 'Node.js Basics',
    content: 'Introduction to Node.js and server-side development...',
    collectionId: '1-2',
    lastEdited: '2024-03-20T10:00:00Z',
    starred: false,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '4',
    title: 'Color Theory',
    content: 'Understanding color theory and its application in design...',
    collectionId: '2-1',
    lastEdited: '2024-03-20T10:00:00Z',
    starred: false,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  }
];

// Collections
export const getCollections = async (): Promise<Collection[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCollections;
};

export const createCollection = async (data: CreateCollectionDto): Promise<Collection> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newCollection: Collection = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    color: data.color || '#6B7280',
    notes: 0,
    starred: false,
    subCollections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (data.parentId) {
    // Add to parent's subCollections
    const parent = mockCollections.find(c => c.id === data.parentId);
    if (parent) {
      parent.subCollections = parent.subCollections || [];
      parent.subCollections.push(newCollection);
    }
  } else {
    // Add to root level
    mockCollections.push(newCollection);
  }

  return newCollection;
};

export const updateCollection = async (id: string, data: UpdateCollectionDto): Promise<Collection> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const collection = [...mockCollections, ...mockCollections.flatMap(c => c.subCollections || [])]
    .find(c => c.id === id);
  
  if (!collection) throw new Error('Collection not found');

  Object.assign(collection, {
    ...data,
    updatedAt: new Date().toISOString()
  });

  return collection;
};

export const deleteCollection = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Find the collection and all its sub-collections
  const findCollectionAndSubCollections: (collections: Collection[], targetId: string) => Collection | null = (collections, targetId) => {
    for (const collection of collections) {
      if (collection.id === targetId) {
        return collection;
      }
      if (collection.subCollections) {
        const found = findCollectionAndSubCollections(collection.subCollections, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Get all collection IDs to delete (including sub-collections)
  const getAllCollectionIds = (collection: Collection): string[] => {
    const ids = [collection.id];
    if (collection.subCollections) {
      collection.subCollections.forEach((sub: Collection) => {
        ids.push(...getAllCollectionIds(sub));
      });
    }
    return ids;
  };

  // Find the collection to delete
  const collectionToDelete = findCollectionAndSubCollections(mockCollections, id);
  if (!collectionToDelete) return;

  // Get all collection IDs to delete
  const collectionIdsToDelete = getAllCollectionIds(collectionToDelete);

  // Delete associated notes
  const notesToKeep = mockNotes.filter(note => !collectionIdsToDelete.includes(note.collectionId));
  mockNotes.length = 0;
  mockNotes.push(...notesToKeep);

  // Delete the collection and its sub-collections
  const deleteFromArray = (collections: Collection[], targetId: string): boolean => {
    const index = collections.findIndex(c => c.id === targetId);
    if (index !== -1) {
      collections.splice(index, 1);
      return true;
    }
    for (const collection of collections) {
      if (collection.subCollections && deleteFromArray(collection.subCollections, targetId)) {
        return true;
      }
    }
    return false;
  };

  deleteFromArray(mockCollections, id);
};

// Notes
export const getNotes = async (collectionId?: string): Promise<Note[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!collectionId) return mockNotes;
  return mockNotes.filter(note => note.collectionId === collectionId);
};

export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newNote: Note = {
    id: Math.random().toString(36).substr(2, 9),
    title: data.title,
    content: data.content || '',
    collectionId: data.collectionId,
    lastEdited: new Date().toISOString(),
    starred: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockNotes.push(newNote);

  // Update collection note count
  const collection = [...mockCollections, ...mockCollections.flatMap(c => c.subCollections || [])]
    .find(c => c.id === data.collectionId);
  if (collection) {
    collection.notes = (collection.notes || 0) + 1;
  }

  return newNote;
};

export const updateNote = async (id: string, data: UpdateNoteDto): Promise<Note> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const note = mockNotes.find(n => n.id === id);
  if (!note) throw new Error('Note not found');

  Object.assign(note, {
    ...data,
    updatedAt: new Date().toISOString(),
    lastEdited: new Date().toISOString()
  });

  return note;
};

export const deleteNote = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const note = mockNotes.find(n => n.id === id);
  if (!note) return;

  const index = mockNotes.findIndex(n => n.id === id);
  mockNotes.splice(index, 1);

  // Update collection note count
  const collection = [...mockCollections, ...mockCollections.flatMap(c => c.subCollections || [])]
    .find(c => c.id === note.collectionId);
  if (collection) {
    collection.notes = Math.max(0, (collection.notes || 0) - 1);
  }
}; 