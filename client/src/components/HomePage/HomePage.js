import React from "react";
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
    <div>
      <h2>Bienvenue !</h2>
      <p>Veuillez vous connecter ou vous enregistrer pour continuer.</p>
      <button onClick={handleNavigateToLogin}>Se connecter</button>
      <button onClick={handleNavigateToRegister}>S'enregistrer</button>
    </div>
  );
}

export default HomePage;
