FROM golang:1.23.3 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server .

FROM ubuntu:22.04

WORKDIR /app

COPY --from=build /app/server .

EXPOSE 8080

CMD ["./server"]

