import { useState, useEffect, useRef } from "react";
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

  // Modo entrenamiento
  const [trainingMode, setTrainingMode] = useState(false);
  const [trainingSelectedCard, setTrainingSelectedCard] = useState(null);

  // Temporizador para avanzar cartas automáticamente
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  const levels = ["level1", "level2", "level3", "level4", "level4_extreme"];
  const options = ["besos", "contacto físico", "quitar ropa", "sexo oral", "juguetes sexuales"];
  const AUTO_ADVANCE_SECONDS = 100; // segundos para avanzar automáticamente

  // Agrega un jugador
  const addPlayer = () => {
    if (players.length < 8) setPlayers([...players, ""]);
    else alert("Máximo 8 jugadores");
  };

  // Actualiza nombre jugador
  const updatePlayer = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  // Iniciar juego y mostrar límites
  const startGame = () => {
    const filtered = players.map(p => p.trim()).filter(Boolean);
    if (filtered.length < 2) return alert("Agrega al menos 2 jugadores");
    setPlayers(filtered);
    setShowLimits(true);
  };

  // Alternar límite por jugador
  const toggleLimit = (player, option) => {
    const current = limits[player] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    setLimits(prev => ({ ...prev, [player]: updated }));
  };

  // Confirmar límites y preparar deck
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

  // Verifica si la carta se ajusta a los límites del jugador
  const cardFitsLimits = (cardText, playerLimits) => {
    if (!playerLimits || playerLimits.length === 0) return true;
    return !playerLimits.some(limit => cardText.toLowerCase().includes(limit));
  };

  // Lee el texto en voz alta usando speechSynthesis
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancelar cualquier lectura previa
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES"; // Cambia según el idioma deseado
    window.speechSynthesis.speak(utterance);
  };

  // Avanzar a la siguiente carta filtrando por límites y reiniciar temporizador
  const nextCard = () => {
    setTimerActive(false); // Reiniciar timer para evitar múltiples ejecuciones
    window.speechSynthesis.cancel();

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

  // Lanzar castigo al azar
  const punish = () => {
    const punishment = cards.punishments[Math.floor(Math.random() * cards.punishments.length)];
    setActiveCard({ text: `Castigo para ${players[currentPlayerIndex]}: ${punishment}` });
    window.speechSynthesis.cancel();
    speakText(`Castigo para ${players[currentPlayerIndex]}: ${punishment}`);
  };

  // Subir de nivel y resetear mazo con cartas filtradas
  const increaseLevel = () => {
    const currentIndex = levels.indexOf(level);
    if (currentIndex === -1 || currentIndex >= levels.length - 1) {
      alert("Ya estás en el nivel más alto");
      return;
    }

    const nextLevel = levels[currentIndex + 1];
    setLevel(nextLevel);

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
      speakText(firstCard.text);
      setTimerActive(true);
    }

    alert(`Nivel aumentado a ${nextLevel.toUpperCase()} 🔥 Solo se mostrarán cartas de este nivel.`);
  };

  // Reiniciar juego
  const resetGame = () => {
    setPlayers([""]);
    setLevel("level1");
    setStarted(false);
    setShowLimits(false);
    setLimits({});
    setDeck([]);
    setActiveCard(null);
    setCurrentPlayerIndex(0);
    setTrainingMode(false);
    setTrainingSelectedCard(null);
    window.speechSynthesis.cancel();
    setTimerActive(false);
  };

  // Al cambiar activeCard, reproducir voz y reiniciar temporizador automático
  useEffect(() => {
    if (!activeCard || !started) return;

    speakText(activeCard.text);
    setTimerActive(true);

    return () => {
      window.speechSynthesis.cancel();
      setTimerActive(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeCard, started]);

  // Temporizador para avanzar automáticamente a la siguiente carta
  useEffect(() => {
    if (!timerActive) return;

    timerRef.current = setTimeout(() => {
      nextCard();
    }, AUTO_ADVANCE_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive]);

  // Cartas para modo entrenamiento
  const trainingCards = level === "random"
    ? levels.flatMap(lvl => cards[lvl])
    : cards[level];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-6 select-none"> Rouge Secrets 🤫🤭</h1>

      {!started && !showLimits && !trainingMode && (
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
            <option className="bg-gray-800" value="level4_extreme">Extremo - Kamasutra</option>
            <option className="bg-gray-800" value="random">Random 🎲</option>
          </select>

          <button
            className="bg-pink-600 hover:bg-pink-700 rounded-md py-3 w-full font-bold mb-3"
            onClick={startGame}
          >
            Comenzar Juego
          </button>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 rounded-md py-2 w-full font-semibold"
            onClick={() => setTrainingMode(true)}
          >
            Modo Entrenamiento
          </button>
        </div>
      )}

      {trainingMode && (
        <div className="w-full max-w-md bg-black/30 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4 select-none">Modo Entrenamiento</h2>
          <select
            className="w-full mb-4 rounded-md p-2 text-white placeholder-white border"
            onChange={(e) => {
              const selected = trainingCards.find(c => c.text === e.target.value);
              setTrainingSelectedCard(selected);
              if (selected) speakText(selected.text);
            }}
            defaultValue=""
          >
            <option value="" disabled>Selecciona una carta</option>
            {trainingCards.map((c, idx) => (
              <option key={idx} value={c.text}>{c.text.slice(0, 40)}...</option>
            ))}
          </select>

          {trainingSelectedCard && (
            <div className="bg-pink-700 rounded-xl p-4 text-xl font-semibold select-text max-h-40 overflow-y-auto mb-4">
              {trainingSelectedCard.text}
            </div>
          )}

          <button
            className="bg-gray-700 hover:bg-gray-800 rounded-md py-2 px-4 font-semibold mr-2"
            onClick={() => setTrainingSelectedCard(null)}
          >
            Limpiar
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 rounded-md py-2 px-4 font-semibold"
            onClick={() => setTrainingMode(false)}
          >
            Salir Modo Entrenamiento
          </button>
        </div>
      )}

      {showLimits && (
        <div className="w-full max-w-md bg-black/30 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 select-none">
            Configura límites personales (por jugador)
          </h2>

          {players.map((p, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold mb-2">{p}</h3>
              <div className="flex flex-wrap gap-2">
                {options.map(option => (
                  <button
                    key={option}
                    className={`px-3 py-1 rounded-md font-semibold ${
                      (limits[p]?.includes(option)) ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => toggleLimit(p, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            className="bg-pink-600 hover:bg-pink-700 rounded-md py-3 w-full font-bold"
            onClick={confirmLimits}
          >
            Confirmar y Empezar
          </button>
        </div>
      )}

      {started && !showLimits && (
        <div className="w-full max-w-md bg-black/30 rounded-xl p-6 shadow-lg text-center select-none">
          <h2 className="text-2xl font-semibold mb-4">Turno de: {players[currentPlayerIndex]}</h2>

          <div className="bg-pink-700 rounded-xl p-6 text-center max-h-48 overflow-y-auto text-xl font-semibold select-text mb-4">
            {activeCard ? activeCard.text : "No hay carta activa."}
          </div>

          <div className="flex gap-4 w-full justify-center flex-wrap">
            <button
              className="bg-pink-600 hover:bg-pink-700 rounded-md py-3 px-6 font-semibold"
              onClick={() => {
                setTimerActive(false);
                nextCard();
              }}
            >
              Siguiente carta
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 rounded-md py-3 px-6 font-semibold"
              onClick={() => {
                setTimerActive(false);
                punish();
              }}
            >
              Castigo
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-md py-3 px-6 font-semibold"
              onClick={() => {
                setTimerActive(false);
                increaseLevel();
              }}
            >
              Subir nivel
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-800 rounded-md py-3 px-6 font-semibold"
              onClick={resetGame}
            >
              Reiniciar juego
            </button>
          </div>

          <p className="mt-4 text-sm select-text italic">
            La carta se leerá automáticamente y avanzará en {window.bindTimeout} segundos.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
