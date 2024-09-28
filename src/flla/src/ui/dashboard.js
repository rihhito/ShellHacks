import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Dashboard</h1>
      <p>You have successfully logged in!</p>
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
    backgroundColor: '#e0f7fa',
  }
};

export default Dashboard;
