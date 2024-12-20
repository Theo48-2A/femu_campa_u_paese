package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
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

	// Endpoint REST pour mettre à jour l'avatar
	http.Handle("/api/upload-avatar", enableCORS(http.HandlerFunc(uploadAvatarHandler)))

	printCurrentDirectory()

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
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

func uploadAvatarHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	// Limiter la taille de la requête
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20) // 10 MB

	// Parse la requête multipart/form-data
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Requête invalide", http.StatusBadRequest)
		return
	}

	// Récupérer le fichier
	file, handler, err := r.FormFile("avatar")
	if err != nil {
		http.Error(w, "Erreur lors de la récupération du fichier", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Récupérer l'ID utilisateur
	userID := r.FormValue("userID")
	if userID == "" {
		http.Error(w, "L'ID utilisateur est requis", http.StatusBadRequest)
		return
	}

	// Déterminer le chemin de sauvegarde
	uploadDir := "./uploads"
	os.MkdirAll(uploadDir, os.ModePerm)
	filePath := filepath.Join(uploadDir, fmt.Sprintf("avatar_%s%s", userID, filepath.Ext(handler.Filename)))

	// Sauvegarder le fichier sur le serveur
	dest, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Erreur lors de la sauvegarde du fichier", http.StatusInternalServerError)
		return
	}
	defer dest.Close()

	_, err = io.Copy(dest, file)
	if err != nil {
		http.Error(w, "Erreur lors de l'enregistrement du fichier", http.StatusInternalServerError)
		return
	}

	// Mettre à jour l'URL de l'avatar dans la base de données
	avatarURL := fmt.Sprintf("/api/user/%s/profile-picture", userID)
	query := `UPDATE user_profile SET avatar_url = $1 WHERE user_account_id = $2`
	_, err = database.DB.Exec(r.Context(), query, avatarURL, userID)
	if err != nil {
		http.Error(w, "Erreur lors de la mise à jour de la base de données", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Avatar mis à jour avec succès : %s", avatarURL)
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
