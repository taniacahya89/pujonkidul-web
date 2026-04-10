package repository

import (
	"fmt"

	"pujon-kidul-explore/backend/internal/model"

	"gorm.io/gorm"
)

// DestinationRepository mendefinisikan kontrak untuk operasi database destinasi
type DestinationRepository interface {
	// FindAll mengembalikan semua destinasi beserta detail dan paket wisata
	FindAll() ([]model.Destination, error)
	// FindByID mengembalikan satu destinasi berdasarkan ID
	FindByID(id uint) (*model.Destination, error)
	// FindFeatured mengembalikan 3 destinasi unggulan (is_featured = true)
	FindFeatured() ([]model.Destination, error)
	// FindByIDs mengembalikan beberapa destinasi berdasarkan slice ID
	FindByIDs(ids []uint) ([]model.Destination, error)
}

// destinationRepository adalah implementasi konkret DestinationRepository
type destinationRepository struct {
	db *gorm.DB
}

// NewDestinationRepository membuat instance baru destinationRepository
func NewDestinationRepository(db *gorm.DB) DestinationRepository {
	return &destinationRepository{db: db}
}

// FindAll mengambil semua destinasi dari database beserta relasi Detail dan Packages
// Menggunakan GORM Preload untuk eager loading relasi
func (r *destinationRepository) FindAll() ([]model.Destination, error) {
	var destinations []model.Destination
	result := r.db.
		Preload("Detail").
		Preload("Packages").
		Order("id ASC").
		Find(&destinations)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil semua destinasi: %w", result.Error)
	}
	return destinations, nil
}

// FindByID mengambil satu destinasi berdasarkan ID beserta relasi lengkap
// Mengembalikan error jika destinasi tidak ditemukan
func (r *destinationRepository) FindByID(id uint) (*model.Destination, error) {
	var destination model.Destination
	result := r.db.
		Preload("Detail").
		Preload("Packages").
		First(&destination, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("destinasi dengan ID %d tidak ditemukan", id)
		}
		return nil, fmt.Errorf("gagal mengambil destinasi ID %d: %w", id, result.Error)
	}
	return &destination, nil
}

// FindFeatured mengambil destinasi unggulan (is_featured = true) maksimal 3
func (r *destinationRepository) FindFeatured() ([]model.Destination, error) {
	var destinations []model.Destination
	result := r.db.
		Preload("Detail").
		Preload("Packages").
		Where("is_featured = ?", true).
		Limit(3).
		Order("id ASC").
		Find(&destinations)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil destinasi unggulan: %w", result.Error)
	}
	return destinations, nil
}

// FindByIDs mengambil beberapa destinasi berdasarkan slice ID
// Digunakan untuk kalkulasi budget (mengambil harga tiket destinasi yang dipilih)
func (r *destinationRepository) FindByIDs(ids []uint) ([]model.Destination, error) {
	var destinations []model.Destination
	result := r.db.
		Where("id IN ?", ids).
		Find(&destinations)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil destinasi berdasarkan IDs: %w", result.Error)
	}
	return destinations, nil
}
