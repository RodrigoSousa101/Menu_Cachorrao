package menu_item

import (
	"net/http"
	"time"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UpdateMenuItem(c *gin.Context) {
	var MenuItem models.MenuItem
	id := c.Param("id")
	db := c.MustGet("db").(*gorm.DB)

	if err := db.First(&MenuItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu item not found"})
		return
	}

	if err := c.ShouldBindJSON(&MenuItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	MenuItem.UpdatedAt = time.Now()

	if err := db.Save(&MenuItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update menu item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Menu item updated successfully", "MenuItem": MenuItem})
}
