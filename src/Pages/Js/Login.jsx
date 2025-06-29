import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/Login.css";
import { useUser } from "../../context/UserContext.jsx";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [formReg, setFormReg] = useState({ name: "", email: "", password: "" });
  const [formLog, setFormLog] = useState({ email: "", password: "" });

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const { setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChangeReg = (e) => {
    setFormReg({ ...formReg, [e.target.name]: e.target.value });
  };

  const handleChangeLog = (e) => {
    setFormLog({ ...formLog, [e.target.name]: e.target.value });
  };

  const handleSubmitRegisterPage = async (e) => {
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
        const from = location.state?.from || "/";
        navigate(from, { state: { isPopUp: location.state?.isPopUp } }); // Pass isPopUp in state
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión al servidor");
    }
  };

  const handleSubmitLoginPage = async (e) => {
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
        setUser(true); // Update UserContext
        const from = location.state?.from || "/";
        navigate(from, { state: { isPopUp: location.state?.isPopUp } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div className={`wrapper ${isActive ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <h2 className="mbot20">Login</h2>
        <form onSubmit={handleSubmitLoginPage}>
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox" name="c" className="mr10 mbot20" />
              Remember me
            </label>
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
        <form onSubmit={handleSubmitRegisterPage}>
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

export default LoginPage;