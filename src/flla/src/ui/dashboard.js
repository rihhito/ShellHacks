// Dashboard.js
import React, { useState } from 'react';
import MoneyBasics from './modules/m1/MoneyBasics'; // Import MoneyBasics module

const Dashboard = () => {
  const [showModule, setShowModule] = useState(false);

  const handleModuleClick = () => {
    setShowModule(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* User profile section */}
        <div style={styles.profileContainer}>
          {/* Placeholder for user avatar */}
          <img 
            src="https://via.placeholder.com/150" 
            alt="Custom Avatar" 
            style={styles.avatar} 
          />
          <h2 style={styles.username}>Player Name</h2>
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <h3>Score</h3>
              <p>1500</p>
            </div>
            <div style={styles.statBox}>
              <h3>Streak</h3>
              <p>10</p>
            </div>
            <div style={styles.statBox}>
              <h3>Level</h3>
              <p>5</p>
            </div>
            <div style={styles.statBox}>
              <h3>Rank</h3>
              <p>Gold</p>
            </div>
          </div>
        </div>

        {/* Buttons for Prepare for Battle and Battle */}
        <div style={styles.buttonsContainer}>
          {!showModule ? (
            <>
              <button onClick={handleModuleClick} style={styles.battleButton}> Prepare for Battle </button>
              <button style={styles.battleButton}> Battle </button>
            </>
          ) : (
            <MoneyBasics /> // Render the Money Basics module when clicked
          )}
        </div>
      </div>

      {/* AI Teacher (Dani) on the right */}
      <div style={styles.teacherContainer}>
        <img 
          src="https://via.placeholder.com/100" 
          alt="AI Teacher Avatar" 
          style={styles.teacherAvatar} 
        />
        <h3 style={styles.teacherName}>Dani</h3>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1e1e1e', // Dark background
    color: '#fff', // White text for contrast
    fontFamily: "'Poppins', sans-serif",
    padding: '0 50px', // Padding for spacing
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Main content takes up available space
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '5px solid gold', // Gold border for avatar
  },
  username: {
    marginTop: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '600px',
    marginTop: '20px',
  },
  statBox: {
    backgroundColor: '#333', // Dark stat background
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'gold', // Gold text for stats
    flex: 1,
    margin: '0 10px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '30px', // Space between profile and buttons
  },
  battleButton: {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'gold', // Gold buttons
    color: '#1e1e1e',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s', // Smooth animation
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
  },
  teacherContainer: {
    position: 'absolute',
    right: '20px',
    top: '20%', // Positioned vertically in the middle
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid gold', // Gold border for teacher avatar
  },
  teacherName: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Dashboard;
