import React from "react";
import { UserProvider } from "./utils/UserContext";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/HomePage/Login/Login";
import Register from "./components/HomePage/Register/Register";
import MainPage from "./components/MainPage/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Page d'accueil */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
