package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"server/api/v1/database"
	"server/api/v1/graph"
	"server/api/v1/routes"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/joho/godotenv"
)

const defaultPort = "8080"

func main() {

	// Configurer l'environnement
	if err := configureEnvironment(); err != nil {
		log.Fatalf("Failed to configure environment: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Init DB
	dsn := os.Getenv("DATABASE_URL") // Utilise la variable d'environnement DATABASE_URL
	database.InitDB(dsn)
	defer database.CloseDB()

	// Init GraphQL server
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// Créer un ServeMux
	mux := http.NewServeMux()

	// Appel SetupRoutes dans le package rest
	routes.SetupRoutes(mux, srv)

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, mux))
}

// configureEnvironment gère le chargement des variables d'environnement en fonction du mode
func configureEnvironment() error {
	// Détection de l'environnement
	appEnv := os.Getenv("APP_ENV")

	if appEnv == "production" {
		log.Println("Running in production environment")
	} else if appEnv == "" {
		log.Println("APP_ENV not foumonculnd, assuming development environment")

		// Charger le fichier .env pour définir les variables d'environnement
		err := godotenv.Load(".env")
		if err != nil {
			log.Printf("Error loading .env file: %v", err)
			return errors.New("error loading .env file")
		}

		// Vérifier que APP_ENV est défini comme "development"
		appEnv = os.Getenv("APP_ENV")
		if appEnv != "development" {
			return errors.New("unexpected APP_ENV value, expected 'development'")
		}

		log.Println("Running in development environment")
	} else {
		return errors.New("unexpected APP_ENV value, expected 'production' or 'development'")
	}

	return nil
}
