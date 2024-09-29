import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Modules = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleModuleClick = (module) => {
    navigate(`/${module}`); // Navigate to the module's page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Learning Modules</h1>

      {/* List of Modules */}
      <div style={styles.modulesContainer}>
        <div style={styles.module} onClick={() => handleModuleClick('money-basics')}>
          <h2 style={styles.moduleTitle}>Module 1: Money Basics</h2>
          <p style={styles.moduleDescription}>Learn the foundations of financial literacy.</p>
        </div>

        <div style={styles.module} onClick={() => handleModuleClick('module2')}>
          <h2 style={styles.moduleTitle}>Module 2: Saving and Investing</h2>
          <p style={styles.moduleDescription}>Discover the basics of saving and how to invest smartly.</p>
        </div>

        <div style={styles.module} onClick={() => handleModuleClick('module3')}>
          <h2 style={styles.moduleTitle}>Module 3: Credit and Loans</h2>
          <p style={styles.moduleDescription}>Understand how credit works and how to manage loans responsibly.</p>
        </div>

        <div style={styles.module} onClick={() => handleModuleClick('module4')}>
          <h2 style={styles.moduleTitle}>Module 4: Budgeting</h2>
          <p style={styles.moduleDescription}>Master the art of creating and sticking to a budget.</p>
        </div>

        <div style={styles.module} onClick={() => handleModuleClick('module5')}>
          <h2 style={styles.moduleTitle}>Module 5: Taxes and Retirement</h2>
          <p style={styles.moduleDescription}>Plan ahead for taxes and a secure retirement.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1e1e1e', // Black background
    color: '#fff', // White text for contrast
    padding: '20px',
    textAlign: 'center',
    minHeight: '100vh', // Full viewport height
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    color: '#EEC62A', // Gold color
    fontSize: '36px',
    marginBottom: '40px',
  },
  modulesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
    gap: '20px', // Spacing between module buttons
    justifyContent: 'center',
  },
  module: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'left',
  },
  moduleTitle: {
    color: '#EEC62A', // Gold color for module titles
    fontSize: '24px',
    marginBottom: '10px',
  },
  moduleDescription: {
    color: '#ccc', // Light gray description
    fontSize: '16px',
  },
  module: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'left',
    '&:hover': {
      transform: 'scale(1.05)', // Slight scale on hover
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Shadow effect
    },
  },
};

export default Modules;
