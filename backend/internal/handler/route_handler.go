package handler

import (
	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/response"

	"github.com/gofiber/fiber/v2"
)

// RouteHandler menangani HTTP request untuk data rute akses jalan
type RouteHandler struct {
	service service.RouteService
}

// NewRouteHandler membuat instance baru RouteHandler
func NewRouteHandler(svc service.RouteService) *RouteHandler {
	return &RouteHandler{service: svc}
}

// GetAllRoutes menangani GET /api/v1/routes
// Mengembalikan semua rute akses jalan beserta status kondisi terkini
func (h *RouteHandler) GetAllRoutes(c *fiber.Ctx) error {
	routes, err := h.service.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("Gagal mengambil data rute akses jalan", fiber.StatusInternalServerError),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(routes))
}
