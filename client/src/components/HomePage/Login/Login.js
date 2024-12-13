import React, { useState } from "react";
import "../HomePage.css";
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

    try {
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              login(username: "${username}", password: "${password}") {
                token
                user {
                  id
                  username
                  email
                  phoneNumber
                  createdAt
                }
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.data.login);
        alert("Connexion réussie !");
        navigate("/main");
      } else {
        alert("Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content login-container">
        {/* Flèche de retour */}
        <button className="back-button" onClick={() => navigate("/")}>
          &#8592; Ritornu
        </button>
        <h1 className="home-title">Autentificazione</h1>
        <p className="home-subtitle">
           Cunnettassi à nostra piattaforma
        </p>
        <form className="home-form">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="home-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="home-input"
          />
          <div className="home-buttons">
            <button type="button" onClick={handleLogin}>
               Si Cunnettà
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
