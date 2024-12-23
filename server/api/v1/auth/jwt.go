package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

// ValidateJWT vérifie et valide un token JWT
func ValidateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}

	// Analyse et valide le token JWT
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Vérifie que la méthode de signature est correcte
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
