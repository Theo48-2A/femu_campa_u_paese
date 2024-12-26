package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	AppEnv      string `mapstructure:"APP_ENV"`
	SrvProtocol string `mapstructure:"SRV_PROTOCOL"`
	SrvIP       string `mapstructure:"SRV_IP"`
	SrvPort     string `mapstructure:"SRV_PORT"`
	DBUser      string `mapstructure:"DB_USER"`
	DBPassword  string `mapstructure:"DB_PASSWORD"`
	DBIP        string `mapstructure:"DB_IP"`
	DBPort      string `mapstructure:"DB_PORT"`
	DBName      string `mapstructure:"DB_NAME"`
	ServerURL   string
	DatabaseURL string
}

var AppConfig Config

func LoadConfig() {
	// Bind des variables d'environnement
	viper.BindEnv("APP_ENV")
	viper.BindEnv("SRV_PROTOCOL")
	viper.BindEnv("SRV_IP")
	viper.BindEnv("SRV_PORT")
	viper.BindEnv("DB_USER")
	viper.BindEnv("DB_PASSWORD")
	viper.BindEnv("DB_IP")
	viper.BindEnv("DB_PORT")
	viper.BindEnv("DB_NAME")

	// Décoder les variables d'environnement dans la structure Config
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Unable to decode environment variables into struct: %v", err)
	}

	// Construire SERVER_URL et DATABASE_URL
	composeServerURL()
	composeDatabaseURL()

	// Déboguer les variables chargées
	log.Println("Configuration Loaded:")
	log.Printf("  APP_ENV: %s", AppConfig.AppEnv)
	log.Printf("  SRV_PROTOCOL: %s", AppConfig.SrvProtocol)
	log.Printf("  SRV_IP: %s", AppConfig.SrvIP)
	log.Printf("  SRV_PORT: %s", AppConfig.SrvPort)
	log.Printf("  DB_USER: %s", AppConfig.DBUser)
	log.Printf("  DB_PASSWORD: %s", AppConfig.DBPassword)
	log.Printf("  DB_IP: %s", AppConfig.DBIP)
	log.Printf("  DB_PORT: %s", AppConfig.DBPort)
	log.Printf("  DB_NAME: %s", AppConfig.DBName)
	log.Printf("  SERVER_URL: %s", AppConfig.ServerURL)
	log.Printf("  DATABASE_URL: %s", AppConfig.DatabaseURL)

	// Valider les configurations
	validateConfig()
}

// composeServerURL construit SERVER_URL à partir des variables d'environnement
func composeServerURL() {
	if AppConfig.SrvProtocol == "" || AppConfig.SrvIP == "" || AppConfig.SrvPort == "" {
		log.Fatalf("One or more server configuration variables are missing (SRV_PROTOCOL, SRV_IP, SRV_PORT)")
	}

	// Construire SERVER_URL
	AppConfig.ServerURL = fmt.Sprintf("%s://%s:%s", AppConfig.SrvProtocol, AppConfig.SrvIP, AppConfig.SrvPort)
}

// composeDatabaseURL construit DATABASE_URL à partir des variables d'environnement
func composeDatabaseURL() {
	if AppConfig.DBUser == "" || AppConfig.DBPassword == "" || AppConfig.DBIP == "" || AppConfig.DBPort == "" || AppConfig.DBName == "" {
		log.Fatalf("One or more database configuration variables are missing (DB_USER, DB_PASSWORD, DB_IP, DB_PORT, DB_NAME)")
	}

	// Construire DATABASE_URL
	AppConfig.DatabaseURL = fmt.Sprintf("postgres://%s:%s@%s:%s/%s", AppConfig.DBUser, AppConfig.DBPassword, AppConfig.DBIP, AppConfig.DBPort, AppConfig.DBName)
}

// validateConfig vérifie les configurations nécessaires
func validateConfig() {
	if AppConfig.AppEnv != "development" && AppConfig.AppEnv != "production" {
		log.Fatalf("Invalid APP_ENV value: %s. Expected 'development' or 'production'", AppConfig.AppEnv)
	}

	if AppConfig.SrvPort == "" {
		log.Fatalf("SRV_PORT is missing")
	}

	if AppConfig.ServerURL == "" {
		log.Fatalf("SERVER_URL is missing")
	}

	if AppConfig.DatabaseURL == "" {
		log.Fatalf("DATABASE_URL is missing")
	}

	fmt.Println("Configuration loaded and validated successfully")
}
