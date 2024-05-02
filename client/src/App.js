import React, { useState, useRef, useEffect } from 'react';
import "./App.css";
import Webcam from "react-webcam";
import ToggleSwitch from './components/ToggleSwitch';

function WebcamImage() {
  const [backendData, setBackendData] = useState({ answer: null, audioUrl: null });
  const [isToggled, setIsToggled] = useState(false);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const uploadImage = async (promptType) => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error('Failed to capture image');
      return;
    }

    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'image.jpeg');
    formData.append('promptType', promptType);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setBackendData({ answer: data.answer, audioUrl: data.audioFile });
      // Automatically restart interval if not default
      if (promptType !== 'default' && isToggled) {
        startInterval();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    if (isToggled) {
      startInterval();
    } else {
      clearIntervalIfActive();
    }

    return () => clearIntervalIfActive();
  }, [isToggled]);

  useEffect(() => {
    if (backendData.audioUrl) {
      // Checks if audioRef is set and audioUrl is updated
      if (audioRef.current) {
        audioRef.current.src = backendData.audioUrl; // Set the source of the audio element
        audioRef.current.load();  // Load the new audio source
        audioRef.current.play().catch(error => console.error('Error playing audio:', error)); // Attempt to play the new audio
      }
    }
  }, [backendData.audioUrl]); // Dependency array includes backendData.audioUrl



  const startInterval = () => {
    clearIntervalIfActive();
    intervalRef.current = setInterval(() => uploadImage('default'), 60000);
  };

  const clearIntervalIfActive = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="container">
      <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" />
      <div className="button-group">
        <h3>Safety Check</h3>
        <ToggleSwitch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)}/>
        <h3>For Your Curiosity</h3>
        <button onClick={() => {
          clearIntervalIfActive(); 
          uploadImage('idea');
        }}>Ideation Prompt</button>
        <button onClick={() => {
          clearIntervalIfActive(); 
          uploadImage('question');
        }}>Question Prompt</button>
      </div>
      {backendData.answer && (
        <div className="answer">
          <h2>Answer:</h2>
          <p>{backendData.answer}</p>
        </div>
      )}
      {backendData.audioUrl && (
        <audio ref={audioRef} controls autoPlay>
        </audio>
      )}
    </div>
  );
}

export default WebcamImage;