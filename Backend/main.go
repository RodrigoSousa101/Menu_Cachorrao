package main

import (
	"log"
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/controllers/category"
	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/controllers/menu_item"
	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/db"
	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
)

func main() {
	database := db.Connect()

	// Cria/atualiza tabelas
	if err := database.AutoMigrate(&models.Category{}, &models.MenuItem{}); err != nil {
		log.Fatal("Erro ao migrar:", err)
	}

	r := gin.Default()

	r.Static("/uploads", "./uploads")

	r.Use(func(c *gin.Context) {
		c.Set("db", database)
		c.Next()
	})

	// CORS simples p/ dev (Vite em 5173)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	category.CategoryRoutes(api)
	menu_item.MenuItemRoutes(api)

	log.Println("API on http://localhost:3000")
	if err := r.Run(":3000"); err != nil {
		log.Fatal(err)
	}
}
