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
	// CalculateBudget menghitung estimasi biaya perjalanan berdasarkan input pengguna
	CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error)
}

// budgetService adalah implementasi konkret BudgetService
type budgetService struct {
	repo repository.BudgetRepository
	cfg  *config.Config
}

// NewBudgetService membuat instance baru budgetService
func NewBudgetService(repo repository.BudgetRepository, cfg *config.Config) BudgetService {
	return &budgetService{repo: repo, cfg: cfg}
}

// CalculateBudget menghitung estimasi biaya perjalanan berdasarkan input pengguna
// Formula:
//   - Transport = (jarak_km / konsumsi_bbm) × harga_bbm × 2 (pulang-pergi)
//   - Aktivitas = jumlah_orang × total_harga_tiket_semua_destinasi
//   - Makan     = jumlah_orang × budget_makan × hari × 3 (3 kali makan per hari)
//   - Oleh-oleh = budget_oleh_oleh × jumlah_orang
//   - Total     = Transport + Aktivitas + Makan + Oleh-oleh
func (s *budgetService) CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error) {
	// Ambil data kota (jarak + konsumsi BBM)
	city, err := s.repo.FindCityByID(req.CityID)
	if err != nil {
		return nil, fmt.Errorf("kota tidak ditemukan: %w", err)
	}

	// Tentukan konsumsi BBM berdasarkan jenis kendaraan
	// Motor: 40-60 km/liter (dari data kota), Mobil: 10-18 km/liter
	var fuelConsumption float64
	if req.VehicleType == "motor" {
		fuelConsumption = city.FuelConsumptionMotor
	} else {
		fuelConsumption = city.FuelConsumptionCar
	}

	// Hitung kebutuhan BBM (liter) untuk perjalanan pulang-pergi
	fuelLiters := (float64(city.DistanceKm) / fuelConsumption) * 2

	// Hitung biaya transportasi (pulang-pergi)
	// Harga BBM dari konfigurasi (env var BBM_PRICE, default Rp 10.000/liter)
	transportCost := int(math.Round(fuelLiters * s.cfg.BBMPrice))

	// Ambil data destinasi yang dipilih untuk menghitung total harga tiket
	destinations, err := s.repo.FindDestinationsByIDs(req.DestinationIDs)
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil data destinasi: %w", err)
	}

	// Hitung total harga tiket semua destinasi yang dipilih
	totalTicketPrice := 0
	bestTimes := []string{}
	for _, dest := range destinations {
		totalTicketPrice += dest.TicketPrice
		if dest.BestTime != "" {
			bestTimes = append(bestTimes, dest.BestTime)
		}
	}

	// Hitung biaya aktivitas (tiket × jumlah orang)
	activityCost := req.PersonCount * totalTicketPrice

	// Hitung biaya makan (orang × budget makan × hari × 3 kali makan)
	mealCost := req.PersonCount * req.MealBudget * req.EstimatedDays * 3

	// Hitung biaya oleh-oleh (budget oleh-oleh × jumlah orang)
	souvenirCost := req.SouvenirBudget * req.PersonCount

	// Hitung total estimasi semua biaya
	totalEstimate := transportCost + activityCost + mealCost + souvenirCost

	// Generate tips hemat berdasarkan input
	tips := generateTravelTips(req.VehicleType, req.PersonCount)

	// Tentukan rekomendasi waktu terbaik berkunjung
	bestVisitTime := determineBestVisitTime(bestTimes)

	return &model.BudgetResponse{
		TransportCost: transportCost,
		ActivityCost:  activityCost,
		MealCost:      mealCost,
		SouvenirCost:  souvenirCost,
		TotalEstimate: totalEstimate,
		DistanceKm:    city.DistanceKm,
		FuelLiters:    math.Round(fuelLiters*100) / 100,
		Tips:          tips,
		BestVisitTime: bestVisitTime,
	}, nil
}

// generateTravelTips menghasilkan minimal 3 tips hemat berdasarkan jenis kendaraan dan jumlah orang
func generateTravelTips(vehicleType string, personCount int) []string {
	tips := []string{
		"Kunjungi di hari kerja (Senin-Jumat) untuk menghindari keramaian dan antrean panjang.",
		"Bawa bekal makanan ringan dari rumah untuk menghemat biaya makan siang.",
		"Beli tiket destinasi secara bundling jika tersedia untuk mendapat diskon.",
	}

	// Tambahkan tip berdasarkan jenis kendaraan
	if vehicleType == "motor" {
		tips = append(tips, "Gunakan motor matic untuk jalur dalam kawasan yang sempit dan menanjak.")
		tips = append(tips, "Isi bensin penuh sebelum berangkat — SPBU terdekat ada di Kota Batu.")
	} else {
		tips = append(tips, "Parkir mobil di area utama dan gunakan ojek lokal untuk keliling destinasi.")
		tips = append(tips, "Manfaatkan carpooling — ajak lebih banyak teman untuk berbagi biaya BBM.")
	}

	// Tambahkan tip berdasarkan jumlah orang
	if personCount >= 4 {
		tips = append(tips, fmt.Sprintf("Dengan %d orang, pertimbangkan sewa minibus untuk efisiensi biaya transport.", personCount))
	}
	if personCount >= 6 {
		tips = append(tips, "Grup besar bisa mendapat diskon tiket masuk — tanyakan ke pengelola destinasi.")
	}

	// Kembalikan minimal 3 tips
	if len(tips) > 5 {
		return tips[:5]
	}
	return tips
}

// determineBestVisitTime menentukan rekomendasi waktu terbaik berdasarkan data destinasi
func determineBestVisitTime(bestTimes []string) string {
	if len(bestTimes) == 0 {
		return "Pagi hari (07:00-10:00) untuk menghindari panas dan keramaian"
	}
	// Kembalikan waktu terbaik dari destinasi pertama sebagai rekomendasi utama
	return bestTimes[0]
}
