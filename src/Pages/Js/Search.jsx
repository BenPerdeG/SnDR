import Login from "../../assets/componentes/JS/Login.jsx"; // Importa el componente Login
import "../Css/Search.css"

const Search = ({ isPopUp, setIsPopUp }) => {
  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <h2 className="logo">Logo</h2>
        <nav className="navigation">
          <a href="/">Inicio</a>
          <a href="/misPartidas">Mis Partidas</a>
          <a href="/search">BUSCAR PARTIDAS</a>
          <a href="/profile">Mi Perfil</a>
          {/* Botón que activa el pop-up */}
          <button className="btnLogin-popup" onClick={() => setIsPopUp(true)}>
            Login
          </button>
        </nav>
      </header>

      {/* Renderiza Login solo si isPopUp es true */}
      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default Search;
