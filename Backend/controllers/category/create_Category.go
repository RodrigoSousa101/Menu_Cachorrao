package category

import (
	"net/http"
	"time"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateCategory(c *gin.Context) {
	var Category models.Category
	if err := c.ShouldBindJSON(&Category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	Category.CreatedAt = time.Now()
	Category.UpdatedAt = time.Now()

	db := c.MustGet("db").(*gorm.DB)

	if err := db.Create(&Category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Category created successfully", "Category": Category})
}
