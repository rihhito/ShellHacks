// useSpeechSynthesis.js
import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check if speech synthesis is supported by the browser
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Function to speak the provided text
  const speak = (text) => {
    if (speechSupported) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to stop speaking
  const stop = () => {
    if (speechSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return {
    speak,
    stop,
    speaking,
    speechSupported,
  };
};

export default useSpeechSynthesis;
