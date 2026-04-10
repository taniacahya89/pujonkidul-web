# 🌿 Pujon Kidul Explore

Platform web wisata fullstack untuk eksplorasi destinasi, peta interaktif, dan kalkulator budget perjalanan ke kawasan **Pujon Kidul, Malang, Jawa Timur**.

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 (Vite), TailwindCSS, Zustand, Leaflet (vanilla JS), Chart.js |
| Backend | Go 1.21, Fiber v2, GORM |
| Database | PostgreSQL 15 |

## 📋 Prasyarat

- **Go** 1.21+
- **Node.js** 18+
- **PostgreSQL** 15+
- API key **OpenWeatherMap** (gratis di [openweathermap.org](https://openweathermap.org/api))

## 🗄️ Setup Database

```bash
# Buat database
psql -U postgres -c "CREATE DATABASE pujon_kidul_explore;"

# Jalankan migration + seed data
psql -U postgres -d pujon_kidul_explore -f backend/migrations/001_init.sql
```

## ⚙️ Setup Backend

```bash
cd backend

# Salin file konfigurasi
cp .env.example .env

# Edit .env sesuai konfigurasi lokal Anda
# Wajib: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, OWM_API_KEY

# Download dependencies
go mod download

# Jalankan server (port default: 8080)
go run cmd/main.go
```

## 🎨 Setup Frontend

```bash
cd frontend

# Salin file konfigurasi
cp .env.example .env

# Install dependencies
npm install

# Jalankan development server (port default: 5173)
npm run dev
```

Buka browser di `http://localhost:5173`

## 📡 API Endpoints

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/destinations` | Semua destinasi wisata |
| GET | `/destinations/featured` | 3 destinasi unggulan |
| GET | `/destinations/:id` | Detail satu destinasi |
| GET | `/weather` | Data cuaca Pujon Kidul (proxy OWM) |
| GET | `/routes` | Rute akses jalan |
| GET | `/provinces` | Daftar provinsi Jawa |
| GET | `/provinces/:id/cities` | Kota berdasarkan provinsi |
| POST | `/budget/calculate` | Kalkulasi budget perjalanan |

### Contoh Request Budget

```json
POST /api/v1/budget/calculate
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

## 🌟 Fitur

- **Beranda** — Hero section + widget cuaca real-time + 3 destinasi unggulan
- **Wisata** — 10 destinasi dengan card expandable (Chart.js + paket wisata)
- **Peta** — Leaflet vanilla JS + OpenStreetMap + marker interaktif
- **Budget** — Kalkulator biaya transport, aktivitas, makan, oleh-oleh
- **WebGIS** — Redirect ke platform ArcGIS eksternal

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=pujon_kidul_explore
PORT=8080
OWM_API_KEY=your_openweathermap_api_key
ALLOWED_ORIGINS=http://localhost:5173
BBM_PRICE=10000
PUJON_LAT=-7.9285
PUJON_LON=112.4012
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 📁 Struktur Proyek

```
pujon-kidul-explore/
├── backend/
│   ├── cmd/main.go              # Entry point
│   ├── config/config.go         # Konfigurasi
│   ├── internal/
│   │   ├── handler/             # HTTP layer
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Database layer
│   │   ├── model/               # Go structs
│   │   └── middleware/          # CORS, error handler
│   ├── pkg/
│   │   ├── database/            # Koneksi DB
│   │   └── response/            # Response helper
│   └── migrations/001_init.sql  # Schema + seed data
└── frontend/
    └── src/
        ├── pages/               # Halaman utama
        ├── features/            # Fitur domain
        ├── components/          # Komponen reusable
        ├── store/               # Zustand stores
        ├── services/            # API calls
        ├── hooks/               # Custom hooks
        └── utils/               # Helper functions
```
