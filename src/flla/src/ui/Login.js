import React, { useState } from 'react';

const Login = ({ onLogin }) => { 
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
      onLogin(email, password); 
    }
  };

  return (
    <div style={styles.container}>
      {/* App Name and Slogan */}
      <h1 style={styles.appName}>FINAI</h1>
      <p style={styles.slogan}>Your Financial Guide</p>

      <h2 style={styles.formTitle}>{isSignUp ? 'Create an Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {isSignUp && (
          <div style={styles.inputContainer}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        )}
        <div style={styles.inputContainer}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
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
    backgroundColor: '#1e1e1e', // Black background
  },
  appName: {
    fontSize: '72px',  // Bigger and bold for a creative touch
    fontWeight: '900',
    color: 'gold',
    textTransform: 'uppercase',  // Make it all caps
    letterSpacing: '5px',  // Spread out the letters a little for effect
    marginBottom: '0px',  // Tighten the gap between the title and slogan
  },
  slogan: {
    fontSize: '20px',
    color: '#fff',
    marginBottom: '30px',  // More space after the slogan
    fontStyle: 'italic',  // Adding italics for a classy touch
  },
  formTitle: {
    color: 'gold',
    marginBottom: '20px',  // Extra space above form title
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '30px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',  // More shadow for emphasis
    borderRadius: '10px',  // Slightly more rounded corners
    border: '2px solid gold',
  },
  inputContainer: {
    marginBottom: '20px',  // Increase spacing between inputs
  },
  label: {
    color: 'gold',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  button: {
    padding: '12px',
    backgroundColor: 'gold',
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px',  // Add some space between button and inputs
  },
  toggleButton: {
    marginTop: '20px',  // Increased margin for spacing
    color: 'gold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
