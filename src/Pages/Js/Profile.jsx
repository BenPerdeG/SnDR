import Login from "../../assets/componentes/JS/LoginComp.jsx";
import "../Css/Profile.css";
import TopNav from "../../assets/componentes/JS/TopNav.jsx";

const Profile = ({ isPopUp, setIsPopUp }) => {
  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <TopNav setIsPopUp={setIsPopUp} />
      </header>

      {/* This is where the Login popup is rendered */}
      {isPopUp && <Login isPopUp={isPopUp} setIsPopUp={setIsPopUp} />}
    </div>
  );
};

export default Profile;