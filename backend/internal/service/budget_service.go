package service

import (
	"fmt"
	"math"

	"pujon-kidul-explore/backend/config"
	"pujon-kidul-explore/backend/internal/model"
	"pujon-kidul-explore/backend/internal/repository"
)

// BudgetService mendefinisikan kontrak business logic untuk kalkulasi budget
type BudgetService interface {
	CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error)
}

type budgetService struct {
	repo repository.BudgetRepository
	cfg  *config.Config
}

func NewBudgetService(repo repository.BudgetRepository, cfg *config.Config) BudgetService {
	return &budgetService{repo: repo, cfg: cfg}
}

// CalculateBudget menghitung estimasi biaya perjalanan
// Harga tiket destinasi dipilih berdasarkan day_type (weekday/weekend)
// Formula:
//
//	Transport  = (jarak / konsumsi_bbm) × harga_bbm × 2 (PP)
//	Aktivitas  = jumlah_orang × Σ harga_tiket_per_destinasi (sesuai day_type)
//	Makan      = jumlah_orang × budget_makan × hari × 3
//	Oleh-oleh  = budget_oleh_oleh × jumlah_orang
//	Total      = Transport + Aktivitas + Makan + Oleh-oleh
func (s *budgetService) CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error) {
	// Ambil data kota (jarak + konsumsi BBM)
	city, err := s.repo.FindCityByID(req.CityID)
	if err != nil {
		return nil, fmt.Errorf("kota tidak ditemukan: %w", err)
	}

	// Tentukan konsumsi BBM berdasarkan jenis kendaraan
	var fuelConsumption float64
	if req.VehicleType == "motor" {
		fuelConsumption = city.FuelConsumptionMotor
	} else {
		fuelConsumption = city.FuelConsumptionCar
	}

	// Hitung kebutuhan BBM pulang-pergi
	fuelLiters := (float64(city.DistanceKm) / fuelConsumption) * 2
	transportCost := int(math.Round(fuelLiters * s.cfg.BBMPrice))

	// Ambil data destinasi yang dipilih
	destinations, err := s.repo.FindDestinationsByIDs(req.DestinationIDs)
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data destinasi: %w", err)
	}

	// Hitung total tiket berdasarkan day_type
	// Gunakan ticket_weekday/ticket_weekend jika tersedia, fallback ke ticket_price
	totalTicketPrice := 0
	destinationTickets := make([]model.DestinationTicketInfo, 0, len(destinations))
	bestTimes := []string{}

	for _, dest := range destinations {
		ticketPrice := resolveTicketPrice(dest, req.DayType)
		totalTicketPrice += ticketPrice
		destinationTickets = append(destinationTickets, model.DestinationTicketInfo{
			ID:          dest.ID,
			Name:        dest.Name,
			TicketPrice: ticketPrice,
		})
		if dest.BestTime != "" {
			bestTimes = append(bestTimes, dest.BestTime)
		}
	}

	activityCost := req.PersonCount * totalTicketPrice
	mealCost := req.PersonCount * req.MealBudget * req.EstimatedDays * 3
	souvenirCost := req.SouvenirBudget * req.PersonCount
	totalEstimate := transportCost + activityCost + mealCost + souvenirCost

	tips := generateTravelTips(req.VehicleType, req.PersonCount, req.DayType)
	bestVisitTime := determineBestVisitTime(bestTimes)

	return &model.BudgetResponse{
		DayType:            req.DayType,
		TransportCost:      transportCost,
		ActivityCost:       activityCost,
		DestinationTickets: destinationTickets,
		MealCost:           mealCost,
		SouvenirCost:       souvenirCost,
		TotalEstimate:      totalEstimate,
		DistanceKm:         city.DistanceKm,
		FuelLiters:         math.Round(fuelLiters*100) / 100,
		Tips:               tips,
		BestVisitTime:      bestVisitTime,
	}, nil
}

// resolveTicketPrice menentukan harga tiket yang berlaku berdasarkan day_type
// Jika ticket_weekday/ticket_weekend = 0, fallback ke ticket_price (harga tunggal)
// Ini memastikan tidak ada silent error atau asumsi ambigu
func resolveTicketPrice(dest model.Destination, dayType model.DayType) int {
	switch dayType {
	case model.DayTypeWeekday:
		if dest.TicketWeekday > 0 {
			return dest.TicketWeekday
		}
	case model.DayTypeWeekend:
		if dest.TicketWeekend > 0 {
			return dest.TicketWeekend
		}
	}
	// Fallback ke harga default jika kolom weekday/weekend belum diisi
	return dest.TicketPrice
}

// generateTravelTips menghasilkan tips hemat berdasarkan konteks perjalanan
func generateTravelTips(vehicleType string, personCount int, dayType model.DayType) []string {
	tips := []string{
		"Bawa bekal makanan ringan dari rumah untuk menghemat biaya makan siang.",
		"Beli tiket destinasi secara bundling jika tersedia untuk mendapat diskon.",
	}

	// Tip berdasarkan hari kunjungan
	if dayType == model.DayTypeWeekday {
		tips = append([]string{"Pilihan tepat! Kunjungan weekday lebih sepi dan beberapa destinasi menawarkan harga lebih murah."}, tips...)
	} else {
		tips = append([]string{"Weekend lebih ramai — datang lebih pagi (sebelum 09.00) untuk menghindari antrean."}, tips...)
	}

	// Tip berdasarkan kendaraan
	if vehicleType == "motor" {
		tips = append(tips, "Isi bensin penuh sebelum berangkat — SPBU terdekat ada di Kota Batu.")
	} else {
		tips = append(tips, "Parkir mobil di area utama dan gunakan ojek lokal untuk keliling destinasi.")
	}

	// Tip berdasarkan jumlah orang
	if personCount >= 4 {
		tips = append(tips, fmt.Sprintf("Dengan %d orang, pertimbangkan sewa minibus untuk efisiensi biaya transport.", personCount))
	}

	if len(tips) > 5 {
		return tips[:5]
	}
	return tips
}

func determineBestVisitTime(bestTimes []string) string {
	if len(bestTimes) == 0 {
		return "Pagi hari (08.00-10.00) untuk menghindari panas dan keramaian"
	}
	return bestTimes[0]
}
