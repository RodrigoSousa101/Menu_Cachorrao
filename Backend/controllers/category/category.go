package category

import (
	"github.com/gin-gonic/gin"
)

func CategoryRoutes(rg *gin.RouterGroup) {
	router := rg.Group("/category")
	{
		router.POST("", CreateCategory)
		router.GET("/:id", GetCategory)
		router.GET("", GetAllCategories)
		router.PUT("/:id", UpdateCategory)
		router.DELETE("/:id", DeleteCategory)
	}
}
