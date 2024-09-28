// ProgressBar.js
import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      <p>{progress}% complete</p>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '30px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    margin: '20px 0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    transition: 'width 0.3s ease-in-out',
  },
};

export default ProgressBar;
