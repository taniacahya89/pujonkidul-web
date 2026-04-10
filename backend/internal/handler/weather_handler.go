package handler

import (
	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/response"

	"github.com/gofiber/fiber/v2"
)

// WeatherHandler menangani HTTP request untuk data cuaca
type WeatherHandler struct {
	service service.WeatherService
}

// NewWeatherHandler membuat instance baru WeatherHandler
func NewWeatherHandler(svc service.WeatherService) *WeatherHandler {
	return &WeatherHandler{service: svc}
}

// GetWeather menangani GET /api/v1/weather
// Bertindak sebagai proxy ke OpenWeatherMap API
// API key OWM tidak pernah dikirim ke frontend — hanya digunakan di service layer
func (h *WeatherHandler) GetWeather(c *fiber.Ctx) error {
	weatherData, err := h.service.GetWeather()
	if err != nil {
		// Kembalikan 503 Service Unavailable jika OWM tidak tersedia
		return c.Status(fiber.StatusServiceUnavailable).JSON(
			response.ErrorResponse("Data cuaca tidak tersedia saat ini", fiber.StatusServiceUnavailable),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(weatherData))
}
