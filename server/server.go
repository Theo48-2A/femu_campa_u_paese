package main

import (
	"log"
	"net/http"
	"server/api/v1/config"
	"server/api/v1/database"
	"server/api/v1/graph"
	"server/api/v1/routes"

	"github.com/99designs/gqlgen/graphql/handler"
)

func main() {
	// Charger et valider la configuration
	config.LoadConfig()

	// Initialiser la base de données
	database.InitDB(config.AppConfig.DatabaseURL)
	defer database.CloseDB()

	// Initialiser le serveur GraphQL
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// Créer un ServeMux
	mux := http.NewServeMux()
	routes.SetupRoutes(mux, srv)

	// Lancer le serveur HTTP
	log.Printf("Connect to %s/api/playground for GraphQL playground", config.AppConfig.ServerURL)
	log.Fatal(http.ListenAndServe(config.AppConfig.SrvListenAddr+":"+config.AppConfig.SrvPort, mux))

}
