class User {
    constructor(username, token, email = null, phoneNumber = null, createdAt = null) {
      this.username = username;
      this.token = token;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.createdAt = createdAt;
    }
  
    isTokenExpired() {
      const payload = JSON.parse(atob(this.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now; // Vérifie si le token est expiré
    }
  }
  