package model

// BudgetRequest adalah input dari frontend untuk kalkulasi budget perjalanan
type BudgetRequest struct {
	// ID provinsi asal pengguna
	ProvinceID uint `json:"province_id" validate:"required"`
	// ID kota asal pengguna
	CityID uint `json:"city_id" validate:"required"`
	// Jenis kendaraan: "motor" atau "mobil"
	VehicleType string `json:"vehicle_type" validate:"required,oneof=motor mobil"`
	// Jumlah orang yang ikut perjalanan (1-10)
	PersonCount int `json:"person_count" validate:"required,min=1,max=10"`
	// ID destinasi yang akan dikunjungi (minimal 1)
	DestinationIDs []uint `json:"destination_ids" validate:"required,min=1"`
	// Anggaran makan per orang per kali makan: 25000, 50000, atau 100000
	MealBudget int `json:"meal_budget" validate:"required,oneof=25000 50000 100000"`
	// Anggaran oleh-oleh per orang: 0, 50000, 150000, atau 300000
	SouvenirBudget int `json:"souvenir_budget" validate:"required,oneof=0 50000 150000 300000"`
	// Estimasi lama perjalanan dalam hari
	EstimatedDays int `json:"estimated_days" validate:"required,min=1"`
}

// BudgetResponse adalah hasil kalkulasi budget yang dikembalikan ke frontend
type BudgetResponse struct {
	// Biaya transportasi (pulang-pergi)
	TransportCost int `json:"transport_cost"`
	// Biaya aktivitas (tiket masuk semua destinasi × jumlah orang)
	ActivityCost int `json:"activity_cost"`
	// Biaya makan (jumlah orang × budget makan × hari × 3 kali makan)
	MealCost int `json:"meal_cost"`
	// Biaya oleh-oleh (budget oleh-oleh × jumlah orang)
	SouvenirCost int `json:"souvenir_cost"`
	// Total estimasi semua biaya
	TotalEstimate int `json:"total_estimate"`
	// Jarak tempuh dari kota asal ke Pujon Kidul
	DistanceKm int `json:"distance_km"`
	// Estimasi kebutuhan BBM dalam liter
	FuelLiters float64 `json:"fuel_liters"`
	// Tips hemat perjalanan berdasarkan input
	Tips []string `json:"tips"`
	// Rekomendasi waktu terbaik berkunjung
	BestVisitTime string `json:"best_visit_time"`
}
