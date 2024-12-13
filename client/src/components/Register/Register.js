import React, { useState } from "react";
import { useUser } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { login } = useUser(); // Accéder à la fonction login du contexte
  const navigate = useNavigate();

  const handleRegister = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

    const mutation = `
      mutation {
        register(
          username: "${username}",
          password: "${password}",
          email: "${email}",
          phoneNumber: "${phoneNumber}"
        ) {
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
    `;

    try {
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.data.register;

        if (result.token) {
          login(result); // Mettre à jour le contexte utilisateur avec le token et les infos utilisateur
          alert(result.message || "Inscription réussie !");
          navigate("/main"); // Rediriger vers la page principale
        } else {
          alert(`Échec : ${result.message}`);
        }
      } else {
        alert("Erreur lors de la requête. Veuillez vérifier vos données.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <input
        type="email"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleRegister}>S'enregistrer</button>
    </div>
  );
}

export default Register;
