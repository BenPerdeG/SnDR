import React, { useState } from "react";

function TopNav({ setIsPopUp }) {
  return (
    <>
      <h2 className="logo">Logo</h2>
      <nav className="navigation">
        <a href="/">Inicio</a>
        <a href="/misPartidas">Mis Partidas</a>
        <a href="/search">Buscar Partidas</a>
        <a href="/profile">Mi Perfil</a>
        <button className="btnLogin-popup" onClick={() => setIsPopUp(true)}>
          Login
        </button>
      </nav>
    </>
  );
}

export default TopNav;