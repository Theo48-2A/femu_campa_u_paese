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

	// Ajouter le middleware CORS
	http.Handle("/", enableCORS(playground.Handler("GraphQL playground", "/query")))
	http.Handle("/query", enableCORS(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// Middleware pour activer les headers CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Remplacez "*" par votre domaine pour plus de sécurité en production
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true") // Si vous utilisez des cookies ou des sessions

		// Répondre immédiatement aux requêtes OPTIONS
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Passer au handler suivant
		next.ServeHTTP(w, r)
	})
}
