package model

import "time"

// TravelPackage merepresentasikan paket wisata yang tersedia untuk satu destinasi
type TravelPackage struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DestinationID uint      `json:"destination_id" gorm:"not null"`
	Name          string    `json:"name" gorm:"not null"`
	Description   string    `json:"description"`
	Price         int       `json:"price" gorm:"not null"`
	Duration      string    `json:"duration"`
	Includes      string    `json:"includes"`
	CreatedAt     time.Time `json:"created_at"`
}

// TableName menentukan nama tabel di database
func (TravelPackage) TableName() string {
	return "travel_packages"
}
