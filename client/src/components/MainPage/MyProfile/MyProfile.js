import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import Sidebar from "../Sidebar/Sidebar";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatingDescription, setUpdatingDescription] = useState(false); // État pour la mise à jour de la description
  const [newDescription, setNewDescription] = useState(""); // Stocker la nouvelle description

  useEffect(() => {
    const fetchUserProfile = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.token || !storedUser.id) {
        setError("Utilisateur non authentifié.");
        setLoading(false);
        return;
      }

      const { token, id } = storedUser;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                getUserProfile(userId: "${id}") {
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

        setProfile(data.getUserProfile);
        setNewDescription(data.getUserProfile.description || ""); // Initialiser la description
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

    const { token, id } = storedUser;
    const file = event.target.files[0];

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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Échec du téléchargement : ${response.status}`);
      }

      const avatarURL = `${apiUrl}/api/user/${id}/profile-picture?timestamp=${Date.now()}`;
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

  const handleDescriptionUpdate = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.token || !storedUser.id) {
      setError("Utilisateur non authentifié.");
      return;
    }

    const { token, id } = storedUser;

    if (!newDescription.trim()) {
      setError("La description ne peut pas être vide.");
      return;
    }

    setUpdatingDescription(true);
    try {
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateProfilDescription(userId: "${id}", description: "${newDescription}") {
                id
                description
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

      setProfile((prevProfile) => ({
        ...prevProfile,
        description: data.updateProfilDescription.description,
      }));
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la description :", error);
      setError("Impossible de mettre à jour la description.");
    } finally {
      setUpdatingDescription(false);
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
            src={profile.avatarUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="profile-avatar"
          />
          <label className="avatar-change-icon">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="profile-details">
          <h1>{profile.username || "Utilisateur inconnu"}</h1>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Mettez à jour votre description"
            className="description-input"
            disabled={updatingDescription}
          />
          <button
            onClick={handleDescriptionUpdate}
            disabled={updatingDescription}
            className="update-description-button"
          >
            {updatingDescription ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
