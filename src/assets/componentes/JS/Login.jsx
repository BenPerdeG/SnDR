import React, { useState } from "react";
import "../CSS/Login.css"

const Login = ({ isPopUp, setIsPopUp }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`wrapper ${isActive ? "active" : ""} ${isPopUp ? "popUp" : ""}`}>
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
            <label>
              <input type="checkbox" className="mr10 mbot20" />Remember me
            </label>
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="login-register">
            <a href="#">
              <br />
              Forgot Password?
            </a>
            <p>
              Don't have an account?{" "}
              <a href="#" className="register-link" onClick={() => setIsActive(true)}>
                Register
              </a>
            </p>
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
  );
};

export default Login;
