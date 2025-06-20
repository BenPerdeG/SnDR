import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add these hooks
import "../CSS/LoginComp.css";
import { useUser } from "../../../context/UserContext.jsx";

const Login = ({ isPopUp, setIsPopUp }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [formReg, setFormReg] = useState({ name: "", email: "", password: "" });
  const [formLog, setFormLog] = useState({ email: "", password: "" });

  const { setUser } = useUser();
  const location = useLocation(); //Dirección actual
  const navigate = useNavigate();

  const handleChangeReg = (e) => {
    setFormReg({ ...formReg, [e.target.name]: e.target.value });
  };

  const handleChangeLog = (e) => {
    setFormLog({ ...formLog, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const responseRegister = await fetch("http://localhost/inc/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formReg),
      });

      const data = await responseRegister.json();
      if (data.success) {
        setUser(true);
        alert("Registro exitoso!");
        setIsPopUp(false);
        const from = location.state?.from || "/";
        navigate(from);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión al servidor");
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const responseLogin = await fetch("http://localhost/inc/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formLog),
        credentials: 'include'
      });

      const data = await responseLogin.json();
      if (data.success) {
        setUser(true); 
        alert("Login exitoso!");
        setIsPopUp(false); 
        const from = location.state?.from || "/";
        navigate(from);
      } else {
        setError(data.message);
        alert("Ha habido algún error en el Login");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div className={`wrapper ${isActive ? "active" : ""} ${isPopUp ? "popUp" : ""}`}>
      <span className="icon-close" onClick={() => setIsPopUp(false)}>
      <span className="icon-close" onClick={() => setIsPopUp(false)}>
  ×
</span>
      </span>

      {/* Login Form */}
      <div className="form-box login">
        <h2 className="mbot20">Login</h2>
        <form onSubmit={handleSubmitLogin}>
          <div className="input-box">
            <span className="icon"></span>
            <input
              type="email"
              name="email"
              className="mr10"
              placeholder="Email"
              required
              onChange={handleChangeLog}
              autoComplete="email"
            />
          </div>
          <div className="input-box">
            <span className="icon"></span>
            <input
              type="password"
              name="password"
              className="mr10"
              placeholder="Password"
              required
              onChange={handleChangeLog}
              autoComplete="new_password"
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
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
        <form onSubmit={handleSubmitRegister}>
          <div className="input-box">
            <span className="icon"></span>
            <input
              type="text"
              name="name"
              className="mr10"
              placeholder="Username"
              required
              onChange={handleChangeReg}
              autoComplete="username"
            />
          </div>
          <div className="input-box">
            <span className="icon"></span>
            <input
              type="email"
              name="email"
              className="mr10"
              placeholder="Email"
              required
              onChange={handleChangeReg}
              autoComplete="email"
            />
          </div>
          <div className="input-box">
            <span className="icon"></span>
            <input
              type="password"
              name="password"
              className="mr10"
              placeholder="Password"
              required
              onChange={handleChangeReg}
              autoComplete="new_password"
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" name="terms" className="mr10 mbot20" />
              I agree to the terms & conditions
            </label>
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <div className="login-register">
            <p>
              Already have an account?{" "}
              <a href="#" className="login-link" onClick={() => setIsActive(false)}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;