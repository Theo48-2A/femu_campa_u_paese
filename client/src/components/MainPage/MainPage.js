import React from "react";
import { useUser } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h1>Bienvenue, {user.user.username || "Utilisateur"} !</h1>
      <p>Email : {user.user.email}</p>
      <p>Téléphone : {user.user.phoneNumber}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}

export default MainPage;
