import React from "react";
import "../index.css";

const ActionButtons = ({ onNext, onPunish, disabled }) => (
  <div className="action-buttons">
    <button onClick={onNext} disabled={disabled}>Siguiente carta</button>
    <button onClick={onPunish} disabled={disabled}>No quiero cumplir 😈</button>
  </div>
);

export default ActionButtons;