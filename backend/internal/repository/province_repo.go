package repository

import (
	"fmt"

	"pujon-kidul-explore/backend/internal/model"

	"gorm.io/gorm"
)

// ProvinceRepository mendefinisikan kontrak untuk operasi database provinsi dan kota
type ProvinceRepository interface {
	// FindAll mengembalikan semua provinsi
	FindAll() ([]model.Province, error)
	// FindByID mengembalikan satu provinsi berdasarkan ID
	FindByID(id uint) (*model.Province, error)
	// FindCitiesByProvinceID mengembalikan semua kota berdasarkan ID provinsi
	FindCitiesByProvinceID(provinceID uint) ([]model.City, error)
}

// provinceRepository adalah implementasi konkret ProvinceRepository
type provinceRepository struct {
	db *gorm.DB
}

// NewProvinceRepository membuat instance baru provinceRepository
func NewProvinceRepository(db *gorm.DB) ProvinceRepository {
	return &provinceRepository{db: db}
}

// FindAll mengambil semua provinsi dari database
func (r *provinceRepository) FindAll() ([]model.Province, error) {
	var provinces []model.Province
	result := r.db.Order("name ASC").Find(&provinces)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil data provinsi: %w", result.Error)
	}
	return provinces, nil
}

// FindByID mengambil satu provinsi berdasarkan ID
// Mengembalikan error jika provinsi tidak ditemukan
func (r *provinceRepository) FindByID(id uint) (*model.Province, error) {
	var province model.Province
	result := r.db.First(&province, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("provinsi dengan ID %d tidak ditemukan", id)
		}
		return nil, fmt.Errorf("gagal mengambil provinsi ID %d: %w", id, result.Error)
	}
	return &province, nil
}

// FindCitiesByProvinceID mengambil semua kota berdasarkan ID provinsi
// Diurutkan berdasarkan nama kota untuk kemudahan pencarian
func (r *provinceRepository) FindCitiesByProvinceID(provinceID uint) ([]model.City, error) {
	var cities []model.City
	result := r.db.
		Where("province_id = ?", provinceID).
		Order("name ASC").
		Find(&cities)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil kota untuk provinsi ID %d: %w", provinceID, result.Error)
	}
	return cities, nil
}
