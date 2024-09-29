import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Dashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handlePrepareForBattle = () => {
    navigate('/money-basics'); // Route to the MoneyBasics page
  };
  const handleBattle = () => {
    navigate('/battle'); // Route to the Battle page
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* User profile section */}
        <div style={styles.profileContainer}>
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
          <button onClick={handlePrepareForBattle} style={styles.battleButton}> Prepare for Battle </button>
          <button onClick={handleBattle} style={styles.battleButton}> Battle </button>
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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1e1e1e', // Dark background
    color: '#fff', // White text for contrast
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px', // Lower the placeholder by 1 inch (roughly 50px)
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
    justifyContent: 'center',
    gap: '20px', // Space between buttons
    marginTop: '30px',
    flexDirection: 'row', // Set buttons side by side
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
    right: '5px',
    top: '50%', // Align vertically at the center of the screen
    transform: 'translateY(-70%)', // Center the AI Teacher vertically
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: '50px',
    min_width: '500px',
    height: '50px',
    borderRadius: '25%',
    border: '3px solid gold', // Gold border for teacher avatar
  },
  teacherName: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Dashboard;
