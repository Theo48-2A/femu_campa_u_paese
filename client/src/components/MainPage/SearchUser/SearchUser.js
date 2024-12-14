import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchUser() {
  const [query, setQuery] = useState(""); // Terme de recherche saisi par l'utilisateur
  const [results, setResults] = useState([]); // Résultats de la recherche
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(""); // Message d'erreur
  const navigate = useNavigate();

  const handleSearch = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

    if (!query) {
      setError("Veuillez entrer un terme de recherche.");
      return;
    }

    setLoading(true);
    setError(""); // Réinitialise les erreurs

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
                email
                phoneNumber
                createdAt
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.errors) {
          setError(data.errors[0]?.message || "Erreur lors de la recherche.");
        } else {
          setResults(data.data.searchUsers || []);
        }
      } else {
        setError("Erreur lors de la recherche. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setError("Erreur réseau. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content login-container">
        {/* Flèche de retour */}
        <button className="back-button" onClick={() => navigate("/main")}>
          &#8592; Ritornu
        </button>
        <h1 className="home-title">Rechercher des utilisateurs</h1>
        <p className="home-subtitle">
          Entrez un nom ou une partie de nom pour trouver un utilisateur.
        </p>
        <form
          className="home-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="home-input"
          />
          <div className="home-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </div>
        </form>
        {/* Affichage des erreurs */}
        {error && <p className="error-message">{error}</p>}
        {/* Résultats de la recherche */}
        <div className="search-results">
          {results.length > 0 ? (
            results.map((user) => (
              <div key={user.id} className="user-card">
                <p>
                  <strong>{user.username}</strong>
                </p>
                <p>Email: {user.email}</p>
                <p>Téléphone: {user.phoneNumber || "Non renseigné"}</p>
                <p>Date de création: {new Date(user.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            !loading && <p>Aucun utilisateur trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchUser;
