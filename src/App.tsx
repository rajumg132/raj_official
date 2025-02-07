import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="bg-gray-900 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<div className="container mx-auto px-4 py-20 text-white">Documentation Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;