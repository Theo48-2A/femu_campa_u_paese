import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import Sidebar from "../Sidebar/Sidebar";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatingDescription, setUpdatingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

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

        // Forcer le rafraîchissement du cache
        const avatarUrlWithCacheBuster = `${data.getUserProfile.avatarUrl}?cachebuster=${Date.now()}`;

        setProfile({
          ...data.getUserProfile,
          avatarUrl: avatarUrlWithCacheBuster,
        });
        setNewDescription(data.getUserProfile.description || "");
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
    if (!file) return;

    setUploading(true);
    setAvatarError(null);

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

      // Met à jour la photo avec un paramètre timestamp pour éviter le cache
      setProfile((prev) => ({
        ...prev,
        avatarUrl: `${apiUrl}/api/user/${id}/profile-picture?timestamp=${Date.now()}`,
      }));
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'avatar :", error);
      setAvatarError("Impossible de mettre à jour l'avatar.");
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
      setDescriptionError("La description ne peut pas être vide.");
      return;
    }

    setUpdatingDescription(true);
    setDescriptionError(null);

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

      setProfile((prev) => ({
        ...prev,
        description: data.updateProfilDescription.description,
      }));
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la description :", error);
      setDescriptionError("Impossible de mettre à jour la description.");
      setNewDescription(profile.description || "");
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

      {/* Le contenu “carte de profil” */}
      <div className="profile-card">
        <div className="avatar-container">
          <img
            src={profile.avatarUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="profile-avatar"
          />
          <label className="avatar-change-icon">
            <i className="fa-solid fa-camera"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
          {avatarError && <p className="avatar-error">{avatarError}</p>}
        </div>

        <h1 className="profile-username">
          {profile.username || "Utilisateur inconnu"}
        </h1>

        <div className="description-container">
          {/* Si on n’est pas en train de modifier la description */}
          {!updatingDescription ? (
            <>
              <p className="profile-description">
                {profile.description || "Aucune description disponible."}
              </p>
              <button
                className="edit-description-icon"
                onClick={() => setUpdatingDescription(true)}
                aria-label="Modifier la description"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </>
          ) : (
            // Sinon, champ de texte + bouton de sauvegarde
            <>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Modifier votre description"
                className="description-input"
              />
              <button
                className="save-description-button"
                onClick={handleDescriptionUpdate}
                disabled={!newDescription.trim()}
              >
                <i className="fa-solid fa-check"></i>
              </button>
            </>
          )}
        </div>

        {descriptionError && (
          <p className="description-error">{descriptionError}</p>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
