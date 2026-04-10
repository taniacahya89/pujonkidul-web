package service

import (
	"pujon-kidul-explore/backend/internal/model"
	"pujon-kidul-explore/backend/internal/repository"
)

// ProvinceService mendefinisikan kontrak business logic untuk provinsi dan kota
type ProvinceService interface {
	// GetAll mengembalikan semua provinsi
	GetAll() ([]model.Province, error)
	// GetCitiesByProvinceID mengembalikan semua kota berdasarkan ID provinsi
	GetCitiesByProvinceID(id uint) ([]model.City, error)
}

// provinceService adalah implementasi konkret ProvinceService
type provinceService struct {
	repo repository.ProvinceRepository
}

// NewProvinceService membuat instance baru provinceService
func NewProvinceService(repo repository.ProvinceRepository) ProvinceService {
	return &provinceService{repo: repo}
}

// GetAll mengambil semua provinsi dari repository
func (s *provinceService) GetAll() ([]model.Province, error) {
	return s.repo.FindAll()
}

// GetCitiesByProvinceID mengambil semua kota berdasarkan ID provinsi
// Memvalidasi bahwa provinsi dengan ID tersebut ada sebelum mengambil kota
func (s *provinceService) GetCitiesByProvinceID(id uint) ([]model.City, error) {
	// Validasi provinsi ada
	_, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Ambil kota berdasarkan provinsi
	return s.repo.FindCitiesByProvinceID(id)
}
