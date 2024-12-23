package search_users

import (
	"context"
	"fmt"
	"server/api/v1/database"
	"server/api/v1/graph/model"
)

func SearchUser(ctx context.Context, prefix string, limit *int) ([]*model.UserProfile, error) {
	fmt.Printf("In schema.resolvers.go, func SearchUsers : debut\n")
	maxResults := 10
	if limit != nil {
		maxResults = *limit
	}

	// Requête SQL mise à jour pour inclure le username et l'avatar_url
	query := `
        SELECT user_profile.id, user_account.username, user_profile.avatar_url
        FROM user_profile
        JOIN user_account
        ON user_profile.user_account_id = user_account.id
        WHERE LOWER(user_account.username) LIKE $1
        LIMIT $2;
    `

	rows, err := database.DB.Query(ctx, query, prefix+"%", maxResults)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'exécution de la requête : %v", err)
	}
	defer rows.Close()

	// Préparation d'un tableau pour stocker les résultats
	var users []*model.UserProfile
	for rows.Next() {
		var user model.UserProfile

		// Récupération des champs id, username et avatar_url
		if err := rows.Scan(&user.ID, &user.Username, &user.AvatarURL); err != nil {
			return nil, err
		}

		users = append(users, &user)
	}
	fmt.Printf("In schema.resolvers.go, func SearchUsers : fin\n")
	return users, nil
}
