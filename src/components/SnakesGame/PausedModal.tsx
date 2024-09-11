import React from 'react';
import './PausedModal.css';

interface PausedModalProps {
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const PausedModal: React.FC<PausedModalProps> = ({ setIsPaused }) => {
  return (
    <div
      id="paused-modal-container"
      onClick={() => setIsPaused(false)}
    >
      <div id="paused-modal">
        <h2>Game Paused</h2>
        <p className="click-dir">(Click anywhere to continue)</p>
      </div>
    </div>
  );
};

export default PausedModal;
