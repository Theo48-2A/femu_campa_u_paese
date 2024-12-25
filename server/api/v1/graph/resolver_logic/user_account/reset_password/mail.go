package reset_password

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// SendEmail envoie un email via SendGrid
func SendEmail(to string, subject string, body string) error {

	// Récupérer la clé API depuis les variables d'environnement
	apiKey := os.Getenv("SENDGRID_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("SENDGRID_API_KEY is not set in the environment")
	}

	// Configuration de l'expéditeur
	from := mail.NewEmail("Femu Campa U Paese", "fcampaup@outlook.com")  // Adresse d'expéditeur
	recipient := mail.NewEmail("", to)                                   // Destinataire
	message := mail.NewSingleEmail(from, subject, recipient, body, body) // Corps de l'email

	// Client SendGrid
	client := sendgrid.NewSendClient(apiKey)

	// Envoi de l'email
	response, err := client.Send(message)
	if err != nil {
		log.Printf("Error sending email to %s: %v", to, err)
		return err
	}

	// Vérification de la réponse
	if response.StatusCode >= 200 && response.StatusCode < 300 {
		log.Printf("Email successfully sent to %s", to)
		return nil
	}

	log.Printf("Failed to send email. Status: %d, Response: %s", response.StatusCode, response.Body)
	return fmt.Errorf("failed to send email: %s", response.Body)
}
