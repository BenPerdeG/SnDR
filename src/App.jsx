import { useState, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; 
import ProtectedRoutesUser from "./context/ProtectedRoutes.jsx";

// Lazy load components for better performance
const Inicio = lazy(() => import("./Pages/Js/Inicio.jsx"));
const MisPartidas = lazy(() => import("./Pages/Js/MisPartidas.jsx"));
const Search = lazy(() => import("./Pages/Js/Search.jsx"));
const Profile = lazy(() => import("./Pages/Js/Profile.jsx"));
const Login = lazy(() => import("./Pages/Js/Login.jsx"));

function App() {
  const [isPopUp, setIsPopUp] = useState(false); 
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              
              {/* Ruta inicial con isPopUp */}
              <Route path="/" element={<Inicio isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />
              
              <Route element={<ProtectedRoutesUser />}>
                <Route path="/misPartidas" element={<MisPartidas isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />
                <Route path="/search" element={<Search isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />
                <Route path="/profile" element={<Profile isPopUp={isPopUp} setIsPopUp={setIsPopUp} />} />
              </Route>
              
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;