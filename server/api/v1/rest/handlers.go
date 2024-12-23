package rest

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"server/api/v1/database"
	"strings"
)

func UserAvatarHandler(w http.ResponseWriter, r *http.Request) {
	// URL attendue : /api/user/{userID}/profile-picture
	pathStr := strings.TrimPrefix(r.URL.Path, "/api/user/")
	parts := strings.Split(pathStr, "/")

	if len(parts) == 2 && parts[1] == "profile-picture" {
		userID := parts[0]

		if userID == "default" {
			// Avatar par défaut
			imagePath := "./api/v1/uploads/default.jpg"
			if _, err := os.Stat(imagePath); os.IsNotExist(err) {
				http.NotFound(w, r)
				return
			}
			http.ServeFile(w, r, imagePath)
			return
		} else {
			// On cherche un fichier avatar_userID.*
			pattern := fmt.Sprintf("avatar_%s.*", userID)
			matches, err := filepath.Glob(filepath.Join("./api/v1/uploads", pattern))
			if err != nil || len(matches) == 0 {
				http.NotFound(w, r)
				return
			}
			// Servir le premier match
			http.ServeFile(w, r, matches[0])
			return
		}
	}

	http.NotFound(w, r)
}

func UploadAvatarHandler(w http.ResponseWriter, r *http.Request) {
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

	// Déterminer l'extension
	ext := strings.ToLower(path.Ext(handler.Filename))
	if ext == "" {
		http.Error(w, "Impossible de déterminer l'extension du fichier", http.StatusBadRequest)
		return
	}

	// Vérifier le type MIME pour plus de sécurité
	contentType := handler.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		http.Error(w, "Le fichier envoyé n'est pas une image", http.StatusBadRequest)
		return
	}

	// Nettoyer les anciens avatars
	uploadDir := "./api/v1/uploads"
	pattern := fmt.Sprintf("avatar_%s.*", userID)
	oldFiles, err := filepath.Glob(filepath.Join(uploadDir, pattern))
	if err == nil {
		for _, oldFile := range oldFiles {
			os.Remove(oldFile)
		}
	}

	// Créer le fichier final
	os.MkdirAll(uploadDir, os.ModePerm)
	filePath := filepath.Join(uploadDir, fmt.Sprintf("avatar_%s%s", userID, ext))

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

	// Mettre à jour l'URL dans la base de données
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
