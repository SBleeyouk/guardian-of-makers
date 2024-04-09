import React, { useEffect, useState } from 'react';

function App() {
  const [backendData, setBackendData] = useState({});

  useEffect(() => {
    fetch("/get-answer").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    )
  });

  return (
    <div>
      {backendData.answer.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <p>{backendData.answer}</p>
        )}

    </div>
  )
}

export default App;
