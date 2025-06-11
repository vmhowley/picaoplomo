import React from "react";

const Card = ({ card }) => {
  if (!card) return null;

  return (
    <div className={`card ${card.type}`}>
      <p>{card.text}</p>
    </div>
  );
};

export default Card;
