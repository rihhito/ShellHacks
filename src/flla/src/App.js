// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './ui/Login'; // Import the Login component
import Dashboard from './ui/dashboard'; // Import the Dashboard component
import MoneyBasics from './ui/modules/m1/MoneyBasics'; // Import MoneyBasics page


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Initial screen */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
        <Route path="/money-basics" element={<MoneyBasics />} /> {/* MoneyBasics route */}
      </Routes>
    </Router>
  );
}

// Creating a LoginPage wrapper for redirection
const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate(); // For navigating after login

  // Dummy authentication function
  const handleLogin = (email, password) => {
    if (email === 'user@fiu.edu' && password === '1') {
      setIsLoggedIn(true); // Set login status to true if credentials match
      navigate('/dashboard'); // Redirect to the dashboard after login
    } else {
      alert('Incorrect email or password');
    }
  };

  return isLoggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />;
};

export default App;
