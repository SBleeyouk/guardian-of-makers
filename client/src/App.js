import React, { useState, useRef, useEffect } from 'react';
import "./App.css";
import Webcam from "react-webcam";
import ToggleSwitch from './components/ToggleSwitch';

function WebcamImage() {
  const [backendData, setBackendData] = useState({ answer: null, audioUrl: null });
  const [isToggled, setIsToggled] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const uploadImage = async (promptType) => {
    setShowCamera(true); // Ensure the camera is shown when uploading new image
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
      setBackendData({ answer: data.answer, audioUrl: `http://localhost:5000/${backendData.audioUrl}` });
      setShowCamera(false); // Hide camera when displaying answers for idea or question prompts
      clearIntervalIfActive(); // Stop interval
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
    if (backendData.audioUrl && audioRef.current) {
      audioRef.current.src = backendData.audioUrl;  // Ensure this URL is correct
      audioRef.current.load();  // Load the audio file
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));  // Play the audio
    }
  }, [backendData.audioUrl]); // Dependency on audioUrl ensures the effect runs when it changes
  

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

  const handleClose = () => {
    setShowCamera(true); // Re-enable camera
    setBackendData({ answer: null, audioUrl: null }); // Clear previous answers
    if (isToggled) {
      startInterval(); // Restart interval if toggle was on
    }
  };

  return (
    <div className="container">
      {showCamera ? (
        <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" />
      ) : (
        <div className="answer">
          <h2>Answer:</h2>
          <p>{backendData.answer}</p>
          <button onClick={handleClose}>Close</button>
        </div>
      )}
      <div className="cam-buttons">
        <h3>Safety Check</h3>
        <ToggleSwitch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />
        <h3>For Your Curiosity</h3>
        <button disabled={!showCamera} onClick={() => uploadImage('idea')}>
            <span className="material-symbols-outlined">
            photo_camera</span>
            Ideation Prompt
        </button>
        <button disabled={!showCamera} onClick={() => uploadImage('question')}>
          <span className="material-symbols-outlined">
            perm_camera_mic</span>
            Question Prompt
        </button>
      </div>
      {backendData.audioUrl && (
      <audio ref={audioRef} controls autoPlay>
        <source src={backendData.audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      )}
    </div>
  );
}

export default WebcamImage;
