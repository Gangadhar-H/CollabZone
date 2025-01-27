import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'

import './App.css'
import Dashboard from './pages/DashBoard';
import CreateMeeting from './pages/CreateMeeting';
import JoinMeeting from './pages/JoinMeeting';
import MeetingRoom from './pages/MeetingRoom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} ></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/create-meeting' element={<CreateMeeting />}></Route>
        <Route path='/join-meeting' element={<MeetingRoom />}></Route>
        <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
      </Routes>
    </Router>
  );
}

export default App
