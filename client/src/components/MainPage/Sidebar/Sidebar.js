import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/UserContext";
import SearchBar from "../SearchBar/SearchBar";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  // Charger l'utilisateur depuis le localStorage
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
    localStorage.removeItem("user"); // Supprime les données du localStorage
    navigate("/"); // Redirige vers la page d'accueil
  };

  const toggleAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  return (
    <div className="sidebar-container">
      {/* Sidebar principale */}
      <div className="sidebar">
        <div className="sidebar-item" onClick={() => navigate("/main")}>
          🏠 Accueil
        </div>
        <div className="sidebar-item" onClick={() => setShowSearch(!showSearch)}>
          🔍 Rechercher
        </div>
        <div className="sidebar-item" onClick={() => navigate("/my-profile")}>
          👤 Profil
        </div>
        <div className="sidebar-item" onClick={toggleAccountInfo}>
          🟦 Infos
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          ⬅ Déconnexion
        </div>
      </div>

      {/* Deuxième sidebar (recherche) */}
      {showSearch && (
        <div className="search-sidebar">
          <SearchBar />
        </div>
      )}

      {/* Informations du compte */}
      {showAccountInfo && userFromLocalStorage && (
        <div className="account-info">
          <h3>Informations du compte</h3>
          <p>id : {userFromLocalStorage.id}</p>
          <p>username : {userFromLocalStorage.username}</p>
          <p>Email : {userFromLocalStorage.email}</p>
          <p>Téléphone : {userFromLocalStorage.phoneNumber}</p>
          <p>CreatedAt : {userFromLocalStorage.createdAt}</p>
          <button
            onClick={() => navigate("/profile")}
            className="profile-button"
          >
            Voir le profil
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;


