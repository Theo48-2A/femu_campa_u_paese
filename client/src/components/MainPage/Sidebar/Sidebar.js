import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Ajouter le CSS pour la barre

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-item" onClick={() => navigate("/main")}>
        🏠 Accueil
      </div>
      <div className="sidebar-item" onClick={() => navigate("/search-user")}>
        🔍 Rechercher
      </div>
      <div className="sidebar-item" onClick={() => navigate("/profile")}>
        👤 Profil
      </div>
    </div>
  );
}

export default Sidebar;
