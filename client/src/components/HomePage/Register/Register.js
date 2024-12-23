import React, { useState } from "react";
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import "../HomePage.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { login } = useUser();
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
      const response = await fetch(`${apiUrl}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.data.register;

        if (result.token) {
          login(result);
          alert(result.message || "Inscription réussie !");
          navigate("/main");
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
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        {/* Flèche de retour */}
        <button className="back-button" onClick={() => navigate("/")}>
          &#8592; Ritornu
        </button>
        <h1 className="home-title">Creà un novu contu</h1>
        <p className="home-subtitle">
          Benvenutu, simu felici chì vi unite à noi.
        </p>
        <form className="home-form">
          <input
            type="text"
            placeholder="Nome d'utilizatore"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="home-input"
          />
          <input
            type="password"
            placeholder="Codice d'accessu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="home-input"
          />
          <input
            type="email"
            placeholder="Indirizzu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="home-input"
          />
          <input
            type="text"
            placeholder="Numeru di telefunu"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="home-input"
          />
          <div className="home-buttons">
            <button type="button" onClick={handleRegister}>
               Si Arrighjistrà
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
