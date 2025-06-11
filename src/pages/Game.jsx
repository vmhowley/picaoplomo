import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cards } from "../data/Cards.js";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, level } = location.state || {};

  // Si no hay jugadores, volvemos a home
  useEffect(() => {
    if (!players || players.length < 2) navigate("/");
  }, [players, navigate]);

  // Estado del juego
  const [deck, setDeck] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Para controlar que no se repitan cartas para el mismo jugador, guardamos índices usados por jugador
  const [usedIndicesByPlayer, setUsedIndicesByPlayer] = useState(
    Array(players?.length).fill(null).map(() => new Set())
  );

  useEffect(() => {
    if (level && cards[level]) {
      // Barajamos el mazo
      const shuffled = [...cards[level]].sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setActiveCard(null);
      setCurrentPlayerIndex(0);
      setUsedIndicesByPlayer(Array(players.length).fill(null).map(() => new Set()));
    }
  }, [level, players]);

  const getNextCard = () => {
    if (!deck.length) {
      setActiveCard({ text: "Fin del mazo. Selecciona otro nivel o vuelve al inicio." });
      return;
    }

    const currentPlayerSet = new Set(usedIndicesByPlayer[currentPlayerIndex]);

    // Buscamos la primera carta que el jugador no haya recibido
    let nextIndex = -1;
    for (let i = 0; i < deck.length; i++) {
      if (!currentPlayerSet.has(i)) {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex === -1) {
      // Ya no hay cartas nuevas para este jugador, damos una carta al azar
      nextIndex = Math.floor(Math.random() * deck.length);
    }

    const nextCard = deck[nextIndex];

    // Actualizamos cartas usadas para el jugador
    const newUsedIndicesByPlayer = usedIndicesByPlayer.map((set, idx) => {
      if (idx === currentPlayerIndex) {
        const newSet = new Set(set);
        newSet.add(nextIndex);
        return newSet;
      }
      return set;
    });
    setUsedIndicesByPlayer(newUsedIndicesByPlayer);

    // Removemos la carta del mazo
    const newDeck = deck.filter((_, idx) => idx !== nextIndex);
    setDeck(newDeck);

    // Mostramos carta y cambiamos jugador para la próxima vez
    setActiveCard(nextCard);
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const handleNext = () => {
    getNextCard();
  };

  const handlePunish = () => {
    const punish = cards.castigo[Math.floor(Math.random() * cards.castigo.length)];
    setActiveCard(punish);
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const handleLevelUp = () => {
    const levels = ["level1", "level2", "level3", "level4"];
    const currentIndex = levels.indexOf(level);
    if (currentIndex < levels.length - 1) {
      navigate("/", { replace: true });
      setTimeout(() => {
        navigate("/game", { state: { players, level: levels[currentIndex + 1] } });
      }, 100);
    } else {
      alert("Ya estás en el nivel máximo 🔥🔥🔥🔥");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-pink-600 to-purple-700 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-extrabold mb-6">🔥 Carta Caliente 🔥</h1>

      <div className="bg-black rounded-lg p-6 max-w-lg w-full shadow-lg backdrop-blur-md">
        <h2 className="text-xl mb-4 font-semibold">
          Turno de: <span className="underline">{players[currentPlayerIndex]}</span>
        </h2>

        <div className="min-h-[100px] mb-6 text-lg font-medium bg-pink-900 bg-opacity-70 rounded p-4 flex items-center justify-center">
          {activeCard ? activeCard.text : "Presiona 'Siguiente carta' para empezar"}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNext}
            className="bg-pink-500 hover:bg-pink-700 py-2 px-5 rounded font-semibold transition"
          >
            Siguiente carta
          </button>
          <button
            onClick={handlePunish}
            className="bg-purple-700 hover:bg-purple-900 py-2 px-5 rounded font-semibold transition"
          >
            No quiero cumplir 😈
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBackHome}
            className="bg-gray-600 hover:bg-gray-800 px-4 py-2 rounded"
          >
            Volver al inicio
          </button>
          <button
            onClick={handleLevelUp}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Subir nivel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game
