package register

import (
	"context"
	"fmt"
	"log"
	"server/database"

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
