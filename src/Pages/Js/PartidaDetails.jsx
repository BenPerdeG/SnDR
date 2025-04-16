import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Users, Play, UserPlus } from "lucide-react"
import TopNav from "../../assets/componentes/JS/TopNav.jsx"
import "../Css/PartidaDetails.css"

const PartidaDetails = ({ isPopUp, setIsPopUp }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  // Mock data with 7 partidas - in a real app, you would fetch this from an API
  const partidas = [
    {
      id: 1,
      name: "Dragón Sombrío",
      description:
        "Aventura en un castillo maldito. Los jugadores deberán enfrentarse a un antiguo dragón que ha despertado tras siglos de letargo y ahora amenaza con destruir el reino.",
      createdBy: {
        name: "DungeonMaster42",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 256,
      },
      players: [
        { id: 1, name: "Alanegra", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 2, name: "Carlos V.", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 3, name: "Danny", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 5,
    },
    {
      id: 2,
      name: "El Bosque Perdido",
      description:
        "Explora un bosque lleno de misterios y criaturas ancestrales. Una antigua maldición ha caído sobre el bosque y los aldeanos están desapareciendo uno a uno.",
      createdBy: {
        name: "ElfoSabio",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 124,
      },
      players: [
        { id: 4, name: "Gandalf", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 5, name: "Legolas", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 4,
    },
    {
      id: 3,
      name: "La Ciudad de Plata",
      description:
        "Una metrópolis futurista donde la magia y la tecnología se entrelazan. Los jugadores deberán resolver una serie de misteriosos asesinatos que amenazan con desestabilizar la frágil paz entre las distintas facciones.",
      createdBy: {
        name: "TecnoMago",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 342,
      },
      players: [
        { id: 6, name: "NeoHacker", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 7, name: "ElectroWizard", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 8, name: "CyberElf", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 9, name: "Quantum", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 6,
    },
    {
      id: 4,
      name: "Reinos en Guerra",
      description:
        "Una campaña épica donde cuatro reinos luchan por la supremacía. Los jugadores deberán elegir un bando y participar en batallas masivas, intrigas políticas y misiones de espionaje.",
      createdBy: {
        name: "WarMaster",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 512,
      },
      players: [
        { id: 10, name: "GeneralOscuro", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 11, name: "ArqueroReal", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 12, name: "CaballeroNegro", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 8,
    },
    {
      id: 5,
      name: "Piratas del Mar Eterno",
      description:
        "Surca los mares en busca de tesoros legendarios y enfrenta a temibles criaturas marinas. Una aventura llena de traiciones, ron y batallas navales.",
      createdBy: {
        name: "CapitánBarbanegra",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 187,
      },
      players: [
        { id: 13, name: "MarineroLoco", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 14, name: "ContramaestRe", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 15, name: "CañoneroExperto", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 16, name: "VigíaAgudo", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 17, name: "TimonelSabio", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 6,
    },
    {
      id: 6,
      name: "El Culto Prohibido",
      description:
        "Una aventura de horror cósmico donde los jugadores investigan un culto que amenaza con invocar a entidades de otro plano de existencia. El miedo y la locura serán tus compañeros.",
      createdBy: {
        name: "NarradorDeMiedos",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 298,
      },
      players: [
        { id: 18, name: "DetectiveOculto", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 19, name: "MédicoForense", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 20, name: "PeriodistaCurioso", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 5,
    },
    {
      id: 7,
      name: "Leyendas del Desierto",
      description:
        "Una campaña ambientada en un vasto desierto lleno de ruinas antiguas, tribus nómadas y secretos enterrados bajo las arenas. Descubre la verdad sobre una civilización perdida.",
      createdBy: {
        name: "ArqueólogoMístico",
        avatar: "/placeholder.svg?height=80&width=80",
        hoursPlayed: 156,
      },
      players: [
        { id: 21, name: "ExploraRuinas", avatar: "/placeholder.svg?height=60&width=60" },
        { id: 22, name: "CazaTesoros", avatar: "/placeholder.svg?height=60&width=60" },
      ],
      maxPlayers: 4,
    },
  ]

  const partida = partidas.find((p) => p.id === Number.parseInt(id))

  if (!partida) {
    return <div>Partida no encontrada</div>
  }

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
                  <p>Drop a File</p>
                  <p className="image-size-hint">Suggested size: 1600 x 800 pixels</p>
                  <p>(JPG, PNG, GIF)</p>
                  <p>or</p>
                  <button className="choose-file-button">Choose a File...</button>
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
                <img
                  src={partida.createdBy.avatar || "/placeholder.svg"}
                  alt={partida.createdBy.name}
                  className="creator-avatar"
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
                    <img src={player.avatar || "/placeholder.svg"} alt={player.name} className="player-avatar" />
                    <p className="player-name">{player.name}</p>
                  </div>
                ))}

                {Array.from({ length: partida.maxPlayers - partida.players.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="player-card empty">
                    <div className="empty-avatar"></div>
                    <p className="empty-name">Vacío</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartidaDetails