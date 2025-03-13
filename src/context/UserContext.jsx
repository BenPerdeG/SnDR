import React, { createContext, useState, useEffect, useContext } from "react"; // Add useContext here

// Create the UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage or default to false
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : false;
  });

  // Update localStorage whenever the user state changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};