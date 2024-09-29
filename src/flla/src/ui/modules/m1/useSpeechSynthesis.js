import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null); // Track selected voice

  // Check if speech synthesis is supported by the browser
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
      // Fetch available voices
      const fetchVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        // Automatically select a natural-sounding voice, e.g., Google voices
        const defaultVoice = availableVoices.find((voice) =>
          voice.name.includes("Google US English") || voice.name.includes("Google UK English")
        );
        setSelectedVoice(defaultVoice || availableVoices[0]); // Set a default voice
      };
      // Load voices (it may need some delay on some browsers)
      fetchVoices();
      window.speechSynthesis.onvoiceschanged = fetchVoices;
    }
  }, []);

  // Function to speak the provided text
  const speak = (text) => {
    if (speechSupported && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice; // Set selected voice
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
    voices,            // Provide voices to the component
    selectedVoice,     // Provide selected voice to the component
    setSelectedVoice,  // Provide method to change selected voice
  };
};

export default useSpeechSynthesis;
