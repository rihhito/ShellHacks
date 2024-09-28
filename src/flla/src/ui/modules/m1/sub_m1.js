// sub_m1.js
import React, { useState } from 'react';

const SubModule1 = ({ setProgress }) => {
  const [levelCompleted, setLevelCompleted] = useState(0);

  const handleLevelComplete = () => {
    const newProgress = Math.min(levelCompleted + 25, 100);
    setLevelCompleted(newProgress);
    setProgress(newProgress); // Update progress in the main module
  };

  return (
    <div>
      <h2>Submodule 1: Understanding Money</h2>
      <p>Level {levelCompleted / 25 + 1} out of 4</p>
      <button onClick={handleLevelComplete} style={styles.button}>Complete Level</button>
    </div>
  );
};

const styles = {
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SubModule1;
