import React, { useState } from "react";

function DynamicMenuPage() {
  const [selectedSection, setSelectedSection] = useState("home");

  const menuItems = [
    { id: "home", label: "Accueil", content: "Benvenuti à a piattaforma!" },
    { id: "culture", label: "Cultura Corsa", content: "A cultura corsa hè viva è dinamica." },
    { id: "nature", label: "Natura", content: "Esplora a bellezza di a nostra isula." },
    { id: "community", label: "Cumunità", content: "Facci campà u paese cun orgogliu!" },
    { id: "friendship", label: "Amicizia", content: "Salute è amicizia per tutti i Corsi!" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar Menu */}
      <div style={styles.sidebar}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.menuItem,
              ...(selectedSection === item.id ? styles.menuItemActive : {}),
            }}
            onClick={() => setSelectedSection(item.id)}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        <h1 style={styles.header}>
          {menuItems.find((item) => item.id === selectedSection).label}
        </h1>
        <p style={styles.text}>
          {menuItems.find((item) => item.id === selectedSection).content}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh", // Full height of the viewport
    width: "100vw", // Full width of the viewport
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "20%", // 20% of the screen width
    backgroundColor: "#2e8b57", // Dark green
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)", // Subtle shadow
  },
  menuItem: {
    padding: "15px 20px",
    margin: "10px 0",
    cursor: "pointer",
    borderRadius: "8px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  menuItemActive: {
    backgroundColor: "#3cb371", // Lighter green for active
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Add depth
    transform: "scale(1.05)", // Slight zoom
  },
  content: {
    flex: 1, // Take up the remaining width
    padding: "40px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: "2.5rem",
    color: "#2e8b57",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.3rem",
    color: "#333",
    textAlign: "center",
    maxWidth: "600px",
  },
};

export default DynamicMenuPage;
