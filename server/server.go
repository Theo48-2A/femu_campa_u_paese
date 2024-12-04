package main

import (
	"log"
	"net/http"
	"os"
	"server/database"
	"server/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Initialiser la base de données
	dsn := "postgres://theo:yourpassword@db:5432/user_db"
	database.InitDB(dsn)
	defer database.CloseDB() // Ferme la base de données à la fin du programme

	// Configurer le serveur GraphQL
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
