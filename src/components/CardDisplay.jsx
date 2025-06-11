import React from "react";
import "../index.css";

const CardDisplay = ({ card, currentPlayer }) => {
  return (
    <div className="card-display">
      {card ? (
        <p><strong>{currentPlayer}:</strong> {card.text}</p>
      ) : (
        <p>Presiona iniciar para comenzar</p>
      )}
    </div>
  );
};

export default CardDisplay;
