import React from "react";
import { useUser } from "../../../context/UserContext.jsx";
import "../CSS/TopNav.css";

function TopNav({ setIsPopUp }) {
  const { user } = useUser(); // Assuming useUser provides a user object

  return (
    <>
      <h2 className="logo">Logo</h2>
      <nav className="navigation">
        <a href="/">Inicio</a>
        <a href="/misPartidas">Mis Partidas</a>
        <a href="/search">Buscar Partidas</a>
        <a href="/profile">Mi Perfil</a>
        <button
          className={`btnLogin-popup ${user ? "active" : ""}`}
          onClick={() => setIsPopUp(true)}
        >
          Login
        </button>
      </nav>
    </>
  );
}

export default TopNav;