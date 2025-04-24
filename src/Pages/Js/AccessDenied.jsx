const AccessDenied = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
  
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