package repository

import (
	"fmt"

	"pujon-kidul-explore/backend/internal/model"

	"gorm.io/gorm"
)

// BudgetRepository mendefinisikan kontrak untuk operasi database yang dibutuhkan kalkulasi budget
type BudgetRepository interface {
	// FindCityByID mengembalikan data kota berdasarkan ID (untuk jarak dan konsumsi BBM)
	FindCityByID(id uint) (*model.City, error)
	// FindDestinationsByIDs mengembalikan destinasi berdasarkan slice ID (untuk harga tiket)
	FindDestinationsByIDs(ids []uint) ([]model.Destination, error)
}

// budgetRepository adalah implementasi konkret BudgetRepository
type budgetRepository struct {
	db *gorm.DB
}

// NewBudgetRepository membuat instance baru budgetRepository
func NewBudgetRepository(db *gorm.DB) BudgetRepository {
	return &budgetRepository{db: db}
}

// FindCityByID mengambil data kota berdasarkan ID
// Data kota berisi jarak ke Pujon Kidul dan konsumsi BBM untuk kalkulasi transport
func (r *budgetRepository) FindCityByID(id uint) (*model.City, error) {
	var city model.City
	result := r.db.First(&city, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("kota dengan ID %d tidak ditemukan", id)
		}
		return nil, fmt.Errorf("gagal mengambil data kota ID %d: %w", id, result.Error)
	}
	return &city, nil
}

// FindDestinationsByIDs mengambil destinasi berdasarkan slice ID
// Hanya mengambil kolom yang dibutuhkan untuk kalkulasi (id, name, ticket_price)
func (r *budgetRepository) FindDestinationsByIDs(ids []uint) ([]model.Destination, error) {
	var destinations []model.Destination
	result := r.db.
		Select("id, name, ticket_price, best_time").
		Where("id IN ?", ids).
		Find(&destinations)
	if result.Error != nil {
		return nil, fmt.Errorf("gagal mengambil destinasi untuk kalkulasi budget: %w", result.Error)
	}
	return destinations, nil
}
