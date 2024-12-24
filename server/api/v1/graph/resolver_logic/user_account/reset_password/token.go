package reset_password

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Clé secrète pour signer les tokens
var jwtKey = []byte("votre-cle-secrete")

// GeneratePasswordResetToken génère un token JWT pour la réinitialisation du mot de passe
func GeneratePasswordResetToken(userID string, email string) (string, error) {
	claims := jwt.MapClaims{
		"userID": userID,
		"email":  email,
		"exp":    time.Now().Add(15 * time.Minute).Unix(), // Expire dans 15 minutes
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(jwtKey)
	if err != nil {
		return "", fmt.Errorf("erreur lors de la génération du token : %v", err)
	}
	return signedToken, nil
}
