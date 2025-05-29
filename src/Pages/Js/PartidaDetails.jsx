import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TopNav from "../../assets/componentes/JS/TopNav"
import Login from "../../assets/componentes/JS/LoginComp"
import "../Css/PartidaDetails.css"
import { useUser } from "../../context/UserContext"
import Gris from "../../assets/images/gris.jpg"
import Invitar from "../../assets/componentes/JS/Invitar"
import { useNavigate } from "react-router-dom";

const PartidaDetails = ({ isPopUp, setIsPopUp }) => {
  const { id } = useParams()
  const { user } = useUser()
  const [partida, setPartida] = useState(null)
  const [error, setError] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [editedNombre, setEditedNombre] = useState("")
  const [editedDescripcion, setEditedDescripcion] = useState("")
  const [editedImagen, setEditedImagen] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPopUpInvi, setIsPopUpInvi] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Función para verificar si el usuario es admin
  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`https://sndr.42web.io/inc/isAdmin.php?partida_id=${id}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        console.error("Error del servidor:", data.message)
        return
      }

      setIsAdmin(data.isAdmin)
    } catch (err) {
      console.error("Error verificando admin:", err)
      setError("Error al verificar permisos")
    }
  }

  // Función para cargar los datos de la partida
  const fetchPartida = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://sndr.42web.io/inc/getPartida.php?id=${id}`, { credentials: "include" })
      const data = await response.json()

      if (data.success) {
        setPartida(data.partida)
        setEditedNombre(data.partida.nombre)
        setEditedDescripcion(data.partida.descripcion)
        setEditedImagen(data.partida.imagen)
        setIsPrivate(data.partida.private === true || data.partida.private === 1)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Error al cargar los datos de la partida")
      console.error("Error fetching partida:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      checkAdminStatus()
      fetchPartida()
    }
  }, [id, user])

  const handlePrivacyChange = async (e) => {
    if (!isAdmin) return

    const newValue = e.target.checked
    setIsPrivate(newValue)

    try {
      await fetch("https://sndr.42web.io/inc/updatePrivacy.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: partida.id,
          private: newValue ? 1 : 0,
        }),
      })
    } catch (error) {
      setIsPrivate(!newValue)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
      const response = await fetch("https://sndr.42web.io/inc/updatePartida.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: partida.id,
          nombre: editedNombre,
          descripcion: editedDescripcion,
          imagen: editedImagen,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPartida({
          ...partida,
          nombre: editedNombre,
          descripcion: editedDescripcion,
          imagen: editedImagen,
        })
        setShowForm(false)
      }
      fetchPartida()
    } catch (err) {
      alert("Error de red")
    }
  }
  const navigate = useNavigate();
  const handleExpulsar = async (jugadorId) => {
    if (!isAdmin) return

    if (window.confirm(`¿Estás seguro de que quieres expulsar a este jugador?`)) {
      try {
        const response = await fetch("https://sndr.42web.io/inc/expulsar.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jugador_id: jugadorId,
            partida_id: id,
          }),
        })

        const data = await response.json()

        if (data.success) {
          alert("Jugador expulsado correctamente")
          fetchPartida()
        } else {
          alert(`Error: ${data.message}`)
        }
        fetchPartida()
      } catch (error) {
        console.error("Error expulsando jugador:", error)
        alert("Error al expulsar al jugador")
      }
    }
  }
  const handleDeletePartida = async () => {
    if (!isAdmin) return;

    if (window.confirm("¿Estás seguro de que quieres borrar esta partida? Esta acción no se puede deshacer.")) {
      try {
        const response = await fetch("https://sndr.42web.io/inc/borrarPartida.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partida_id: id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = "/misPartidas";
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error borrando partida:", error);
        alert("Error al borrar la partida");
      }
    }
  };

  if (!user) {
    return <div className="partida-details-container">Por favor inicia sesión para ver los detalles de la partida</div>
  }

  if (loading) {
    return <div className="partida-details-container">Cargando partida...</div>
  }

  if (error) {
    return <div className="partida-details-container error-message">{error}</div>
  }

  if (!partida) {
    return <div className="partida-details-container">No se encontró la partida</div>
  }

  return (
    <div className="partida-details-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
      {isPopUpInvi && <Invitar isPopUpInvi={isPopUpInvi} setIsPopUpInvi={setIsPopUpInvi} />}
      {partida && (
        <div className="partida-details-content">
          <div className="partida-header">
            <h1>{partida.nombre}</h1>
          </div>

          <div className="partida-main-content">
            <div className="partida-left-column">
              <div className="partida-info">
                <h2>Descripción</h2>
                <p>{partida.descripcion}</p>
              </div>
              {isAdmin && (
                <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                  {showForm ? "Ocultar Formulario" : "Editar Partida"}
                </button>
              )}
              {isAdmin && showForm && (
                <div className="adminOnly">
                  <form className="edit-partida-form" onSubmit={handleUpdate}>
                    <label>
                      Nombre:
                      <input type="text" value={editedNombre} onChange={(e) => setEditedNombre(e.target.value)} />
                    </label>
                    <label>
                      Descripción:
                      <textarea value={editedDescripcion} onChange={(e) => setEditedDescripcion(e.target.value)} />
                    </label>
                    <label>
                      Imagen (URL):
                      <input type="text" value={editedImagen} onChange={(e) => setEditedImagen(e.target.value)} />
                    </label>
                    <label className="figma-private-btn">
                      <input type="checkbox" checked={isPrivate} onChange={handlePrivacyChange} disabled={!isAdmin} />
                      <span>Privada</span>
                    </label>
                    <button type="submit">Guardar Cambios</button>
                  </form>
                  <div className="admin-buttons-container">
                    <button className="invitar" onClick={() => setIsPopUpInvi(!isPopUpInvi)}>
                      Invitar jugador
                    </button>
                    <button className="eliminar" onClick={handleDeletePartida}>
                      Borrar Partida
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="partida-right-column">
              <div className="partida-image-placeholder">
                {partida.imagen ? (
                  <img src={partida.imagen || "/placeholder.svg"} alt="Imagen de partida" />
                ) : (
                  <img src={Gris || "/placeholder.svg"} alt="Imagen de partida" />
                )}
              </div>

              <div className="created-by-section">
                <h3>Creado por</h3>
                <div className="creator-info">
                  {partida.admin?.imagen_perfil ? (
                    <img src={partida.admin?.imagen_perfil || "/placeholder.svg"} alt="Administrador" />
                  ) : (
                    <div className="icon-avatar small">👤</div>
                  )}
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
                      <div className="player-avatar-container" onClick={() => isAdmin && handleExpulsar(jugador.id)}>
                        {jugador.imagen_perfil ? (
                          <img
                            src={jugador.avatar || "/placeholder.svg"}
                            alt={jugador.nombre}
                            className="player-avatar"
                          />
                        ) : (
                          <div className="icon-avatar small">👤</div>
                        )}
                        {isAdmin && <div className="player-expel-overlay">✕</div>}
                      </div>
                      <p className="player-name">{jugador.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="entrar" onClick={() => navigate(`/tablero/${id}`)}>Entrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PartidaDetails