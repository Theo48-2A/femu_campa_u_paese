import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/UserContext";
import SearchBar from "../SearchBar/SearchBar";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
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
      {showAccountInfo && user && (
        <div className="account-info">
          <h3>Informations du compte</h3>
          <p>username : {user.user.username}</p>
          <p>Téléphone : {user.user.token}</p>
          <p>Email : {user.user.email}</p>
          <p>Téléphone : {user.user.phoneNumber}</p>
          <p>CreatedAt : {user.user.createdAt}</p>
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
}

export default Sidebar;
