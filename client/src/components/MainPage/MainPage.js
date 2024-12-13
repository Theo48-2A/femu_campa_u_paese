import React, { useState } from "react";
import { useUser } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import "./MainPage.css"; // Importer le CSS spécifique à la page

function MainPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }

  const toggleAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  return (
    <div className="main-container">
      <header className="header">
        <h1>Bienvenue sur l'application</h1>
        <div className="header-actions">
          <button onClick={toggleAccountInfo} className="info-button">
            🟦
          </button>
          <button onClick={logout} className="logout-button">
            ⬅
          </button>
        </div>
      </header>
      <main className="content">
        <p>Bienvenue dans votre tableau de bord, {user.user.username || "Utilisateur"} !</p>
        {showAccountInfo && (
          <div className="account-info">
            <h3>Informations du compte</h3>
            <p>Email : {user.user.email}</p>
            <p>Téléphone : {user.user.phoneNumber}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainPage;
