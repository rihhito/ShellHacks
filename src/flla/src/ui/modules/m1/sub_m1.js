import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSpeechSynthesis from './useSpeechSynthesis';  // Import custom speech synthesis hook

const SubModule1 = ({ setProgress, onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [toggleVoice, setToggleVoice] = useState(false);  // Voice toggle
  const [explanation, setExplanation] = useState('');  // AI response
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [userQuestion, setUserQuestion] = useState('');  // Track the user's question
  const [points, setPoints] = useState(0);  // Track user's points
  const [question, setQuestion] = useState('');  // Track current question
  const [userAnswer, setUserAnswer] = useState('');  // Store user answer
  const [levelUnlocked, setLevelUnlocked] = useState([true, false, false]);  // Track level unlocks

  // Level topics
  const levelTopics = {
    1: "Understanding Money",
    2: "Savings and Investments",
    3: "Financial Planning"
  };

  // Use the custom speech synthesis hook
  const { speak, stop, speaking, speechSupported } = useSpeechSynthesis();

  // Call Gemini API for Dani to ask a question and start conversation
  const askQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/ai_call', {
        question: `Please explain the current level.`,
        level_topic: levelTopics[currentLevel]  // Send the level topic to AI
      });
      setQuestion(response.data.response);

      // Log when question is received
      console.log('Received explanation: ', response.data.response);

      // If voice is toggled on, speak the explanation
      if (toggleVoice) {
        console.log('Speaking the explanation...');
        speak(response.data.response);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the user answer submission and analyze response
  const handleUserAnswerSubmit = async () => {
    if (userAnswer.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/ai_call', {
          question: userAnswer,
          level_topic: levelTopics[currentLevel]  // Provide context to AI
        });
        const feedback = response.data.response;
        setExplanation(feedback); // Dani gives feedback

        // If voice is toggled on, speak the feedback
        if (toggleVoice) {
          console.log('Speaking feedback...');
          speak(feedback);
        }

        if (feedback.includes('correct')) {
          setPoints((prevPoints) => prevPoints + 10);  // Award 10 points for a correct answer
        }

        // Automatically advance to the next level if points are sufficient
        if (points + 10 >= 30) {  // Assume 30 points to unlock the next level
          unlockNextLevel();
        }

        setUserAnswer('');  // Clear the answer field
      } catch (error) {
        console.error('Error analyzing answer:', error);
      }
    }
  };

  // Unlock the next level
  const unlockNextLevel = () => {
    if (currentLevel < 3) {  // Assuming 3 levels in SubModule1
      setLevelUnlocked((prevLevels) => {
        const newLevels = [...prevLevels];
        newLevels[currentLevel] = true;
        return newLevels;
      });
      setProgress((prevProgress) => Math.min(prevProgress + 33, 100));  // Update progress in parent component
      setCurrentLevel(currentLevel + 1);
      // Auto-ask new question when level advances
      askQuestion();
    }
  };

  // Handle voice toggle
  const handleToggleVoice = () => {
    setToggleVoice(!toggleVoice);
    
    // If turning on voice and there's already an explanation, speak it
    if (!toggleVoice && explanation) {
      console.log('Speaking explanation...');
      speak(explanation);
    } else {
      stop(); // Stop any ongoing speech if toggling off
    }
  };

  // Load explanation and ask a question when the level changes
  useEffect(() => {
    askQuestion();  // Dani starts each level with an explanation
  }, [currentLevel]);

  // Stop speech when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      stop();  // Stop Dani from speaking when leaving the screen
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sub-module 1: {levelTopics[currentLevel]}</h1>

      {/* Dani's Avatar and Explanation */}
      <div style={styles.daniExplanation}>
        <div style={{ ...styles.avatarCircle, ...(speaking ? styles.speaking : {}) }}>
          <img 
            src={`${process.env.PUBLIC_URL}/avatars/Daniai.png`} 
            alt="Dani Avatar" 
            style={styles.avatar}
          />
        </div>
        <div style={styles.captionBox}>
          <p>{question}</p>  {/* Show the question */} 
        </div>
        <button onClick={handleToggleVoice} style={styles.toggleButton}>
          {toggleVoice ? 'Turn Off Voice' : 'Turn On Voice'}
        </button>
      </div>

      {/* User Answer Input */}
      <div style={styles.userInputContainer}>
        <input
          type="text"
          placeholder="Type your answer..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}  // Update answer state
          style={styles.inputField}
        />
        <button onClick={handleUserAnswerSubmit} style={styles.answerButton}>
          Submit Answer
        </button>
      </div>

      {/* Level Information, Points, and Roadmap */}
      <div style={styles.levelInfo}>
        <p>Level: {currentLevel}</p>
        <p>Points: {points}</p>

        {/* Roadmap for Submodule */}
        <div style={styles.roadmapContainer}>
          <div style={{ ...styles.roadmapItem, backgroundColor: levelUnlocked[0] ? 'gold' : '#ccc' }}>
            Level 1
          </div>
          <div style={styles.roadmapConnector} />
          <div style={{ ...styles.roadmapItem, backgroundColor: levelUnlocked[1] ? 'gold' : '#ccc' }}>
            Level 2
          </div>
          <div style={styles.roadmapConnector} />
          <div style={{ ...styles.roadmapItem, backgroundColor: levelUnlocked[2] ? 'gold' : '#ccc' }}>
            Level 3
          </div>
        </div>
      </div>

      {/* Next Level Progression */}
      <div style={styles.progressContainer}>
        {levelUnlocked[1] && currentLevel === 1 && (
          <button onClick={() => setCurrentLevel(2)} style={styles.nextButton}>
            Go to Level 2
          </button>
        )}
        {levelUnlocked[2] && currentLevel === 2 && (
          <button onClick={() => setCurrentLevel(3)} style={styles.nextButton}>
            Go to Level 3
          </button>
        )}
      </div>

      {/* Back Button to go to previous screen */}
      <button onClick={onBack} style={styles.backButton}>
        Back to Submodules
      </button>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '36px',
    color: 'gold',
    textAlign: 'center',
  },
  daniExplanation: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarCircle: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '5px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'border-color 0.3s ease-in-out',
  },
  speaking: {
    borderColor: 'green',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
  },
  captionBox: {
    backgroundColor: '#444',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: '20px',
    backgroundColor: 'gold',
    color: '#1e1e1e',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  userInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  inputField: {
    width: '300px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  answerButton: {
    backgroundColor: 'gold',
    color: '#1e1e1e',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  levelInfo: {
    marginTop: '20px',
    textAlign: 'center',
  },
  roadmapContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  roadmapItem: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    borderRadius: '5px',
    color: '#1e1e1e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roadmapConnector: {
    width: '50px',
    height: '2px',
    backgroundColor: '#ccc',
    margin: '0 10px',
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  nextButton: {
    backgroundColor: 'green',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '30px',
    backgroundColor: 'red',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default SubModule1;
