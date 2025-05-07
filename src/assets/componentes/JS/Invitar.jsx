import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../CSS/Invitar.css";

function Invitar({ isPopUpInvi, setIsPopUpInvi }) {
    const { id: partidaId } = useParams();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInvitar = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("https://sndr.42web.io/inc/invitar.php", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    partida_id: partidaId
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setMessage(data.message);
                setIsSuccess(true);
                setEmail("");
            } else {
                setMessage(data.message);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("Error de conexión con el servidor");
            setIsSuccess(false);
            console.error("Error al invitar:", error);
        }
    };

    return (
        <div className={`invitar-container ${isPopUpInvi ? "popUp" : ""}`}>
            <div className="form-box">
                <h2>Invitar Jugadores</h2>
                {message && (
                    <div className={`message ${isSuccess ? "success" : "error"}`}>
                        {message}
                    </div>
                )}
                <form className="invitar-form" onSubmit={handleInvitar}>
                    <div className="input-box">
                        <input 
                            type="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce el correo de un Usuario para invitarlo" 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn">
                        Invitar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Invitar;