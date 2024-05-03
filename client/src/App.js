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
      setBackendData({ answer: data.answer, audioUrl: `http://localhost:5000/${data.audioFile}` });
      setShowCamera(false); // Hide camera and controls
      clearIntervalIfActive(); // Stop interval
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    if (isToggled && showCamera) {
      startInterval();
    } else {
      clearIntervalIfActive();
    }

    return () => clearIntervalIfActive();
  }, [isToggled, showCamera]);

  useEffect(() => {
    if (backendData.audioUrl && audioRef.current) {
      audioRef.current.src = backendData.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }
  }, [backendData.audioUrl]);

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
    setShowCamera(true); // Re-enable camera and controls
    setBackendData({ answer: null, audioUrl: null }); // Clear previous answers
    if (isToggled) {
      startInterval(); // Restart interval if toggle was on
    }
  };

  return (
    <div className="parent">
      <div className="container">
        {showCamera ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              width: 500,
              height: 700,
              facingMode: "user",
              aspectRatio: 3
            }}
            screenshotFormat="image/jpeg"
          />
        ) : (
          <div className="answer">
            <h2>Answer:</h2>
            <p>{backendData.answer}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        )}
        {showCamera && (
          <div className="cam-buttons">
            <div className="btn-safe">
              <h3>Safety</h3>
              <ToggleSwitch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)} />
            </div>
            <div className="btn">
                <button className = "iconbtn" onClick={() => uploadImage('idea')}>
                  <span className="material-symbols-outlined">
                    photo_camera</span>
                  Ideation Prompt
                </button>
                <button className = "iconbtn" onClick={() => uploadImage('question')}>
                  <span className="material-symbols-outlined">
                    perm_camera_mic</span>
                  Question Prompt
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamImage;
