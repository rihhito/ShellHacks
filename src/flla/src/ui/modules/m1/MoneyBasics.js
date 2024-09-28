// MoneyBasics.js
import React, { useState } from 'react';
import ProgressBar from '../visuals/ProgressBar'; // Import progress bar
import SubModule1 from './sub_m1'; // Import Submodule 1
import SubModule2 from './sub_m2'; // Import Submodule 2

const MoneyBasics = () => {
  const [progress, setProgress] = useState(0);
  const [activeSubmodule, setActiveSubmodule] = useState(null);

  const handleSubmoduleClick = (submodule) => {
    setActiveSubmodule(submodule);
  };

  return (
    <div style={styles.container}>
      <h1>Money Basics</h1>
      <ProgressBar progress={progress} />
      {!activeSubmodule ? (
        <div>
          <h2>Select a submodule:</h2>
          <button onClick={() => handleSubmoduleClick('sub1')} style={styles.button}>Submodule 1: Understanding Money</button>
          <button onClick={() => handleSubmoduleClick('sub2')} style={styles.button}>Submodule 2: Managing Your Budget</button>
        </div>
      ) : (
        <div>
          {activeSubmodule === 'sub1' && <SubModule1 setProgress={setProgress} />}
          {activeSubmodule === 'sub2' && <SubModule2 setProgress={setProgress} />}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  button: {
    padding: '10px',
    margin: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MoneyBasics;
