import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1 className="home-title">Femu Campà U Paese !</h1>
        <p className="home-subtitle">
          La piattaforma chi face campà a cultura corsa.
        </p>
        <div className="home-buttons">
          <button onClick={handleNavigateToLogin}>Se connecter</button>
          <button onClick={handleNavigateToRegister}>S'enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
