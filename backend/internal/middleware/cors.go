package middleware

import (
	"pujon-kidul-explore/backend/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// SetupCORS mengkonfigurasi middleware CORS untuk Fiber
// AllowOrigins dibaca dari environment variable ALLOWED_ORIGINS
// sehingga tidak perlu hardcode domain frontend
func SetupCORS(cfg *config.Config) fiber.Handler {
	return cors.New(cors.Config{
		// Origin yang diizinkan dari konfigurasi (bisa multiple, pisah koma)
		AllowOrigins: cfg.AllowedOrigins,
		// Method HTTP yang diizinkan
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		// Header yang diizinkan dari client
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
		// Izinkan credentials (cookie, auth header)
		AllowCredentials: false,
		// Cache preflight request selama 12 jam
		MaxAge: 43200,
	})
}
