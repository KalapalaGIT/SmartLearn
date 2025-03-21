export interface Collection {
  id: string;
  name: string;
  color: string;
  notes: number;
  starred: boolean;
  subCollections: Collection[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  collectionId: string;
  lastEdited: string;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionDto {
  name: string;
  color?: string;
  parentId?: string;
}

export interface UpdateCollectionDto {
  name?: string;
  color?: string;
  starred?: boolean;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  collectionId: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  starred?: boolean;
} 