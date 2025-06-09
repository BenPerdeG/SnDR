import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/Profile.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PartidaCard from "../../assets/componentes/JS/PartidaCard.jsx";

function Profile({ isPopUp, setIsPopUp }) {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [lastGame, setLastGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/inc/userData.php', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || `Error ${response.status}`);
        setUserData(data.user);
        setIsPrivate(data.user.private || false);
        setUser(prev => ({ ...prev, ...data.user }));

        // Fetch last game after user data is loaded
        fetchLastGame();
      } catch (error) {
        setError(error.message);
        if (error.message.includes('autorizado')) handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [setUser]);

  const fetchLastGame = async () => {
    setLoadingGame(true);
    try {
      const response = await fetch('http://localhost/inc/ultimaPartida.php', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || `Error ${response.status}`);
      setLastGame(data.partida);
    } catch (error) {
      console.error('Error fetching last game:', error);
    } finally {
      setLoadingGame(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch('http://localhost/inc/logout.php', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/';
    } finally {
      setLogoutLoading(false);
    }
  };

  const handlePrivacyChange = async (e) => {
    const newValue = e.target.checked;
    setIsPrivate(newValue);
    try {
      await fetch('http://localhost/inc/updatePrivacy.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ private: newValue })
      });
    } catch (error) {
      setIsPrivate(!newValue);
      console.error('Privacy update failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (deleteConfirmation !== "Borrar") {
      alert('Por favor escribe "Borrar" para confirmar');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('http://localhost/inc/deleteAccount.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmation })
      });
      const data = await response.json();
      if (!data.success) throw new Error('Failed to delete account');
      navigate('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEnterGame = () => {
    if (lastGame) {
      navigate(`/partida/${lastGame.id}`);
    }
  };

  if (loading) return (
    <div className="profile-loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="profile-error-container">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  const handleCreatePartida = async () => {
    try {
      const response = await fetch('http://localhost/inc/createPartida.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/partida/${data.partida_id}`);
      } else {
        alert('Error al crear partida: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear partida');
    }
  };
  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      <div className="perfil-layout">
        <div className="perfil-sidebar">
          <div className="perfil-avatar">
            {userData?.imagen_perfil && <img src={userData.imagen_perfil} alt="Avatar" />}
          </div>

          <div className="perfil-input-container">
            <input
              type="text"
              className="perfil-username-input"
              readOnly
              value={userData?.nombre || ""}
            />
          </div>

          <div className="perfil-info-group">
            <p className="perfil-label">Correo:</p>
            <p className="perfil-value">{userData?.email || "No disponible"}</p>
          </div>

          {/* Ya haré las horas jugadas en otra acualización */}
          {/* <div className="perfil-info-group">
            <p className="perfil-label">Horas Jugadas:</p>
            <p className="perfil-value">{userData?.horas_jugadas || 0}</p>
          </div> */}

          <label className="perfil-private-btn">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handlePrivacyChange}
            />
            <span>Privada</span>
          </label>

          <button
            type="button"
            onClick={handleLogout}
            className="perfil-logout-btn"
            disabled={logoutLoading}
          >
            {logoutLoading ? 'Cerrando...' : 'Cerrar sesión'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="perfil-delete-btn"
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
          </button>
        </div>

        <div className="perfil-content">
          <div className="perfil-card">
            <div className="perfil-card-header">
              <h2>Última Partida Creada</h2>
            </div>
            <div className="perfil-card-body">
              {loadingGame ? (
                <div className="loading-spinner-small"></div>
              ) : lastGame ? (
                <PartidaCard
                  key={lastGame.id}
                  partida={lastGame}
                  buttonText="Entrar"
                />
              ) : (
                <div className="perfil-no-game">
                  <p>No has creado ninguna partida</p>
                  <button
                    className="crear-partida"
                    onClick={handleCreatePartida}
                  >
                    Crear Partida
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>¿Estás seguro?</h3>
            <p>Escribe <strong>"Borrar"</strong> para confirmar:</p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Escribe 'Borrar'"
              style={{
                width: '100%',
                padding: '8px',
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: 'black'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '8px 16px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "Borrar"}
                style={{
                  padding: '8px 16px',
                  background: deleteConfirmation === "Borrar" ? '#d9534f' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
}

export default Profile;