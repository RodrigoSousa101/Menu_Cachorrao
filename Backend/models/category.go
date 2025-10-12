package models

import "time"

type Category struct {
	ID        uint       `gorm:"primaryKey"`
	Name      string     `gorm:"size:120;not null"`
	Items     []MenuItem `gorm:"constraint:OnDelete:CASCADE"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
