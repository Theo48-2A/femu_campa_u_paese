package register

import (
	"context"
	"fmt"
	"server/api/v1/auth"
	"server/api/v1/database"
	"server/api/v1/graph/model"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// RegisterAndGenerateToken gère l'enregistrement, le login et la génération de token
func Register(ctx context.Context, username, password, email string, phoneNumber *string) (*model.AuthResponse, error) {
	// Hachage du mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %v", err)
	}

	// Transaction pour garantir l'intégrité de l'opération
	tx, err := database.DB.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %v", err)
	}

	var userID int
	// Étape 1: Insertion dans la table user_account
	queryUser := `INSERT INTO user_account (username, password_hash, email, phone_number) 
	              VALUES ($1, $2, $3, $4) RETURNING id`
	err = tx.QueryRow(ctx, queryUser, username, hashedPassword, email, phoneNumber).Scan(&userID)
	if err != nil {
		tx.Rollback(ctx)
		return nil, fmt.Errorf("failed to register user: %v", err)
	}

	// Étape 2: Création d'un profil par défaut dans user_profile
	defaultAvatarURL := "" // URL exposée par le serveur
	queryProfile := `INSERT INTO user_profile (user_account_id, description, avatar_url) 
	                 VALUES ($1, $2, $3)`
	_, err = tx.Exec(ctx, queryProfile, userID, "Bienvenue sur mon profil", defaultAvatarURL)
	if err != nil {
		tx.Rollback(ctx)
		return nil, fmt.Errorf("failed to create user profile: %v", err)
	}

	// Commit si tout s'est bien passé
	err = tx.Commit(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %v", err)
	}

	// Convertir userID pour le JWT
	userIDStr := strconv.Itoa(userID)

	// Générer le token JWT
	token, err := auth.GenerateJWT(userID, username)
	if err != nil {
		return nil, fmt.Errorf("error generating JWT: %v", err)
	}

	// Retourner la réponse d'authentification
	return &model.AuthResponse{
		Token:   token,
		User:    &model.UserAccount{ID: userIDStr, Username: username, Email: email, PhoneNumber: phoneNumber, CreatedAt: time.Now().Format(time.RFC3339)},
		Message: &[]string{fmt.Sprintf("User %d and profile created successfully", userID)}[0],
	}, nil
}
