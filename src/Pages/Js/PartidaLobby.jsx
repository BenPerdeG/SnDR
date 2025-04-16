import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import "../Css/PartidaLobby.css"; 

const PartidaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch this data from an API based on the ID
  const partidas = [
    { id: 1, name: "Dragón Sombrío", description: "Aventura en un castillo maldito." },
    { id: 2, name: "El Bosque Perdido", description: "Explora un bosque lleno de misterios." },
    // ... other partidas
  ];
  
  const partida = partidas.find(p => p.id === parseInt(id));

  if (!partida) {
    return <div>Partida no encontrada</div>;
  }

  return (
    <div className="partida-details-container">
      <header className="LoginHeader">
        <TopNav />
      </header>

      <div className="partida-details-content">
        <h1>{partida.name}</h1>
        <div className="partida-image-placeholder"></div>
        <div className="partida-info">
          <h2>Descripción:</h2>
          <p>{partida.description}</p>
        </div>
        <button 
          className="join-button"
          onClick={() => {
            // Logic to join the game would go here
            alert(`Te has unido a ${partida.name}`);
          }}
        >
          Unirse a la Partida
        </button>
      </div>
    </div>
  );
};

export default PartidaDetails;