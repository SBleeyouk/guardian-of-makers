import React, { useRef } from 'react';
import Webcam from "react-webcam";

function WebcamImage({ onCapture }) {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);  // Pass the captured image source back to App.js
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        audio={false} // Assuming no audio is needed for image capture
        height={480} // Define the size as needed
        width={640} // Define the size as needed
      />
      <button onClick={handleCapture}>Capture Image</button>
    </div>
  );
}

export default WebcamImage;
