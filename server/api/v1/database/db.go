package database

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

// InitDB initialise la connexion à la base de données
func InitDB(dsn string) {
	var err error
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Utilisation de pgxpool.New pour établir la connexion
	DB, err = pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("Impossible de se connecter à la base de données : %v", err)
	}
	log.Println("Connexion à la base de données établie")
}

// CloseDB ferme la connexion à la base de données
func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Connexion à la base de données fermée")
	}
}
