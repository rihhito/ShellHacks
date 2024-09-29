import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import useSpeechSynthesis from './useSpeechSynthesis';  // Import custom speech synthesis hook

// DaniModel Component to load the .glb model
const DaniModel = () => {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/models/dani.glb`);
  return <primitive object={scene} scale={1.5} />;
};

const SubModule1 = ({ setProgress }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [toggleVoice, setToggleVoice] = useState(false);  // Voice toggle
  const [explanation, setExplanation] = useState('');  // AI response
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [userQuestion, setUserQuestion] = useState('');  // Track the user's question

  // Use the custom speech synthesis hook
  const { speak, stop, speaking, speechSupported } = useSpeechSynthesis();

  // Call Gemini API for topic explanation
  const getTopicExplanation = async (topic) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://10.108.132.25:5000/ai_call', { 
        question: topic  // Only pass the topic as the question
      });
      const explanationText = response.data.response;
      setExplanation(explanationText);

      // If voice is enabled, speak the explanation
      if (toggleVoice) {
        speak(explanationText);
      }
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user question submission
  const handleUserQuestionSubmit = async () => {
    if (userQuestion.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.post('http://10.108.132.25:5000/ai_call', { 
          question: userQuestion  // Pass the user's question to the AI
        });
        const aiResponse = response.data.response;
        setExplanation(aiResponse);  // Show AI's response in the explanation

        // If voice is enabled, speak the AI's response
        if (toggleVoice) {
          speak(aiResponse);
        }
      } catch (error) {
        console.error('Error calling Gemini AI:', error);
      } finally {
        setIsLoading(false);
        setUserQuestion('');  // Clear the input field after submission
      }
    }
  };

  // Load explanation based on the current level
  useEffect(() => {
    if (currentLevel === 1) {
      getTopicExplanation('What is money?');
    } else if (currentLevel === 2) {
      getTopicExplanation('What is currency and inflation?');
    }

    // Stop speaking when the component is unmounted or when switching levels
    return () => stop();
  }, [currentLevel, toggleVoice]);

  // Handle voice toggle
  const handleToggleVoice = () => {
    setToggleVoice(!toggleVoice);

    // If turning on voice and there's already an explanation, speak it
    if (!toggleVoice && explanation) {
      speak(explanation);
    } else {
      stop();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sub-module 1: Understanding Money</h1>

      {/* Dani's virtual classroom */}
      <div style={styles.classroomContainer}>
        <Canvas style={styles.canvas}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <DaniModel />  {/* Render Dani's 3D model */}
          </Suspense>
          <OrbitControls enableZoom={false} />  {/* Control for rotating Dani */}
        </Canvas>

        {/* Dani's explanation (either voice or chat) */}
        <div style={styles.daniExplanation}>
          {toggleVoice ? (
            <p>{speaking ? 'Dani is speaking...' : 'Voice mode is on'}</p>
          ) : (
            <div style={styles.captionBox}>
              <p>{explanation}</p>  {/* Text explanation if voice is off */}
            </div>
          )}
          <button onClick={handleToggleVoice} style={styles.toggleButton}>
            {toggleVoice ? 'Turn Off Voice' : 'Turn On Voice'}
          </button>
        </div>
      </div>

      {/* User input to ask a question */}
      <div style={styles.userInputContainer}>
        <input
          type="text"
          placeholder="Ask Dani a question..."
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}  // Update question state
          style={styles.inputField}
        />
        <button onClick={handleUserQuestionSubmit} style={styles.askButton}>
          Ask Dani
        </button>
      </div>

      {/* Level 1 Content */}
      {currentLevel === 1 && (
        <div style={styles.levelContainer}>
          <h2>Level 1: What is Money?</h2>
          <p>Learning Objective: Understand the concept of money, its history, and its importance in society.</p>
        </div>
      )}

      {/* Level Progression */}
      <div style={styles.progressContainer}>
        <button onClick={() => setCurrentLevel(currentLevel + 1)} style={styles.nextButton}>
          Next Level
        </button>
      </div>
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
  classroomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    margin: '20px 0',
  },
  canvas: {
    width: '400px',
    height: '400px',
  },
  daniExplanation: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  askButton: {
    backgroundColor: 'gold',
    color: '#1e1e1e',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  levelContainer: {
    textAlign: 'center',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px 0',
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
};

export default SubModule1;
