export interface Note {
  id: number;
  title: string;
}

export interface Collection {
  id: number;
  name: string;
  notes: Note[];
}

export interface Course {
  id: number;
  name: string;
  collections: Collection[];
}

export const mockCourses: Course[] = [
  {
    id: 1,
    name: "Computer Science 101",
    collections: [
      {
        id: 1,
        name: "Data Structures",
        notes: [
          { id: 1, title: "Arrays and Lists" },
          { id: 2, title: "Trees and Graphs" }
        ]
      },
      {
        id: 2,
        name: "Algorithms",
        notes: [
          { id: 3, title: "Sorting Algorithms" },
          { id: 4, title: "Search Algorithms" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Mathematics",
    collections: [
      {
        id: 3,
        name: "Calculus",
        notes: [
          { id: 5, title: "Derivatives" },
          { id: 6, title: "Integrals" }
        ]
      }
    ]
  }
];