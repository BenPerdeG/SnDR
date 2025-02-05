import React, { Component } from "react";
import "../Css/Login.css";



class Login extends React.Component {
  render() {
    return (
      <div className="LoginContainer">
        <header className="LoginHeader">
          <h2 className="logo">Logo</h2>
          <nav className="navigation">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
            <button className="btnLogin-popup">LoginPopUp</button>
          </nav>
        </header>
      </div>
    );
  }
}

export default Login;
