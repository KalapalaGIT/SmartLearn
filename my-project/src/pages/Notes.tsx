import { useState } from 'react';
import { Search, FolderPlus, Tag, Upload, MoreHorizontal, Star, FilePlus } from 'lucide-react';

// Sample data
const collections = [
  { id: 1, name: "Biology", color: "#10B981", notes: 12, starred: true },
  { id: 2, name: "History", color: "#F59E0B", notes: 8, starred: false },
  { id: 3, name: "Mathematics", color: "#3B82F6", notes: 15, starred: true },
  { id: 4, name: "Physics", color: "#8B5CF6", notes: 10, starred: false },
  { id: 5, name: "English Literature", color: "#EC4899", notes: 6, starred: false }
];

const recentNotes = [
  { id: 1, title: "Cell Structure and Function", collection: "Biology", lastEdited: "2 hours ago", tags: ["midterm", "important"] },
  { id: 2, title: "World War II Timeline", collection: "History", lastEdited: "Yesterday", tags: ["essay", "research"] },
  { id: 3, title: "Integration Techniques", collection: "Mathematics", lastEdited: "3 days ago", tags: ["difficult", "exam"] }
];

const Notes: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to get collection color
  const getCollectionColor = (name: string): string => {
  const colors: string[] = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#6A33FF"
  ];

  if (!name) return "#6B7280"; // Default color for empty names

  let hash = 0;
  const cleanedName = name.trim().toLowerCase(); // Ensure consistency

  for (let i = 0; i < cleanedName.length; i++) {
    hash = cleanedName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};


  return (
    <div className="flex h-screen bg-gray-100">

      {/* Collections Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Notes</h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          
          <div className="flex space-x-2 mb-6">
            <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center">
              <FilePlus className="mr-1" size={16} />
              New Note
            </button>
            <button className="flex-1 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium flex items-center justify-center">
              <Upload className="mr-1" size={16} />
              Import
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Collections</h3>
              <button className="text-indigo-600 hover:text-indigo-800">
                <FolderPlus size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              {collections.map(collection => (
                <button
                  key={collection.id}
                  className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${selectedCollection === collection.id ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: collection.color }}></div>
                  <span className="flex-1 text-left text-sm font-medium text-gray-700">{collection.name}</span>
                  <span className="text-xs text-gray-500">{collection.notes}</span>
                  {collection.starred && <Star className="ml-2 text-yellow-400" size={14} fill="#FBBF24" />}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full flex items-center">
                midterm
                <button className="ml-1">×</button>
              </span>
              <span className="text-xs bg-red-100 text-red-800 py-1 px-2 rounded-full flex items-center">
                important
                <button className="ml-1">×</button>
              </span>
              <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
                exam
                <button className="ml-1">×</button>
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 py-1 px-2 rounded-full flex items-center">
                research
                <button className="ml-1">×</button>
              </span>
              <button className="text-xs text-gray-500 hover:text-indigo-600">
                + Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">All Notes</h3>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-indigo-600">
                <Tag size={16} />
              </button>
              <button className="text-gray-500 hover:text-indigo-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">45 notes</p>
        </div>
        
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 73px)" }}>
          {recentNotes.map(note => (
            <div 
              key={note.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedNote === note.id ? 'bg-gray-50' : ''}`}
              onClick={() => setSelectedNote(note.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{note.title}</h4>
                  <div className="flex items-center mt-1">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: getCollectionColor(note.collection) }}
                    ></div>
                    <span className="text-xs text-gray-500">{note.collection}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{note.lastEdited}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {note.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                {note.id === 1 ? 
                  "The cell is the basic structural, functional, and biological unit of all known organisms. Cells are the smallest units of life..." :
                  note.id === 2 ?
                  "World War II, also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the majority of..." :
                  "Integration is the reverse process of differentiation. Common techniques include substitution, parts, partial fractions..."
                }
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: "#10B981" }}></div>
              <h3 className="font-medium text-gray-800">Cell Structure and Function</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-gray-500 hover:text-indigo-600">
                <Star size={18} />
              </button>
              <button className="text-gray-500 hover:text-indigo-600">
                <Tag size={18} />
              </button>
              <button className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                Create Quiz
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Cell Structure and Function</h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>AI Summary:</strong> This note covers the basic structure and functions of a cell, including organelles, cell membrane, and cellular processes. Key concepts include prokaryotic vs eukaryotic cells and the role of mitochondria.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-indigo max-w-none">
              <p>The cell is the basic structural, functional, and biological unit of all known organisms. Cells are the smallest units of life, and hence are often referred to as the "building blocks of life".</p>
              
              <h2>Types of Cells</h2>
              <p>There are two main types of cells:</p>
              <ul>
                <li><strong>Prokaryotic cells</strong> - These are simple, small cells with no nucleus or membrane-bound organelles. Bacteria and archaea are prokaryotes.</li>
                <li><strong>Eukaryotic cells</strong> - These are more complex cells with a true nucleus and membrane-bound organelles. Plants, animals, fungi, and protists are eukaryotes.</li>
              </ul>
              
              <h2>Cell Structure</h2>
              <p>A typical eukaryotic cell contains the following components:</p>
              
              <h3>Cell Membrane</h3>
              <p>The cell membrane, also called the plasma membrane, is a thin semi-permeable membrane that surrounds the cytoplasm of a cell. Its function is to protect the integrity of the interior of the cell by allowing certain substances into the cell while keeping other substances out.</p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-4">
                <h4 className="text-blue-800 font-medium mb-2">Key Concept</h4>
                <p className="text-sm text-blue-800">The cell membrane is composed primarily of a mix of proteins and lipids, especially phospholipids. The structure is described by the fluid mosaic model.</p>
              </div>
              
              <h3>Nucleus</h3>
              <p>The nucleus is a membrane-bound organelle that contains the cell's genes and controls the cell's growth and reproduction. It is surrounded by a double membrane called the nuclear envelope.</p>
              
              <h3>Cytoplasm</h3>
              <p>The cytoplasm is the gel-like material within the cell. It is composed mainly of water and also contains enzymes, salts, cell organelles, and various organic molecules.</p>
              
              <h3>Mitochondria</h3>
              <p>Mitochondria are often referred to as the "powerhouse of the cell" because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.</p>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 my-4">
                <h4 className="text-purple-800 font-medium mb-2">Exam Tip</h4>
                <p className="text-sm text-purple-800">Remember that mitochondria have their own DNA (mtDNA) and can replicate independently of the cell division cycle. This is important for understanding genetic inheritance patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;