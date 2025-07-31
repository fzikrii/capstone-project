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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Howtouse from './pages/Howtouse';
import Schedule from './pages/Schedule';
import BountyBoard from './pages/Bountyboard';
import InboxMessages from './pages/Inboxmesseges';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/howtouse" element={<Howtouse/>}/>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/bountyboard" element={<BountyBoard />} />
        <Route path="/inboxmesseges" element={<InboxMessages />} />`
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;


