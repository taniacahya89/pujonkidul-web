package handler

import (
	"strconv"
	"strings"

	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/response"

	"github.com/gofiber/fiber/v2"
)

// DestinationHandler menangani semua HTTP request terkait destinasi wisata
type DestinationHandler struct {
	service service.DestinationService
}

// NewDestinationHandler membuat instance baru DestinationHandler
func NewDestinationHandler(svc service.DestinationService) *DestinationHandler {
	return &DestinationHandler{service: svc}
}

// GetAllDestinations menangani GET /api/v1/destinations
// Mengembalikan semua destinasi beserta detail dan paket wisata
// Menyertakan header Cache-Control untuk caching di sisi client
func (h *DestinationHandler) GetAllDestinations(c *fiber.Ctx) error {
	destinations, err := h.service.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil data destinasi", fiber.StatusInternalServerError),
		)
	}

	// Set header Cache-Control untuk caching 5 menit di browser
	c.Set("Cache-Control", "public, max-age=300")

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(destinations))
}

// GetFeaturedDestinations menangani GET /api/v1/destinations/featured
// Mengembalikan tepat 3 destinasi unggulan (is_featured = true)
// PENTING: Route ini harus didaftarkan SEBELUM /destinations/:id
func (h *DestinationHandler) GetFeaturedDestinations(c *fiber.Ctx) error {
	destinations, err := h.service.GetFeatured()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil destinasi unggulan", fiber.StatusInternalServerError),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(destinations))
}

// GetDestinationByID menangani GET /api/v1/destinations/:id
// Mengembalikan detail satu destinasi berdasarkan ID
// Mengembalikan 404 jika tidak ditemukan, 422 jika koordinat tidak valid
func (h *DestinationHandler) GetDestinationByID(c *fiber.Ctx) error {
	// Parse ID dari URL parameter
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("ID destinasi tidak valid", fiber.StatusBadRequest),
		)
	}

	destination, err := h.service.GetByID(uint(id))
	if err != nil {
		// Tentukan kode HTTP berdasarkan jenis error
		errMsg := err.Error()
		if strings.Contains(errMsg, "tidak ditemukan") {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("Destinasi tidak ditemukan", fiber.StatusNotFound),
			)
		}
		if strings.Contains(errMsg, "koordinat") || strings.Contains(errMsg, "latitude") || strings.Contains(errMsg, "longitude") {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(
				response.ErrorResponse("Koordinat destinasi tidak valid atau kosong", fiber.StatusUnprocessableEntity),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil data destinasi", fiber.StatusInternalServerError),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(destination))
}
