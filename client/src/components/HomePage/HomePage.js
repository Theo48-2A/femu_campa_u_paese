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
        <div className="home-title-container">
          <h1 className="home-title">Femu Campà U Paese </h1>
          <img
            src="/images/triangle_isula.jpg"
            alt="Triangle Isula"
            className="home-icon"
          />
        </div>
        <p className="home-subtitle">
          La piattaforma chi face campà a cultura corsa.
        </p>
        <div className="home-buttons">
          <button onClick={handleNavigateToLogin}>Si Cunnettà</button>
          <button onClick={handleNavigateToRegister}>Si Arrighjistrà</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
