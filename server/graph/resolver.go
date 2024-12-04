package graph

import (

	// Remplacez "your_project" par le nom de votre module Go

	"github.com/golang-jwt/jwt/v5"
)

type Resolver struct{}

// Clé secrète pour signer les tokens JWT
var jwtKey = []byte("votre-cle-secrete")

// Structure pour les revendications JWT
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Résolveur pour la mutation `login`
/*func (r *mutationResolver) Login(ctx context.Context, username string, password string) (*model.AuthResponse, error) {
	// Remplacez cette partie par une vraie validation (par exemple, base de données)
	if username != "admin" || password != "password123" {
		return nil, errors.New("invalid username or password")
	}

	// Créer un token JWT
	expirationTime := time.Now().Add(15 * time.Minute) // Token valide 15 minutes
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return nil, errors.New("could not create token")
	}

	// Retourner le token et les informations utilisateur
	return &model.AuthResponse{
		Token: tokenString,
		User: &model.User{
			ID:       "1", // Id utilisateur fictif pour le test
			Username: username,
		},
	}, nil
}
*/
