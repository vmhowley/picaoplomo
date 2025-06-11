import React from "react";

const LimitsForm = ({ players, limits, setLimits }) => {
  const options = ["besos", "contacto físico", "quitar ropa", "sexo oral", "juguetes sexuales"];

  const toggleLimit = (player, option) => {
    const current = limits[player] || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    setLimits(prev => ({ ...prev, [player]: updated }));
  };

  return (
    <div className="limits-form">
      <h2>Define límites por jugador</h2>
      <h2>Al seleccionar un limite se excluyen las cartas de ese tipo para el jugador que la selecciono </h2>
      {players.map(player => (
        <div key={player} style={{ marginBottom: "1rem" }}>
          <h4>{player}</h4>
          {options.map(option => (
            <label key={option} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={(limits[player] || []).includes(option)}
                onChange={() => toggleLimit(player, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LimitsForm;