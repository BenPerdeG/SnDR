import { useState, useEffect } from "react";
import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/MisPartidas.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import Swiper from "../../assets/componentes/JS/Swiper.jsx";
import PartidaCard from "../../assets/componentes/JS/PartidaCard.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const MisPartidas = ({ isPopUp, setIsPopUp }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPartidas, setAllPartidas] = useState([]);
  const [filteredPartidas, setFilteredPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const faqData = [
    {
      question: "¿Qué es SnDR?",
      answer: "SnDR es una página web donde puedes crear o unirte a sesiones. Dentro de estas sesiones, hay un tablero virtual donde se puede llevar a cabo todo lo necesario para una partida de un TTRPG."
    },
    {
      question: "¿Qué es un TTRPG?",
      answer: "El término TTRPG significa 'juego de rol de mesa' (o RPG de mesa). La principal diferencia entre los TTRPG y los videojuegos RPG es que los TTRPG generalmente tienen lugar entre un grupo de jugadores sentados alrededor de una mesa, y la acción ocurre principalmente en el 'teatro de la mente'."
    },
    {
      question: "¿Es SnDR un juego?",
      answer: "NO."
    }
  ];

  const fetchMisPartidas = async () => {
    try {
      const response = await fetch('https://sndr.42web.io/inc/getUserPartidas.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success && data.partidas) {
        setAllPartidas(data.partidas);
        setFilteredPartidas(data.partidas);
      } else {
        setError(data.message || "No tienes partidas creadas");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar tus partidas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMisPartidas();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPartidas(allPartidas);
    } else {
      const filtered = allPartidas.filter((partida) =>
        partida.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartidas(filtered);
    }
  }, [searchTerm, allPartidas]);

  const handleCreatePartida = () => {
   
  };

  if (loading) return <div className="loading">Cargando partidas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mis-partidas-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}

      <h1 className="title">Mis Partidas</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar partida..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="partidas-list">
        {filteredPartidas.length > 0 ? (
          filteredPartidas.map((partida) => (
            <PartidaCard 
              key={partida.id} 
              partida={partida} 
              buttonText="Entrar"
            />
          ))
        ) : (
          <p className="no-results">No se encontraron partidas.</p>
        )}
      </div>

      <div className="QnA">
        <Swiper data={faqData}/>
      </div>
      <button 
        className="crear-partida" 
        onClick={handleCreatePartida}
      >
        Crear Partida
      </button>
    </div>
  );
};

export default MisPartidas;