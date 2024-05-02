import React from 'react';

const ToggleSwitch = ({ isToggled, onToggle }) => {
  return(
    <button onClick={onToggle}>
      {isToggled ? 'ON' : 'OFF'}
    </button>
  );
};

export default ToggleSwitch;
