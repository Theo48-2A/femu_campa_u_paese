package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.57

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"server/auth"
	search_users "server/content/social"
	"server/content/user_account/login"
	"server/content/user_account/register"
	"server/database"
	"server/graph/model"
	"strconv"
)

// Register est inchangé
func (r *mutationResolver) Register(ctx context.Context, username string, password string, email string, phoneNumber *string) (*model.AuthResponse, error) {
	message, err := register.Register(ctx, username, password, email, phoneNumber)
	if err != nil {
		return nil, fmt.Errorf("error registering user: %v", err)
	}

	user, err := login.Login(ctx, username, password)
	if err != nil {
		return nil, fmt.Errorf("error logging in: %v", err)
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	token, err := auth.GenerateJWT(int(userID), user.Username)
	if err != nil {
		return nil, fmt.Errorf("error generating JWT: %v", err)
	}

	return &model.AuthResponse{
		Token:   token,
		User:    user,
		Message: &message,
	}, nil
}

// Login est inchangé
func (r *mutationResolver) Login(ctx context.Context, username string, password string) (*model.AuthResponse, error) {
	user, err := login.Login(ctx, username, password)
	if err != nil {
		return nil, fmt.Errorf("error logging in: %v", err)
	}

	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	token, err := auth.GenerateJWT(int(userID), user.Username)
	if err != nil {
		return nil, fmt.Errorf("error generating JWT: %v", err)
	}

	return &model.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// UpdateProfilDescription is the resolver for the updateProfilDescription field.
func (r *mutationResolver) UpdateProfilDescription(ctx context.Context, userID string, description *string) (*model.UserProfile, error) {
	log.Printf("Début UpdateProfilDescription\n")

	// Vérifier si la description est valide
	if description == nil || *description == "" {
		return nil, fmt.Errorf("la description ne peut pas être vide")
	}

	// Vérifier si l'utilisateur existe dans la base de données
	checkQuery := `
        SELECT COUNT(*)
        FROM user_profile
        WHERE user_account_id = $1
    `
	var count int
	err := database.DB.QueryRow(ctx, checkQuery, userID).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la vérification de l'utilisateur : %v", err)
	}
	if count == 0 {
		return nil, fmt.Errorf("aucun profil utilisateur trouvé pour l'ID : %s", userID)
	}

	// Mettre à jour la description dans la base de données
	updateQuery := `
        UPDATE user_profile
        SET description = $1
        WHERE user_account_id = $2
        RETURNING description
    `
	var updatedDescription string
	err = database.DB.QueryRow(ctx, updateQuery, *description, userID).Scan(&updatedDescription)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la mise à jour de la description : %v", err)
	}

	// Construire l'objet UserProfile mis à jour
	userProfile := &model.UserProfile{
		ID:          userID,
		Description: &updatedDescription,
	}

	log.Printf("Fin UpdateProfilDescription\n")
	return userProfile, nil
}

// SearchUsers inchangé
func (r *queryResolver) SearchUsers(ctx context.Context, prefix string, limit *int) ([]*model.UserProfile, error) {
	fmt.Printf("In schema.resolvers.go, func SearchUsers")
	return search_users.SearchUser(ctx, prefix, limit)
}

// GetUserProfile
func (r *queryResolver) GetUserProfile(ctx context.Context, userID string) (*model.UserProfile, error) {
	log.Printf("Début GetUserProfile\n")

	query := `
        SELECT u.username, p.description, p.avatar_url
        FROM user_account AS u
        JOIN user_profile AS p ON u.id = p.user_account_id
        WHERE u.id = $1
    `

	var userProfile model.UserProfile
	var username, avatarFileName string

	err := database.DB.QueryRow(ctx, query, userID).Scan(
		&username,
		&userProfile.Description,
		&avatarFileName,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("Profil utilisateur introuvable pour l'ID : %s", userID)
		}
		return nil, fmt.Errorf("Erreur lors de la récupération du profil utilisateur : %v", err)
	}

	userProfile.ID = userID
	userProfile.Username = username

	// Construction de l'URL vers l'endpoint REST
	baseURL := "http://localhost:8080"
	a := fmt.Sprintf("%s/api/user/default/profile-picture", baseURL)
	b := fmt.Sprintf("%s/api/user/%s/profile-picture", baseURL, userID)
	if avatarFileName == "" {
		// Pas d'avatar défini en base, utiliser l'avatar par défaut
		userProfile.AvatarURL = &a
	} else {
		userProfile.AvatarURL = &b
	}

	log.Printf("Fin GetUserProfile\n")
	return &userProfile, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
