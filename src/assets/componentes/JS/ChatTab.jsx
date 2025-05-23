import React from "react";

const ChatTab = React.memo(({ chatMessages, chatInput, setChatInput, setChatMessages, userData }) => {
  return (
    <div className="tab-content">
      <h3>Chat</h3>
      <div
        className="chat-box"
        style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}
      >
        {chatMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.nombre}</strong>: {msg.mensaje}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (chatInput.trim() === "") return;
          const newMessage = { nombre: userData?.nombre || "Anónimo", mensaje: chatInput };
          setChatMessages((prev) => [...prev, newMessage]);
          setChatInput("");
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ width: "80%" }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
});

export default ChatTab;
