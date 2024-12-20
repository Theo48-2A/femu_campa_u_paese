import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Initialiser l'état utilisateur à partir du localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fonction pour connecter l'utilisateur
  const login = (userData) => {
    const userObject = {
      id: userData.user.id,
      username: userData.user.username,
      token: userData.token,
      email: userData.user.email,
      phoneNumber: userData.user.phoneNumber,
      createdAt: userData.user.createdAt,
    };

    setUser(userObject); // Mettre à jour l'état utilisateur
    localStorage.setItem("user", JSON.stringify(userObject)); // Sauvegarder dans le localStorage
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUser(null); // Réinitialiser l'état utilisateur
    localStorage.removeItem("user"); // Supprimer les données du localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
