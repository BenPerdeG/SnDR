import React, { useState, useEffect } from "react";

const AccessDenied = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  return (
    <div className="access-denied-page">
      <TopNav />
      <div className="access-denied-content">
        <Lock size={48} />
        <h2>Acceso denegado</h2>
        <p>{state?.message || 'No tienes permisos para acceder a este recurso'}</p>
        <div className="denied-actions">
          <button onClick={() => navigate(state?.redirectTo || '/inicio')}>
            Volver a Inicio
          </button>
          <button onClick={() => navigate(-1)}>Regresar</button>
        </div>
      </div>
    </div>
  );
};