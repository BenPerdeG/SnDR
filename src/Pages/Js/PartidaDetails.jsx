import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, UserPlus, User, Users } from "lucide-react";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import "../Css/PartidaDetails.css";

const PartidaDetails = ({ isPopUp, setIsPopUp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartida = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Añadimos timestamp para evitar caché
      const timestamp = Date.now();
      const response = await fetch(
        `https://sndr.42web.io/inc/getPartida.php?id=${id}&t=${timestamp}`,
        {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          }
        }
      );

      // Depuración: mostramos la respuesta cruda
      const text = await response.text();
      console.log("Respuesta cruda del servidor:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`El servidor respondió con formato inválido: ${text.substring(0, 100)}...`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      if (!data.partida) {
        throw new Error("Estructura de datos incorrecta del servidor");
      }

      setPartida({
        id: data.partida.id,
        name: data.partida.nombre,
        description: data.partida.descripcion,
        isPrivate: data.partida.private,
        createdBy: {
          id: data.partida.admin.id,
          name: data.partida.admin.nombre,
          avatar: data.partida.admin.avatar,
          hoursPlayed: data.partida.admin.horas_jugadas || 0
        },
        players: data.partida.jugadores.map(jugador => ({
          id: jugador.id,
          name: jugador.nombre,
          avatar: jugador.avatar
        })),
        maxPlayers: data.partida.max_jugadores || 6
      });

    } catch (error) {
      console.error("Error al cargar partida:", error);
      setError(`Error al cargar la partida: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartida();
  }, [id]);

  const AvatarComponent = ({ avatar, name, isAdmin = false }) => {
    if (avatar && !avatar.includes('default-avatar.png') && !avatar.includes('default-player.png')) {
      return (
        <img 
          src={avatar} 
          alt={name}
          className={isAdmin ? "creator-avatar" : "player-avatar"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = isAdmin ? "default-avatar.png" : "default-player.png";
          }}
          loading="lazy"
        />
      );
    }
    
    return isAdmin ? (
      <div className="icon-avatar creator-icon">
        <User size={48} />
      </div>
    ) : (
      <div className="icon-avatar player-icon">
        <Users size={32} />
      </div>
    );
  };

  const handleJoinGame = () => {
    if (partida.isPrivate && !partida.players.some(p => p.id === partida.createdBy.id)) {
      alert("Debes ser invitado para unirte a esta partida privada");
      return;
    }
    navigate(`/game/${partida.id}`);
  };

  if (loading) {
    return (
      <div className="partida-details-container">
        <header className="LoginHeader">
          <TopNav setIsPopUp={setIsPopUp} />
        </header>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando detalles de la partida...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="partida-details-container">
        <header className="LoginHeader">
          <TopNav setIsPopUp={setIsPopUp} />
        </header>
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()}>Reintentar</button>
            <button onClick={() => navigate(-1)}>Volver atrás</button>
          </div>
        </div>
      </div>
    );
  }

  if (!partida) {
    return (
      <div className="partida-details-container">
        <header className="LoginHeader">
          <TopNav setIsPopUp={setIsPopUp} />
        </header>
        <div className="no-partida">
          <h2>No se encontró la partida</h2>
          <p>La partida solicitada no existe o fue eliminada</p>
          <button onClick={() => navigate('/search')}>Buscar partidas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="partida-details-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      <div className="partida-details-content">
        <div className="partida-header">
          <h1>{partida.name}</h1>
          {partida.isPrivate && (
            <span className="private-badge">PRIVADA</span>
          )}
        </div>

        <div className="partida-main-content">
          <div className="partida-left-column">
            <div className="partida-image-container">
              <div className="partida-image-placeholder">
                <div className="image-upload-text">
                  <p>Arrastra una imagen</p>
                  <p>o</p>
                  <button className="choose-file-button">Sube una imagen...</button>
                </div>
              </div>
            </div>

            <div className="partida-info">
              <h2>Descripción:</h2>
              <p>{partida.description || "No hay descripción disponible"}</p>
            </div>

            <div className="partida-controls">
              <button 
                className="control-button primary"
                onClick={handleJoinGame}
              >
                <Play size={18} />
                <span>Entrar a la partida</span>
              </button>
            </div>
          </div>

          <div className="partida-right-column">
            <div className="created-by-section">
              <h3>CREADO POR</h3>
              <div className="creator-info">
                <AvatarComponent 
                  avatar={partida.createdBy.avatar} 
                  name={partida.createdBy.name}
                  isAdmin
                />
                <div className="creator-details">
                  <p className="creator-name">{partida.createdBy.name}</p>
                  <p className="creator-hours">
                    Horas jugadas: {partida.createdBy.hoursPlayed}
                  </p>
                </div>
              </div>
            </div>

            <div className="players-section">
              <div className="players-header">
                <h3>
                  {partida.players.length} / {partida.maxPlayers} JUGADORES
                </h3>
                <button 
                  className="invite-button" 
                  onClick={() => alert(`Invitando jugadores a ${partida.name}`)}
                >
                  <UserPlus size={18} />
                  <span>Invitar Jugadores</span>
                </button>
              </div>

              <div className="players-grid">
                {partida.players.map((player) => (
                  <div key={player.id} className="player-card">
                    <AvatarComponent 
                      avatar={player.avatar} 
                      name={player.name}
                    />
                    <p className="player-name">{player.name}</p>
                  </div>
                ))}

                {Array.from({ length: partida.maxPlayers - partida.players.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="player-card empty">
                    <div className="empty-avatar"></div>
                    <p className="empty-name">Vacante</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default PartidaDetails;