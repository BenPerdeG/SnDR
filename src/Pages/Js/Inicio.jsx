import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/Inicio.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Inicio = ({ isPopUp, setIsPopUp }) => {
  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}

      <div className="info-container">
        <h1 className="titulo-info">¿Que es esto?</h1>
        <p className="info"> SnDR es un proyecto estudiantil desarrollado por Benjamín Pérez. Este proyecto presenta una página web donde crear y gestionar partidas de rol de mesa(TTRPG).
          Para mas información al respecto aqui tienes la memoria del proyecto con información y el GitHub público del mismo.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0' }}>
          <a
            href="https://docs.google.com/document/d/1509fGxVWja3TBe6K7DZZcYKWr9YJFbOjzV1u0naOO0I/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '2rem', color: '#4285F4' }}
            title="Memoria del proyecto en Google Drive"
          >
            <FcGoogle />
          </a>
          <a
            href="https://github.com/BenPerdeG/SnDR"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '2rem', color: 'inherit' }}
            title="GitHub del proyecto"
          >
            <FaGithub />
          </a>
        </div>

        <h2 className="info-concl"> ¡Dicho esto, espero que pases muchas horas aqui y que la suerte de los dados no te abandone!</h2>
      </div>

    </div>
  );
};

export default Inicio;