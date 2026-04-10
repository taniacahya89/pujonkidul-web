package model

// WeatherData adalah data cuaca yang dikirim ke frontend (tanpa API key)
type WeatherData struct {
	// Suhu dalam Celsius
	Temp float64 `json:"temp"`
	// Suhu yang dirasakan dalam Celsius
	FeelsLike float64 `json:"feels_like"`
	// Kondisi cuaca utama (contoh: "Clouds", "Rain", "Clear")
	Condition string `json:"condition"`
	// Deskripsi cuaca dalam Bahasa Indonesia
	Description string `json:"description"`
	// Kode ikon cuaca dari OpenWeatherMap
	Icon string `json:"icon"`
	// Kelembaban udara dalam persen
	Humidity int `json:"humidity"`
	// Kecepatan angin dalam m/s
	WindSpeed float64 `json:"wind_speed"`
}

// OWMResponse adalah struktur response mentah dari OpenWeatherMap API
// Digunakan untuk parsing, tidak dikirim ke frontend
type OWMResponse struct {
	Weather []struct {
		Main        string `json:"main"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
	} `json:"weather"`
	Main struct {
		Temp      float64 `json:"temp"`
		FeelsLike float64 `json:"feels_like"`
		Humidity  int     `json:"humidity"`
	} `json:"main"`
	Wind struct {
		Speed float64 `json:"speed"`
	} `json:"wind"`
	// Kode status dari OWM (200 = sukses)
	Cod int `json:"cod"`
}
