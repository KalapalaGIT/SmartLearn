import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-base-200 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SmartLearnAI</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 hover:bg-base-300 rounded-lg">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/notes" className="flex items-center p-2 hover:bg-base-300 rounded-lg">
              <span>Notes</span>
            </Link>
          </li>
          <li>
            <Link href="/studytools" className="flex items-center p-2 hover:bg-base-300 rounded-lg">
              <span>Study Tools</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        {/* Footer content if needed */}
      </div>
    </div>
  );
};

export default Sidebar;