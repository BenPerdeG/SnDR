import Login from "../../assets/componentes/JS/LoginComp.jsx"; // Importa el componente Login
import "../Css/MisPartidas.css"
import TopNav from "../../assets/componentes/JS/TopNav.jsx";

const MisPartidas = ({ isPopUp, setIsPopUp }) => {
  return (
    <div className="LoginContainer">
       <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>
      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default MisPartidas;
