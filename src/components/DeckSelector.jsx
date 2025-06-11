import React from "react";
import "../index.css";

const DeckSelector = ({ onSelect }) => {
  const decks = [
    { id: "level1", name: "Coqueteo 💋" },
    { id: "level2", name: "Contacto 🤤" },
    { id: "level3", name: "Hardcore 🔥" }
  ];

  return (
    <div className="deck-selector">
      {decks.map((deck) => (
        <button
          key={deck.id}
          className="deck-card"
          onClick={() => onSelect(deck.id)}
        >
          {deck.name}
        </button>
      ))}
    </div>
  );
};

export default DeckSelector;