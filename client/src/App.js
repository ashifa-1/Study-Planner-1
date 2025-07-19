import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskDashboard from './pages/TaskDashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<TaskDashboard />} />
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<PrivateRoute> <TaskDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;