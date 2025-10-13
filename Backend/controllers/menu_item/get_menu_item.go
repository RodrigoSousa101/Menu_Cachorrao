package menu_item

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetMenuItem(c *gin.Context) {
	var MenuItem models.MenuItem
	id := c.Param("id")
	db := c.MustGet("db").(*gorm.DB)

	if err := db.First(&MenuItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu Item not found"})
		return
	}

	c.JSON(http.StatusOK, MenuItem)
}
