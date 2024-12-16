import React, { useState, useEffect, useCallback } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              searchUsers(prefix: "${query}", limit: 10) {
                id
                username
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
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
          <div key={user.id} className="search-result-item">
            {user.username}
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
