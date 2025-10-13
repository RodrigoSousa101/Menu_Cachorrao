package menu_item

import (
	"github.com/gin-gonic/gin"
)

func MenuItemRoutes(rg *gin.RouterGroup) {
	router := rg.Group("/menuitem")
	{
		router.POST("/:category_id", CreateMenuItem)
		router.GET("/:id", GetMenuItem)
		router.GET("", GetAllMenuItens)
		router.PUT("/:id", UpdateMenuItem)
		router.DELETE("/:id", DeleteMenuItem)
	}
}
