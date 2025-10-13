package menu_item

import (
	"net/http"
	"strconv"
	"time"

	"github.com/RodrigoSousa101/Menu_Cachorrao/backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateMenuItem(c *gin.Context) {
	var MenuItem models.MenuItem
	var Category models.Category

	categoryID := c.Param("category_id")
	categoryID64, err := strconv.ParseUint(categoryID, 10, 32)

	category_ID := uint(categoryID64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category id"})
		return
	}
	db := c.MustGet("db").(*gorm.DB)

	if err := db.First(&Category, category_ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := c.ShouldBindJSON(&MenuItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	MenuItem.CategoryID = category_ID
	MenuItem.CreatedAt = time.Now()
	MenuItem.UpdatedAt = time.Now()

	if err := db.Create(&MenuItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create menu item"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Menu item created successfully", "MenuItem": MenuItem})
}
