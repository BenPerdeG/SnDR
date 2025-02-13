import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto de user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false); // Estado de user, por defecto está en false

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext); // Hook para acceder al contexto
};