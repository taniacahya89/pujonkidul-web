package handler

import (
	"pujon-kidul-explore/backend/internal/model"
	"pujon-kidul-explore/backend/internal/service"
	"pujon-kidul-explore/backend/pkg/response"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// BudgetHandler menangani HTTP request untuk kalkulasi budget perjalanan
type BudgetHandler struct {
	service  service.BudgetService
	validate *validator.Validate
}

// NewBudgetHandler membuat instance baru BudgetHandler
func NewBudgetHandler(svc service.BudgetService) *BudgetHandler {
	return &BudgetHandler{
		service:  svc,
		validate: validator.New(),
	}
}

// CalculateBudget menangani POST /api/v1/budget/calculate
// Memvalidasi input, menghitung estimasi budget, dan mengembalikan breakdown biaya
func (h *BudgetHandler) CalculateBudget(c *fiber.Ctx) error {
	// Parse request body ke struct BudgetRequest
	var req model.BudgetRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("Format request tidak valid", fiber.StatusBadRequest),
		)
	}

	// Validasi input menggunakan go-playground/validator
	if err := h.validate.Struct(req); err != nil {
		// Konversi error validasi ke format yang mudah dibaca
		validationErrors := make(map[string]string)
		for _, e := range err.(validator.ValidationErrors) {
			fieldName := e.Field()
			validationErrors[fieldName] = getValidationMessage(e)
		}
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ValidationErrorResponse(validationErrors),
		)
	}

	// Hitung budget menggunakan service
	result, err := h.service.CalculateBudget(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse(err.Error(), fiber.StatusBadRequest),
		)
	}

	return c.Status(fiber.StatusOK).JSON(response.SuccessResponse(result))
}

// getValidationMessage mengkonversi error validasi ke pesan Bahasa Indonesia
func getValidationMessage(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "Field ini wajib diisi"
	case "min":
		if e.Field() == "PersonCount" {
			return "Jumlah orang harus antara 1 hingga 10"
		}
		return "Nilai minimum tidak terpenuhi"
	case "max":
		if e.Field() == "PersonCount" {
			return "Jumlah orang harus antara 1 hingga 10"
		}
		return "Nilai maksimum terlampaui"
	case "oneof":
		if e.Field() == "VehicleType" {
			return "Jenis kendaraan harus 'motor' atau 'mobil'"
		}
		if e.Field() == "MealBudget" {
			return "Anggaran makan harus 25000, 50000, atau 100000"
		}
		if e.Field() == "SouvenirBudget" {
			return "Anggaran oleh-oleh harus 0, 50000, 150000, atau 300000"
		}
		return "Nilai tidak valid"
	default:
		return "Nilai tidak valid"
	}
}
