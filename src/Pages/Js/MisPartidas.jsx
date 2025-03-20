import { useState, useEffect } from "react";
import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/MisPartidas.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";

const MisPartidas = ({ isPopUp, setIsPopUp }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPartidas, setFilteredPartidas] = useState([]);

  // Sample game data with different names and descriptions
  const partidas = [
    { id: 1, name: "Dragón Sombrío", description: "Aventura en un castillo maldito." },
    { id: 2, name: "El Bosque Perdido", description: "Explora un bosque lleno de misterios." },
    { id: 3, name: "Guerra de Reinos", description: "Batallas épicas entre clanes rivales." },
    { id: 4, name: "Cueva de los Ancestros", description: "Descubre los secretos de una antigua civilización." },
    { id: 5, name: "El Reino de los Magos", description: "Magia y hechicería en una tierra olvidada." },
    { id: 6, name: "El Reino de los Magos 2", description: "Magia y hechicería en una tierra no tan olvidada." },
    { id: 7, name: "El Reino de los Magos 3", description: "Magia y hechicería en una tierra para nada olvidada." }
  ];

  // Set initial state with all partidas to prevent empty display
  useEffect(() => {
    setFilteredPartidas(partidas);
  }, []);

  // Debounce function definition
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    const filtered = partidas.filter((partida) =>
      partida.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPartidas(filtered);
  }, 300); // 300ms delay

  // Update filteredPartidas whenever searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="mis-partidas-container">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}

      <h1 className="title">Mis Partidas</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar partida..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Game List */}
      <div className="partidas-list">
        {filteredPartidas.length > 0 ? (
          filteredPartidas.map((partida) => (
            <div key={partida.id} className="partida-card">
              <div className="image-placeholder"></div>
              <div className="partida-info">
                <h2>{partida.name}</h2>
                <p>{partida.description}</p>
              </div>
              <button className="enter-btn">Entrar</button>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron partidas.</p>
        )}
      </div>

      {/* Create Game Button */}
      <button className="crear-partida">Crear Partida</button>
    </div>
  );
};

export default MisPartidas;
