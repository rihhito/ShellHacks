// Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => { // Receive the onLogin prop
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Handle sign-up logic here (optional)
      console.log('Sign Up', { name, email, password });
    } else {
      // Handle login logic here
      onLogin(email, password); // Call the onLogin prop with email and password
    }
  };

  return (
    <div style={styles.container}>
      <h1>{isSignUp ? 'Create an Account' : 'Login'}</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {isSignUp && (
          <div style={styles.inputContainer}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div style={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <button
        style={styles.toggleButton}
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Already have an account? Log In' : 'Create an Account'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    marginTop: '15px',
    color: '#007bff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
