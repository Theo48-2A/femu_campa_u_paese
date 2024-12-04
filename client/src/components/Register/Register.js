import React from "react";

function Register() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>S'inscrive</h1>
        <form style={styles.form}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            style={styles.input}
          />
          <input type="email" placeholder="Email" style={styles.input} />
          <input type="password" placeholder="Mot de passe" style={styles.input} />
          <button style={styles.button}>S'inscrire</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage: "url('images/Pastricciola.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Semi-transparent overlay
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "300px",
  },
  title: {
    fontSize: "2rem",
    color: "#2e8b57",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#2e8b57",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default Register;
