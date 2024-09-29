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
      {/* Full-Screen Image with Description */}
      <div style={styles.imageContainer}>
        <img
          src={`${process.env.PUBLIC_URL}/capital_clash.jpg`}
          alt="Capital Clash Logo"
          style={styles.fullscreenImage}
        />
        {/* Description Overlay */}
        <div style={styles.descriptionOverlay}>
          <h1 style={styles.descriptionText}>
            Designing something that would be both educational and entertaining
          </h1>
        </div>
      </div>

      {/* Login Form */}
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
    backgroundColor: '#1e1e1e', // Black background
    overflowX: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh', // Full viewport height
    overflow: 'hidden',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  descriptionOverlay: {
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    textAlign: 'center',
    padding: '0 20px',
  },
  descriptionText: {
    fontSize: '28px',
    color: 'gold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
  },
  formTitle: {
    color: 'gold',
    marginBottom: '20px',
    textAlign: 'center',
    marginTop: '40px', // Space from the image
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '30px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    border: '2px solid gold',
    margin: '0 auto', // Center the form
  },
  inputContainer: {
    marginBottom: '20px',
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
    marginTop: '10px',
  },
  toggleButton: {
    marginTop: '20px',
    color: 'gold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default Login;
