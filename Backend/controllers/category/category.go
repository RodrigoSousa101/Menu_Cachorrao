package category

import (
	"github.com/gin-gonic/gin"
)

func CategoryRoutes(rg *gin.RouterGroup) {
	router := rg.Group("/category")
	{
		router.POST("", CreateCategory)
		//router.GET("/:id", GetUser)
		//router.GET("", GetAllUsers)
		//router.PUT("/:id", UpdateUser)
		//router.DELETE("/:id", DeleteUser)
		//router.GET("/current", GetCurrentUser)
	}
}
