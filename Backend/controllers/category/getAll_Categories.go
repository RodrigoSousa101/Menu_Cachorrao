package category

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllCategories(c *gin.Context) {
	var Categories []models.Category
	db := c.MustGet("db").(*gorm.DB)

	if err := db.Preload("Items").Find(&Categories).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categories not found"})
		return
	}

	c.JSON(http.StatusOK, Categories)
}
