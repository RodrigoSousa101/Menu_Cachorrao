package models

import (
	"time"

	"github.com/lib/pq"
)

type MenuItem struct {
	ID          uint           `gorm:"primaryKey"`
	Name        string         `gorm:"size:180;not null"`
	Price       float64        `gorm:"not null"`
	Ingredients pq.StringArray `gorm:"type:text[]" json:"ingredients"`
	ImageURL    *string
	CategoryID  uint     `gorm:"not null"`
	Category    Category `gorm:"constraint:OnDelete:RESTRICT" json:"-"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
