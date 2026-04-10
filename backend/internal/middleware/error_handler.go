package middleware

import (
	"errors"
	"log"

	"pujon-kidul-explore/backend/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

// GlobalErrorHandler menangkap semua error yang tidak tertangani di handler
// Mencatat error ke log dan mengembalikan response HTTP yang aman
// tanpa mengekspos detail internal ke client
func GlobalErrorHandler(c *fiber.Ctx, err error) error {
	// Kode HTTP default adalah 500 Internal Server Error
	code := fiber.StatusInternalServerError
	message := "Terjadi kesalahan internal server"

	// Tangani Fiber error yang sudah memiliki kode HTTP spesifik
	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
		message = e.Message
	}

	// Log error lengkap untuk debugging di server (tidak dikirim ke client)
	log.Printf("[ERROR] %s %s - Status %d: %v", c.Method(), c.Path(), code, err)

	// Kembalikan response error yang aman (tanpa stack trace atau detail internal)
	return c.Status(code).JSON(response.ErrorResponse(message, code))
}

// SetupRecovery mengkonfigurasi middleware recovery untuk menangkap panic
// Panic diubah menjadi error 500 tanpa mengekspos stack trace ke client
func SetupRecovery() fiber.Handler {
	return recover.New(recover.Config{
		// Jangan ekspos stack trace ke client untuk keamanan
		EnableStackTrace: false,
	})
}
