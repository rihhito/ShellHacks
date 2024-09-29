import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For calling the Flask API

const SubModule1 = ({ setProgress }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [toggleVoice, setToggleVoice] = useState(false); // Toggle for voice/chat
  const [feedback, setFeedback] = useState(null);
  const [explanation, setExplanation] = useState(null); // Holds Dani's explanation
  const [isLoading, setIsLoading] = useState(false); // Loading state for animation
  const [levelProgress, setLevelProgress] = useState([true, false, false]); // Track level unlocks
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null); // Track right/wrong answers
  const [answeredQuestions, setAnsweredQuestions] = useState({
    level1: { q1: null, q2: null, q3: null },
  }); // Track answers to all questions
  const [progress, setInternalProgress] = useState(33); // Local progress tracker
  const [retryEnabled, setRetryEnabled] = useState(false); // Retry button control
  const [levelCompleted, setLevelCompleted] = useState(false); // Control post-level completion

  // Correct answers for questions
  const correctAnswers = {
    level1: {
      q1: 'Answer 1',
      q2: 'Answer 1',
      q3: 'Answer 2',
    },
  };

  // Call the Gemini API for topic explanation
  const getTopicExplanation = async (topic) => {
    try {
      setIsLoading(true); // Start loading animation
      const response = await axios.post('http://localhost:5000/ai_call', {
        question: topic,
        chosen_answer: '',
        correct_answer: '',
      });
      setExplanation(response.data.response);
      setIsLoading(false); // End loading animation
    } catch (error) {
      console.error("Error getting explanation from AI:", error);
      setIsLoading(false); // End loading animation even on error
    }
  };

  // Triggered when the user selects a level or topic
  useEffect(() => {
    if (currentLevel === 1) {
      getTopicExplanation("What is money?");
    } else if (currentLevel === 2) {
      getTopicExplanation("What is currency and inflation?");
    } else if (currentLevel === 3) {
      getTopicExplanation("What is compound interest?");
    }
  }, [currentLevel]);

  // Handle the voice toggle
  const handleToggleVoice = () => {
    setToggleVoice(!toggleVoice);
  };

  // Check answer and update question state
  const checkAnswer = (question, selectedAnswer) => {
    const isCorrect = selectedAnswer === correctAnswers[`level${currentLevel}`][question];
    setIsCorrectAnswer(isCorrect);
    setAnsweredQuestions((prevState) => ({
      ...prevState,
      [`level${currentLevel}`]: { ...prevState[`level${currentLevel}`], [question]: isCorrect },
    }));

    if (isCorrect) {
      setRetryEnabled(false); // Disable retry if correct
    } else {
      setRetryEnabled(true); // Enable retry if incorrect
    }

    // If all answers are correct for this level, unlock the next level
    if (
      Object.values({
        ...answeredQuestions[`level${currentLevel}`],
        [question]: isCorrect,
      }).every((val) => val === true)
    ) {
      unlockNextLevel();
      setLevelCompleted(true); // Mark level as completed
    }
  };

  // Unlock the next level
  const unlockNextLevel = () => {
    if (currentLevel < 3) {
      setLevelProgress((prev) => {
        const updatedProgress = [...prev];
        updatedProgress[currentLevel] = true;
        return updatedProgress;
      });
      setInternalProgress((prev) => prev + 33); // Update local progress tracker
      setProgress((prev) => prev + 33); // Update global progress
    }
  };

  // Retry the questions
  const retryQuestions = () => {
    setAnsweredQuestions({
      ...answeredQuestions,
      [`level${currentLevel}`]: { q1: null, q2: null, q3: null },
    });
    setIsCorrectAnswer(null); // Reset correctness state
    setRetryEnabled(false); // Disable retry button after reset
  };

  // Render Dani Placeholder (Voice/Chat Mode)
  const renderDaniPlaceholder = () => {
    return (
      <div style={styles.daniContainer}>
        <div style={styles.daniPlaceholder}>
          <img
            src={`${process.env.PUBLIC_URL}/avatars/Daniai.png`}
            alt="AI Teacher Dani"
            style={styles.daniAvatar}
          />
          <h3 style={styles.daniName}>Dani</h3>
        </div>

        {/* Toggle for voice vs chat */}
        <div style={styles.voiceToggle}>
          <label style={styles.toggleLabel}>
            Voice Mode:
            <input
              type="checkbox"
              checked={toggleVoice}
              onChange={handleToggleVoice}
              style={styles.toggleInput}
            />
          </label>
        </div>

        {/* Show explanation in chat box if voice is off */}
        {!toggleVoice && explanation && (
          <div style={{ ...styles.daniChat, animation: 'fadeIn 0.5s ease-in-out' }}>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    );
  };

  // Render Quiz for Level 1 with Randomized Answer Order
  const renderLevel1Content = () => {
    const quizQuestions = [
      {
        question: 'Why is the painting not a suitable medium of exchange?',
        answers: ['Answer 1', 'Answer 2'].sort(() => 0.5 - Math.random()),
        key: 'q1',
      },
      {
        question: 'If Carlos had cash, what function of money would it serve?',
        answers: ['Answer 1', 'Answer 2'].sort(() => 0.5 - Math.random()),
        key: 'q2',
      },
      {
        question: 'How does the use of money make transactions easier?',
        answers: ['Answer 1', 'Answer 2'].sort(() => 0.5 - Math.random()),
        key: 'q3',
      },
    ];

    return (
      <div style={styles.levelContainer}>
        <h2>Level 1: What is Money?</h2>

        {/* Render Quiz */}
        <div style={styles.quizContainer}>
          {quizQuestions.map((q, index) => (
            <div key={index} style={styles.quizItem}>
              <p>{q.question}</p>
              {q.answers.map((ans, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.answerButton,
                    backgroundColor:
                      answeredQuestions.level1[q.key] === null
                        ? '#ccc' // Gray if not answered
                        : answeredQuestions.level1[q.key] === true
                        ? 'green' // Green if correct
                        : 'red', // Red if wrong
                  }}
                  onClick={() => checkAnswer(q.key, ans)}
                  disabled={answeredQuestions.level1[q.key] !== null} // Disable if already answered
                >
                  {ans}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Show right/wrong answer feedback */}
        {isCorrectAnswer !== null && (
          <p style={{ color: isCorrectAnswer ? 'green' : 'red' }}>
            {isCorrectAnswer ? 'Correct!' : 'Wrong answer, try again!'}
          </p>
        )}

        {/* Retry Button */}
        {retryEnabled && (
          <button style={styles.retryButton} onClick={retryQuestions}>
            Retry Questions
          </button>
        )}

        {/* Post-level completion options */}
        {levelCompleted && (
          <div style={styles.completionContainer}>
            <p>Level 1 Completed!</p>
            <button style={styles.nextButton} onClick={() => setCurrentLevel(2)}>
              Move to Level 2
            </button>
            <button style={styles.submoduleButton} onClick={() => setCurrentLevel(null)}>
              Back to Submodules
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render Levels with Requirements and Roadmap
  const renderLevelContent = () => {
    if (currentLevel === 1) return renderLevel1Content();
    if (currentLevel === 2 && levelProgress[1]) {
      return (
        <div>
          <h2>Level 2: Currency and Inflation</h2>
          <p>Explanation for currency and inflation...</p>
        </div>
      );
    }
    if (currentLevel === 3 && levelProgress[2]) {
        return (
          <div>
            <h2>Level 3: Compound Interest</h2>
            <p>Explanation for compound interest...</p>
          </div>
        );
      }
      return <p>Select a level to start learning!</p>;
    };
  
    return (
      <div style={styles.container}>
        {/* Dani (AI Teacher) on the right */}
        {renderDaniPlaceholder()}
  
        <h1 style={styles.title}>Sub-module 1: Understanding Money</h1>
  
        {/* Progress Bar with percentage on top */}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}>
            <span style={styles.progressText}>{progress}%</span>
          </div>
        </div>
  
        {/* Render Content Based on Selected Level */}
        {renderLevelContent()}
      </div>
    );
  };
  
  const styles = {
    container: {
      backgroundColor: '#1e1e1e',
      color: '#fff',
      fontFamily: "'Poppins', sans-serif",
      padding: '20px',
      minHeight: '100vh',
      position: 'relative',
    },
    title: {
      textAlign: 'center',
      color: 'gold',
      fontSize: '36px',
      marginBottom: '20px',
    },
    progressBarContainer: {
      position: 'relative',
      width: '100%',
      height: '25px',
      backgroundColor: '#444',
      borderRadius: '15px',
      marginBottom: '20px',
    },
    progressBar: {
      height: '100%',
      backgroundColor: 'gold',
      borderRadius: '15px',
      textAlign: 'center',
      position: 'relative',
      lineHeight: '25px',
    },
    progressText: {
      position: 'absolute',
      width: '100%',
      top: '0',
      color: '#1e1e1e',
      fontWeight: 'bold',
    },
    quizContainer: {
      marginTop: '20px',
      backgroundColor: '#444',
      padding: '15px',
      borderRadius: '10px',
    },
    quizItem: {
      marginBottom: '15px',
    },
    answerButton: {
      backgroundColor: '#ccc', // Default gray color
      color: '#1e1e1e',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      margin: '5px',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    retryButton: {
      marginTop: '20px',
      backgroundColor: 'red',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    daniContainer: {
      position: 'absolute',
      right: '20px',
      top: '20%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    daniPlaceholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    daniAvatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: '3px solid gold',
    },
    daniName: {
      color: 'gold',
      fontSize: '18px',
      marginTop: '10px',
    },
    voiceToggle: {
      marginTop: '20px',
      color: '#fff',
    },
    toggleLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '16px',
    },
    toggleInput: {
      marginLeft: '10px',
    },
    daniChat: {
      backgroundColor: '#444',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '10px',
      maxWidth: '300px',
      textAlign: 'left',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
    completionContainer: {
      marginTop: '20px',
      textAlign: 'center',
    },
    nextButton: {
      padding: '10px 20px',
      backgroundColor: 'green',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px',
      fontWeight: 'bold',
    },
    submoduleButton: {
      padding: '10px 20px',
      backgroundColor: 'blue',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px',
      fontWeight: 'bold',
    },
  };
  
  export default SubModule1;
  