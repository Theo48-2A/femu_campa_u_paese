import React from "react";
import { UserProvider } from "./utils/UserContext";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/HomePage/Login/Login";
import Register from "./components/HomePage/Register/Register";
import MainPage from "./components/MainPage/MainPage";
import MyProfile from "./components/MainPage/MyProfile/MyProfile";
import SearchBar from "./components/MainPage/SearchBar/SearchBar";
import UserProfile from "./components/MainPage/UserProfile/UserProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/search-bar" element={<SearchBar />} />
          <Route path="/user/:userID" element={<UserProfile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;