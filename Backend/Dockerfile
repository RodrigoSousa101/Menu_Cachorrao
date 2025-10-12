# Etapa 1 - build (compila o binário Go)
FROM golang:1.23 AS builder

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os ficheiros de módulo e instala dependências
COPY go.mod go.sum ./
RUN go mod download

# Copia o código do projeto
COPY . .

# Compila o binário
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go


# Etapa 2 - run (imagem leve só com o binário)
FROM gcr.io/distroless/base-debian12

WORKDIR /app
COPY --from=builder /app/server /app/server

# Expõe a porta da API
EXPOSE 3000

# Executa o binário
USER nonroot:nonroot
ENTRYPOINT ["/app/server"]
