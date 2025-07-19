// src/components/Home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Study Planner 📘</h1>
        <p className="intro-text">
          Your personal companion to organize, track, and master your study goals.
        </p>

        <p className="features-text">
          Study Planner helps you to create and manage tasks with deadlines, prioritize your workload, and monitor your progress seamlessly.
          Stay motivated with timely reminders, track completed and pending tasks, and customize your study sessions to suit your learning style.
          Whether you're preparing for exams or managing daily assignments, Study Planner makes studying efficient and stress-free.
        </p>

        <div className="home-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
