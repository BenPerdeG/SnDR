import { useState } from 'react'
import './App.css'

import Login from "./Pages/Js/Login.jsx";
import MisPartidas from "./Pages/Js/MisPartidas.jsx";
import Search from "./Pages/Js/Search.jsx";
import Profile from "./Pages/Js/Profile.jsx";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Si existe


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <UserProvider>  
        <BrowserRouter>
          <Routes>
          
          {/*Ruta inicial*/}
          <Route path="/" element={ <Login/>} />
          <Route path="/misPartidas" element={ <MisPartidas/>} />
          <Route path="/search" element={ <Search/>} />
          <Route path="/profile" element={ <Profile/>} />

          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  )
}

export default App
