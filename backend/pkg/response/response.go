package response

import "github.com/gofiber/fiber/v2"

// SuccessResponse membuat format response sukses yang konsisten
// Parameter data berisi payload yang akan dikirim ke client
func SuccessResponse(data interface{}) fiber.Map {
	return fiber.Map{
		"success": true,
		"data":    data,
		"message": "OK",
	}
}

// SuccessMessageResponse membuat response sukses dengan pesan kustom
func SuccessMessageResponse(data interface{}, message string) fiber.Map {
	return fiber.Map{
		"success": true,
		"data":    data,
		"message": message,
	}
}

// ErrorResponse membuat format response error yang konsisten
// Parameter message berisi pesan error yang aman untuk ditampilkan ke client
// Parameter code berisi kode HTTP status
func ErrorResponse(message string, code int) fiber.Map {
	return fiber.Map{
		"success": false,
		"error":   message,
		"code":    code,
	}
}

// ValidationErrorResponse membuat response error validasi dengan detail per field
// Parameter errors berisi map field -> pesan error
func ValidationErrorResponse(errors map[string]string) fiber.Map {
	return fiber.Map{
		"success": false,
		"error":   "Validasi input gagal",
		"code":    fiber.StatusBadRequest,
		"errors":  errors,
	}
}
