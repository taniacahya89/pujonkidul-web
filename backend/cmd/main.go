package main

import (
	"log"

	"pujon-kidul-explore/backend/config"
	"pujon-kidul-explore/backend/internal/handler"
	"pujon-kidul-explore/backend/internal/middleware"
	"pujon-kidul-explore/backend/internal/repository"
	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Muat konfigurasi dari environment variable / .env
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("[FATAL] Gagal memuat konfigurasi: %v", err)
	}

	// Buka koneksi ke database PostgreSQL
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("[FATAL] Gagal koneksi ke database: %v", err)
	}

	// Inisialisasi repository layer
	destRepo := repository.NewDestinationRepository(db)
	routeRepo := repository.NewRouteRepository(db)
	provinceRepo := repository.NewProvinceRepository(db)
	budgetRepo := repository.NewBudgetRepository(db)

	// Inisialisasi service layer
	destService := service.NewDestinationService(destRepo)
	weatherService := service.NewWeatherService(cfg)
	routeService := service.NewRouteService(routeRepo)
	provinceService := service.NewProvinceService(provinceRepo)
	budgetService := service.NewBudgetService(budgetRepo, cfg)

	// Inisialisasi handler layer
	destHandler := handler.NewDestinationHandler(destService)
	weatherHandler := handler.NewWeatherHandler(weatherService)
	routeHandler := handler.NewRouteHandler(routeService)
	provinceHandler := handler.NewProvinceHandler(provinceService)
	budgetHandler := handler.NewBudgetHandler(budgetService)

	// Buat aplikasi Fiber dengan konfigurasi error handler global
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.GlobalErrorHandler,
	})

	// Daftarkan middleware global
	app.Use(middleware.SetupRecovery())
	app.Use(middleware.SetupCORS(cfg))
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} (${latency})\n",
	}))

	// Daftarkan semua route di bawah prefix /api/v1
	api := app.Group("/api/v1")

	// Route destinasi
	// PENTING: /destinations/featured harus didaftarkan SEBELUM /destinations/:id
	// untuk menghindari konflik routing di Fiber
	api.Get("/destinations/featured", destHandler.GetFeaturedDestinations)
	api.Get("/destinations/:id", destHandler.GetDestinationByID)
	api.Get("/destinations", destHandler.GetAllDestinations)

	// Route cuaca (proxy ke OpenWeatherMap)
	api.Get("/weather", weatherHandler.GetWeather)

	// Route akses jalan
	api.Get("/routes", routeHandler.GetAllRoutes)

	// Route provinsi dan kota
	api.Get("/provinces", provinceHandler.GetAllProvinces)
	api.Get("/provinces/:id/cities", provinceHandler.GetCitiesByProvince)

	// Route kalkulasi budget
	api.Post("/budget/calculate", budgetHandler.CalculateBudget)

	// Jalankan server di port dari konfigurasi
	log.Printf("[SERVER] Pujon Kidul Explore API berjalan di port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("[FATAL] Gagal menjalankan server: %v", err)
	}
}
