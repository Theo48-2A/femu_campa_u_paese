import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080"; 
  const navigate = useNavigate();
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleSearch = useCallback(async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              searchUsers(prefix: "${query}", limit: 10) {
                id
                username
                avatarUrl
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Résultats de la recherche :", data.data.searchUsers);
        setResults(data.data.searchUsers || []);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query, handleSearch]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  // Fonction pour naviguer vers le profil utilisateur
  const handleUserClick = (id) => {
    if(id === userFromLocalStorage.id){
      navigate(`/my-profile`);
    }
    else{
      navigate(`/user/${id}`);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && !loading && (
          <button className="clear-button" onClick={clearSearch}>
            &#10005;
          </button>
        )}
        {loading && <div className="loading-spinner"></div>}
      </div>
      <div className="search-results">
        {results.map((user) => (
          <div
            key={user.id}
            className="search-result-item"
            onClick={() => handleUserClick(user.id)}
          >
            <img
              src={`${apiUrl}${user.avatarUrl || "/default-avatar.png"}`}
              alt={`${user.username}'s avatar`}
              className="search-result-avatar"
            />
            <span className="search-result-username">{user.username}</span>
          </div>
        ))}
        {results.length === 0 && query && !loading && (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
