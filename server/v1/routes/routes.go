package routes

import (
	"net/http"
	"server/v1/rest"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func SetupRoutes(mux *http.ServeMux, gqlHandler *handler.Server) {
	// Routes GraphQL
	mux.Handle("/", EnableCORS(playground.Handler("GraphQL playground", "/query")))
	mux.Handle("/graphql", EnableCORS(gqlHandler))

	// Routes REST
	mux.Handle("/api/user/", EnableCORS(http.HandlerFunc(rest.UserAvatarHandler)))
	mux.Handle("/api/upload-avatar", EnableCORS(http.HandlerFunc(rest.UploadAvatarHandler)))
}

// Juste pour l’exemple, tu peux le séparer en un fichier middleware.go
func EnableCORS(next http.Handler) http.Handler {
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
