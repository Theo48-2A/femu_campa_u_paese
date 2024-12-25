FROM golang:1.23.3 AS build

# Étape de compilation
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . . 
RUN go build -o server .

FROM ubuntu:22.04

# Installer les certificats racines
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/server .
COPY --from=build /app/api/v1/uploads ./v1/uploads
COPY .env /app/.env
EXPOSE 8080
CMD ["./server"]


