import React, { useState } from "react";
import "../CSS/Login.css";

const Login = ({ isPopUp, setIsPopUp }) => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", form); // Debugging statement
      const response = await fetch("https://sndr.42web.io/src/inc/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging statement
      if (data.success) {
        alert("Registro exitoso!");
        setIsPopUp(false);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error); // Debugging statement
      setError("Error de conexión al servidor");
    }
  };


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
            <input type="email" name="a" className="mr10" placeholder="Email" required />
          </div>
          <div className="input-box">
            <span className="icon"></span>
            <input type="password" name="b" className="mr10" placeholder="Password" required />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" name="c" className="mr10 mbot20" />Remember me
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
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <span className="icon"></span>
              <input type="text" name="name" className="mr10" placeholder="Username" required onChange={handleChange} autoComplete="username"/>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="email" name="email" className="mr10" placeholder="Email" required onChange={handleChange} autoComplete="email"/>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="password" name="password" className="mr10" placeholder="Password" required onChange={handleChange} autoComplete="new_password"/>
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" name="terms" className="mr10 mbot20" />I agree to the terms & conditions</label>
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
