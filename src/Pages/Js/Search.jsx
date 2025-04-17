import { useState, useEffect } from "react";
import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/Search.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import { useNavigate } from "react-router-dom";

const Search = ({ isPopUp, setIsPopUp }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPartidas, setAllPartidas] = useState([]);
  const [filteredPartidas, setFilteredPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPublicPartidas = async () => {
    try {
      const response = await fetch('https://sndr.42web.io/inc/getPublicPartidas.php', {
        credentials: 'include' 
      });
      const data = await response.json();
      
      console.log("Datos API Search:", data);
      
      if (data.success && data.partidas) {
        setAllPartidas(data.partidas);
        setFilteredPartidas(data.partidas);
      } else {
        setError(data.message || "No se encontraron partidas públicas");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar partidas públicas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicPartidas();
  }, []);

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

  if (loading) return <div className="loading">Cargando partidas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="search-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}

      <h1 className="title">Buscar Partidas</h1>

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
            <div key={partida.id} className="partida-card">
              <div className="image-placeholder"></div>
              <div className="partida-info">
                <h2>{partida.nombre}</h2>
                <p>{partida.descripcion}</p>
              </div>
              <button
                className="enter-btn"
                onClick={() => navigate(`/partida/${partida.id}`)}
              >
                Unirte
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron partidas.</p>
        )}
      </div>
    </div>
  );
};

export default Search;