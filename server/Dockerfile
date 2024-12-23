FROM golang:1.23.3 AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . . 
RUN go build -o server .

FROM ubuntu:22.04
WORKDIR /app
COPY --from=build /app/server .
COPY --from=build /app/api/v1/uploads ./v1/uploads
EXPOSE 8080
CMD ["./server"]

