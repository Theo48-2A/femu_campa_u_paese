FROM postgres:17

# Copie du fichier de script d'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Expose le port PostgreSQL par défaut
EXPOSE 5432

