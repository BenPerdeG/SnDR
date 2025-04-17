import { useLocation, useNavigate } from 'react-router-dom';
import TopNav from '../../assets/componentes/JS/TopNav';
import { Lock } from 'lucide-react';
import '../Css/AccessDenied.css';

const AccessDenied = ({ isPopUp, setIsPopUp }) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="access-denied-page">
            <TopNav setIsPopUp={setIsPopUp} />
            
            <div className="access-denied-content">
                <div className="denied-icon">
                    <Lock size={48} />
                </div>
                <h2>Acceso denegado</h2>
                <p className="denied-message">
                    {state?.message || 'No tienes permisos para acceder a este recurso'}
                </p>
                <div className="denied-actions">
                    <button 
                        onClick={() => navigate(state?.redirectTo || '/search')}
                        className="primary-button"
                    >
                        Volver a partidas públicas
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="secondary-button"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;