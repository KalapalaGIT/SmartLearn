import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/notes" element={<Notes />} />
    </Routes>
  );
}

export default App;
