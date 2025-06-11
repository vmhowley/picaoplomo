import React, { useState } from "react";
import "../index.css";

const StartScreen = ({ onStart }) => {
  const [players, setPlayers] = useState("");
  const [level, setLevel] = useState("level1");

  const handleStart = () => {
    const playerList = players.split(",").map(p => p.trim()).filter(Boolean);
    if (playerList.length >= 2) {
      onStart(playerList, level);
    } else {
      alert("Ingresa al menos dos nombres separados por coma.");
    }
  };

  return (
    <div className="start-screen">
      <h2>Jugadores</h2>
      <input
        type="text"
        placeholder="Ej: Ana, Luis, Pedro"
        value={players}
        onChange={(e) => setPlayers(e.target.value)}
      />
      <h2>Dificultad</h2>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="level1">Coqueteo 💋</option>
        <option value="level2">Contacto 🤤</option>
        <option value="level3">Hardcore 🔥</option>
      </select>
      <br /><br />
      <button onClick={handleStart}>Iniciar</button>
    </div>
  );
};

export default StartScreen;