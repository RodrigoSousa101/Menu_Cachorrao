package category

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeleteCategory(c *gin.Context) {
	var Category models.Category
	id := c.Param("id")
	db := c.MustGet("db").(*gorm.DB)

	if err := db.First(&Category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := db.Delete(&Category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
