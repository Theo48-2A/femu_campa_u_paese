package graph

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

func (r *mutationResolver) UpdateProfile(ctx context.Context, description *string, avatarURL *string) (*model.UserProfile, error) {
	panic(fmt.Errorf("not implemented: UpdateProfile - updateProfile"))
}

// SearchUsers inchangé
func (r *queryResolver) SearchUsers(ctx context.Context, prefix string, limit *int) ([]*model.UserAccount, error) {
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

func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }
func (r *Resolver) Query() QueryResolver       { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
