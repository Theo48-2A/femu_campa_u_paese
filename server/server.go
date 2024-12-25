package main

import (
	"log"
	"net/http"
	"os"
	"server/api/v1/database"
	"server/api/v1/graph"
	"server/api/v1/routes"

	"github.com/99designs/gqlgen/graphql/handler"
)

const defaultPort = "8080"

func main() {

	appEnv := os.Getenv("APP_ENV")
	if appEnv != "development" && appEnv != "production" {
		log.Fatalf("Invalid APP_ENV value: %s. Expected 'development' or 'production'", appEnv)
	}
	log.Printf("Current APP_ENV: %s", appEnv)

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
