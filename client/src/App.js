import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import RandomPage from "./components/RandomPage/RandomPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <MainPage
              isAuthenticated={isAuthenticated}
              onLogin={handleLogin}
            />
          }
        />
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        {/* Page d'inscription */}
        <Route path="/register" element={<Register />} />
        {/* Page random */}
        <Route path="/random" element={<RandomPage />} />
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
