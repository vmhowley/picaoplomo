import React, { useState } from "react";
import "../index.css";

const StartScreen = ({ onStart }) => {
  const [players, setPlayers] = useState([""]);
  const [level, setLevel] = useState("level1");

  const handleStart = () => {
    const filtered = players.map(p => p.trim()).filter(Boolean);
    if (filtered.length >= 2) {
      onStart(filtered, level);
    } else {
      alert("Agrega al menos dos jugadores.");
    }
  };

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, ""]);
    } else {
      alert("Máximo 8 jugadores.");
    }
  };

  const handlePlayerChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  return (
    <div className="start-screen">
      <h2>Jugadores</h2>
      {players.map((name, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Jugador ${index + 1}`}
          value={name}
          onChange={(e) => handlePlayerChange(index, e.target.value)}
          className="block mx-auto my-2 p-2 w-72 rounded-md text-black"
        />
      ))}
      <button
        onClick={addPlayer}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded my-2"
      >
        + Agregar jugador
      </button>

      <h2 className="mt-4">Dificultad</h2>
      <select
  value={level}
  onChange={(e) => setLevel(e.target.value)}
  className="p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
>
  <option value="level1">Coqueteo 💋</option>
  <option value="level2">Contacto 🤤</option>
  <option value="level3">Hardcore 🔥</option>
  <option value="level4">Sexo Total 🚫🧼</option>
  <option value="random">Random 🎲</option>
</select>


      <br /><br />
      <button
        onClick={handleStart}
        className="bg-pink-600 hover:bg-pink-800 text-white px-6 py-3 rounded"
      >
        Iniciar
      </button>
    </div>
  );
};

export default StartScreen;