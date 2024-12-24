package reset_password

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"server/api/v1/database"
	"server/api/v1/graph/model"
)

func ResetPassword(ctx context.Context, email string) (*model.AuthResponse, error) {
	log.Printf("Attempting to reset password for email: %s", email)

	// Vérifier si l'utilisateur existe dans la base de données
	query := `SELECT id, username FROM user_account WHERE email=$1`
	var userID, username string
	err := database.DB.QueryRow(ctx, query, email).Scan(&userID, &username)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no user found with the email: %s", email)
		}
		return nil, fmt.Errorf("error verifying the email: %v", err)
	}

	// Générer un token sécurisé pour la réinitialisation du mot de passe
	token, err := GeneratePasswordResetToken(userID, email)
	if err != nil {
		return nil, fmt.Errorf("error generating reset token: %v", err)
	}

	// Construire le lien de réinitialisation
	resetLink := fmt.Sprintf("http://example.com/reset-password?token=%s", token)

	// Envoyer l'email
	subject := "Reset Your Password"
	body := fmt.Sprintf(
		"Bonghjornu,\n\nAvemu ricivutu una dumanda per azzerà a vostra chjave d'accessu. S’è vo site statu/a, cliccate nantu à u ligame sottu per azzerà a vostra chjave d'accessu:\n\n%s\n\nS'è vo ùn site micca à l'origine di sta dumanda, ignurite stu mail.\n\nVi ringraziemu,\nA Squadra di Campa U Paese",
		resetLink,
	)

	err = SendEmail(email, subject, body)
	if err != nil {
		return nil, fmt.Errorf("error sending the email: %v", err)
	}

	// Retourner une réponse de succès
	message := fmt.Sprintf("A password reset email has been sent to %s", email)
	return &model.AuthResponse{
		Token: token,
		User: &model.UserAccount{
			ID:       userID,
			Username: username,
			Email:    email,
		},
		Message: &message,
	}, nil
}
