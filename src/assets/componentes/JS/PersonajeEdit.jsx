import { useState, useEffect } from "react";
import "../CSS/PersonajeEdit.css";

const PersonajeEdit = ({
  personaje,
  onClose,
  onSave,
  usuariosPartida = [],
  usuariosPersonaje = []
}) => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    if (personaje) {
      setNombre(personaje.nombre || "");
      setImagen(personaje.imagen || "");
    }
  }, [personaje]);

  useEffect(() => {
    if (!personaje || !usuariosPersonaje) return;

    const asignados = usuariosPersonaje
      .filter(
        (rel) => rel.id_personaje === personaje.id && rel.id_usuario
      )
      .map((rel) => ({
        id: rel.id_usuario,
        nombre: rel.nombre_usuario,
      }));

    setUsuariosAsignados(asignados);

    const disponibles = usuariosPartida.filter(
      (u) => !asignados.some((a) => a.id === u.id)
    );

    if (disponibles.length > 0) {
      setUsuarioSeleccionado(disponibles[0].id);
    } else {
      setUsuarioSeleccionado(null);
    }
  }, [personaje, usuariosPartida, usuariosPersonaje]);

  const handleAddUsuario = async () => {
    const usuario = usuariosPartida.find(
      (u) => u.id === usuarioSeleccionado
    );
    if (!usuario || usuariosAsignados.some((u) => u.id === usuario.id)) return;

    try {
      const res = await fetch(
        "https://sndr.42web.io/inc/addUsuarioPersonaje.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_personaje: personaje.id,
            id_usuario: usuario.id,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setUsuariosAsignados((prev) => [...prev, usuario]);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error añadiendo usuario:", error);
    }
  };

  const handleRemoveUsuario = async (idUsuario) => {
    try {
      const res = await fetch(
        "https://sndr.42web.io/inc/removeUsuarioPersonaje.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_personaje: personaje.id,
            id_usuario: idUsuario,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setUsuariosAsignados((prev) =>
          prev.filter((u) => u.id !== idUsuario)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: personaje.id,
      nombre,
      imagen,
    });
  };

  if (!personaje) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Editar Personaje</h3>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
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
              placeholder="https://example.com/avatar.jpg"
            />
            {imagen && (
              <div className="image-preview">
                <img
                  src={imagen}
                  alt="Vista previa"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Usuarios asignados:</label>
            {usuariosAsignados.length > 0 ? (
              <div className="tags-container">
                {usuariosAsignados.map((usuario) => (
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
            ) : (
              <p>No hay usuarios asignados a este personaje.</p>
            )}

            <div className="add-user-container">
              <select
                value={usuarioSeleccionado ?? ""}
                onChange={(e) =>
                  setUsuarioSeleccionado(parseInt(e.target.value))
                }
              >
                {usuariosPartida
                  .filter(
                    (u) => !usuariosAsignados.some((a) => a.id === u.id)
                  )
                  .map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddUsuario}
                className="add-user-button"
                disabled={usuarioSeleccionado === null}
              >
                Añadir Usuario
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
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
