import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './lib/Pages/Navbar/Navbar';
function App() {
  return (
    <Router>
      <div className="flex bg-[#E5E5E5]">
        <Navbar />
        <Routes>
          <Route path="/" element={<>interface</>} />
          <Route path="/about" element={<>about</>} />
          <Route path="/services" element={<>ser</>} />
          <Route path="/contact" element={<>cont</>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
