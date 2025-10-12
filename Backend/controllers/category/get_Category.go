package category

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetCategory(c *gin.Context) {
	var category models.Category
	id := c.Param("id")
	db := c.MustGet("db").(*gorm.DB)

	if err := db.Preload("Items").First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}
