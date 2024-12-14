package search_users

import (
	"context"
	"fmt"
	"server/database"
	"server/graph/model"
	"time"
)

func SearchUser(ctx context.Context, prefix string, limit *int) ([]*model.UserAccount, error) {
	fmt.Printf("In schema.resolvers.go, func SearchUsers : debut\n")
	maxResults := 10
	if limit != nil {
		maxResults = *limit
	}

	query := `
        SELECT id, username, email, phone_number, created_at
        FROM user_account
        WHERE LOWER(username) LIKE $1
        LIMIT $2;
    `

	rows, err := database.DB.Query(ctx, query, prefix+"%", maxResults)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'exécution de la requête : %v", err)
	}
	defer rows.Close()

	var users []*model.UserAccount
	for rows.Next() {
		var user model.UserAccount
		var dbCreatedAt time.Time // Utiliser une variable temporaire pour le timestamp

		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.PhoneNumber, &dbCreatedAt); err != nil {
			return nil, err
		}

		// Convertir le timestamp en string (ISO 8601 format)
		user.CreatedAt = dbCreatedAt.Format(time.RFC3339)

		users = append(users, &user)
	}
	fmt.Printf("In schema.resolvers.go, func SearchUsers : fin\n")
	return users, nil
}
