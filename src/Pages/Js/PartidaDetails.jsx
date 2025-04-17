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

  useEffect(() => {
    const fetchPartida = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`https://sndr.42web.io/inc/getPartida.php?id=${id}&t=${timestamp}`, {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.partida) {
          setPartida({
            id: data.partida.id,
            name: data.partida.nombre,
            description: data.partida.descripcion,
            createdBy: {
              id: data.partida.admin_id,
              name: data.partida.admin_nombre,
              avatar: data.partida.admin_avatar,
              hoursPlayed: data.partida.admin_horas_jugadas || 0
            },
            players: data.partida.jugadores.map(jugador => ({
              id: jugador.id,
              name: jugador.nombre,
              avatar: jugador.avatar
            })),
            maxPlayers: data.partida.max_jugadores || 6
          });
        } else {
          setError(data.message || "Partida no encontrada");
        }
      } catch (error) {
        console.error("Error fetching partida:", error);
        setError(`Error al cargar la partida: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPartida();
  }, [id]);

  // Componente para mostrar avatar o icono de fallback
  const AvatarComponent = ({ avatar, name, isAdmin = false }) => {
    if (avatar && !avatar.includes('default-avatar.png') && !avatar.includes('default-player.png')) {
      return (
        <img 
          src={avatar} 
          alt={name}
          className={isAdmin ? "creator-avatar" : "player-avatar"}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
          loading="lazy"
        />
      );
    }
    
    // Mostrar icono si no hay avatar válido
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

  if (loading) return (
    <div className="partida-details-container">
      <div className="loading">Cargando partida...</div>
    </div>
  );

  if (error) return (
    <div className="partida-details-container">
      <div className="error">{error}</div>
      <button onClick={() => window.location.reload()} className="retry-button">
        Reintentar
      </button>
    </div>
  );

  if (!partida) return (
    <div className="partida-details-container">
      <div className="error">No se pudo cargar la partida</div>
    </div>
  );

  return (
    <div className="partida-details-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      <div className="partida-details-content">
        <div className="partida-header">
          <h1>{partida.name}</h1>
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
              <p>{partida.description}</p>
            </div>

            <div className="partida-controls">
              <button className="control-button primary">
                <Play size={18} />
                <span>Entrar</span>
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
                  <p className="creator-hours">Horas jugadas: {partida.createdBy.hoursPlayed}</p>
                </div>
              </div>
            </div>

            <div className="players-section">
              <div className="players-header">
                <h3>{partida.players.length} JUGADORES</h3>
                <button className="invite-button" onClick={() => alert(`Invitando jugadores a ${partida.name}`)}>
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
                    <div className="icon-avatar player-icon">
                      <Users size={32} />
                    </div>
                    <p className="empty-name"></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartidaDetails;