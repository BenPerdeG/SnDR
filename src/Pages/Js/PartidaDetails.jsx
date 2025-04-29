import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../../assets/componentes/JS/TopNav";
import Login from "../../assets/componentes/JS/LoginComp";
import "../Css/PartidaDetails.css";
import { useUser } from "../../context/UserContext";

const PartidaDetails = ({ isPopUp, setIsPopUp }) => {
  const { id } = useParams();
  const { user } = useUser();
  const [partida, setPartida] = useState(null);
  const [error, setError] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [editedNombre, setEditedNombre] = useState("");
  const [editedDescripcion, setEditedDescripcion] = useState("");
  const [editedImagen, setEditedImagen] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPartida = async () => {
      try {
        const response = await fetch(
          `https://sndr.42web.io/inc/getPartida.php?id=${id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success) {
          setPartida(data.partida);
          setEditedNombre(data.partida.nombre);
          setEditedDescripcion(data.partida.descripcion);
          setEditedImagen(data.partida.imagen || "");
          setIsPrivate(data.partida.private === 1);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error al cargar los datos de la partida");
      }
    };

    fetchPartida();
  }, [id]);

  // Verificación más estricta de usuario y permisos
  const isAdmin = user && partida && user.id === partida.id_admin;

  const handlePrivacyChange = async (e) => {
    if (!isAdmin) return;
    
    const newValue = e.target.checked;
    setIsPrivate(newValue);
    try {
      await fetch('https://sndr.42web.io/inc/updatePrivacy.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: partida.id,
          private: newValue ? 1 : 0 
        })
      });
    } catch (error) {
      setIsPrivate(!newValue);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    try {
      const response = await fetch("https://sndr.42web.io/inc/updatePartida.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: partida.id,
          nombre: editedNombre,
          descripcion: editedDescripcion,
          imagen: editedImagen
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPartida({
          ...partida,
          nombre: editedNombre,
          descripcion: editedDescripcion,
          imagen: editedImagen
        });
        setShowForm(false);
      }
    } catch (err) {
      alert("Error de red");
    }
  };

  if (!user) {
    return <div className="partida-details-container">Por favor inicia sesión para ver los detalles de la partida</div>;
  }

  return (
    <div className="partida-details-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}

      {error && <p className="error-message">{error}</p>}

      {partida && (
        <div className="partida-details-content">
          <div className="partida-header">
            <h1>{partida.nombre}</h1>
            {/* Botón SOLO visible para admin */}
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="toggle-form-button"
              >
                {showForm ? "Ocultar Formulario" : "Editar Partida"}
              </button>
            )}
          </div>

          <div className="partida-main-content">
            <div className="partida-left-column">
              <div className="partida-info">
                <h2>Descripción</h2>
                <p>{partida.descripcion}</p>
              </div>
              
          
              {isAdmin && showForm && (
                <form className="edit-partida-form" onSubmit={handleUpdate}>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={editedNombre}
                      onChange={(e) => setEditedNombre(e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción:
                    <textarea
                      value={editedDescripcion}
                      onChange={(e) => setEditedDescripcion(e.target.value)}
                    />
                  </label>
                  <label>
                    Imagen (URL):
                    <input
                      type="text"
                      value={editedImagen}
                      onChange={(e) => setEditedImagen(e.target.value)}
                    />
                  </label>
                  <label className="figma-private-btn">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={handlePrivacyChange}
                      disabled={!isAdmin}
                    />
                    <span>Privada</span>
                  </label>
                  <button type="submit">Guardar Cambios</button>
                </form>
              )}
            </div>

            <div className="partida-right-column">
              <div className="partida-image-placeholder">
                {partida.imagen ? (
                  <img src={partida.imagen} alt="Imagen de partida" />
                ) : (
                  <div className="image-upload-text">
                    <p>🖼️</p>
                    <p>Sin imagen de partida</p>
                  </div>
                )}
              </div>

              <div className="created-by-section">
                <h3>Creado por</h3>
                <div className="creator-info">
                  <img
                    src={partida.admin?.avatar || "/default-avatar.png"}
                    alt="Avatar del administrador"
                    className="creator-avatar"
                  />
                  <div className="creator-details">
                    <p className="creator-name">{partida.admin?.nombre || "Administrador"}</p>
                    <p className="creator-membership">Administrador</p>
                  </div>
                </div>
              </div>

              <div className="players-section">
                <h3>Jugadores</h3>
                <div className="players-grid">
                  {partida.jugadores?.map((jugador) => (
                    <div key={jugador.id} className="player-card">
                      {jugador.avatar ? (
                        <img
                          src={jugador.avatar}
                          alt={jugador.nombre}
                          className="player-avatar"
                        />
                      ) : (
                        <div className="icon-avatar small">👤</div>
                      )}
                      <p className="player-name">{jugador.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartidaDetails;