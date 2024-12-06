package users

import (
	"context"
	"fmt"
	"log"
	"server/database"
	"server/graph/model"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Register crée un nouvel utilisateur dans la base de données
func Register(ctx context.Context, username, password, email string, phoneNumber *string) (string, error) {
	// Hachage du mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %v", err)
	}

	// Insertion dans la base de données
	query := `INSERT INTO users (username, password_hash, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING id`
	var userID int
	err = database.DB.QueryRow(ctx, query, username, hashedPassword, email, phoneNumber).Scan(&userID)
	if err != nil {
		return "", fmt.Errorf("failed to register user: %v", err)
	}

	log.Printf("User %s registered successfully with ID %d", username, userID)
	return fmt.Sprintf("User %d created successfully", userID), nil
}

func Login(ctx context.Context, username, password string) (*model.User, error) {
	// Debug log pour suivre le processus
	log.Printf("Attempting login for username: %s", username)

	// Récupération des informations utilisateur
	query := `SELECT id, password_hash, email, phone_number, created_at FROM users WHERE username=$1`
	var user model.User
	var hashedPassword string
	var dbCreatedAt time.Time

	err := database.DB.QueryRow(ctx, query, username).Scan(
		&user.ID,
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
