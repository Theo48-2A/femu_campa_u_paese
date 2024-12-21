import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/UserContext";
import SearchBar from "../SearchBar/SearchBar";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [activeSection, setActiveSection] = useState(null); // Gérer la section active

  // Charger l'utilisateur depuis le localStorage
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
    localStorage.removeItem("user"); // Supprime les données du localStorage
    navigate("/"); // Redirige vers la page d'accueil
  };

  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="sidebar-container">
      {/* Sidebar principale */}
      <div className="sidebar">
        <div className="sidebar-item" onClick={() => navigate("/main")}>
          🏠 Accueil
        </div>
        <div
          className="sidebar-item"
          onClick={() => toggleSection("search")}
        >
          🔍 Rechercher
        </div>
        <div className="sidebar-item" onClick={() => navigate("/my-profile")}>
          👤 Profil
        </div>
        <div
          className="sidebar-item"
          onClick={() => toggleSection("accountInfo")}
        >
          🟦 Infos
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          ⬅ Déconnexion
        </div>
      </div>

      {/* Section de recherche */}
      {activeSection === "search" && (
        <div className="search-sidebar">
          <SearchBar />
        </div>
      )}

      {/* Informations du compte */}
      {activeSection === "accountInfo" && userFromLocalStorage && (
        <div className="account-info">
          <h3>Informations du compte</h3>
          <p><strong>ID :</strong> {userFromLocalStorage.id}</p>
          <p><strong>Nom d'utilisateur :</strong> {userFromLocalStorage.username}</p>
          <p><strong>Email :</strong> {userFromLocalStorage.email}</p>
          <p><strong>Téléphone :</strong> {userFromLocalStorage.phoneNumber || "Non renseigné"}</p>
          <p><strong>Créé le :</strong> {new Date(userFromLocalStorage.createdAt).toLocaleDateString()}</p>
          <button
            onClick={() => navigate("/my-profile")}
            className="profile-button"
          >
            Voir mon profil
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
