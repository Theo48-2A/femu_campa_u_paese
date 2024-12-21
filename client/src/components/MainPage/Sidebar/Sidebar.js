import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../utils/UserContext";
import SearchBar from "../SearchBar/SearchBar";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [activeSection, setActiveSection] = useState(null);

  // Charger l'utilisateur depuis le localStorage
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();                       // Déconnexion
    localStorage.removeItem("user");// Supprime les données du localStorage
    navigate("/");                  // Redirige vers la page d'accueil
  };

  // Toggle d’une section (search, accountInfo, etc.)
  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="sidebar-container">
      {/* SIDEBAR PRINCIPALE */}
      <div className="modern-sidebar">
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate("/main")}>
            <i className="fas fa-home icon"></i>
            <span className="text">Accueil</span>
          </div>

          <div className="menu-item" onClick={() => toggleSection("search")}>
            <i className="fas fa-search icon"></i>
            <span className="text">Rechercher</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/my-profile")}>
            <i className="fas fa-user icon"></i>
            <span className="text">Profil</span>
          </div>

          <div className="menu-item" onClick={() => toggleSection("accountInfo")}>
            <i className="fas fa-info-circle icon"></i>
            <span className="text">Infos</span>
          </div>

          <div className="menu-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt icon"></i>
            <span className="text">Déconnexion</span>
          </div>
        </div>
      </div>

      {/* SECTION RECHERCHE */}
      {activeSection === "search" && (
        <div className="search-sidebar">
          <SearchBar />
        </div>
      )}

      {/* INFORMATIONS DU COMPTE */}
      {activeSection === "accountInfo" && userFromLocalStorage && (
        <div className="account-info">
          <h3>Informations du compte</h3>
          <p>
            <strong>ID :</strong> {userFromLocalStorage.id}
          </p>
          <p>
            <strong>Nom d'utilisateur :</strong> {userFromLocalStorage.username}
          </p>
          <p>
            <strong>Email :</strong> {userFromLocalStorage.email}
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            {userFromLocalStorage.phoneNumber || "Non renseigné"}
          </p>
          <p>
            <strong>Créé le :</strong>{" "}
            {new Date(userFromLocalStorage.createdAt).toLocaleDateString()}
          </p>
          <button onClick={() => navigate("/my-profile")} className="profile-button">
            Voir mon profil
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
