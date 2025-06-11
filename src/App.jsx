import { useState } from "react";
import { cards } from "./data/Cards";

const App = () => {
  const [players, setPlayers] = useState([""]);
  const [level, setLevel] = useState("level1");
  const [started, setStarted] = useState(false);
  const [showLimits, setShowLimits] = useState(false);
  const [limits, setLimits] = useState({});
  const [deck, setDeck] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const levels = ["level1", "level2", "level3", "level4"];
  const options = ["besos", "contacto físico", "quitar ropa", "sexo oral", "juguetes sexuales"];

  const addPlayer = () => {
    if (players.length < 8) setPlayers([...players, ""]);
    else alert("Máximo 8 jugadores");
  };

  const updatePlayer = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    const filtered = players.map(p => p.trim()).filter(Boolean);
    if (filtered.length < 2) return alert("Agrega al menos 2 jugadores");
    setPlayers(filtered);
    setShowLimits(true);
  };

  const toggleLimit = (player, option) => {
    const current = limits[player] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    setLimits(prev => ({ ...prev, [player]: updated }));
  };

  const confirmLimits = () => {
    let newDeck = [];
    if (level === "random") {
      levels.forEach(lvl => newDeck.push(...cards[lvl]));
    } else {
      newDeck = [...cards[level]];
    }
    newDeck = newDeck.sort(() => Math.random() - 0.5);
    const [firstCard, ...restDeck] = newDeck;
setActiveCard(firstCard);
setDeck(restDeck);
    setStarted(true);
    setShowLimits(false);
  };

  const cardFitsLimits = (cardText, playerLimits) => {
    if (!playerLimits || playerLimits.length === 0) return true;
    return !playerLimits.some(limit => cardText.toLowerCase().includes(limit));
  };

  const nextCard = () => {
    setCurrentPlayerIndex(prev => {
      const nextIndex = (prev + 1) % players.length;
      const nextPlayer = players[nextIndex];
      const playerLimits = limits[nextPlayer] || [];

      const validCardIndex = deck.findIndex(c => cardFitsLimits(c.text, playerLimits));
      if (validCardIndex === -1) {
        setActiveCard({ text: `No hay cartas válidas para ${nextPlayer} respetando sus límites.` });
        return prev;
      }

      const selectedCard = deck[validCardIndex];
      setActiveCard(selectedCard);
      setDeck(deck.filter((_, idx) => idx !== validCardIndex));
      return nextIndex;
    });
  };

  const punish = () => {
    const punishment = cards.punishments[Math.floor(Math.random() * cards.punishments.length)];
    setActiveCard({ text: `Castigo para ${players[currentPlayerIndex]}: ${punishment}` });
  };

  const increaseLevel = () => {
  const currentIndex = levels.indexOf(level);
  if (currentIndex === -1 || currentIndex >= levels.length - 1) {
    alert("Ya estás en el nivel más alto");
    return;
  }

  const nextLevel = levels[currentIndex + 1];
  setLevel(nextLevel);

  // Reemplazar mazo con nuevas cartas del nivel seleccionado
  let newDeck = [...cards[nextLevel]].sort(() => Math.random() - 0.5);
  const currentPlayer = players[currentPlayerIndex];
  const playerLimits = limits[currentPlayer] || [];
  const validCardIndex = newDeck.findIndex(c => cardFitsLimits(c.text, playerLimits));

  if (validCardIndex === -1) {
    setActiveCard({ text: `No hay cartas válidas para ${currentPlayer} en el nuevo nivel.` });
    setDeck([]);
  } else {
    const [firstCard] = newDeck.splice(validCardIndex, 1);
    setActiveCard(firstCard);
    setDeck(newDeck);
  }

  alert(`Nivel aumentado a ${nextLevel.toUpperCase()} 🔥 Solo se mostrarán cartas de este nivel.`);
};
  const resetGame = () => {
    setPlayers([""]);
    setLevel("level1");
    setStarted(false);
    setShowLimits(false);
    setLimits({});
    setDeck([]);
    setActiveCard(null);
    setCurrentPlayerIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-6 select-none"> Rouge Secrets 🤫🤭</h1>

      {!started && !showLimits && (
        <div className="w-full max-w-md bg-black/40 bg-opacity-20 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl mb-4 font-semibold">Jugadores</h2>
          {players.map((p, i) => (
            <input
              key={i}
              className="w-full mb-3 rounded-md p-2 text-white placeholder-white/40 border focus:outline-none"
              placeholder={`Jugador ${i + 1}`}
              value={p}
              onChange={(e) => updatePlayer(i, e.target.value)}
              maxLength={20}
            />
          ))}
          <button
            className="mb-5 bg-pink-500 hover:bg-pink-600 rounded-md py-2 px-4 w-full font-semibold"
            onClick={addPlayer}
          >
            + Agregar jugador
          </button>

          <h2 className="text-xl mb-2 font-semibold">Nivel 🔥</h2>
          <select
            className="w-full mb-5 rounded-md p-2 text-white placeholder-white border"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option className="bg-gray-800" value="level1">Coqueteo 💋</option>
            <option className="bg-gray-800" value="level2">Contacto 🤤</option>
            <option className="bg-gray-800" value="level3">Hardcore 🔥</option>
            <option className="bg-gray-800" value="level4">Sexo Total 🚫🧼</option>
            <option className="bg-gray-800" value="random">Random 🎲</option>
          </select>

          <button
            className="bg-pink-600 hover:bg-pink-700 rounded-md py-3 w-full font-bold"
            onClick={startGame}
          >
            Comenzar Juego
          </button>
        </div>
      )}

      {showLimits && !started && (
        <div className="w-full max-w-lg bg-black/40 bg-opacity-20 rounded-xl p-6 shadow-lg  text-center">
          <h2 className="text-2xl font-semibold mb-4 ">Define límites por jugador</h2>
            <p className="text-xs bg-white/20 rounded p-2 text-center m-4 ">Al seleccionar un limite se excluyen las cartas de ese tipo para el jugador que la selecciono  <br/> <p className="text-red-500 text-sm">No selecciones nada si no quieres limites!</p> </p>

          {players.map(player => (
            <div key={player} className="mb-5">
              <h3 className="font-semibold mb-2">{player}</h3>
              <div className="flex flex-wrap gap-2">
                {options.map(option => (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-full px-3 py-1 border ${
                      (limits[player] || []).includes(option)
                        ? "bg-pink-600 border-pink-600 text-white"
                        : "border-gray-300 text-gray-300 hover:bg-pink-600 hover:text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={(limits[player] || []).includes(option)}
                      onChange={() => toggleLimit(player, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            className="bg-pink-600 hover:bg-pink-700 rounded-md py-3 w-full font-bold"
            onClick={confirmLimits}
          >
            Empezar partida
          </button>
          <button
            className="mt-3 text-sm text-pink-300 underline"
            onClick={() => setShowLimits(false)}
          >
            Volver atrás
          </button>
        </div>
      )}

      {started && (
        <div className="w-full max-w-xl bg-black/40 bg-opacity-20 rounded-xl p-6 shadow-lg flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold">
            Turno de <span className="underline">{players[currentPlayerIndex]}</span>
          </h2>

          <div className="bg-pink-700 rounded-xl p-5 w-full text-center min-h-[100px] flex items-center justify-center text-lg font-semibold">
            {activeCard ? activeCard.text : "No hay carta activa"}
          </div>

          <div className="flex flex-wrap gap-3 w-full justify-center">
            <button
              onClick={nextCard}
              className="bg-pink-600 hover:bg-pink-700 rounded-md py-2 px-5 font-semibold"
            >
              Siguiente carta
            </button>
            <button
              onClick={punish}
              className="bg-red-600 hover:bg-red-700 rounded-md py-2 px-5 font-semibold"
            >
              Castigo
            </button>
            <button
              onClick={increaseLevel}
              className="bg-yellow-600 hover:bg-yellow-700 rounded-md py-2 px-5 font-semibold"
            >
              Subir Nivel
            </button>
            <button
              onClick={resetGame}
              className="bg-gray-600 hover:bg-gray-700 rounded-md py-2 px-5 font-semibold"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 text-xs text-pink-300 select-none">
        Juego creado con ❤️ para momentos picantes entre amigos.
      </footer>
    </div>
  );
};

export default App;
