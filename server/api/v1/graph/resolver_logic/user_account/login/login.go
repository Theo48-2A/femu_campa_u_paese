package login

import (
	"context"
	"fmt"
	"log"
	"server/api/v1/database"
	"server/api/v1/graph/model"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func Login(ctx context.Context, username, password string) (*model.UserAccount, error) {
	// Debug log pour suivre le processus
	log.Printf("Attempting login for username: %s", username)

	// Récupération des informations utilisateur
	query := `SELECT id, username, password_hash, email, phone_number, created_at FROM user_account WHERE username=$1`
	var user model.UserAccount
	var hashedPassword string
	var dbCreatedAt time.Time

	err := database.DB.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Username, // Ajout du scan du champ username
		&hashedPassword,
		&user.Email,
		&user.PhoneNumber,
		&dbCreatedAt,
	)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		return nil, fmt.Errorf("invalid username or password")
	}

	// Convertir dbCreatedAt en string (format ISO 8601 par exemple)
	user.CreatedAt = dbCreatedAt.Format(time.RFC3339)

	// Debug pour vérifier le hash du mot de passe
	log.Printf("Password hash from DB: %s", hashedPassword)

	// Vérification du mot de passe
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		log.Printf("Password mismatch for user %s: %v", username, err)
		return nil, fmt.Errorf("invalid username or password")
	}

	// Si tout est OK
	log.Printf("User %s logged in successfully", username)
	return &user, nil
}
