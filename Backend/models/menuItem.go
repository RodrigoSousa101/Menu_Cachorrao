package models

import "time"

type MenuItem struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"size:180;not null"`
	Description *string `gorm:"type:text"`
	PriceCents  int     `gorm:"not null"`
	ImageURL    *string
	IsAvailable bool     `gorm:"default:true"`
	CategoryID  uint     `gorm:"not null"`
	Category    Category `gorm:"constraint:OnDelete:RESTRICT"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
