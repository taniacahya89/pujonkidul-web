package repository

import (
	"fmt"

	"pujon-kidul-explore/backend/internal/model"

	"gorm.io/gorm"
)

// RouteRepository mendefinisikan kontrak untuk operasi database rute akses jalan
type RouteRepository interface {
	// FindAll mengembalikan semua rute akses jalan
	FindAll() ([]model.Route, error)
}

// routeRepository adalah implementasi konkret RouteRepository
type routeRepository struct {
	db *gorm.DB
}

// NewRouteRepository membuat instance baru routeRepository
func NewRouteRepository(db *gorm.DB) RouteRepository {
	return &routeRepository{db: db}
}

// FindAll mengambil semua rute akses jalan dari database
// Diurutkan berdasarkan ID untuk konsistensi tampilan
func (r *routeRepository) FindAll() ([]model.Route, error) {
	var routes []model.Route
	result := r.db.Order("id ASC").Find(&routes)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil data rute: %w", result.Error)
	}
	return routes, nil
}
