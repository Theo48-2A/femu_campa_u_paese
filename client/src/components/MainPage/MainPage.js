import React, { useState } from "react";
import { useUser } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import "./MainPage.css"; // Importer le CSS spécifique à la page
import Sidebar from "./Sidebar/Sidebar"; // Inclure la barre de navigation


function MainPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showAccountInfo] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }


  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1> </h1>
          <div className="header-actions">
            <button onClick={logout} className="logout-button">
              ⬅
            </button>
          </div>
        </header>
        <main className="content">
          <p>Bienvenue dans votre tableau de bord, {user.username || "Utilisateur"} !</p>
          {showAccountInfo && (
            <div className="account-info">
              <h3>Informations du compte</h3>
              <p>Email : {user.email}</p>
              <p>Téléphone : {user.phoneNumber}</p>
              <button
                onClick={() => navigate("/profile")}
                className="profile-button"
              >
                Voir le profil
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
  
}

export default MainPage;