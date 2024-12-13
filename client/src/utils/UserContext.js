import React, { createContext, useState, useContext } from "react";

// Création du contexte utilisateur
const UserContext = createContext();

// Hook personnalisé pour accéder au contexte utilisateur
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker l'utilisateur

  // Fonction pour authentifier l'utilisateur
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Stocker le token dans le localStorage
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Supprimer le token
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
