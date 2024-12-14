import React from "react";
import "./ProfilePage.css";
import Sidebar from "../Sidebar/Sidebar"; // Inclure la barre de navigation

function ProfilePage() {
  const user = {
    username: "theo_fontana",
    bio: "Combattant Muay-Thai (Boxe Thailandaise) 🥊\nLozérien/Corse",
    posts: 26,
    followers: 328,
    following: 280,
    avatar: "/images/Bastia3.jpg", // Chemin de l'avatar
    publications: [
      "/images/Bastia.jpg",
      "/images/Bastia2.jpg",
      "/images/Bastia3.jpg",
    ], // Liste des photos publiées
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-container">
        <div className="profile-header">
          <img src={user.avatar} alt="Avatar" className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-username">{user.username}</h1>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-stats">
              <span>{user.posts} publications</span>
              <span>{user.followers} followers</span>
              <span>{user.following} following</span>
            </div>
          </div>
        </div>
        <div className="profile-gallery">
          {user.publications.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Publication ${index + 1}`}
              className="gallery-photo"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
