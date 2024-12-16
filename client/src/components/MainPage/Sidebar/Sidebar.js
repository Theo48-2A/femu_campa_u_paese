import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

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
        <div className="sidebar-item" onClick={() => navigate("/profile")}>
          👤 Profil
        </div>
      </div>

      {/* Deuxième sidebar (recherche) */}
      {showSearch && (
        <div className="search-sidebar">
          <SearchBar />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
