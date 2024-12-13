import React, { useState } from "react";
import { useUser } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser(); // Accéder à la fonction login du contexte
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
        login(data.data.login); // Mettre à jour le contexte utilisateur
        alert("Connexion réussie !");
        navigate("/main"); // Rediriger vers la page principale
      } else {
        alert("Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}

export default Login;
