import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/Profile.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";
import { useUser } from "../../context/UserContext.jsx";

const Profile = ({ isPopUp, setIsPopUp }) => {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(false);
    window.location.reload();
  };

  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>
      <div className="profile-container">
    
      <button className="cerrar" onClick={handleLogout}>
        CERRAR SESIÓN
      </button>
      </div>
      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default Profile;