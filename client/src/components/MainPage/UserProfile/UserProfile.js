import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css";
import Sidebar from "../Sidebar/Sidebar"; // Inclure la barre de navigation


function UserProfile() {
  const { userID } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetUserProfile($userId: ID!) {
                getUserProfile(userId: $userId) {
                  username
                  description
                  avatarUrl
                }
              }
            `,
            variables: { userId: userID },
          }),
        });

        if (!response.ok) {
          throw new Error(`Échec de la requête : ${response.status}`);
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors[0].message || "Erreur inconnue");
        }

        setProfile(data.getUserProfile);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        setError("Impossible de charger le profil utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userID]);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div>Utilisateur introuvable.</div>;
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

export default UserProfile;
