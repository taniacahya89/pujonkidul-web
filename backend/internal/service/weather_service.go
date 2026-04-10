package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"pujon-kidul-explore/backend/config"
	"pujon-kidul-explore/backend/internal/model"
)

// WeatherService mendefinisikan kontrak untuk layanan cuaca
type WeatherService interface {
	// GetWeather mengambil data cuaca terkini untuk kawasan Pujon Kidul
	// API key OWM tidak pernah dikirim ke frontend — hanya digunakan di sini
	GetWeather() (*model.WeatherData, error)
}

// weatherService adalah implementasi konkret WeatherService
type weatherService struct {
	cfg        *config.Config
	httpClient *http.Client
}

// NewWeatherService membuat instance baru weatherService
func NewWeatherService(cfg *config.Config) WeatherService {
	return &weatherService{
		cfg: cfg,
		// HTTP client dengan timeout 10 detik untuk menghindari hang
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

// GetWeather mengambil data cuaca dari OpenWeatherMap API
// Koordinat Pujon Kidul diambil dari konfigurasi (env var PUJON_LAT, PUJON_LON)
// API key diambil dari env var OWM_API_KEY — tidak pernah dikirim ke frontend
func (s *weatherService) GetWeather() (*model.WeatherData, error) {
	// Periksa apakah API key tersedia
	if s.cfg.OWMAPIKey == "" {
		return nil, fmt.Errorf("OWM_API_KEY tidak dikonfigurasi")
	}

	// Bangun URL request ke OpenWeatherMap API
	// units=metric untuk suhu Celsius, lang=id untuk deskripsi Bahasa Indonesia
	url := fmt.Sprintf(
		"https://api.openweathermap.org/data/2.5/weather?lat=%.4f&lon=%.4f&appid=%s&units=metric&lang=id",
		s.cfg.PujonLat,
		s.cfg.PujonLon,
		s.cfg.OWMAPIKey, // API key hanya ada di sini, tidak dikirim ke frontend
	)

	// Kirim request ke OWM API
	resp, err := s.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("gagal menghubungi OWM API: %w", err)
	}
	defer resp.Body.Close()

	// Periksa status response OWM
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OWM API mengembalikan status %d", resp.StatusCode)
	}

	// Parse response JSON dari OWM ke struct internal
	var owmResp model.OWMResponse
	if err := json.NewDecoder(resp.Body).Decode(&owmResp); err != nil {
		return nil, fmt.Errorf("gagal parse response OWM: %w", err)
	}

	// Validasi response OWM memiliki data cuaca
	if len(owmResp.Weather) == 0 {
		return nil, fmt.Errorf("response OWM tidak memiliki data cuaca")
	}

	// Transform response OWM ke format internal (tanpa API key)
	// Hanya data yang diperlukan frontend yang dikirim
	weatherData := &model.WeatherData{
		Temp:        owmResp.Main.Temp,
		FeelsLike:   owmResp.Main.FeelsLike,
		Condition:   owmResp.Weather[0].Main,
		Description: owmResp.Weather[0].Description,
		Icon:        owmResp.Weather[0].Icon,
		Humidity:    owmResp.Main.Humidity,
		WindSpeed:   owmResp.Wind.Speed,
	}

	return weatherData, nil
}
