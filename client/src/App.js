import React from "react";
import { UserProvider } from "./utils/UserContext";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MainPage from "./components/MainPage/MainPage";
import HomePage from "./components/HomePage/HomePage"; // Import de la nouvelle page
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Page d'accueil */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
