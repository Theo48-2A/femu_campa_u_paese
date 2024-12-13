package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.57

import (
	"context"
	"fmt"
	"server/auth"
	"server/graph/model"
	"server/users"
	"strconv"
)

// Register is the resolver for the register field.
func (r *mutationResolver) Register(ctx context.Context, username string, password string, email string, phoneNumber *string) (*model.AuthResponse, error) {
	// Enregistrement de l'utilisateur
	message, err := users.Register(ctx, username, password, email, phoneNumber)
	if err != nil {
		return nil, fmt.Errorf("error registering user: %v", err)
	}

	user, err := users.Login(ctx, username, password)
	if err != nil {
		return nil, fmt.Errorf("error logging in: %v", err)
	}

	// Conversion de user.ID (string) en int
	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	// Génération du token JWT
	token, err := auth.GenerateJWT(int(userID), user.Username)
	if err != nil {
		return nil, fmt.Errorf("error generating JWT: %v", err)
	}

	return &model.AuthResponse{
		Token:   token,
		User:    user,
		Message: &message, // Convertit la chaîne en pointeur
	}, nil
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, username string, password string) (*model.AuthResponse, error) {
	// Connexion utilisateur
	user, err := users.Login(ctx, username, password)
	if err != nil {
		return nil, fmt.Errorf("error logging in: %v", err)
	}

	// Conversion de user.ID (string) en int
	userID, err := strconv.Atoi(user.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	// Génération du token JWT
	token, err := auth.GenerateJWT(int(userID), user.Username)
	if err != nil {
		return nil, fmt.Errorf("error generating JWT: %v", err)
	}

	return &model.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
