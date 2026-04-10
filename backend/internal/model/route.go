package model

import "time"

// Route merepresentasikan rute akses jalan menuju kawasan Pujon Kidul
type Route struct {
	ID          uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description" gorm:"not null"`
	// Status kondisi jalan: "baik", "sedang", atau "rusak"
	Status      string    `json:"status" gorm:"default:'baik'"`
	LastUpdated time.Time `json:"last_updated"`
}

// TableName menentukan nama tabel di database
func (Route) TableName() string {
	return "routes"
}
