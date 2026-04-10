# Design Document: Pujon Kidul Explore

## Overview

Pujon Kidul Explore adalah platform web wisata fullstack yang memungkinkan pengguna menjelajahi destinasi wisata di kawasan Pujon Kidul, Malang, Jawa Timur. Platform ini dibangun dengan arsitektur client-server yang jelas: **Frontend** React 18 (Vite) berkomunikasi dengan **Backend** Go Fiber melalui REST API, dengan **PostgreSQL** sebagai penyimpanan data persisten.

Fitur utama meliputi:
- Halaman beranda dengan widget cuaca real-time (via Weather Proxy)
- Destination Card expandable dengan Visitor Chart dan Travel Package
- Halaman Wisata dengan 10 destinasi dan pencarian real-time
- Peta interaktif Leaflet (vanilla JS) dengan marker dan sidebar
- Kalkulator budget perjalanan dengan formula transportasi berbasis jarak
- Informasi akses jalan (Route Status)
- Redirect ke WebGIS eksternal ArcGIS

Stack teknologi:
- **Backend**: Go 1.21+, Fiber v2, GORM, PostgreSQL 15
- **Frontend**: React 18, Vite, TailwindCSS, Zustand, Chart.js, Leaflet
- **Infrastruktur**: Docker Compose (opsional), `.env` untuk konfigurasi


## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React 18 + Vite Frontend                    │   │
│  │                                                          │   │
│  │  Pages: Home | Wisata | Peta | Budget | WebGIS           │   │
│  │  State: Zustand (destination|weather|budget|route)       │   │
│  │  Map:   Leaflet vanilla JS (useEffect + useRef)          │   │
│  │  Chart: Chart.js (bar chart visitor data)                │   │
│  └──────────────────────┬───────────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP REST (JSON)
                          │ VITE_API_BASE_URL
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Go Fiber Backend                             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Middleware  │  │   Handler   │  │      Service         │   │
│  │  - CORS      │  │  (HTTP)     │  │  (Business Logic)    │   │
│  │  - ErrorHdlr │  │             │  │                      │   │
│  │  - Logger    │  │             │  │                      │   │
│  └─────────────┘  └──────┬──────┘  └──────────┬───────────┘   │
│                           │                    │               │
│                           └────────────────────┘               │
│                                    │                           │
│                           ┌────────▼────────┐                  │
│                           │   Repository    │                  │
│                           │   (GORM/SQL)    │                  │
│                           └────────┬────────┘                  │
│                                    │                           │
│  ┌─────────────────────────────────▼──────────────────────┐   │
│  │              Weather Proxy (OWM API)                    │   │
│  │  API Key tersimpan di env, tidak terekspos ke client    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL 15                                 │
│  destinations | destination_details | travel_packages           │
│  routes | provinces | cities                                    │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼ (Weather Proxy only)
┌─────────────────────────────────────────────────────────────────┐
│              OpenWeatherMap API (Eksternal)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Frontend → [CORS Middleware] → [Router] → [Handler] → [Service] → [Repository] → PostgreSQL
                                                    ↘ [WeatherProxy] → OWM API
```

### Layer Responsibilities

| Layer | Tanggung Jawab |
|-------|---------------|
| Handler | Parsing request, validasi input HTTP, format response JSON |
| Service | Business logic, kalkulasi budget, orkestrasi data |
| Repository | Query database via GORM, tidak ada business logic |
| Middleware | CORS, error recovery, logging |


## Components and Interfaces

### Backend: Struktur Folder

```
backend/
├── cmd/
│   └── main.go                    # Entry point, inisialisasi app
├── config/
│   └── config.go                  # Load env vars, struct Config
├── internal/
│   ├── handler/
│   │   ├── destination_handler.go # Handler destinasi
│   │   ├── weather_handler.go     # Handler weather proxy
│   │   ├── route_handler.go       # Handler rute akses jalan
│   │   ├── province_handler.go    # Handler provinsi & kota
│   │   └── budget_handler.go      # Handler kalkulasi budget
│   ├── service/
│   │   ├── destination_service.go # Business logic destinasi
│   │   ├── weather_service.go     # Proxy ke OWM API
│   │   ├── route_service.go       # Logic rute
│   │   ├── province_service.go    # Logic provinsi & kota
│   │   └── budget_service.go      # Formula kalkulasi budget
│   ├── repository/
│   │   ├── destination_repo.go    # Query tabel destinations
│   │   ├── route_repo.go          # Query tabel routes
│   │   ├── province_repo.go       # Query tabel provinces & cities
│   │   └── budget_repo.go         # Query data untuk kalkulasi
│   ├── model/
│   │   ├── destination.go         # Struct Destination, DestinationDetail
│   │   ├── travel_package.go      # Struct TravelPackage
│   │   ├── route.go               # Struct Route
│   │   ├── province.go            # Struct Province, City
│   │   └── budget.go              # Struct BudgetRequest, BudgetResponse
│   └── middleware/
│       ├── cors.go                # CORS middleware
│       └── error_handler.go       # Global error handler & recovery
├── pkg/
│   └── response/
│       └── response.go            # Helper format JSON response
├── migrations/
│   └── 001_init.sql               # DDL schema + seed data
├── .env.example
├── go.mod
└── README.md
```

### Frontend: Struktur Folder

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx           # Halaman beranda
│   │   ├── WisataPage.jsx         # Halaman semua destinasi
│   │   ├── PetaPage.jsx           # Halaman peta interaktif
│   │   ├── BudgetPage.jsx         # Halaman kalkulator budget
│   │   └── WebGISPage.jsx         # Halaman redirect WebGIS
│   ├── features/
│   │   ├── destination/
│   │   │   ├── DestinationCard.jsx    # Card collapsed/expanded
│   │   │   ├── VisitorChart.jsx       # Chart.js bar chart
│   │   │   └── TravelPackageList.jsx  # Daftar paket wisata
│   │   ├── map/
│   │   │   ├── InteractiveMap.jsx     # Leaflet vanilla JS wrapper
│   │   │   └── MapSidebar.jsx         # Sidebar info destinasi
│   │   ├── budget/
│   │   │   ├── BudgetForm.jsx         # Form input kalkulasi
│   │   │   ├── BudgetResult.jsx       # Tampilan hasil breakdown
│   │   │   └── TravelTips.jsx         # Tips hemat perjalanan
│   │   └── weather/
│   │       └── WeatherWidget.jsx      # Widget cuaca di hero
│   ├── components/
│   │   ├── Navbar.jsx             # Navigasi utama
│   │   ├── Footer.jsx             # Footer
│   │   ├── SkeletonLoader.jsx     # Loading skeleton
│   │   └── RouteCard.jsx          # Card info akses jalan
│   ├── store/
│   │   ├── destinationStore.js    # Zustand: destinasi
│   │   ├── weatherStore.js        # Zustand: cuaca
│   │   ├── budgetStore.js         # Zustand: budget
│   │   └── routeStore.js          # Zustand: rute
│   ├── services/
│   │   ├── api.js                 # Axios instance + base URL
│   │   ├── destinationService.js  # API calls destinasi
│   │   ├── weatherService.js      # API calls cuaca
│   │   ├── budgetService.js       # API calls budget
│   │   └── routeService.js        # API calls rute
│   ├── hooks/
│   │   ├── useDestinations.js     # Hook fetch & cache destinasi
│   │   ├── useWeather.js          # Hook fetch cuaca
│   │   ├── useBudget.js           # Hook kalkulasi budget
│   │   └── useRoutes.js           # Hook fetch rute
│   └── utils/
│       ├── formatCurrency.js      # Format Rupiah
│       ├── formatDate.js          # Format tanggal Indonesia
│       └── constants.js           # Konstanta app (BBM price, dll)
├── .env.example
├── vite.config.js
└── tailwind.config.js
```

### Backend: Interface Signatures

```go
// internal/handler/destination_handler.go

// GetAllDestinations mengembalikan semua destinasi dari database
// GET /api/v1/destinations
func (h *DestinationHandler) GetAllDestinations(c *fiber.Ctx) error

// GetDestinationByID mengembalikan detail satu destinasi berdasarkan ID
// GET /api/v1/destinations/:id
func (h *DestinationHandler) GetDestinationByID(c *fiber.Ctx) error

// GetFeaturedDestinations mengembalikan 3 destinasi unggulan (is_featured = true)
// GET /api/v1/destinations/featured
func (h *DestinationHandler) GetFeaturedDestinations(c *fiber.Ctx) error

// internal/service/destination_service.go

type DestinationService interface {
    GetAll() ([]model.Destination, error)
    GetByID(id uint) (*model.Destination, error)
    GetFeatured() ([]model.Destination, error)
}

// internal/repository/destination_repo.go

type DestinationRepository interface {
    FindAll() ([]model.Destination, error)
    FindByID(id uint) (*model.Destination, error)
    FindFeatured() ([]model.Destination, error)
}

// internal/service/budget_service.go

// CalculateBudget menghitung estimasi biaya perjalanan berdasarkan input
func (s *BudgetService) CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error)

// internal/service/weather_service.go

// GetWeather meneruskan request ke OWM API menggunakan API key dari env
// API key tidak pernah dikirim ke frontend
func (s *WeatherService) GetWeather() (*model.WeatherData, error)
```

### Frontend: Component Signatures

```jsx
// src/features/destination/DestinationCard.jsx
// Komponen card destinasi dengan mode collapsed dan expanded
// Props: destination (object), defaultExpanded (bool)
function DestinationCard({ destination, defaultExpanded = false })

// src/features/destination/VisitorChart.jsx
// Bar chart Chart.js untuk data kunjungan bulanan
// Props: visitorData (array of {month, count})
function VisitorChart({ visitorData })

// src/features/destination/TravelPackageList.jsx
// Daftar paket wisata untuk satu destinasi
// Props: packages (array), destinationId (number)
function TravelPackageList({ packages, destinationId })

// src/features/map/InteractiveMap.jsx
// Wrapper Leaflet vanilla JS menggunakan useEffect + useRef
// Props: destinations (array), onMarkerClick (function)
function InteractiveMap({ destinations, onMarkerClick })

// src/features/map/MapSidebar.jsx
// Sidebar info destinasi yang muncul saat marker diklik
// Props: destination (object|null), onClose (function), onViewDetail (function)
function MapSidebar({ destination, onClose, onViewDetail })

// src/features/budget/BudgetForm.jsx
// Form input kalkulator budget dengan validasi
// Props: onSubmit (function)
function BudgetForm({ onSubmit })

// src/features/budget/BudgetResult.jsx
// Tampilan breakdown hasil kalkulasi budget
// Props: result (object BudgetResponse)
function BudgetResult({ result })

// src/features/budget/TravelTips.jsx
// Tips hemat berdasarkan jenis kendaraan dan jumlah orang
// Props: vehicleType (string), personCount (number)
function TravelTips({ vehicleType, personCount })

// src/features/weather/WeatherWidget.jsx
// Widget cuaca di section hero halaman beranda
// Props: tidak ada (mengambil dari weatherStore)
function WeatherWidget()

// src/components/RouteCard.jsx
// Card informasi kondisi akses jalan
// Props: route (object)
function RouteCard({ route })
```


## Data Models

### Database Schema (PostgreSQL)

```sql
-- Tabel utama destinasi wisata
CREATE TABLE destinations (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    short_description VARCHAR(300) NOT NULL,          -- maks 150 karakter untuk collapsed
    full_description  TEXT NOT NULL,
    opening_hours     VARCHAR(100) NOT NULL,           -- contoh: "07:00 - 17:00"
    ticket_price      INTEGER NOT NULL DEFAULT 0,      -- dalam Rupiah
    latitude          DECIMAL(10, 8) NOT NULL,
    longitude         DECIMAL(11, 8) NOT NULL,
    best_time         VARCHAR(255),                    -- waktu terbaik berkunjung
    parking_available BOOLEAN NOT NULL DEFAULT TRUE,
    vehicle_access    VARCHAR(255),                    -- jenis kendaraan yang bisa akses
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,  -- 3 destinasi unggulan
    rating            DECIMAL(3, 1) DEFAULT 4.5,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_is_featured ON destinations(is_featured);
CREATE INDEX idx_destinations_name ON destinations(name);

-- Detail tambahan destinasi (visitor data, gambar)
CREATE TABLE destination_details (
    id             SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    visitor_data   JSONB NOT NULL DEFAULT '[]',  -- [{month:"Jan",count:1200}, ...]
    image_url      VARCHAR(500),                 -- placeholder, ganti gambar di sini
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(destination_id)
);

CREATE INDEX idx_destination_details_dest_id ON destination_details(destination_id);

-- Paket wisata per destinasi
CREATE TABLE travel_packages (
    id             SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    price          INTEGER NOT NULL,             -- dalam Rupiah
    duration       VARCHAR(100),                 -- contoh: "3 jam", "1 hari"
    includes       TEXT,                         -- fasilitas yang termasuk
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_travel_packages_dest_id ON travel_packages(destination_id);

-- Rute akses jalan menuju kawasan Pujon Kidul
CREATE TABLE routes (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  TEXT NOT NULL,
    status       VARCHAR(50) NOT NULL DEFAULT 'baik',  -- 'baik'|'sedang'|'rusak'
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provinsi (hanya Jawa)
CREATE TABLE provinces (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Kota dengan data jarak dan konsumsi BBM ke Pujon Kidul
CREATE TABLE cities (
    id                     SERIAL PRIMARY KEY,
    province_id            INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    name                   VARCHAR(100) NOT NULL,
    distance_km            INTEGER NOT NULL,           -- jarak ke Pujon Kidul dalam km
    fuel_consumption_motor DECIMAL(5, 2) NOT NULL,     -- km/liter untuk motor
    fuel_consumption_car   DECIMAL(5, 2) NOT NULL,     -- km/liter untuk mobil
    created_at             TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cities_province_id ON cities(province_id);
```

### Go Model Structs

```go
// internal/model/destination.go

type Destination struct {
    ID               uint              `json:"id" gorm:"primaryKey"`
    Name             string            `json:"name"`
    ShortDescription string            `json:"short_description"`
    FullDescription  string            `json:"full_description"`
    OpeningHours     string            `json:"opening_hours"`
    TicketPrice      int               `json:"ticket_price"`
    Latitude         float64           `json:"latitude"`
    Longitude        float64           `json:"longitude"`
    BestTime         string            `json:"best_time"`
    ParkingAvailable bool              `json:"parking_available"`
    VehicleAccess    string            `json:"vehicle_access"`
    IsFeatured       bool              `json:"is_featured"`
    Rating           float64           `json:"rating"`
    CreatedAt        time.Time         `json:"created_at"`
    UpdatedAt        time.Time         `json:"updated_at"`
    Detail           *DestinationDetail `json:"detail,omitempty" gorm:"foreignKey:DestinationID"`
    Packages         []TravelPackage   `json:"packages,omitempty" gorm:"foreignKey:DestinationID"`
}

type DestinationDetail struct {
    ID            uint            `json:"id" gorm:"primaryKey"`
    DestinationID uint            `json:"destination_id"`
    VisitorData   json.RawMessage `json:"visitor_data" gorm:"type:jsonb"`
    ImageURL      string          `json:"image_url"`
}

// internal/model/budget.go

type BudgetRequest struct {
    ProvinceID     uint   `json:"province_id" validate:"required"`
    CityID         uint   `json:"city_id" validate:"required"`
    VehicleType    string `json:"vehicle_type" validate:"required,oneof=motor mobil"`
    PersonCount    int    `json:"person_count" validate:"required,min=1,max=10"`
    DestinationIDs []uint `json:"destination_ids" validate:"required,min=1"`
    MealBudget     int    `json:"meal_budget" validate:"required,oneof=25000 50000 100000"`
    SouvenirBudget int    `json:"souvenir_budget" validate:"required,oneof=0 50000 150000 300000"`
    EstimatedDays  int    `json:"estimated_days" validate:"required,min=1"`
}

type BudgetResponse struct {
    TransportCost  int `json:"transport_cost"`
    ActivityCost   int `json:"activity_cost"`
    MealCost       int `json:"meal_cost"`
    SouvenirCost   int `json:"souvenir_cost"`
    TotalEstimate  int `json:"total_estimate"`
    DistanceKm     int `json:"distance_km"`
}

// internal/model/province.go

type Province struct {
    ID     uint   `json:"id" gorm:"primaryKey"`
    Name   string `json:"name"`
    Cities []City `json:"cities,omitempty" gorm:"foreignKey:ProvinceID"`
}

type City struct {
    ID                   uint    `json:"id" gorm:"primaryKey"`
    ProvinceID           uint    `json:"province_id"`
    Name                 string  `json:"name"`
    DistanceKm           int     `json:"distance_km"`
    FuelConsumptionMotor float64 `json:"fuel_consumption_motor"`
    FuelConsumptionCar   float64 `json:"fuel_consumption_car"`
}
```

### Frontend: Zustand Store Shapes

```js
// src/store/destinationStore.js
{
  destinations: [],          // array of Destination objects
  featuredDestinations: [],  // array of 3 featured Destination objects
  selectedDestination: null, // Destination | null (untuk peta)
  isLoading: false,
  error: null,
  searchQuery: '',           // query pencarian real-time
  // Actions
  fetchDestinations: async () => {},
  fetchFeatured: async () => {},
  setSelectedDestination: (destination) => {},
  setSearchQuery: (query) => {},
  // Computed (getter)
  filteredDestinations: () => [], // filter berdasarkan searchQuery
}

// src/store/weatherStore.js
{
  weather: null,   // { temp, condition, icon, description }
  isLoading: false,
  error: null,
  fetchWeather: async () => {},
}

// src/store/budgetStore.js
{
  provinces: [],
  cities: [],       // kota berdasarkan provinsi yang dipilih
  result: null,     // BudgetResponse | null
  isLoading: false,
  error: null,
  fetchProvinces: async () => {},
  fetchCities: async (provinceId) => {},
  calculateBudget: async (request) => {},
  resetResult: () => {},
}

// src/store/routeStore.js
{
  routes: [],
  isLoading: false,
  error: null,
  fetchRoutes: async () => {},
}
```

### Data Seed

#### 10 Destinasi Wisata

```sql
INSERT INTO destinations (name, short_description, full_description, opening_hours, ticket_price, latitude, longitude, best_time, parking_available, vehicle_access, is_featured, rating) VALUES
('Cafe Sawah', 'Kafe unik di tengah hamparan sawah hijau dengan pemandangan pegunungan yang memukau.', 'Cafe Sawah Pujon Kidul adalah destinasi wisata kuliner yang menawarkan pengalaman makan di tengah sawah yang hijau. Pengunjung dapat menikmati berbagai menu makanan dan minuman sambil menikmati pemandangan alam pegunungan Malang yang indah. Tersedia berbagai spot foto instagramable di area persawahan.', '07:00 - 21:00', 10000, -7.9285, 122.4012, 'Pagi hari (07:00-10:00) atau sore hari (15:00-18:00)', TRUE, 'Motor, Mobil', TRUE, 4.7),

('Wisata Petik Sayur', 'Pengalaman seru memetik sayuran segar langsung dari kebun organik Pujon Kidul.', 'Wisata Petik Sayur menawarkan pengalaman agrowisata yang edukatif. Pengunjung dapat langsung memetik berbagai jenis sayuran segar seperti tomat, cabai, wortel, dan selada dari kebun organik yang dikelola warga setempat. Cocok untuk keluarga dan edukasi anak-anak tentang pertanian.', '08:00 - 16:00', 15000, -7.9301, 122.3998, 'Pagi hari (08:00-11:00)', TRUE, 'Motor, Mobil', TRUE, 4.5),

('Taman Kreatif Wangi Lestari', 'Taman bunga dan tanaman aromatik dengan berbagai instalasi seni kreatif yang instagramable.', 'Taman Kreatif Wangi Lestari adalah ruang terbuka hijau yang memadukan keindahan bunga-bunga berwarna-warni dengan instalasi seni kreatif karya seniman lokal. Aroma bunga lavender, mawar, dan melati menyambut pengunjung. Tersedia workshop membuat potpourri dan produk aromaterapi.', '08:00 - 17:00', 20000, -7.9315, 122.4025, 'Pagi hingga siang hari', TRUE, 'Motor, Mobil', TRUE, 4.6),

('Air Terjun Sumber Pitu', 'Air terjun tujuh sumber dengan air jernih dan suasana hutan tropis yang menyejukkan.', 'Air Terjun Sumber Pitu merupakan air terjun alami dengan tujuh sumber mata air yang mengalir membentuk air terjun bertingkat. Dikelilingi hutan tropis yang lebat, suasananya sangat sejuk dan menyegarkan. Jalur trekking menuju air terjun melewati kebun teh dan hutan pinus.', '07:00 - 16:00', 15000, -7.9420, 122.3875, 'Musim kemarau (April-Oktober)', FALSE, 'Motor (parkir di bawah, jalan kaki 30 menit)', FALSE, 4.8),

('Wisata Petik Buah', 'Kebun buah tropis dengan pengalaman memetik apel, stroberi, dan jeruk langsung dari pohonnya.', 'Wisata Petik Buah menawarkan pengalaman memetik buah-buahan segar langsung dari pohon. Tersedia kebun apel, stroberi, jeruk, dan jambu kristal. Pengunjung dapat membeli buah yang dipetik dengan harga langsung dari petani. Tersedia juga jus buah segar di area wisata.', '08:00 - 16:00', 20000, -7.9278, 122.4045, 'Musim panen (Mei-Agustus)', TRUE, 'Motor, Mobil', FALSE, 4.4),

('Camping Ground Pujon', 'Area berkemah dengan pemandangan bintang terbaik dan udara pegunungan yang segar.', 'Camping Ground Pujon menyediakan area berkemah yang luas dengan pemandangan pegunungan dan lembah yang spektakuler. Pada malam hari, langit bebas polusi cahaya menjadikannya spot terbaik untuk melihat bintang. Tersedia fasilitas toilet, air bersih, dan warung makan di sekitar area.', '24 jam (check-in 14:00)', 35000, -7.9350, 122.3950, 'Musim kemarau, akhir pekan', TRUE, 'Motor, Mobil', FALSE, 4.3),

('Peternakan Sapi Pujon', 'Wisata edukasi peternakan sapi perah dengan pengalaman memerah susu langsung.', 'Peternakan Sapi Pujon adalah wisata edukasi yang memperkenalkan proses peternakan sapi perah modern. Pengunjung dapat melihat proses pemerahan susu, pengolahan susu segar, dan mencicipi berbagai produk olahan susu seperti yogurt, keju, dan es krim susu segar.', '07:00 - 15:00', 25000, -7.9265, 122.4060, 'Pagi hari saat pemerahan (07:00-09:00)', TRUE, 'Motor, Mobil', FALSE, 4.5),

('Kampung Budaya', 'Desa wisata yang melestarikan tradisi dan budaya lokal Jawa dengan pertunjukan seni.', 'Kampung Budaya Pujon Kidul adalah pusat pelestarian budaya Jawa yang menampilkan pertunjukan tari tradisional, wayang kulit, dan gamelan. Pengunjung dapat belajar membatik, membuat gerabah, dan memasak masakan tradisional Jawa. Tersedia homestay untuk pengalaman menginap di rumah warga.', '09:00 - 17:00', 30000, -7.9295, 122.4005, 'Akhir pekan (ada pertunjukan seni)', TRUE, 'Motor, Mobil', FALSE, 4.6),

('Gardu Pandang Pujon', 'Menara pandang dengan panorama 360 derajat kawasan Pujon Kidul dan Gunung Kawi.', 'Gardu Pandang Pujon adalah titik tertinggi yang dapat diakses di kawasan wisata Pujon Kidul. Dari atas menara setinggi 15 meter, pengunjung dapat menikmati panorama 360 derajat yang mencakup hamparan sawah, kebun teh, dan siluet Gunung Kawi di kejauhan. Spot terbaik untuk sunrise dan sunset.', '05:30 - 18:00', 10000, -7.9330, 122.3985, 'Sunrise (05:30-07:00) atau Sunset (16:30-18:00)', TRUE, 'Motor, Mobil', FALSE, 4.7),

('Pasar Desa Pujon', 'Pasar tradisional desa dengan produk lokal, kuliner khas, dan kerajinan tangan Pujon Kidul.', 'Pasar Desa Pujon adalah pasar tradisional yang beroperasi setiap hari dengan menjual berbagai produk lokal. Tersedia sayuran segar hasil panen petani setempat, produk olahan susu, kerajinan tangan bambu dan rotan, serta berbagai kuliner khas Pujon seperti nasi jagung, pecel, dan minuman wedang jahe.', '05:00 - 12:00', 0, -7.9270, 122.4015, 'Pagi hari (05:00-09:00) saat pasar ramai', TRUE, 'Motor, Mobil', FALSE, 4.2);
```

#### 5 Rute Akses Jalan

```sql
INSERT INTO routes (name, description, status, last_updated) VALUES
('Jalur Utama Malang - Pujon via Batu', 'Rute paling populer dari Kota Malang melalui Kota Batu. Jalan beraspal mulus, lebar 2 jalur, cocok untuk semua jenis kendaraan. Jarak ±35 km, waktu tempuh ±1 jam.', 'baik', NOW()),
('Jalur Alternatif Kepanjen - Pujon', 'Rute alternatif dari arah selatan melalui Kepanjen dan Ngajum. Jalan lebih sempit namun pemandangan lebih indah melewati perkebunan. Jarak ±45 km, waktu tempuh ±1.5 jam.', 'sedang', NOW()),
('Jalur Singosari - Pujon via Karangploso', 'Rute dari arah utara melalui Singosari dan Karangploso. Cocok untuk pengunjung dari arah Surabaya. Jarak ±40 km dari Singosari, waktu tempuh ±1.2 jam.', 'baik', NOW()),
('Jalur Dalam Kawasan Pujon Kidul', 'Jalan desa di dalam kawasan wisata Pujon Kidul menghubungkan semua destinasi. Jalan sempit (1 jalur), disarankan menggunakan motor atau berjalan kaki antar destinasi.', 'baik', NOW()),
('Jalur Pujon - Air Terjun Sumber Pitu', 'Jalur khusus menuju Air Terjun Sumber Pitu. Jalan tanah berbatu setelah parkiran, hanya bisa dilalui motor atau berjalan kaki. Trekking ±30 menit dari area parkir.', 'sedang', NOW());
```

#### 6 Provinsi Jawa dan Kota

```sql
INSERT INTO provinces (name) VALUES
('DKI Jakarta'), ('Banten'), ('Jawa Barat'), ('Jawa Tengah'), ('DI Yogyakarta'), ('Jawa Timur');

-- DKI Jakarta (id=1), jarak dari masing-masing kota ke Pujon Kidul
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(1, 'Jakarta Pusat', 820, 45.0, 14.0),
(1, 'Jakarta Utara', 835, 45.0, 14.0),
(1, 'Jakarta Barat', 815, 45.0, 14.0),
(1, 'Jakarta Selatan', 825, 45.0, 14.0),
(1, 'Jakarta Timur', 810, 45.0, 14.0),
-- Banten (id=2)
(2, 'Kota Serang', 870, 45.0, 13.5),
(2, 'Kota Cilegon', 890, 45.0, 13.5),
(2, 'Kota Tangerang', 800, 45.0, 14.0),
(2, 'Kota Tangerang Selatan', 805, 45.0, 14.0),
(2, 'Kabupaten Serang', 875, 45.0, 13.5),
(2, 'Kabupaten Pandeglang', 920, 44.0, 13.0),
(2, 'Kabupaten Lebak', 940, 44.0, 13.0),
(2, 'Kabupaten Tangerang', 795, 45.0, 14.0),
-- Jawa Barat (id=3)
(3, 'Kota Bandung', 620, 46.0, 14.5),
(3, 'Kota Bekasi', 790, 45.0, 14.0),
(3, 'Kota Depok', 810, 45.0, 14.0),
(3, 'Kota Bogor', 780, 45.0, 14.0),
(3, 'Kota Cimahi', 625, 46.0, 14.5),
(3, 'Kota Sukabumi', 720, 45.0, 14.0),
(3, 'Kabupaten Bandung', 615, 46.0, 14.5),
(3, 'Kabupaten Bogor', 775, 45.0, 14.0),
(3, 'Kabupaten Bekasi', 785, 45.0, 14.0),
(3, 'Kabupaten Karawang', 750, 45.0, 14.0),
(3, 'Kabupaten Cirebon', 530, 46.0, 14.5),
(3, 'Kabupaten Garut', 580, 46.0, 14.0),
(3, 'Kabupaten Tasikmalaya', 540, 46.0, 14.0),
-- Jawa Tengah (id=4)
(4, 'Kota Semarang', 380, 47.0, 15.0),
(4, 'Kota Surakarta', 280, 47.0, 15.5),
(4, 'Kota Magelang', 320, 47.0, 15.0),
(4, 'Kota Tegal', 450, 46.0, 14.5),
(4, 'Kota Pekalongan', 420, 46.0, 14.5),
(4, 'Kabupaten Semarang', 375, 47.0, 15.0),
(4, 'Kabupaten Banyumas', 360, 47.0, 15.0),
(4, 'Kabupaten Kudus', 400, 46.0, 14.5),
(4, 'Kabupaten Jepara', 430, 46.0, 14.5),
(4, 'Kabupaten Pati', 410, 46.0, 14.5),
(4, 'Kabupaten Cilacap', 390, 47.0, 15.0),
(4, 'Kabupaten Kebumen', 340, 47.0, 15.0),
-- DI Yogyakarta (id=5)
(5, 'Kota Yogyakarta', 260, 47.0, 15.5),
(5, 'Kabupaten Sleman', 255, 47.0, 15.5),
(5, 'Kabupaten Bantul', 265, 47.0, 15.5),
(5, 'Kabupaten Gunungkidul', 290, 47.0, 15.0),
(5, 'Kabupaten Kulon Progo', 280, 47.0, 15.0),
-- Jawa Timur (id=6)
(6, 'Kota Surabaya', 110, 48.0, 16.0),
(6, 'Kota Malang', 35, 50.0, 17.0),
(6, 'Kota Batu', 20, 50.0, 17.0),
(6, 'Kota Kediri', 80, 49.0, 16.5),
(6, 'Kota Blitar', 95, 49.0, 16.5),
(6, 'Kota Madiun', 175, 48.0, 16.0),
(6, 'Kabupaten Malang', 40, 50.0, 17.0),
(6, 'Kabupaten Sidoarjo', 120, 48.0, 16.0),
(6, 'Kabupaten Gresik', 130, 48.0, 16.0),
(6, 'Kabupaten Jombang', 90, 49.0, 16.5),
(6, 'Kabupaten Pasuruan', 75, 49.0, 16.5),
(6, 'Kabupaten Probolinggo', 130, 48.0, 16.0),
(6, 'Kabupaten Kediri', 85, 49.0, 16.5),
(6, 'Kabupaten Banyuwangi', 250, 47.0, 15.5),
(6, 'Kabupaten Bojonegoro', 200, 48.0, 16.0),
(6, 'Kabupaten Tuban', 220, 48.0, 16.0);
```


## API Endpoint Design

### Base URL: `/api/v1`

Semua response menggunakan format JSON standar:
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

Error response:
```json
{
  "success": false,
  "error": "Pesan error deskriptif",
  "code": 400
}
```

---

### 1. `GET /api/v1/destinations`

Mengembalikan semua destinasi beserta detail dan paket wisata.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cafe Sawah",
      "short_description": "Kafe unik di tengah hamparan sawah hijau...",
      "full_description": "...",
      "opening_hours": "07:00 - 21:00",
      "ticket_price": 10000,
      "latitude": -7.9285,
      "longitude": 122.4012,
      "best_time": "Pagi hari (07:00-10:00)",
      "parking_available": true,
      "vehicle_access": "Motor, Mobil",
      "is_featured": true,
      "rating": 4.7,
      "detail": {
        "visitor_data": [
          {"month": "Jan", "count": 1200},
          {"month": "Feb", "count": 980}
        ],
        "image_url": "/images/placeholder.jpg"
      },
      "packages": [
        {
          "id": 1,
          "name": "Paket Sarapan Sawah",
          "description": "Sarapan pagi dengan menu tradisional",
          "price": 45000,
          "duration": "2 jam",
          "includes": "Sarapan, foto, akses area sawah"
        }
      ]
    }
  ]
}
```

**Headers:** `Cache-Control: public, max-age=300`

---

### 2. `GET /api/v1/destinations/:id`

Mengembalikan detail satu destinasi berdasarkan ID.

**Response 200:** Sama dengan satu item dari endpoint list.

**Response 404:**
```json
{ "success": false, "error": "Destinasi tidak ditemukan", "code": 404 }
```

---

### 3. `GET /api/v1/destinations/featured`

Mengembalikan tepat 3 destinasi dengan `is_featured = true`.

**Response 200:** Array 3 destinasi (format sama dengan endpoint list).

---

### 4. `GET /api/v1/weather`

Weather proxy ke OpenWeatherMap API. API key tidak pernah dikirim ke frontend.

**Query params:** tidak ada (koordinat Pujon Kidul hardcoded di backend: lat=-7.9285, lon=122.4012)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "temp": 22.5,
    "feels_like": 21.0,
    "condition": "Berawan",
    "description": "awan mendung",
    "icon": "04d",
    "humidity": 78,
    "wind_speed": 3.2
  }
}
```

**Response 503 (OWM gagal):**
```json
{ "success": false, "error": "Data cuaca tidak tersedia saat ini", "code": 503 }
```

---

### 5. `GET /api/v1/routes`

Mengembalikan semua rute akses jalan.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jalur Utama Malang - Pujon via Batu",
      "description": "Rute paling populer...",
      "status": "baik",
      "last_updated": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### 6. `GET /api/v1/provinces`

Mengembalikan semua provinsi (hanya Jawa).

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "DKI Jakarta" },
    { "id": 2, "name": "Banten" },
    { "id": 3, "name": "Jawa Barat" },
    { "id": 4, "name": "Jawa Tengah" },
    { "id": 5, "name": "DI Yogyakarta" },
    { "id": 6, "name": "Jawa Timur" }
  ]
}
```

---

### 7. `GET /api/v1/provinces/:id/cities`

Mengembalikan daftar kota berdasarkan provinsi.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "province_id": 6,
      "name": "Kota Malang",
      "distance_km": 35,
      "fuel_consumption_motor": 50.0,
      "fuel_consumption_car": 17.0
    }
  ]
}
```

**Response 404:** Provinsi tidak ditemukan.

---

### 8. `POST /api/v1/budget/calculate`

Menghitung estimasi budget perjalanan.

**Request Body:**
```json
{
  "province_id": 6,
  "city_id": 42,
  "vehicle_type": "motor",
  "person_count": 2,
  "destination_ids": [1, 2, 3],
  "meal_budget": 50000,
  "souvenir_budget": 150000,
  "estimated_days": 1
}
```

**Validasi:**
- `vehicle_type`: harus `"motor"` atau `"mobil"`
- `person_count`: 1–10
- `destination_ids`: minimal 1 item
- `meal_budget`: salah satu dari `[25000, 50000, 100000]`
- `souvenir_budget`: salah satu dari `[0, 50000, 150000, 300000]`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transport_cost": 42000,
    "activity_cost": 90000,
    "meal_cost": 100000,
    "souvenir_cost": 300000,
    "total_estimate": 532000,
    "distance_km": 35
  }
}
```

**Response 400 (validasi gagal):**
```json
{
  "success": false,
  "error": "Jumlah orang harus antara 1 hingga 10",
  "code": 400
}
```

**Response 422 (koordinat tidak valid):**
```json
{
  "success": false,
  "error": "Koordinat destinasi tidak valid atau kosong",
  "code": 422
}
```


## Budget Calculation Formula

### Formula Detail

Formula kalkulasi budget diimplementasikan di `internal/service/budget_service.go`:

```go
// CalculateBudget menghitung estimasi biaya perjalanan berdasarkan input pengguna
// Parameter:
//   - req: BudgetRequest berisi semua input dari form frontend
// Return:
//   - *BudgetResponse: breakdown biaya per kategori
//   - error: jika data kota atau destinasi tidak ditemukan
func (s *BudgetService) CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error) {
    // 1. Ambil data kota (jarak + konsumsi BBM)
    city, err := s.cityRepo.FindByID(req.CityID)
    
    // 2. Harga BBM (Pertalite, dikonfigurasi via env atau konstanta)
    const fuelPricePerLiter = 10000 // Rp 10.000/liter (Pertalite 2024)
    
    // 3. Konsumsi BBM berdasarkan jenis kendaraan
    var fuelConsumption float64
    if req.VehicleType == "motor" {
        // Motor: 40-60 km/liter, rata-rata dari data kota
        fuelConsumption = city.FuelConsumptionMotor  // contoh: 50.0 km/liter
    } else {
        // Mobil: 10-18 km/liter, rata-rata dari data kota
        fuelConsumption = city.FuelConsumptionCar    // contoh: 17.0 km/liter
    }
    
    // 4. Biaya Transportasi (pulang-pergi × 2)
    // Formula: (jarak_km / konsumsi_bbm) × harga_bbm × 2 (PP)
    fuelNeeded := float64(city.DistanceKm) / fuelConsumption
    transportCost := int(fuelNeeded * fuelPricePerLiter * 2)
    
    // 5. Biaya Aktivitas
    // Formula: jumlah_orang × total_harga_tiket_semua_destinasi_dipilih
    destinations, err := s.destRepo.FindByIDs(req.DestinationIDs)
    totalTicketPrice := 0
    for _, dest := range destinations {
        totalTicketPrice += dest.TicketPrice
    }
    activityCost := req.PersonCount * totalTicketPrice
    
    // 6. Biaya Makan
    // Formula: jumlah_orang × anggaran_makan × estimasi_hari × 3 (3 kali makan)
    mealCost := req.PersonCount * req.MealBudget * req.EstimatedDays * 3
    
    // 7. Biaya Oleh-oleh
    // Formula: anggaran_oleh_oleh × jumlah_orang
    souvenirCost := req.SouvenirBudget * req.PersonCount
    
    // 8. Total Estimasi
    totalEstimate := transportCost + activityCost + mealCost + souvenirCost
    
    return &model.BudgetResponse{
        TransportCost: transportCost,
        ActivityCost:  activityCost,
        MealCost:      mealCost,
        SouvenirCost:  souvenirCost,
        TotalEstimate: totalEstimate,
        DistanceKm:    city.DistanceKm,
    }, nil
}
```

### Contoh Kalkulasi

Input: Kota Malang → Pujon Kidul, Motor, 2 orang, 3 destinasi (Cafe Sawah Rp10k + Petik Sayur Rp15k + Wangi Lestari Rp20k), Makan Rp50k, Oleh-oleh Rp150k, 1 hari

```
Jarak          : 35 km
Konsumsi motor : 50 km/liter
Harga BBM      : Rp 10.000/liter

Transport = (35 / 50) × 10.000 × 2 = 0.7 × 10.000 × 2 = Rp 14.000
Aktivitas = 2 × (10.000 + 15.000 + 20.000) = 2 × 45.000 = Rp 90.000
Makan     = 2 × 50.000 × 1 × 3 = Rp 300.000
Oleh-oleh = 150.000 × 2 = Rp 300.000
─────────────────────────────────────────
Total     = Rp 704.000
```

### Travel Tips Logic

```js
// src/features/budget/TravelTips.jsx
// Tips dihasilkan berdasarkan vehicleType dan personCount

const generateTips = (vehicleType, personCount) => {
  const tips = []
  
  // Tip 1: Selalu ada
  tips.push('Kunjungi di hari kerja untuk menghindari keramaian dan antrean panjang.')
  
  // Tip 2: Berdasarkan kendaraan
  if (vehicleType === 'motor') {
    tips.push('Gunakan motor matic untuk jalur dalam kawasan yang sempit dan menanjak.')
  } else {
    tips.push('Parkir mobil di area utama dan gunakan ojek lokal untuk keliling destinasi.')
  }
  
  // Tip 3: Berdasarkan jumlah orang
  if (personCount >= 4) {
    tips.push(`Dengan ${personCount} orang, pertimbangkan sewa minibus untuk efisiensi biaya transport.`)
  } else {
    tips.push('Bawa bekal makanan ringan dari rumah untuk menghemat biaya makan siang.')
  }
  
  // Tip 4: Selalu ada
  tips.push('Beli tiket destinasi secara bundling jika tersedia untuk mendapat diskon.')
  
  return tips.slice(0, 3) // Minimal 3 tips
}
```


## Leaflet Vanilla JS Integration Pattern

Leaflet digunakan sebagai vanilla JS (bukan react-leaflet) untuk menghindari dependency tambahan dan masalah SSR. Pattern menggunakan `useRef` untuk menyimpan instance map dan `useEffect` untuk lifecycle management.

### InteractiveMap Component Pattern

```jsx
// src/features/map/InteractiveMap.jsx
import { useEffect, useRef } from 'react'

// Komponen peta interaktif menggunakan Leaflet vanilla JS
// Menggunakan useRef untuk menyimpan instance map agar tidak re-render
// Props:
//   - destinations: array destinasi dengan latitude, longitude
//   - onMarkerClick: callback saat marker diklik, menerima objek destinasi
function InteractiveMap({ destinations, onMarkerClick }) {
  const mapContainerRef = useRef(null)  // ref ke DOM element container
  const mapInstanceRef = useRef(null)   // ref ke instance L.map
  const markersRef = useRef([])         // ref ke array marker aktif

  // Inisialisasi map saat komponen mount
  useEffect(() => {
    // Hindari inisialisasi ganda (React StrictMode)
    if (mapInstanceRef.current) return

    // Koordinat pusat kawasan Pujon Kidul
    const PUJON_KIDUL_CENTER = [-7.9285, 122.4012]
    const DEFAULT_ZOOM = 14

    // Inisialisasi Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: PUJON_KIDUL_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    // Tambahkan tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    // Cleanup saat komponen unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Hanya run sekali saat mount

  // Update marker saat data destinasi berubah
  useEffect(() => {
    if (!mapInstanceRef.current || !destinations.length) return

    // Hapus semua marker lama
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Tambahkan marker baru untuk setiap destinasi
    destinations.forEach(destination => {
      // Skip destinasi dengan koordinat tidak valid
      if (!destination.latitude || !destination.longitude) return

      // Custom icon marker
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                 <span class="text-xs font-bold">📍</span>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const marker = L.marker(
        [destination.latitude, destination.longitude],
        { icon: customIcon }
      )
        .addTo(mapInstanceRef.current)
        .on('click', () => onMarkerClick(destination))

      markersRef.current.push(marker)
    })
  }, [destinations, onMarkerClick])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-xl z-0"
      // Leaflet membutuhkan height eksplisit
    />
  )
}
```

### MapSidebar Component

```jsx
// src/features/map/MapSidebar.jsx
// Sidebar yang muncul saat marker diklik
// Props:
//   - destination: objek destinasi yang dipilih (null = tersembunyi)
//   - onClose: callback untuk menutup sidebar
//   - onViewDetail: callback navigasi ke halaman Wisata dengan card expanded
function MapSidebar({ destination, onClose, onViewDetail }) {
  if (!destination) return null

  return (
    <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-xl z-[1000] p-4">
      <button onClick={onClose} className="absolute top-2 right-2">✕</button>
      <h3 className="font-bold text-lg text-green-700">{destination.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{destination.short_description}</p>
      <div className="mt-2 space-y-1 text-sm">
        <p>🕐 {destination.opening_hours}</p>
        <p>🎫 Rp {destination.ticket_price.toLocaleString('id-ID')}</p>
        <p>⭐ {destination.rating}</p>
      </div>
      <button
        onClick={() => onViewDetail(destination.id)}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
      >
        Lihat Detail
      </button>
    </div>
  )
}
```

### PetaPage Integration

```jsx
// src/pages/PetaPage.jsx
function PetaPage() {
  const { destinations, selectedDestination, setSelectedDestination,
          isLoading, error, fetchDestinations } = useDestinationStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch hanya jika belum ada data (caching via Zustand)
    if (!destinations.length) fetchDestinations()
  }, [])

  const handleMarkerClick = (destination) => {
    // Single source of truth: hanya satu destinasi aktif
    setSelectedDestination(destination)
  }

  const handleViewDetail = (destinationId) => {
    // Navigasi ke halaman Wisata dengan state untuk expand card
    navigate('/wisata', { state: { expandedId: destinationId } })
  }

  if (isLoading) return <SkeletonLoader type="map" />
  if (error) return <ErrorRetry message="Gagal memuat data peta destinasi." onRetry={fetchDestinations} />

  return (
    <div className="relative">
      <InteractiveMap
        destinations={destinations}
        onMarkerClick={handleMarkerClick}
      />
      <MapSidebar
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onViewDetail={handleViewDetail}
      />
    </div>
  )
}
```


## Weather Proxy Pattern

Backend bertindak sebagai proxy untuk OpenWeatherMap API sehingga API key tidak pernah terekspos ke frontend.

### Data Flow

```
Frontend                    Backend                     OWM API
   │                           │                           │
   │  GET /api/v1/weather       │                           │
   │──────────────────────────►│                           │
   │                           │  GET api.openweathermap.org/data/2.5/weather
   │                           │  ?lat=-7.9285&lon=122.4012&appid=SECRET_KEY
   │                           │──────────────────────────►│
   │                           │                           │
   │                           │◄──────────────────────────│
   │                           │  Raw OWM Response         │
   │                           │                           │
   │◄──────────────────────────│                           │
   │  Transformed JSON         │                           │
   │  (tanpa API key)          │                           │
```

### Backend Implementation

```go
// internal/service/weather_service.go

// GetWeather mengambil data cuaca dari OpenWeatherMap API
// API key diambil dari environment variable, tidak pernah dikirim ke frontend
// Koordinat Pujon Kidul: lat=-7.9285, lon=122.4012
func (s *WeatherService) GetWeather() (*model.WeatherData, error) {
    apiKey := s.config.OWMAPIKey  // dari env: OWM_API_KEY
    url := fmt.Sprintf(
        "https://api.openweathermap.org/data/2.5/weather?lat=-7.9285&lon=122.4012&appid=%s&units=metric&lang=id",
        apiKey,
    )

    resp, err := http.Get(url)
    if err != nil {
        return nil, fmt.Errorf("gagal menghubungi OWM API: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("OWM API mengembalikan status %d", resp.StatusCode)
    }

    // Parse response OWM dan transform ke format internal
    var owmResp OWMResponse
    if err := json.NewDecoder(resp.Body).Decode(&owmResp); err != nil {
        return nil, fmt.Errorf("gagal parse response OWM: %w", err)
    }

    // Transform: hanya kirim data yang diperlukan, tanpa API key
    return &model.WeatherData{
        Temp:        owmResp.Main.Temp,
        FeelsLike:   owmResp.Main.FeelsLike,
        Condition:   owmResp.Weather[0].Main,
        Description: owmResp.Weather[0].Description,
        Icon:        owmResp.Weather[0].Icon,
        Humidity:    owmResp.Main.Humidity,
        WindSpeed:   owmResp.Wind.Speed,
    }, nil
}
```

### Frontend WeatherWidget

```jsx
// src/features/weather/WeatherWidget.jsx
// Widget cuaca menggunakan data dari weatherStore
// Tidak ada API key di frontend - semua melalui backend proxy
function WeatherWidget() {
  const { weather, isLoading, error, fetchWeather } = useWeatherStore()

  useEffect(() => {
    fetchWeather()
  }, [])

  if (isLoading) return <div className="animate-pulse h-16 bg-white/20 rounded-lg" />

  if (error) {
    return (
      <p className="text-white/70 text-sm">
        Data cuaca tidak tersedia saat ini
      </p>
    )
  }

  if (!weather) return null

  return (
    <div className="flex items-center gap-3 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        className="w-12 h-12"
      />
      <div>
        <p className="text-white font-bold text-2xl">{Math.round(weather.temp)}°C</p>
        <p className="text-white/80 text-sm capitalize">{weather.description}</p>
      </div>
    </div>
  )
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Berdasarkan analisis prework acceptance criteria, fitur ini memiliki beberapa komponen yang cocok untuk property-based testing, terutama pada:
- Formula kalkulasi budget (pure function dengan input bervariasi)
- Filter pencarian destinasi (pure function)
- Validasi input form
- State management (single active destination)

Library PBT yang digunakan:
- **Backend (Go)**: `github.com/leanovate/gopter` atau `pgregory.net/rapid`
- **Frontend (JS)**: `fast-check`

---

### Property 1: Budget calculation components sum to total

*For any* valid budget request (province, city, vehicle type, person count 1-10, at least 1 destination, valid meal and souvenir budgets), the sum of transport_cost + activity_cost + meal_cost + souvenir_cost SHALL equal total_estimate.

**Validates: Requirements 5.3**

---

### Property 2: Transport cost scales with distance

*For any* two cities A and B where distance(A) > distance(B), with all other inputs equal, the transport_cost for city A SHALL be greater than or equal to transport_cost for city B.

**Validates: Requirements 5.3**

---

### Property 3: Destination search filter correctness

*For any* non-empty search query and list of destinations, every destination card displayed SHALL have a name that contains the search query (case-insensitive), and no destination whose name does not contain the query SHALL be displayed.

**Validates: Requirements 3.3**

---

### Property 4: Card expand/collapse round-trip

*For any* DestinationCard in collapsed state, clicking it SHALL transition to expanded state, and clicking again SHALL return to collapsed state (round-trip invariant).

**Validates: Requirements 2.2, 2.4**

---

### Property 5: Single active destination on map

*For any* sequence of marker clicks on the interactive map, only the last clicked destination SHALL be in the selected state — no two destinations can be simultaneously selected.

**Validates: Requirements 6.5**

---

### Property 6: City dropdown filtered by province

*For any* selected province, every city displayed in the city dropdown SHALL have a province_id matching the selected province's id — no city from a different province SHALL appear.

**Validates: Requirements 5.2**

---

### Property 7: Budget form disabled when invalid

*For any* form state where person_count < 1 or person_count > 10, or where province/city/destination fields are empty, the "Hitung Budget" button SHALL be disabled.

**Validates: Requirements 5.7, 5.8**

---

### Property 8: Weather proxy does not expose API key

*For any* response from `GET /api/v1/weather`, the response body and all response headers SHALL NOT contain the OWM_API_KEY value stored in the backend environment.

**Validates: Requirements 8.7**

---

### Property 9: Invalid coordinates return HTTP 422

*For any* destination with null, empty, or out-of-range coordinates (latitude outside [-90,90] or longitude outside [-180,180]), the backend SHALL return HTTP 422 with a descriptive error message.

**Validates: Requirements 4.5**

---

### Property 10: Input validation returns HTTP 400

*For any* POST /api/v1/budget/calculate request with invalid input (person_count outside 1-10, invalid vehicle_type, empty destination_ids, invalid meal_budget or souvenir_budget values), the backend SHALL return HTTP 400 with a descriptive error message.

**Validates: Requirements 8.3**


## Error Handling

### Backend Error Handling

```go
// internal/middleware/error_handler.go

// GlobalErrorHandler menangkap semua panic dan error tak terduga
// Mencatat error ke log dan mengembalikan response HTTP 500 yang aman
// tanpa mengekspos detail internal ke client
func GlobalErrorHandler(c *fiber.Ctx, err error) error {
    code := fiber.StatusInternalServerError
    message := "Terjadi kesalahan internal server"

    // Tangani Fiber error (sudah memiliki kode HTTP)
    var e *fiber.Error
    if errors.As(err, &e) {
        code = e.Code
        message = e.Message
    }

    // Log error lengkap untuk debugging (tidak dikirim ke client)
    log.Printf("[ERROR] %s %s: %v", c.Method(), c.Path(), err)

    return c.Status(code).JSON(pkg.ErrorResponse(message, code))
}

// RecoveryMiddleware menangkap panic dan mengubahnya menjadi error 500
func RecoveryMiddleware() fiber.Handler {
    return recover.New(recover.Config{
        EnableStackTrace: false, // Jangan ekspos stack trace ke client
    })
}
```

### Error Response Matrix

| Kondisi | HTTP Code | Pesan |
|---------|-----------|-------|
| Input tidak valid | 400 | Pesan validasi spesifik per field |
| Resource tidak ditemukan | 404 | "Destinasi tidak ditemukan" |
| Koordinat tidak valid | 422 | "Koordinat destinasi tidak valid atau kosong" |
| OWM API gagal | 503 | "Data cuaca tidak tersedia saat ini" |
| Error internal | 500 | "Terjadi kesalahan internal server" |

### Frontend Error Handling

```jsx
// Pattern error handling di setiap custom hook

// src/hooks/useDestinations.js
const useDestinations = () => {
  const { destinations, isLoading, error, fetchDestinations } = useDestinationStore()

  useEffect(() => {
    // Fetch hanya jika belum ada data (caching)
    if (!destinations.length && !isLoading) {
      fetchDestinations()
    }
  }, [])

  return { destinations, isLoading, error, refetch: fetchDestinations }
}

// Komponen menampilkan error state dengan tombol retry
// Contoh di PetaPage:
if (error) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">
        Gagal memuat data peta destinasi. Silakan coba lagi.
      </p>
      <button
        onClick={fetchDestinations}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Coba Lagi
      </button>
    </div>
  )
}
```

### Frontend Validation

```js
// src/utils/budgetValidation.js

// Validasi form budget sebelum submit
// Return: { isValid: bool, errors: { fieldName: string } }
const validateBudgetForm = (formData) => {
  const errors = {}

  if (!formData.provinceId) errors.province = 'Pilih provinsi asal'
  if (!formData.cityId) errors.city = 'Pilih kota asal'
  if (!formData.destinationIds?.length) errors.destinations = 'Pilih minimal 1 destinasi'

  if (formData.personCount < 1 || formData.personCount > 10) {
    errors.personCount = 'Jumlah orang harus antara 1 hingga 10'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```


## Testing Strategy

### Dual Testing Approach

Strategi pengujian menggunakan dua pendekatan komplementer:
1. **Unit tests** — contoh spesifik, edge case, error condition
2. **Property-based tests** — properti universal di semua input valid

### Backend Testing (Go)

**Library:**
- Unit test: `testing` (stdlib) + `testify`
- Property-based test: `pgregory.net/rapid`
- Mock: `github.com/stretchr/testify/mock`

```go
// Contoh property test untuk budget calculation
// Feature: pujon-kidul-explore, Property 1: Budget components sum to total
func TestBudgetCalculation_ComponentsSumToTotal(t *testing.T) {
    rapid.Check(t, func(t *rapid.T) {
        // Generate input valid secara acak
        personCount := rapid.IntRange(1, 10).Draw(t, "person_count")
        distanceKm := rapid.IntRange(10, 1000).Draw(t, "distance_km")
        fuelConsumption := rapid.Float64Range(10.0, 60.0).Draw(t, "fuel_consumption")
        ticketPrice := rapid.IntRange(0, 100000).Draw(t, "ticket_price")
        mealBudget := rapid.SampledFrom([]int{25000, 50000, 100000}).Draw(t, "meal_budget")
        souvenirBudget := rapid.SampledFrom([]int{0, 50000, 150000, 300000}).Draw(t, "souvenir_budget")

        result := calculateBudget(distanceKm, fuelConsumption, personCount, ticketPrice, mealBudget, souvenirBudget, 1)

        // Property: komponen harus berjumlah sama dengan total
        expected := result.TransportCost + result.ActivityCost + result.MealCost + result.SouvenirCost
        if result.TotalEstimate != expected {
            t.Fatalf("total %d != sum of components %d", result.TotalEstimate, expected)
        }
    })
}

// Contoh unit test untuk validasi input
func TestBudgetHandler_InvalidPersonCount_Returns400(t *testing.T) {
    // Test person_count = 0 → HTTP 400
    // Test person_count = 11 → HTTP 400
    // Test person_count = 1 → HTTP 200
    // Test person_count = 10 → HTTP 200
}
```

**Test Coverage Target:**
- Service layer: ≥80% (terutama budget calculation)
- Handler layer: ≥70% (validasi input, error response)
- Repository layer: integration test dengan test database

### Frontend Testing (JavaScript)

**Library:**
- Unit/component test: `vitest` + `@testing-library/react`
- Property-based test: `fast-check`

```js
// Contoh property test untuk filter pencarian
// Feature: pujon-kidul-explore, Property 3: Destination search filter correctness
import fc from 'fast-check'
import { filterDestinations } from '../utils/filterDestinations'

test('search filter: semua hasil mengandung query', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1 }),           // query pencarian
      fc.array(fc.record({                    // daftar destinasi
        id: fc.integer(),
        name: fc.string({ minLength: 1 }),
      }), { minLength: 0, maxLength: 20 }),
      (query, destinations) => {
        const results = filterDestinations(destinations, query)
        // Semua hasil harus mengandung query (case-insensitive)
        return results.every(d =>
          d.name.toLowerCase().includes(query.toLowerCase())
        )
      }
    ),
    { numRuns: 100 }
  )
})

// Contoh property test untuk budget form validation
// Feature: pujon-kidul-explore, Property 7: Budget form disabled when invalid
test('form disabled ketika person_count di luar range 1-10', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc.integer({ max: 0 }),    // < 1
        fc.integer({ min: 11 })    // > 10
      ),
      (invalidCount) => {
        const { isValid } = validateBudgetForm({
          provinceId: 1,
          cityId: 1,
          destinationIds: [1],
          personCount: invalidCount,
          mealBudget: 50000,
          souvenirBudget: 0,
        })
        return isValid === false
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Tests

Dijalankan terhadap database test (PostgreSQL) dan backend yang berjalan:

| Test | Endpoint | Verifikasi |
|------|----------|-----------|
| Semua destinasi tersedia | GET /api/v1/destinations | ≥10 destinasi, field lengkap |
| Featured destinations | GET /api/v1/destinations/featured | Tepat 3 destinasi |
| Cities by province | GET /api/v1/provinces/6/cities | Kota Jawa Timur |
| Budget calculation | POST /api/v1/budget/calculate | Response valid, total = sum |
| Weather proxy | GET /api/v1/weather | Response tanpa API key |
| CORS headers | Semua endpoint | Header CORS ada |
| Cache-Control | GET /api/v1/destinations | Header Cache-Control ada |

### Smoke Tests

| Test | Verifikasi |
|------|-----------|
| Database schema | Semua 6 tabel ada dengan kolom yang benar |
| CORS middleware | Header `Access-Control-Allow-Origin` ada |
| Error handler | Panic tidak mengekspos stack trace |
| Env variables | Semua env var wajib terbaca saat startup |

### Test Configuration

```
Minimum iterations per property test: 100
Test database: PostgreSQL (separate dari production)
Mock: OWM API di-mock untuk unit test weather service
```

