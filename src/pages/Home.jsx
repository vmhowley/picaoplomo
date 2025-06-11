import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [players, setPlayers] = useState(["", ""]);
  const [level, setLevel] = useState("level1");
  const navigate = useNavigate();

  const startGame = () => {
    const filtered = players.map(p => p.trim()).filter(Boolean);
    if (filtered.length < 2) return alert("Agrega al menos 2 jugadores");
    navigate("/game", { state: { players: filtered, level } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-600 to-red-600 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-white mb-6">🔥 Carta Caliente 🔥</h1>

      <div className="w-full max-w-md bg-black rounded-lg p-6 shadow-lg backdrop-blur-md">
        <h2 className="text-white text-2xl mb-4 font-semibold">Jugadores</h2>
        {players.map((name, i) => (
          <input
            key={i}
            type="text"
            value={name}
            onChange={e => {
              const newPlayers = [...players];
              newPlayers[i] = e.target.value;
              setPlayers(newPlayers);
            }}
            placeholder={`Jugador ${i + 1}`}
            className="w-full mb-3 px-3 py-2 rounded placeholder-white text-white bg-pink-800"
            maxLength={15}
          />
        ))}
        {players.length < 8 && (
          <button
            onClick={() => setPlayers([...players, ""])}
            className="mb-4 w-full bg-pink-500 hover:bg-pink-700 text-white py-2 rounded"
          >
            + Agregar jugador
          </button>
        )}

        <h2 className="text-white text-2xl mb-4 font-semibold">Nivel 🔥</h2>
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded text-white bg-pink-500"
        >
          <option value="level1">🔥 Suave</option>
          <option value="level2">🔥🔥 Picante</option>
          <option value="level3">🔥🔥🔥 Extremo</option>
          <option value="level4">🔥🔥🔥🔥 SEXO</option>
        </select>

        <button
          onClick={startGame}
          className="w-full bg-red-600 hover:bg-red-800 text-white py-3 font-bold rounded transition"
        >
          Comenzar Juego
        </button>
      </div>
    </div>
  );
};

export default Home;
