package main

import (
	"log"
	"net/http"
	"os"
	"server/v1/database"
	"server/v1/graph"
	"server/v1/routes"

	"github.com/99designs/gqlgen/graphql/handler"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Init DB
	dsn := "postgres://theo:yourpassword@db:5432/user_db"
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
