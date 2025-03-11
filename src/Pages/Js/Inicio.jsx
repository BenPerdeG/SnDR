import Login from "../../assets/componentes/JS/LoginComp.jsx"; // Importa el componente Login
import "../Css/Inicio.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";

const Inicio = ({ isPopUp, setIsPopUp }) => {
  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {/* Renderiza Login solo si isPopUp es true */}
      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default Inicio;
