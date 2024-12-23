package register

import (
	"context"
	"fmt"
	"log"
	"server/database"

	"golang.org/x/crypto/bcrypt"
)

// Register crée un nouvel utilisateur dans la base de données et initialise son profil
func Register(ctx context.Context, username, password, email string, phoneNumber *string) (string, error) {
	// Hachage du mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %v", err)
	}

	// Transaction pour garantir l'intégrité de l'opération
	tx, err := database.DB.Begin(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to start transaction: %v", err)
	}

	var userID int
	// Étape 1: Insertion dans la table user_account
	queryUser := `INSERT INTO user_account (username, password_hash, email, phone_number) 
	              VALUES ($1, $2, $3, $4) RETURNING id`
	err = tx.QueryRow(ctx, queryUser, username, hashedPassword, email, phoneNumber).Scan(&userID)
	if err != nil {
		tx.Rollback(ctx) // Rollback si l'insertion échoue
		return "", fmt.Errorf("failed to register user: %v", err)
	}

	// Étape 2: Création d'un profil vide ou par défaut dans user_profile
	// exemple attendu : avatar_1
	defaultAvatarURL := "" // URL exposée par le serveur
	queryProfile := `INSERT INTO user_profile (user_account_id, description, avatar_url) 
	                 VALUES ($1, $2, $3)`
	_, err = tx.Exec(ctx, queryProfile, userID, "Bienvenue sur mon profil", defaultAvatarURL)
	if err != nil {
		tx.Rollback(ctx) // Rollback si l'insertion échoue
		return "", fmt.Errorf("failed to create user profile: %v", err)
	}

	// Commit si tout s'est bien passé
	err = tx.Commit(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to commit transaction: %v", err)
	}

	log.Printf("User %s registered successfully with ID %d", username, userID)
	return fmt.Sprintf("User %d and profile created successfully", userID), nil
}
