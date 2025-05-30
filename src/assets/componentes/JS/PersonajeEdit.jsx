import { useState, useEffect } from "react";
import "../CSS/PersonajeEdit.css";

const PersonajeEdit = ({ 
  personaje, 
  onClose, 
  onSave, 
  usuariosPartida, 
  usuariosPersonaje 
}) => {
  const [nombre, setNombre] = useState(personaje?.nombre || "");
  const [imagen, setImagen] = useState(personaje?.imagen || "");
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  // Inicializar datos
  useEffect(() => {
    if (personaje) {
      setNombre(personaje.nombre || "");
      setImagen(personaje.imagen || "");
      
      // Obtener usuarios asignados a este personaje
      const asignados = usuariosPersonaje
        .filter(up => up.id_personaje === personaje.id)
        .map(up => 
          usuariosPartida.find(u => u.id === up.id_usuario)
        ).filter(Boolean);
      
      setUsuariosAsignados(asignados);
    }
  }, [personaje, usuariosPartida, usuariosPersonaje]);

  // Actualizar usuarios disponibles (los que no están asignados)
  useEffect(() => {
    if (usuariosPartida && usuariosAsignados) {
      const disponibles = usuariosPartida.filter(
        usuario => !usuariosAsignados.some(u => u.id === usuario.id)
      );
      setUsuariosDisponibles(disponibles);
      if (disponibles.length > 0) {
        setUsuarioSeleccionado(disponibles[0].id);
      }
    }
  }, [usuariosPartida, usuariosAsignados]);

  const handleAddUsuario = () => {
    if (!usuarioSeleccionado) return;
    
    const usuario = usuariosPartida.find(u => u.id === parseInt(usuarioSeleccionado));
    if (usuario && !usuariosAsignados.some(u => u.id === usuario.id)) {
      setUsuariosAsignados([...usuariosAsignados, usuario]);
    }
  };

  const handleRemoveUsuario = (idUsuario) => {
    setUsuariosAsignados(usuariosAsignados.filter(u => u.id !== idUsuario));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: personaje.id,
      nombre,
      imagen,
      usuarios: usuariosAsignados.map(u => u.id)
    });
  };

  if (!personaje) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Editar Personaje</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Imagen (URL):</label>
            <input
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            />
            {imagen && (
              <div className="image-preview">
                <img src={imagen} alt="Vista previa" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Usuarios asignados:</label>
            <div className="tags-container">
              {usuariosAsignados.map(usuario => (
                <div key={usuario.id} className="tag">
                  {usuario.nombre}
                  <button 
                    type="button"
                    onClick={() => handleRemoveUsuario(usuario.id)}
                    className="remove-tag"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            {usuariosDisponibles.length > 0 && (
              <div className="add-user-container">
                <select
                  value={usuarioSeleccionado}
                  onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                >
                  {usuariosDisponibles.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={handleAddUsuario}
                  className="add-user-button"
                >
                  Añadir Usuario
                </button>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PersonajeEdit;
