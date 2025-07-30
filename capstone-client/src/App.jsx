// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <h1 class="text-3xl font-bold underline">
//         Hello world!
//       </h1>
//     </>
//   )
// }

// export default App

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projectboard from './pages/Projectboard';
import Schedule from './pages/Schedule';
import Bountyboard from './pages/Bountyboard';
import Howtouse from './pages/Howtouse';
import Landing from './pages/Landing';

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
        <Route path="/howtouse" element={<Howtouse />} />
        <Route path="/" element={<Landing />} />
        <Route
          path="/projectboard"
          element={<Projectboard
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />}
        />
      </Routes>
    </Router>
  );
}

export default App;

