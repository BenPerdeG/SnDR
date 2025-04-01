import Login from "../../assets/componentes/JS/LoginComp.jsx"
import "../Css/Profile.css"
import TopNav from "../../assets/componentes/JS/TopNav.jsx"
import { useUser } from "../../context/UserContext.jsx"

function Profile({ isPopUp, setIsPopUp }) {
  const { user, setUser } = useUser()

  const handleLogout = () => {
    setUser(false)
    window.location.reload()
  }

  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      <div className="figma-layout">
        <div className="figma-sidebar">
          <div className="figma-avatar"></div>

          <div className="figma-input-container">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              className="figma-username-input"
              readOnly="true"
              defaultValue={user?.username || ""}
            />
          </div>

          <div className="figma-info-group">
            <p className="figma-label">Correo:</p>
            <p className="figma-value">{user?.email || "aaaaaa@aaaaa.aaa"}</p>
          </div>

          <div className="figma-info-group">
            <p className="figma-label">Horas Jugadas:</p>
            <p className="figma-value">{user?.hoursPlayed || "2"}</p>
          </div>

          <button type="button" className="figma-private-btn">
            <input type="checkbox"></input>
            <span>Privada</span>
          </button>

          <button type="button" onClick={handleLogout} className="figma-logout-btn">
            Log out
          </button>

          <button type="button" className="figma-delete-btn">
            Eliminar cuenta
          </button>
        </div>

        {/* Right content - Game cards */}
        <div className="figma-content">
          {/* First card */}
          <div className="figma-card">
            <div className="figma-card-header">
              <h2>Ultima Partida Creada</h2>
            </div>

            <div className="figma-card-body">
              <div className="figma-card-image"></div>

              <div className="figma-card-details">
                <h3 className="figma-card-title">Nombre de partida</h3>

                <div className="figma-card-description">
                  <p className="figma-description-label">Datos y descripción de la partida</p>
                  <p className="figma-description-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat accumsan ligula, et mollis
                    justo rhoncus eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat accumsan
                    ligula, et mollis justo rhoncus eget.
                  </p>
                </div>

                <button type="button" className="figma-enter-btn">
                  Entrar
                </button>
              </div>
            </div>
          </div>

          {/* Second card */}
          <div className="figma-card">
            <div className="figma-card-header">
              <h2>Ultima Partida Jugada</h2>
            </div>

            <div className="figma-card-body">
              <div className="figma-card-image"></div>

              <div className="figma-card-details">
                <h3 className="figma-card-title">Nombre de partida</h3>

                <div className="figma-card-description">
                  <p className="figma-description-label">Datos y descripción de la partida</p>
                  <p className="figma-description-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat accumsan ligula, et mollis
                    justo rhoncus eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat accumsan
                    ligula, et mollis justo rhoncus eget.
                  </p>
                </div>

                <button type="button" className="figma-enter-btn">
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  )
}

export default Profile

