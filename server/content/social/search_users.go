package search_users

import (
	"context"
	"fmt"
	"server/database"
	"server/graph/model"
)

func SearchUser(ctx context.Context, prefix string, limit *int) ([]*model.User, error) {
	maxResults := 10
	if limit != nil {
		maxResults = *limit
	}

	query := `
        SELECT id, username, email, phone_number, created_at
        FROM users
        WHERE LOWER(username) LIKE $1
        LIMIT $2;
    `

	rows, err := database.DB.Query(ctx, query, prefix+"%", maxResults)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'exécution de la requête : %v", err)
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		var user model.User
		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.PhoneNumber, &user.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	return users, nil
}
