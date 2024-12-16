package search_users

import (
	"context"
	"fmt"
	"server/database"
	"server/graph/model"
)

func SearchUser(ctx context.Context, prefix string, limit *int) ([]*model.UserAccount, error) {
	fmt.Printf("In schema.resolvers.go, func SearchUsers : debut\n")
	maxResults := 10
	if limit != nil {
		maxResults = *limit
	}

	// Requête SQL ne récupérant que id et username
	query := `
        SELECT id, username
        FROM user_account
        WHERE LOWER(username) LIKE $1
        LIMIT $2;
    `

	rows, err := database.DB.Query(ctx, query, prefix+"%", maxResults)
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'exécution de la requête : %v", err)
	}
	defer rows.Close()

	// Préparation d'un tableau pour stocker les résultats
	var users []*model.UserAccount
	for rows.Next() {
		var user model.UserAccount

		// Récupération des champs id et username uniquement
		if err := rows.Scan(&user.ID, &user.Username); err != nil {
			return nil, err
		}

		users = append(users, &user)
	}
	fmt.Printf("In schema.resolvers.go, func SearchUsers : fin\n")
	return users, nil
}
