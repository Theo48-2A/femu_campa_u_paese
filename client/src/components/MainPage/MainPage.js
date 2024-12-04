import React, { useState } from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const [hovered, setHovered] = useState(null); // Track hovered menu item

  const handleMouseEnter = (index) => {
    setHovered(index);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const menuItems = [
    { label: "S'identificà", link: "/login" },
    { label: "S'inscrive", link: "/register" },
    { label: "Cuntinuà Senza Login", link: "/random" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <header style={styles.header}>
        <h1 style={styles.title}>Femu Campà u Paese</h1>
        <h3 style={styles.subtitle}>
          Benvenuti nant'à a piattaforma chi face campà a cultura corsa.
        </h3>
      </header>

      <nav style={styles.menu}>
        {menuItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            style={{
              ...styles.menuItem,
              ...(hovered === index ? styles.menuItemHover : {}),
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    backgroundImage: "url('images/Pastricciola.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  header: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "white",
    marginTop: "20px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "3.5rem",
    background: "linear-gradient(90deg, #1e90ff, #32cd32)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#f0f0f0",
    textShadow: "0 4px 6px rgba(0, 0, 0, 0.6)",
    marginBottom: "30px",
  },
  menu: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  menuItem: {
    textDecoration: "none",
    fontSize: "1.2rem",
    color: "white",
    backgroundColor: "rgba(46, 139, 87, 0.9)",
    padding: "10px 20px",
    borderRadius: "50px",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  },
  menuItemHover: {
    transform: "scale(1.1)",
    backgroundColor: "rgba(46, 139, 87, 1)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.5)",
  },
};

export default MainPage;
