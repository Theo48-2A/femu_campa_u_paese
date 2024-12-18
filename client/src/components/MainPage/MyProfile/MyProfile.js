import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import Sidebar from "../Sidebar/Sidebar"; // Inclure la barre de navigation

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const id = localStorage.getItem("id"); // Récupère le token d'authentification
      const token = localStorage.getItem("token"); // Récupère le token d'authentification

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envoie le token au serveur
          },
          body: JSON.stringify({
            query: `
              query GetAuthenticatedUserProfile {
                getAuthenticatedUserProfile {
                  username
                  description
                  avatarUrl
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error(`Échec de la requête : ${response.status}`);
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors[0].message || "Erreur inconnue");
        }

        setProfile(data.getAuthenticatedUserProfile);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        setError("Impossible de charger votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div>Profil introuvable.</div>;
  }

  return (
    <div className="user-profile-container">
      <Sidebar />
      <div className="profile-header">
        <img
          src={profile.avatarUrl}
          alt="Avatar"
          className="profile-avatar"
        />
        <div className="profile-details">
          <h1>{profile.username || "Utilisateur inconnu"}</h1>
          <p>{profile.description || "Pas de description disponible."}</p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
