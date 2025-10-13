package menu_item

import (
	"net/http"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllMenuItens(c *gin.Context) {
	var MenuItem []models.MenuItem
	db := c.MustGet("db").(*gorm.DB)

	if err := db.Find(&MenuItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "MenuItens not found"})
		return
	}

	c.JSON(http.StatusOK, MenuItem)
}
