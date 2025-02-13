import React, { useState } from "react";
import "../Css/Profile.css";

const Profile = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false); 

  return (
    <div className="LoginContainer">
      <header className="LoginHeader">
        <h2 className="logo">Logo</h2>
        <nav className="navigation">
          <a href="/">Inicio</a>
          <a href="misPartidas">MisPartidas</a>
          <a href="search">Buscar Partidas</a>
          <a href="profile">AAAAAAAAAAAAAAAAAAAAAAAAAAAA</a>
          <button className="btnLogin-popup" onClick={() => setIsPopUp(true)}>Login</button>
        </nav>
      </header>

      {/* Add 'active' class conditionally */}
      <div className={`wrapper ${isActive ? "active" : ""} ${isPopUp ? "popUp":""}`}>
        <span className="icon-close" onClick={() => setIsPopUp(false)}>
          <ion-icon name="close"></ion-icon>
        </span>

        {/* Login Form */}
        <div className="form-box login">
          <h2 className="mbot20">Login</h2>
          <form action="#">
            <div className="input-box">
              <span className="icon"></span>
              <input type="email" className="mr10" placeholder="Email" required />
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="password" className="mr10" placeholder="Password" required />
            </div>
            <div className="remember-forgot">
              <label> <input type="checkbox" className="mr10 mbot20" />Remember me</label>
            </div>
            <button type="submit" className="btn">Login</button>
            <div className="login-register">
              <a href="#"><br />Forgot Password?</a>
              <p>Don't have an account? <a href="#" className="register-link" onClick={() => setIsActive(true)}>Register</a></p>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <h2 className="mbot20">Register</h2>
          <form action="#">
            <div className="input-box">
              <span className="icon"></span>
              <input type="text" className="mr10" placeholder="Username" required />
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="email" className="mr10" placeholder="Email" required />
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="password" className="mr10" placeholder="Password" required />
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" className="mr10 mbot20" />I agree to the terms & conditions</label>
            </div>
            <button type="submit" className="btn">Register</button>
            <div className="login-register">
              <p>Already have an account? <a href="#" className="login-link" onClick={() => setIsActive(false)}>Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
