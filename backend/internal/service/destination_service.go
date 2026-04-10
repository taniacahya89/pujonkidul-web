package service

import (
	"fmt"

	"pujon-kidul-explore/backend/internal/model"
	"pujon-kidul-explore/backend/internal/repository"
)

// DestinationService mendefinisikan kontrak business logic untuk destinasi
type DestinationService interface {
	// GetAll mengembalikan semua destinasi
	GetAll() ([]model.Destination, error)
	// GetByID mengembalikan satu destinasi berdasarkan ID
	GetByID(id uint) (*model.Destination, error)
	// GetFeatured mengembalikan 3 destinasi unggulan
	GetFeatured() ([]model.Destination, error)
}

// destinationService adalah implementasi konkret DestinationService
type destinationService struct {
	repo repository.DestinationRepository
}

// NewDestinationService membuat instance baru destinationService
func NewDestinationService(repo repository.DestinationRepository) DestinationService {
	return &destinationService{repo: repo}
}

// GetAll mengambil semua destinasi dan memvalidasi koordinat setiap destinasi
func (s *destinationService) GetAll() ([]model.Destination, error) {
	destinations, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return destinations, nil
}

// GetByID mengambil satu destinasi berdasarkan ID
// Memvalidasi koordinat destinasi sebelum mengembalikan data
func (s *destinationService) GetByID(id uint) (*model.Destination, error) {
	destination, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Validasi koordinat destinasi
	if err := validateCoordinates(destination.Latitude, destination.Longitude); err != nil {
		return nil, err
	}

	return destination, nil
}

// GetFeatured mengambil 3 destinasi unggulan
func (s *destinationService) GetFeatured() ([]model.Destination, error) {
	destinations, err := s.repo.FindFeatured()
	if err != nil {
		return nil, err
	}
	return destinations, nil
}

// validateCoordinates memvalidasi bahwa koordinat latitude dan longitude valid
// Latitude harus dalam rentang [-90, 90] dan longitude dalam [-180, 180]
func validateCoordinates(lat, lon float64) error {
	if lat == 0 && lon == 0 {
		return fmt.Errorf("koordinat destinasi tidak valid atau kosong")
	}
	if lat < -90 || lat > 90 {
		return fmt.Errorf("latitude tidak valid: harus antara -90 dan 90, diterima %.6f", lat)
	}
	if lon < -180 || lon > 180 {
		return fmt.Errorf("longitude tidak valid: harus antara -180 dan 180, diterima %.6f", lon)
	}
	return nil
}
