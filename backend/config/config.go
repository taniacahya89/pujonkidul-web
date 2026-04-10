package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config menyimpan semua konfigurasi aplikasi yang dibaca dari environment variable
type Config struct {
	// Konfigurasi database PostgreSQL
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string

	// Port server backend
	Port string

	// API key OpenWeatherMap (tidak pernah dikirim ke frontend)
	OWMAPIKey string

	// Origin yang diizinkan untuk CORS
	AllowedOrigins string

	// Harga BBM per liter dalam Rupiah
	BBMPrice float64

	// Koordinat Pujon Kidul untuk weather proxy
	PujonLat float64
	PujonLon float64
}

// Load membaca konfigurasi dari file .env dan environment variable
// Mengembalikan error jika variabel wajib tidak ditemukan
func Load() (*Config, error) {
	// Muat file .env jika ada (tidak wajib, bisa pakai env langsung)
	_ = godotenv.Load()

	cfg := &Config{}

	// Baca konfigurasi database
	cfg.DBHost = getEnv("DB_HOST", "localhost")
	cfg.DBPort = getEnv("DB_PORT", "5432")
	cfg.DBUser = getEnv("DB_USER", "postgres")
	cfg.DBPassword = getEnv("DB_PASSWORD", "")
	cfg.DBName = getEnv("DB_NAME", "pujon_kidul_explore")

	// Baca port server
	cfg.Port = getEnv("PORT", "8080")

	// Baca API key OWM (wajib ada)
	cfg.OWMAPIKey = os.Getenv("OWM_API_KEY")
	if cfg.OWMAPIKey == "" {
		// Izinkan kosong untuk development, tapi log peringatan
		fmt.Println("[PERINGATAN] OWM_API_KEY tidak diset, fitur cuaca tidak akan berfungsi")
	}

	// Baca allowed origins untuk CORS
	cfg.AllowedOrigins = getEnv("ALLOWED_ORIGINS", "http://localhost:5173")

	// Baca harga BBM
	bbmPrice, err := strconv.ParseFloat(getEnv("BBM_PRICE", "10000"), 64)
	if err != nil {
		return nil, fmt.Errorf("BBM_PRICE tidak valid: %w", err)
	}
	cfg.BBMPrice = bbmPrice

	// Baca koordinat Pujon Kidul
	pujonLat, err := strconv.ParseFloat(getEnv("PUJON_LAT", "-7.9285"), 64)
	if err != nil {
		return nil, fmt.Errorf("PUJON_LAT tidak valid: %w", err)
	}
	cfg.PujonLat = pujonLat

	pujonLon, err := strconv.ParseFloat(getEnv("PUJON_LON", "122.4012"), 64)
	if err != nil {
		return nil, fmt.Errorf("PUJON_LON tidak valid: %w", err)
	}
	cfg.PujonLon = pujonLon

	return cfg, nil
}

// DSN mengembalikan string koneksi PostgreSQL
func (c *Config) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Jakarta",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName,
	)
}

// getEnv membaca environment variable dengan nilai default jika tidak ada
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
