import React, { useState } from "react";
import { cards } from "./cards"; // tu objeto con las cartas

export default function GameSetup() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedType, setSelectedType] = useState("truth");
  const [players, setPlayers] = useState([""]);
  const [difficulty, setDifficulty] = useState("level1");
  const [gameStarted, setGameStarted] = useState(false);

  // Añadir jugador
  const addPlayer = () => setPlayers([...players, ""]);
  // Cambiar nombre de jugador
  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  // Iniciar juego: bloquea cambios
  const startGame = () => {
    if (players.some((p) => p.trim() === "")) {
      alert("Por favor ingresa nombre para todos los jugadores");
      return;
    }
    setGameStarted(true);
    setSelectedLevel(difficulty); // usar el nivel elegido
  };

  // Cartas filtradas por tipo y nivel
  const filteredCards = selectedLevel
    ? cards[selectedLevel].filter((card) => card.type === selectedType)
    : [];

  return (
    <div>
      {!gameStarted ? (
        <>
          <h2>Configura tu juego</h2>

          <div>
            <label>Nombres de jugadores:</label>
            {players.map((p, i) => (
              <input
                key={i}
                type="text"
                value={p}
                onChange={(e) => updatePlayerName(i, e.target.value)}
                placeholder={`Jugador ${i + 1}`}
              />
            ))}
            <button onClick={addPlayer}>Agregar jugador</button>
          </div>

          <div>
            <label>Nivel de dificultad:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="level1">Suave (Nivel 1)</option>
              <option value="level2">Medio (Nivel 2)</option>
              <option value="level3">Picante (Nivel 3)</option>
              {/* Aquí puedes agregar level4_extreme si lo tienes */}
            </select>
          </div>

          <div>
            <label>Tipo de carta:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="truth">Verdad</option>
              <option value="dare">Reto</option>
              <option value="punishment">Castigo</option>
            </select>
          </div>

          <button onClick={startGame}>Iniciar Juego</button>
        </>
      ) : (
        <>
          <h2>Juego iniciado - Nivel: {selectedLevel}</h2>
          <p>Jugadores: {players.join(", ")}</p>

          <h3>Cartas tipo: {selectedType}</h3>
          <ul>
            {filteredCards.length === 0 && (
              <li>No hay cartas de este tipo en este nivel.</li>
            )}
            {filteredCards.map((card, idx) => (
              <li key={idx}>{card.text}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
