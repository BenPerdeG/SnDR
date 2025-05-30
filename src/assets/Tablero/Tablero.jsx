import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Tablero.css"
import { useParams } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import ChatTab from "../componentes/JS/ChatTab"
import { db } from "./fireBaseInit.js"
import { onValue, ref, push } from "firebase/database"
import PersonajeEdit from '../componentes/JS/PersonajeEdit.jsx';

const Tablero = () => {
  const containerRef = useRef(null)
  const parentRef = useRef(null)
  const boxRefs = useRef([])
  const [snapToGrid, setSnapToGrid] = useState(40)
  const [mouseDownBox, setMouseDownBox] = useState(null)
  const canvasSize = 2000
  const { id } = useParams()
  const { user, setUser } = useUser()
  const [userData, setUserData] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedDice, setSelectedDice] = useState("d6")
  const [diceCount, setDiceCount] = useState(1)
  const [fondoUrl, setFondoUrl] = useState(null)
  const [tableroImage, setTableroImage] = useState("")
  const [personajes, setPersonajes] = useState([])
  const [editingPersonaje, setEditingPersonaje] = useState(null);
  const [usuariosPartida, setUsuariosPartida] = useState([]);
  const [usuariosPersonaje, setUsuariosPersonaje] = useState([]);

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSetChatInput = useCallback((value) => setChatInput(value), [])
  const handleSetChatMessages = useCallback((updater) => setChatMessages(updater), [])

  const rollDice = () => {
    const sides = Number.parseInt(selectedDice.slice(1))
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * sides) + 1)
    const total = rolls.reduce((sum, val) => sum + val, 0)
    const userName = userData?.nombre || user?.nombre || "Jugador"
    const resultMessage = `${diceCount}${selectedDice}: [${rolls.join(", ")}] Total: ${total}`
    const message = {
      chatRoomId: id,
      mensaje: resultMessage,
      nombre: userName,
      timestamp: Date.now(),
    }
    const newMessageRef = ref(db, `chatrooms/${id}/messages`)
    push(newMessageRef, message)
  }

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [id, user])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`https://sndr.42web.io/inc/isAdmin.php?partida_id=${id}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (!data.success) {
        console.error("Error del servidor:", data.message)
        return
      }
      setIsAdmin(data.isAdmin)
    } catch (err) {
      console.error("Error verificando admin:", err)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://sndr.42web.io/inc/userData.php", {
          credentials: "include",
          headers: { Accept: "application/json" },
        })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || `Error ${response.status}`)
        setUserData(data.user)
        setUser((prev) => ({ ...prev, ...data.user }))
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    const cargarImagenTablero = async () => {
      try {
        const response = await fetch(`https://sndr.42web.io/inc/getImagenTablero.php?id_partida=${id}`, {
          credentials: "include",
        })
        const data = await response.json()
        if (!data.success || !data.imagen) {
          setFondoUrl(null)
          return
        }
        const img = new Image()
        img.onload = () => setFondoUrl(data.imagen)
        img.onerror = () => setFondoUrl(null)
        img.src = data.imagen
      } catch (err) {
        console.error("Error al cargar imagen:", err)
        setFondoUrl(null)
      }
    }

    if (id) cargarImagenTablero()
  }, [id])

  useEffect(() => {
    const messagesRef = ref(db, `chatrooms/${id}/messages`)
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        setChatMessages([])
        return
      }
      const messagesArray = Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
      setChatMessages(messagesArray)
    })
    return () => unsubscribe()
  }, [id])

  const fetchPersonajes = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`https://sndr.42web.io/inc/getPersonajesTablero.php?id_tablero=${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setPersonajes(data.personajes);
      } else {
        console.warn("No se encontraron personajes:", data.message);
        setPersonajes([]);
      }
    } catch (error) {
      console.error("Error cargando personajes:", error);
    }
  }, [id]);

  const crearPersonaje = async (nombre, imagen) => {
    try {
      const response = await fetch("https://sndr.42web.io/inc/crearPersonaje.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tablero: id,
          nombre: nombre,
          imagen: imagen
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPersonajes();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error creando personaje:", error);
      return { success: false, message: "Error de red" };
    }
  };

  useEffect(() => {
    fetchPersonajes();
  }, [id, fetchPersonajes]);

const fetchUsuariosPartida = useCallback(async () => {
  try {
    const response = await fetch(`https://sndr.42web.io/inc/getPartida.php?id=${id}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (data.success && data.partida && Array.isArray(data.partida.jugadores)) {
      setUsuariosPartida(data.partida.jugadores);
    } else {
      console.warn("No jugadores found in partida data:", data);
    }
  } catch (error) {
    console.error("Error fetching partida info:", error);
  }
}, [id]);

  const fetchUsuariosPersonaje = useCallback(async (idPersonaje) => {
    if (!idPersonaje) return;
    try {
      const response = await fetch(`https://sndr.42web.io/inc/getUsuariosPersonaje.php?id_personaje=${idPersonaje}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUsuariosPersonaje(data.relaciones);
      }
    } catch (error) {
      console.error("Error cargando relaciones usuario-personaje:", error);
    }
  }, []);

  useEffect(() => {
    fetchPersonajes();
    fetchUsuariosPartida();
  }, [id, fetchPersonajes, fetchUsuariosPartida]);

  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true)
  const [rightMenuCollapsed, setRightMenuCollapsed] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    updateGridClass()
  }, [snapToGrid])

  const updateGridClass = () => {
    if (parentRef.current) {
      parentRef.current.className = `grid g`
    }
  }

  const calculateSnapValue = () => {
    const snapToGridCount = Number.parseInt(snapToGrid, 10)
    const snapToGridPct = 100 / snapToGridCount
    return Number.parseInt((snapToGridPct / 100) * canvasSize, 10)
  }

  const handleMouseDown = (index) => () => {
    setMouseDownBox(index)
  }

  const handleMouseUp = () => {
    setMouseDownBox(null)
  }

  const handleMouseMove = (event) => {
    if (mouseDownBox === null) return

    const container = containerRef.current
    const box = boxRefs.current[mouseDownBox]

    if (!container || !box) return

    let clientX = event.clientX + container.scrollLeft
    let clientY = event.clientY + container.scrollTop

    const offsetLeft = container.getBoundingClientRect().left
    const offsetTop = container.getBoundingClientRect().top

    clientX = clientX - offsetLeft
    clientY = clientY - offsetTop

    const snapValue = calculateSnapValue()

    const snapedX = clientX - (clientX % snapValue)
    const snapedY = clientY - (clientY % snapValue)

    box.style.left = `${snapedX}px`
    box.style.top = `${snapedY}px`
  }

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ChatTab
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={handleSetChatInput}
            userData={userData}
            chatRoomId={id}
          />
        )
      case 1:
        return (
          <div className="tab-content">
            <h3>Personajes</h3>
            <div className="personajes-list">
              {personajes.length === 0 ? (
                <p>No hay personajes en este tablero.</p>
              ) : (
                personajes.map((p) => (
                  <div
                    key={p.id}
                    className="personaje-item"
                    style={{ display: "flex", alignItems: "center", marginBottom: "10px", cursor: "pointer" }}
                    onClick={() => {
                      setEditingPersonaje(p);
                      fetchUsuariosPersonaje(p.id);
                    }}
                  >
                    <img
                      src={
                        p.imagen && !p.imagen.startsWith('"')
                          ? p.imagen
                          : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt={`Personaje ${p.id}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                        objectFit: "cover",
                        pointerEvents: "none"
                      }}
                    />
                    <span>{p.nombre}</span>
                  </div>
                ))
              )}
            </div>
            {isAdmin && (
              <div className="crear-personaje-form" style={{ marginBottom: "20px" }}>
                <h4>Crear Nuevo Personaje</h4>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const nombre = e.target.nombre.value;
                  const imagen = e.target.imagen.value;
                  const result = await crearPersonaje(nombre, imagen);
                  if (result.success) {
                    e.target.reset();
                  } else {
                    alert(result.message || "Error al crear el personaje");
                  }
                }}>
                  <input className="crear-personaje"
                    type="text"
                    name="nombre"
                    placeholder="Nombre del personaje"
                    required
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                  <input className="crear-personaje"
                    type="text"
                    name="imagen"
                    placeholder="URL de la imagen"
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                  <button type="submit">Crear Personaje</button>
                </form>
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div className="tab-content">
            <h3>Editar Imagen del Tablero</h3>
            <input
              type="text"
              placeholder="URL de la imagen"
              value={tableroImage}
              onChange={(e) => setTableroImage(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button
              onClick={async () => {
                try {
                  const response = await fetch("https://sndr.42web.io/inc/updateTablero.php", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id_partida: parseInt(id), nueva_imagen: tableroImage }),
                  })
                  const data = await response.json()
                  if (data.success) {
                    window.location.reload()
                  } else {
                    alert("Error: " + data.message)
                  }
                } catch (error) {
                  alert("Error de red: " + error.message)
                }
              }}
            >
              Guardar
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="tablero-container" style={{
      backgroundColor: fondoUrl ? "transparent" : "white",
      backgroundImage: fondoUrl ? `url(${fondoUrl})` : "none",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      <button className="collapse-button left-toggle-button" onClick={() => setLeftMenuCollapsed(!leftMenuCollapsed)}>
        {leftMenuCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button className="collapse-button right-toggle-button" onClick={() => setRightMenuCollapsed(!rightMenuCollapsed)}>
        {rightMenuCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className={`left-menu ${leftMenuCollapsed ? "collapsed" : ""}`}>
        <div className="left-menu-content">
          <div className="left-menu-header">
            <h3>Dados</h3>
          </div>
          <div className="left-menu-buttons">
            <label>Tipo de dado:</label>
            <select value={selectedDice} onChange={(e) => setSelectedDice(e.target.value)}>
              {["d2", "d4", "d6", "d8", "d10", "d12", "d20"].map((die) => (
                <option key={die} value={die}>{die}</option>
              ))}
            </select>

            <label>Cantidad:</label>
            <input type="number" min="1" max="10" value={diceCount} onChange={(e) => setDiceCount(Number.parseInt(e.target.value))} />
            <button onClick={rollDice}>Lanzar</button>
          </div>
        </div>
      </div>

      <div className={`right-menu ${rightMenuCollapsed ? "collapsed" : ""}`}>
        <div className="right-menu-content">
          <div className="tabs-container">
            <div className={`tab ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}><span>Chat</span></div>
            <div className={`tab ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}><span>Personajes</span></div>
            {isAdmin && (
              <div className={`tab ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}><span>Editar Imagen</span></div>
            )}
          </div>
          <div className="tab-content-container">
            <TabContent />
          </div>
        </div>
      </div>

      <div
        id="parentContainer"
        ref={parentRef}
        className="grid g"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ position: "relative" }}
      >
        <div id="container" ref={containerRef} style={{ position: "relative" }}>
          {[{ left: 250, top: 250 }, { left: 350, top: 350 }].map((pos, i) => (
            <div
              key={i}
              className="box"
              ref={(el) => (boxRefs.current[i] = el)}
              onMouseDown={handleMouseDown(i)}
              style={{
                position: "absolute",
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                cursor: mouseDownBox === i ? "grabbing" : "grab",
              }}
            />
          ))}
        </div>
      </div>
      {editingPersonaje && (
        <PersonajeEdit
          personaje={editingPersonaje}
          onClose={() => setEditingPersonaje(null)}
          onSave={async (data) => {
            try {
              const response = await fetch("https://sndr.42web.io/inc/updatePersonaje.php", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: data.id,
                  nombre: data.nombre,
                  imagen: data.imagen,
                  usuarios: data.usuarios
                }),
              });
              const result = await response.json();
              if (result.success) {
                fetchPersonajes();
                fetchUsuariosPersonaje(data.id);
                setEditingPersonaje(null);
              } else {
                alert("Error al guardar: " + result.message);
              }
            } catch (error) {
              alert("Error de red: " + error.message);
            }
          }}
          usuariosPartida={usuariosPartida}
          usuariosPersonaje={usuariosPersonaje}
        />
      )}
    </div>
  )
}

export default Tablero