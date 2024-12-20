import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import Sidebar from "../Sidebar/Sidebar"; // Inclure la barre de navigation

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false); // État pour le téléchargement de l'avatar

  useEffect(() => {
    const fetchUserProfile = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

      // Récupérer les informations utilisateur depuis le localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.token || !storedUser.id) {
        setError("Utilisateur non authentifié.");
        setLoading(false);
        return;
      }

      const { token, id } = storedUser; // On récupère le token et l'id

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Utiliser le token pour authentifier la requête
          },
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
            variables: { userId: id }, // Utiliser l'id de l'utilisateur connecté
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
        setError("Impossible de charger votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAvatarChange = async (event) => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.token || !storedUser.id) {
      setError("Utilisateur non authentifié.");
      return;
    }
  
    const { token, id } = storedUser; // Récupérer le token et l'id
    const file = event.target.files[0]; // Fichier sélectionné
  
    if (!file) {
      return;
    }
  
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userID", id);
  
      const response = await fetch(`${apiUrl}/api/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter l'autorisation
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Échec du téléchargement : ${response.status}`);
      }
  
      const avatarURL = `${apiUrl}/api/user/${id}/profile-picture?timestamp=${Date.now()}`; // Ajouter un timestamp
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatarUrl: avatarURL,
      }));
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'avatar :", error);
      setError("Impossible de mettre à jour l'avatar.");
    } finally {
      setUploading(false);
    }
  };
  

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
        <div className="avatar-container">
          <img
            src={profile.avatarUrl || "https://via.placeholder.com/150"} // Image par défaut si avatar non disponible
            alt="Avatar"
            className="profile-avatar"
          />
          <label className="avatar-change-icon">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading} // Désactiver si téléchargement en cours
              style={{ display: "none" }} // Cacher l'input file natif
            />
          </label>
        </div>
        <div className="profile-details">
          <h1>{profile.username || "Utilisateur inconnu"}</h1>
          <p>{profile.description || "Pas de description disponible."}</p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
