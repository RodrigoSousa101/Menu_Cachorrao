package menu_item

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DeleteMenuItem(c *gin.Context) {
	var MenuItem models.MenuItem
	id := c.Param("id")
	db := c.MustGet("db").(*gorm.DB)

	if err := db.First(&MenuItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu item not found"})
		return
	}

	if err := db.Delete(&MenuItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Menu Item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Menu Item deleted successfully"})
}
