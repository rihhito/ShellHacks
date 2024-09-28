import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './ui/Login'; // Import the Login component
import Dashboard from './ui/dashboard'; // Import the Dashboard component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Dummy authentication function
  const handleLogin = (email, password) => {
    // For now, we'll just check against a static email and password.
    // Replace this with actual authentication logic.
    if (email === 'user@example.com' && password === 'password') {
      setIsLoggedIn(true); // Set login status to true if credentials match
    } else {
      alert('Incorrect email or password');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {isLoggedIn ? (
        <Dashboard /> // Show Dashboard if logged in
      ) : (
        <Login onLogin={handleLogin} /> // Show Login if not logged in
      )}
    </div>
  );
}

export default App;
