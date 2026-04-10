package model

import "time"

// Province merepresentasikan provinsi di Pulau Jawa
type Province struct {
	ID     uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name   string `json:"name" gorm:"not null;uniqueIndex"`
	Cities []City `json:"cities,omitempty" gorm:"foreignKey:ProvinceID"`
}

// TableName menentukan nama tabel di database
func (Province) TableName() string {
	return "provinces"
}

// City merepresentasikan kota/kabupaten dengan data jarak dan konsumsi BBM ke Pujon Kidul
type City struct {
	ID         uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	ProvinceID uint   `json:"province_id" gorm:"not null"`
	Name       string `json:"name" gorm:"not null"`
	// Jarak dari kota ini ke Pujon Kidul dalam kilometer
	DistanceKm int `json:"distance_km" gorm:"not null"`
	// Konsumsi BBM motor dalam km/liter (rata-rata 40-60 km/liter)
	FuelConsumptionMotor float64 `json:"fuel_consumption_motor" gorm:"not null"`
	// Konsumsi BBM mobil dalam km/liter (rata-rata 10-18 km/liter)
	FuelConsumptionCar float64   `json:"fuel_consumption_car" gorm:"not null"`
	CreatedAt          time.Time `json:"created_at"`
}

// TableName menentukan nama tabel di database
func (City) TableName() string {
	return "cities"
}
