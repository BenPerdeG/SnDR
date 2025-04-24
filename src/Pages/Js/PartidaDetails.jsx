import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNav from "../../assets/componentes/JS/TopNav.jsx"; // ✅ Asegúrate de que el path sea correcto
import "../Css/PartidaDetails.css";

const PartidaDetails = ({ setIsPopUp }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partida, setPartida] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartida = async () => {
      try {
        const response = await fetch(`https://sndr.42web.io/inc/getPartida.php?id=${id}`, {
          method: "GET",
          credentials: "include",
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`El servidor respondió con formato inválido: ${text.substring(0, 100)}...`);
        }

        if (!response.ok || !data.success) {
          if (data.message === "No tienes acceso a esta partida") {
            navigate("/acceso-denegado", {
              state: {
                message: "No tienes permisos para ver esta partida",
                redirectTo: "/search",
              },
            });
            return;
          }
          throw new Error(data.message || `Error ${response.status}`);
        }

        setPartida(data.partida);
      } catch (err) {
        console.error("Error al cargar la partida:", err);
        setError(err.message);
      }
    };

    fetchPartida();
  }, [id, navigate]);

  if (error) {
    return <div className="partida-details-container"><p>Error al cargar la partida: {error}</p></div>;
  }

  if (!partida) {
    return <div className="partida-details-container"><p>Cargando partida...</p></div>;
  }

  const renderAvatar = (avatar, nombre, size = 60) => {
    return avatar ? (
      <img
        src={`/img/avatars/${avatar}`}
        alt={`Avatar de ${nombre}`}
        className="player-avatar"
        style={{ width: size, height: size }}
      />
    ) : (
      <div className="icon-avatar" style={{ width: size, height: size }}>
        {nombre.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <>
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      <div className="partida-details-container">
        <div className="partida-details-content">
          <div className="partida-header">
            <h1>{partida.nombre}</h1>
          </div>

          <div className="partida-main-content">
            {/* Columna izquierda */}
            <div className="partida-left-column">
              <div className="partida-image-container">
                <div className="partida-image-placeholder">
                  {partida.imagen ? (
                    <img
                      src={`/img/partidas/${partida.imagen}`}
                      alt="Imagen de la partida"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                    />
                  ) : (
                    <div className="image-upload-text">
                      <p>📜</p>
                      <p className="image-size-hint">Imagen de la partida aún no definida</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="partida-info">
                <h2>Descripción</h2>
                <p>{partida.descripcion}</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="partida-right-column">
              <div className="created-by-section">
                <h3>Creada por</h3>
                <div className="creator-info">
                  {renderAvatar(partida.admin.avatar, partida.admin.nombre, 80)}
                  <div className="creator-details">
                    <p className="creator-name">{partida.admin.nombre}</p>
                    <p className="creator-membership">Administrador</p>
                  </div>
                </div>
              </div>

              <div className="players-section">
                <h3>Jugadores</h3>
                <div className="players-grid">
                  {partida.jugadores.map((j) => (
                    <div className="player-card" key={j.id}>
                      {renderAvatar(j.avatar, j.nombre)}
                      <p className="player-name">{j.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartidaDetails;
