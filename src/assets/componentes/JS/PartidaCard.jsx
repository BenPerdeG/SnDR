import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "../CSS/PartidaCard.css";
import Gris from "../../images/gris.jpg"; 

const PartidaCard = ({ partida, buttonText = 'Unirte', onButtonClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick(partida);
    } else {
      navigate(`/partida/${partida.id}`);
    }
  };

  return (
    <div className="partida-card">
      <div className="partida-image-container">
        {partida.imagen ? (
          <img src={partida.imagen} alt={partida.nombre} className="partida-image" />
        ) : (
          <img src={Gris} alt="Default partida" className="partida-image" />
        )}
      </div>
      <div className="partida-info">
        <h2>{partida.nombre}</h2>
        <p>{partida.descripcion}</p>
      </div>
      <button
        className="enter-btn"
        onClick={handleButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

PartidaCard.propTypes = {
  partida: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    imagen: PropTypes.string,
  }).isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default PartidaCard;