import { useState } from "react";
import "./App.css";
import Inicio from "./Pages/Js/Inicio.jsx";
import MisPartidas from "./Pages/Js/MisPartidas.jsx";
import Search from "./Pages/Js/Search.jsx";
import Profile from "./Pages/Js/Profile.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Si existe

function App() {
  const [isPopUp, setIsPopUp] = useState(false); // Estado global para el pop-up de Login

  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta inicial con isPopUp */}
            <Route path="/" element={<Inicio isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />
            <Route path="/misPartidas" element={<MisPartidas isPopUp={isPopUp} setIsPopUp={setIsPopUp}/>} />
            <Route path="/search" element={<Search isPopUp={isPopUp} setIsPopUp={setIsPopUp}/>} />
            <Route path="/profile" element={<Profile isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />


          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
