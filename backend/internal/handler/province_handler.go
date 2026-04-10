package handler

import (
	"strconv"
	"strings"

	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/response"

	"github.com/gofiber/fiber/v2"
)

// ProvinceHandler menangani HTTP request untuk data provinsi dan kota
type ProvinceHandler struct {
	service service.ProvinceService
}

// NewProvinceHandler membuat instance baru ProvinceHandler
func NewProvinceHandler(svc service.ProvinceService) *ProvinceHandler {
	return &ProvinceHandler{service: svc}
}

// GetAllProvinces menangani GET /api/v1/provinces
// Mengembalikan semua provinsi (hanya Jawa) untuk dropdown kalkulator budget
func (h *ProvinceHandler) GetAllProvinces(c *fiber.Ctx) error {
	provinces, err := h.service.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil data provinsi", fiber.StatusInternalServerError),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(provinces))
}

// GetCitiesByProvince menangani GET /api/v1/provinces/:id/cities
// Mengembalikan semua kota berdasarkan ID provinsi untuk dropdown dependent
// Mengembalikan 404 jika provinsi tidak ditemukan
func (h *ProvinceHandler) GetCitiesByProvince(c *fiber.Ctx) error {
	// Parse ID provinsi dari URL parameter
	idStr := c.Params("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("ID provinsi tidak valid", fiber.StatusBadRequest),
		)
	}

	cities, err := h.service.GetCitiesByProvinceID(uint(id))
	if err != nil {
		// Kembalikan 404 jika provinsi tidak ditemukan
		if strings.Contains(err.Error(), "tidak ditemukan") {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("Provinsi tidak ditemukan", fiber.StatusNotFound),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil data kota", fiber.StatusInternalServerError),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(cities))
}
