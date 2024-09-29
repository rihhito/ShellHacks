import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import ProgressBar from '../visuals/ProgressBar'; // Import progress bar
import SubModule1 from './sub_m1'; // Import Submodule 1
import SubModule2 from './sub_m2'; // Import Submodule 2

const MoneyBasics = () => {
  const [progress, setProgress] = useState(0);
  const [activeSubmodule, setActiveSubmodule] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmoduleClick = (submodule) => {
    setActiveSubmodule(submodule);
  };

  const handleBackToSubmodules = () => {
    setActiveSubmodule(null); // Go back to the submodule selection screen
  };

  const handleGoBackToDashboard = () => {
    navigate('/dashboard'); // Navigate back to the dashboard
  };

  return (
    <div style={styles.container}>
      {/* User Placeholder at the Top Left */}
      <div style={styles.userPlaceholder}>
        <img 
          src={`${process.env.PUBLIC_URL}/avatars/ReadyPlayerMe-Avatar.png`} 
          alt="Custom Avatar" 
          style={styles.avatar} 
        />
        <span style={styles.username}> Messi </span>
      </div>

      <h1 style={styles.title}>Money Basics</h1>
      <ProgressBar progress={progress} />

      {!activeSubmodule ? (
        <div style={styles.submoduleSelection}>
          <h2 style={styles.subtitle}>Select a submodule:</h2>
          <button onClick={() => handleSubmoduleClick('sub1')} style={styles.button}>
            Understanding Money
          </button>
          <button onClick={() => handleSubmoduleClick('sub2')} style={styles.button}>
            Managing Your Budget
          </button>
        </div>
      ) : (
        <div>
          {activeSubmodule === 'sub1' && <SubModule1 setProgress={setProgress} onBack={handleBackToSubmodules} />}
          {activeSubmodule === 'sub2' && <SubModule2 setProgress={setProgress} onBack={handleBackToSubmodules} />}
        </div>
      )}

      {/* Go Back to Dashboard Button at the Bottom */}
      <button onClick={handleGoBackToDashboard} style={styles.backButton}>
        Go Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1e1e1e', // Black background
    color: '#fff', // White text for contrast
    padding: '20px',
    textAlign: 'center',
    minHeight: '100vh', // Ensures the full viewport is covered
    fontFamily: "'Poppins', sans-serif",
    position: 'relative', // Allows for absolute positioning of user placeholder
    display: 'flex', // Flexbox to position items
    flexDirection: 'column',
    justifyContent: 'space-between', // Space between content and button at the bottom
  },
  userPlaceholder: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #EEC62A',
  },
  username: {
    marginLeft: '10px',
    color: '#EEC62A',
    fontWeight: 'bold',
  },
  title: {
    color: '#EEC62A', // Updated gold color
    fontSize: '36px',
    marginBottom: '20px',
  },
  subtitle: {
    color: '#fff', // White subtitle text
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#EEC62A', // Updated gold button color
    color: '#1e1e1e', // Black text inside the button
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s', // Smooth animation on hover
  },
  backButton: {
    padding: '10px 20px',
    marginTop: 'auto', // Pushes the button to the bottom
    backgroundColor: '#EEC62A', // Gold color for the back button
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  submoduleSelection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default MoneyBasics;
