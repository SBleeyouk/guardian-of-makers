import React from 'react';

const ToggleSwitch = ({ isToggled, onToggle }) => {
  return(
    <button 
      onClick={onToggle}
      style={{
        background: '#735572',
        color: '#fff',
        border: 'none', // Assuming you want no border
        padding: '10px 20px', // Adds some padding around the text
        borderRadius: '20px', // Gives the button rounded corners
        cursor: 'pointer', // Changes cursor to pointer on hover
      }}
    >
      {isToggled ? 'ON' : 'OFF'}
    </button>
  );
};

export default ToggleSwitch;
