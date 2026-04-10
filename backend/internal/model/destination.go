package model

import (
	"encoding/json"
	"time"
)

// Destination merepresentasikan destinasi wisata di kawasan Pujon Kidul
type Destination struct {
	ID               uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name             string    `json:"name" gorm:"not null"`
	ShortDescription string    `json:"short_description" gorm:"not null"`
	FullDescription  string    `json:"full_description" gorm:"not null"`
	OpeningHours     string    `json:"opening_hours" gorm:"not null"`
	TicketPrice      int       `json:"ticket_price" gorm:"default:0"`
	Latitude         float64   `json:"latitude" gorm:"not null"`
	Longitude        float64   `json:"longitude" gorm:"not null"`
	BestTime         string    `json:"best_time"`
	ParkingAvailable bool      `json:"parking_available" gorm:"default:true"`
	VehicleAccess    string    `json:"vehicle_access"`
	IsFeatured       bool      `json:"is_featured" gorm:"default:false"`
	Rating           float64   `json:"rating" gorm:"default:4.5"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	// Relasi ke tabel lain (dimuat via GORM Preload)
	Detail   *DestinationDetail `json:"detail,omitempty" gorm:"foreignKey:DestinationID"`
	Packages []TravelPackage    `json:"packages,omitempty" gorm:"foreignKey:DestinationID"`
}

// TableName menentukan nama tabel di database
func (Destination) TableName() string {
	return "destinations"
}

// DestinationDetail menyimpan data tambahan destinasi (visitor data, gambar)
type DestinationDetail struct {
	ID            uint            `json:"id" gorm:"primaryKey;autoIncrement"`
	DestinationID uint            `json:"destination_id" gorm:"not null;uniqueIndex"`
	VisitorData   json.RawMessage `json:"visitor_data" gorm:"type:jsonb;default:'[]'"`
	// Ganti gambar di sini — ubah image_url dengan URL gambar asli destinasi
	ImageURL  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName menentukan nama tabel di database
func (DestinationDetail) TableName() string {
	return "destination_details"
}

// VisitorDataPoint merepresentasikan satu titik data kunjungan bulanan
type VisitorDataPoint struct {
	Month string `json:"month"`
	Count int    `json:"count"`
}
