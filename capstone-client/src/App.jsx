import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projectboard from './pages/Projectboard';
import Schedule from './pages/Schedule';
import Howtouse from './pages/Howtouse';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Bountyboard from './pages/Bountyboard';
import MyProjects from './pages/Myprojects';
import NotFound from './pages/Notfound';
import Profile from './pages/Profile';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/bountyboard" element={<Bountyboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/projectboard" element={<Projectboard />} />
        <Route path="/howtouse" element={<Howtouse />} />
        <Route path="/" element={<Landing />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

