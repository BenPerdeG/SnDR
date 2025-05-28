import React from "react";
import { ref, push } from "firebase/database";
import { db } from "../../Tablero/fireBaseInit.js";

const ChatTab = ({ chatMessages, chatInput, setChatInput, userData, chatRoomId }) => {
  const sendMessage = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    const newMessage = {
      nombre: userData?.nombre || "Anónimo",
      mensaje: chatInput,
      timestamp: Date.now()
    };

    await push(ref(db, `chatrooms/${chatRoomId}/messages`), newMessage);
    setChatInput("");
  };

  return (
    <div className="tab-content">
      <h3>Chat</h3>
      <div
        className="chat-box"
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "0.5rem",
          marginBottom: "0.5rem"
        }}
      >
        {chatMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.nombre}</strong>: {msg.mensaje}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ width: "80%" }}
          autoFocus
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default React.memo(ChatTab);
