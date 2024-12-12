import React, { useState } from "react";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const apiUrl = process.env.REACT_APP_API_URL
    alert(apiUrl); // Vérifie si la variable est accessible

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
                message
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.login.token;
        localStorage.setItem("token", token); // Stocker le token
        alert("Connexion réussie !");
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














