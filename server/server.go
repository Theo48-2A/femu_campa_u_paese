package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"server/database"
	"server/graph"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	dsn := "postgres://theo:yourpassword@db:5432/user_db"
	database.InitDB(dsn)
	defer database.CloseDB()

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", enableCORS(playground.Handler("GraphQL playground", "/query")))
	http.Handle("/query", enableCORS(srv))

	// Endpoint REST pour servir l'avatar
	http.Handle("/api/user/", enableCORS(http.HandlerFunc(userAvatarHandler)))

	printCurrentDirectory()

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
	//log.Printf("Try an image: http://localhost:%s/api/user/12345/profile-picture", port)

	// Ecoute sur 0.0.0.0 pour docker
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}

func userAvatarHandler(w http.ResponseWriter, r *http.Request) {
	// URL attendue : /api/user/{userID}/profile-picture
	path := strings.TrimPrefix(r.URL.Path, "/api/user/")
	parts := strings.Split(path, "/")

	if len(parts) == 2 && parts[1] == "profile-picture" {
		userID := parts[0]

		var imageName string
		if userID == "default" {
			// Avatar par défaut si l'utilisateur n'en a pas
			imageName = "default.jpg"
		} else {
			imageName = "avatar_" + userID + ".jpg"
		}

		imagePath := "./uploads/" + imageName

		if _, err := os.Stat(imagePath); os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}

		http.ServeFile(w, r, imagePath)
		return
	}

	http.NotFound(w, r)
}

func printCurrentDirectory() {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Erreur pour récupérer le répertoire courant : %v", err)
	}

	fmt.Printf("Répertoire courant : %s\n", dir)

	files, err := ioutil.ReadDir("./uploads")
	if err != nil {
		log.Printf("Erreur pour lire le répertoire uploads : %v", err)
		return
	}

	fmt.Println("Fichiers dans le répertoire uploads :")
	for _, file := range files {
		fmt.Println(file.Name())
	}
}

// Middleware CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
