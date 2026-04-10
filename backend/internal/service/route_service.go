package service

import (
	"pujon-kidul-explore/backend/internal/model"
	"pujon-kidul-explore/backend/internal/repository"
)

// RouteService mendefinisikan kontrak business logic untuk rute akses jalan
type RouteService interface {
	// GetAll mengembalikan semua rute akses jalan
	GetAll() ([]model.Route, error)
}

// routeService adalah implementasi konkret RouteService
type routeService struct {
	repo repository.RouteRepository
}

// NewRouteService membuat instance baru routeService
func NewRouteService(repo repository.RouteRepository) RouteService {
	return &routeService{repo: repo}
}

// GetAll mengambil semua rute akses jalan dari repository
func (s *routeService) GetAll() ([]model.Route, error) {
	return s.repo.FindAll()
}
