# Implementation Plan: Pujon Kidul Explore

## Overview

Implementasi platform web wisata Pujon Kidul Explore secara fullstack. Backend Go Fiber + PostgreSQL menyediakan REST API berlapis (handler–service–repository), sementara frontend React 18 + Vite + TailwindCSS + Zustand mengonsumsi API tersebut. Setiap task dibangun secara inkremental sehingga tidak ada kode yang tergantung tanpa integrasi.

## Tasks

- [x] 1. Setup struktur proyek dan konfigurasi awal
  - Buat direktori `backend/` dan `frontend/` di root proyek
  - Inisialisasi Go module (`go mod init`) di `backend/`, tambahkan dependency: `github.com/gofiber/fiber/v2`, `gorm.io/gorm`, `gorm.io/driver/postgres`, `github.com/joho/godotenv`, `github.com/go-playground/validator/v10`
  - Buat `backend/.env.example` dengan variabel: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `OWM_API_KEY`, `ALLOWED_ORIGINS`
  - Inisialisasi project Vite React di `frontend/` (`npm create vite@latest`), install dependency: `axios`, `zustand`, `react-router-dom`, `chart.js`, `react-chartjs-2`, `leaflet`, `fast-check`
  - Buat `frontend/.env.example` dengan variabel: `VITE_API_BASE_URL`
  - Konfigurasi TailwindCSS di `frontend/tailwind.config.js` dan `postcss.config.js`
  - Buat `frontend/vite.config.js` dengan proxy `/api` ke backend untuk development
  - _Requirements: 11.1, 11.2, 11.6_

- [x] 2. Backend: konfigurasi, model, dan skema database
  - [x] 2.1 Buat `backend/config/config.go` — struct `Config` yang membaca semua env var via `os.Getenv`, dengan validasi bahwa variabel wajib tidak kosong
    - _Requirements: 8.6, 11.1_
  - [x] 2.2 Buat semua Go model struct di `backend/internal/model/`
    - `destination.go`: struct `Destination`, `DestinationDetail` dengan GORM tags dan JSON tags sesuai desain
    - `travel_package.go`: struct `TravelPackage`
    - `route.go`: struct `Route`
    - `province.go`: struct `Province`, `City`
    - `budget.go`: struct `BudgetRequest` dengan validate tags, `BudgetResponse`
    - `weather.go`: struct `WeatherData`, `OWMResponse` (untuk parsing response OWM)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  - [x] 2.3 Buat `backend/migrations/001_init.sql` — DDL lengkap semua 6 tabel dengan index, foreign key `ON DELETE CASCADE`, dan seluruh data seed (10 destinasi, detail + visitor_data JSONB, travel_packages, 5 rute, 6 provinsi, semua kota Jawa)
    - _Requirements: 9.1–9.8_
  - [x] 2.4 Buat `backend/pkg/database/database.go` — fungsi `Connect(cfg *config.Config) (*gorm.DB, error)` yang membuka koneksi PostgreSQL via GORM dan menjalankan auto-migrate atau eksekusi SQL migration
    - _Requirements: 9.7_

- [x] 3. Backend: helper, middleware, dan entry point
  - [x] 3.1 Buat `backend/pkg/response/response.go` — fungsi helper `SuccessResponse(data interface{}) fiber.Map` dan `ErrorResponse(message string, code int) fiber.Map`
    - _Requirements: 8.3_
  - [x] 3.2 Buat `backend/internal/middleware/cors.go` — CORS middleware Fiber yang membaca `ALLOWED_ORIGINS` dari config
    - _Requirements: 8.4_
  - [x] 3.3 Buat `backend/internal/middleware/error_handler.go` — `GlobalErrorHandler` dan `RecoveryMiddleware` yang menangkap panic, log error, dan kembalikan HTTP 500 tanpa detail internal
    - _Requirements: 8.5_
  - [x] 3.4 Buat `backend/cmd/main.go` — entry point yang: load config, connect DB, setup Fiber app dengan middleware, daftarkan semua route, jalankan server di port dari config
    - _Requirements: 8.1, 8.4, 8.5_

- [x] 4. Backend: repository layer
  - [x] 4.1 Buat `backend/internal/repository/destination_repo.go` — interface `DestinationRepository` dan implementasinya dengan method: `FindAll()`, `FindByID(id uint)`, `FindFeatured()`, `FindByIDs(ids []uint)`; query menggunakan GORM Preload untuk `Detail` dan `Packages`
    - _Requirements: 8.1, 3.1_
  - [x] 4.2 Buat `backend/internal/repository/route_repo.go` — interface `RouteRepository` dan implementasi `FindAll()`
    - _Requirements: 8.1_
  - [x] 4.3 Buat `backend/internal/repository/province_repo.go` — interface `ProvinceRepository` dan implementasi `FindAll()`, `FindByID(id uint)`, `FindCitiesByProvinceID(provinceID uint)`
    - _Requirements: 8.1, 5.2_
  - [x] 4.4 Buat `backend/internal/repository/budget_repo.go` — interface `BudgetRepository` dan implementasi `FindCityByID(id uint)`, `FindDestinationsByIDs(ids []uint)` untuk keperluan kalkulasi budget
    - _Requirements: 8.1, 5.3_

- [x] 5. Backend: service layer
  - [x] 5.1 Buat `backend/internal/service/destination_service.go` — interface `DestinationService` dan implementasi `GetAll()`, `GetByID(id uint)`, `GetFeatured()`; validasi koordinat (lat ∈ [-90,90], lon ∈ [-180,180]) dan kembalikan error jika tidak valid
    - _Requirements: 8.1, 4.5_
  - [x] 5.2 Buat `backend/internal/service/weather_service.go` — `GetWeather()` yang memanggil OWM API dengan API key dari config, parse `OWMResponse`, transform ke `WeatherData`; kembalikan error jika OWM gagal
    - _Requirements: 8.7, 1.2_
  - [x] 5.3 Buat `backend/internal/service/route_service.go` — `GetAll()` yang mendelegasikan ke repository
    - _Requirements: 8.1_
  - [x] 5.4 Buat `backend/internal/service/province_service.go` — `GetAll()`, `GetCitiesByProvinceID(id uint)` dengan validasi provinsi ada
    - _Requirements: 8.1, 5.2_
  - [x] 5.5 Buat `backend/internal/service/budget_service.go` — `CalculateBudget(req model.BudgetRequest) (*model.BudgetResponse, error)` dengan formula lengkap: transport (PP × jarak/konsumsi × harga BBM), aktivitas (orang × total tiket), makan (orang × budget × hari × 3), oleh-oleh (budget × orang), total = sum keempat komponen
    - _Requirements: 5.3, 5.4_
  - [ ]* 5.6 Tulis property test untuk `CalculateBudget` menggunakan `pgregory.net/rapid`
    - **Property 1: Budget calculation components sum to total**
    - **Validates: Requirements 5.3**
  - [ ]* 5.7 Tulis property test untuk transport cost scaling
    - **Property 2: Transport cost scales with distance**
    - **Validates: Requirements 5.3**

- [-] 6. Backend: handler layer dan routing
  - [x] 6.1 Buat `backend/internal/handler/destination_handler.go` — `GetAllDestinations`, `GetDestinationByID`, `GetFeaturedDestinations`; set header `Cache-Control: public, max-age=300` pada `GetAllDestinations`; kembalikan 404 jika tidak ditemukan, 422 jika koordinat tidak valid
    - _Requirements: 8.2, 8.3, 4.5, 6.10_
  - [x] 6.2 Buat `backend/internal/handler/weather_handler.go` — `GetWeather`; kembalikan 503 jika OWM gagal
    - _Requirements: 8.2, 1.2_
  - [x] 6.3 Buat `backend/internal/handler/route_handler.go` — `GetAllRoutes`
    - _Requirements: 8.2_
  - [x] 6.4 Buat `backend/internal/handler/province_handler.go` — `GetAllProvinces`, `GetCitiesByProvince`; kembalikan 404 jika provinsi tidak ditemukan
    - _Requirements: 8.2, 5.2_
  - [x] 6.5 Buat `backend/internal/handler/budget_handler.go` — `CalculateBudget`; parse dan validasi `BudgetRequest` menggunakan `go-playground/validator`, kembalikan 400 dengan pesan deskriptif untuk input tidak valid
    - _Requirements: 8.2, 8.3, 5.3_
  - [x] 6.6 Daftarkan semua 8 route di `cmd/main.go` di bawah prefix `/api/v1`:
    - `GET /destinations`, `GET /destinations/featured`, `GET /destinations/:id`
    - `GET /weather`
    - `GET /routes`
    - `GET /provinces`, `GET /provinces/:id/cities`
    - `POST /budget/calculate`
    - _Requirements: 8.2_
  - [ ]* 6.7 Tulis unit test untuk `BudgetHandler` — validasi input tidak valid mengembalikan HTTP 400
    - **Property 10: Input validation returns HTTP 400**
    - **Validates: Requirements 8.3**
  - [ ]* 6.8 Tulis unit test untuk `WeatherHandler` — response tidak mengandung nilai `OWM_API_KEY`
    - **Property 8: Weather proxy does not expose API key**
    - **Validates: Requirements 8.7**
  - [ ]* 6.9 Tulis unit test untuk `DestinationHandler` — koordinat tidak valid mengembalikan HTTP 422
    - **Property 9: Invalid coordinates return HTTP 422**
    - **Validates: Requirements 4.5**

- [x] 7. Checkpoint backend — pastikan semua test lulus
  - Pastikan semua test lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 8. Frontend: setup routing, layout, dan komponen dasar
  - [x] 8.1 Buat `frontend/src/main.jsx` dan `frontend/src/App.jsx` — setup `BrowserRouter` dengan route: `/` (HomePage), `/wisata` (WisataPage), `/peta` (PetaPage), `/budget` (BudgetPage), `/webgis` (WebGISPage)
    - _Requirements: 11.2_
  - [x] 8.2 Buat `frontend/src/components/Navbar.jsx` — navigasi utama dengan link ke semua halaman, aktif state berdasarkan route saat ini; komentar Bahasa Indonesia
    - _Requirements: 11.2, 11.4_
  - [x] 8.3 Buat `frontend/src/components/Footer.jsx` — footer sederhana dengan informasi aplikasi
    - _Requirements: 11.2_
  - [x] 8.4 Buat `frontend/src/components/SkeletonLoader.jsx` — komponen skeleton loading yang mendukung prop `type` (`card`, `map`, `list`) untuk berbagai konteks loading
    - _Requirements: 10.3_
  - [x] 8.5 Buat `frontend/src/components/RouteCard.jsx` — card informasi kondisi akses jalan; prop `route` dengan badge status berwarna (baik=hijau, sedang=kuning, rusak=merah)
    - _Requirements: 6.1_
  - [x] 8.6 Buat `frontend/src/utils/formatCurrency.js`, `formatDate.js`, `constants.js` — helper format Rupiah, format tanggal Indonesia, dan konstanta app (harga BBM, dll.)
    - _Requirements: 11.2_

- [-] 9. Frontend: service layer dan Axios instance
  - [x] 9.1 Buat `frontend/src/services/api.js` — Axios instance dengan `baseURL` dari `import.meta.env.VITE_API_BASE_URL`, interceptor untuk error handling global
    - _Requirements: 10.5_
  - [x] 9.2 Buat `frontend/src/services/destinationService.js` — fungsi `fetchAllDestinations()`, `fetchDestinationById(id)`, `fetchFeaturedDestinations()`
    - _Requirements: 10.5_
  - [x] 9.3 Buat `frontend/src/services/weatherService.js` — fungsi `fetchWeather()`
    - _Requirements: 10.5_
  - [x] 9.4 Buat `frontend/src/services/budgetService.js` — fungsi `fetchProvinces()`, `fetchCitiesByProvince(provinceId)`, `calculateBudget(payload)`
    - _Requirements: 10.5_
  - [x] 9.5 Buat `frontend/src/services/routeService.js` — fungsi `fetchRoutes()`
    - _Requirements: 10.5_

- [-] 10. Frontend: Zustand store (4 slice)
  - [x] 10.1 Buat `frontend/src/store/destinationStore.js` — Zustand store dengan state: `destinations`, `featuredDestinations`, `selectedDestination`, `isLoading`, `error`, `searchQuery`; actions: `fetchDestinations`, `fetchFeatured`, `setSelectedDestination`, `setSearchQuery`; computed getter `filteredDestinations` yang filter berdasarkan `searchQuery` (case-insensitive)
    - _Requirements: 10.1, 10.2, 3.3, 3.4_
  - [x] 10.2 Buat `frontend/src/store/weatherStore.js` — state: `weather`, `isLoading`, `error`; action: `fetchWeather`
    - _Requirements: 10.1_
  - [x] 10.3 Buat `frontend/src/store/budgetStore.js` — state: `provinces`, `cities`, `result`, `isLoading`, `error`; actions: `fetchProvinces`, `fetchCities(provinceId)`, `calculateBudget(request)`, `resetResult`
    - _Requirements: 10.1, 5.2_
  - [x] 10.4 Buat `frontend/src/store/routeStore.js` — state: `routes`, `isLoading`, `error`; action: `fetchRoutes`
    - _Requirements: 10.1_
  - [ ]* 10.5 Tulis property test untuk `filteredDestinations` menggunakan `fast-check`
    - **Property 3: Destination search filter correctness**
    - **Validates: Requirements 3.3**
  - [ ]* 10.6 Tulis property test untuk city dropdown filtering
    - **Property 6: City dropdown filtered by province**
    - **Validates: Requirements 5.2**

- [-] 11. Frontend: custom hooks
  - [x] 11.1 Buat `frontend/src/hooks/useDestinations.js` — enkapsulasi fetch destinasi dari store; fetch hanya jika `destinations` kosong dan tidak sedang loading (caching)
    - _Requirements: 10.4, 10.2_
  - [x] 11.2 Buat `frontend/src/hooks/useWeather.js` — enkapsulasi fetch cuaca dari store
    - _Requirements: 10.4_
  - [x] 11.3 Buat `frontend/src/hooks/useBudget.js` — enkapsulasi fetch provinsi, fetch kota (dipanggil saat provinsi berubah), dan kalkulasi budget
    - _Requirements: 10.4_
  - [x] 11.4 Buat `frontend/src/hooks/useRoutes.js` — enkapsulasi fetch rute dari store
    - _Requirements: 10.4_

- [x] 12. Frontend: fitur Destination Card dan Visitor Chart
  - [x] 12.1 Buat `frontend/src/features/destination/VisitorChart.jsx` — bar chart Chart.js dengan prop `visitorData` (array `{month, count}`); label bulan Bahasa Indonesia; warna hijau sesuai tema wisata alam
    - _Requirements: 2.5_
  - [x] 12.2 Buat `frontend/src/features/destination/TravelPackageList.jsx` — daftar paket wisata dengan prop `packages`; tampilkan nama, harga (format Rupiah), durasi, dan fasilitas
    - _Requirements: 2.3_
  - [x] 12.3 Buat `frontend/src/features/destination/DestinationCard.jsx` — card dengan mode collapsed/expanded; collapsed: nama, short_description (maks 150 karakter), jam buka, harga tiket; expanded: deskripsi lengkap, gambar placeholder dengan komentar `{/* Ganti gambar di sini */}`, akses kendaraan, parkir, waktu terbaik, `VisitorChart`, `TravelPackageList`; animasi transisi halus; desain playful warna cerah
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  - [ ]* 12.4 Tulis property test untuk card expand/collapse round-trip menggunakan `fast-check` + `@testing-library/react`
    - **Property 4: Card expand/collapse round-trip**
    - **Validates: Requirements 2.2, 2.4**

- [-] 13. Frontend: fitur Weather Widget
  - [x] 13.1 Buat `frontend/src/features/weather/WeatherWidget.jsx` — widget cuaca menggunakan `weatherStore`; tampilkan suhu, kondisi, ikon OWM; loading state: skeleton pulse; error state: teks "Data cuaca tidak tersedia saat ini"; tidak ada API key di frontend
    - _Requirements: 1.3, 1.4, 8.7_

- [-] 14. Frontend: halaman Beranda (HomePage)
  - [x] 14.1 Buat `frontend/src/pages/HomePage.jsx` — section hero dengan judul, deskripsi kawasan Pujon Kidul, `WeatherWidget`, dan tombol CTA "Rencanakan Wisata" yang navigate ke `/budget`; section featured destinations dengan 3 `DestinationCard` dari `featuredDestinations` store; gunakan `useDestinations` hook untuk fetch featured
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [-] 15. Frontend: halaman Wisata (WisataPage)
  - [x] 15.1 Buat `frontend/src/pages/WisataPage.jsx` — grid layout semua 10 destinasi menggunakan `DestinationCard`; input pencarian real-time yang memanggil `setSearchQuery` di store; pesan "Destinasi tidak ditemukan" jika `filteredDestinations` kosong; baca `state.expandedId` dari `useLocation` untuk expand card tertentu saat navigasi dari peta; skeleton loader saat loading
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.4_

- [-] 16. Frontend: fitur Peta Interaktif
  - [x] 16.1 Buat `frontend/src/features/map/InteractiveMap.jsx` — wrapper Leaflet vanilla JS menggunakan `useRef` (mapContainerRef, mapInstanceRef, markersRef) dan `useEffect`; inisialisasi `L.map` dengan center Pujon Kidul dan tile OpenStreetMap; update marker saat `destinations` berubah; custom `L.divIcon` untuk marker; skip destinasi dengan koordinat tidak valid; cleanup `map.remove()` saat unmount
    - _Requirements: 4.1, 4.2, 4.5, 4.6_
  - [x] 16.2 Buat `frontend/src/features/map/MapSidebar.jsx` — sidebar absolut yang muncul saat marker diklik; tampilkan nama, short_description, jam buka, harga tiket (format Rupiah), rating, tombol "Lihat Detail"; tombol tutup (✕); return null jika `destination` prop null
    - _Requirements: 4.3, 4.4_
  - [ ]* 16.3 Tulis property test untuk single active destination
    - **Property 5: Single active destination on map**
    - **Validates: Requirements 6.5**

- [-] 17. Frontend: halaman Peta (PetaPage)
  - [x] 17.1 Buat `frontend/src/pages/PetaPage.jsx` — integrasikan `InteractiveMap` dan `MapSidebar`; gunakan `destinationStore` untuk `destinations`, `selectedDestination`, `setSelectedDestination`; fetch destinasi hanya jika belum ada (caching); loading state: `SkeletonLoader type="map"`; error state: pesan "Gagal memuat data peta destinasi. Silakan coba lagi." dengan tombol "Coba Lagi"; `handleViewDetail` navigate ke `/wisata` dengan `state: { expandedId }`; `handleMarkerClick` set single selected destination
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 6.1–6.9_

- [-] 18. Frontend: fitur Budget Calculator
  - [x] 18.1 Buat `frontend/src/utils/budgetValidation.js` — fungsi `validateBudgetForm(formData)` yang return `{ isValid, errors }`; validasi: provinceId wajib, cityId wajib, destinationIds minimal 1, personCount 1–10
    - _Requirements: 5.7, 5.8_
  - [x] 18.2 Buat `frontend/src/features/budget/BudgetForm.jsx` — form dengan semua field sesuai desain: dropdown Provinsi, dropdown Kota (dependent, diisi saat provinsi dipilih), radio jenis kendaraan (motor/mobil), input jumlah orang (1–10), multi-select destinasi, radio anggaran makan, radio anggaran oleh-oleh; validasi real-time dengan `validateBudgetForm`; tombol "Hitung Budget" disabled jika form tidak valid; pesan validasi per field
    - _Requirements: 5.1, 5.2, 5.7, 5.8_
  - [x] 18.3 Buat `frontend/src/features/budget/BudgetResult.jsx` — tampilan breakdown biaya: Transport, Aktivitas, Makan, Oleh-oleh, Total Estimasi; semua nilai format Rupiah; tampilkan jarak tempuh
    - _Requirements: 5.4_
  - [x] 18.4 Buat `frontend/src/features/budget/TravelTips.jsx` — generate minimal 3 tips berdasarkan `vehicleType` dan `personCount` sesuai logika di desain; tampilkan sebagai list
    - _Requirements: 5.5_
  - [x] 18.5 Buat `frontend/src/pages/BudgetPage.jsx` — integrasikan `BudgetForm`, `BudgetResult`, `TravelTips`; gunakan `useBudget` hook; fetch provinsi saat mount; fetch kota saat provinsi berubah; tampilkan `BudgetResult` dan `TravelTips` setelah kalkulasi selesai; tampilkan rekomendasi waktu terbaik berkunjung dari data destinasi yang dipilih
    - _Requirements: 5.1–5.8_
  - [ ]* 18.6 Tulis property test untuk budget form validation menggunakan `fast-check`
    - **Property 7: Budget form disabled when invalid**
    - **Validates: Requirements 5.7, 5.8**

- [-] 19. Frontend: halaman WebGIS (WebGISPage)
  - [x] 19.1 Buat `frontend/src/pages/WebGISPage.jsx` — halaman informasi singkat WebGIS Pujon Kidul; peringatan bahwa pengguna akan diarahkan ke situs eksternal; tombol "Buka WebGIS" yang membuka `https://www.arcgis.com/apps/instant/basic/index.html?appid=647f2b41fe55407d88c40f6b7afc0660` dengan `target="_blank" rel="noopener noreferrer"`
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 20. Checkpoint frontend — pastikan semua test lulus
  - Pastikan semua test lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 21. Dokumentasi dan file konfigurasi
  - [x] 21.1 Buat `README.md` di root proyek dengan instruksi lengkap: prasyarat (Go 1.21+, Node 18+, PostgreSQL 15), cara setup database (jalankan `001_init.sql`), cara menjalankan backend (`go run cmd/main.go`), cara menjalankan frontend (`npm run dev`), daftar semua endpoint API dengan contoh request/response singkat
    - _Requirements: 11.5_
  - [x] 21.2 Lengkapi `backend/.env.example` dan `frontend/.env.example` dengan semua variabel yang dibutuhkan beserta contoh nilai dan komentar penjelasan
    - _Requirements: 11.6_

- [x] 22. Final checkpoint — integrasi end-to-end
  - Pastikan backend dan frontend dapat berkomunikasi (CORS terkonfigurasi, base URL benar), semua 8 endpoint merespons dengan benar, semua halaman frontend merender tanpa error, semua test lulus. Tanyakan kepada user jika ada pertanyaan.

## Notes

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Leaflet digunakan sebagai vanilla JS (bukan react-leaflet) — selalu gunakan `useRef` + `useEffect`
- API key OWM **tidak pernah** dikirim ke frontend — selalu melalui backend proxy
- Zustand store berfungsi sebagai cache: fetch hanya jika data belum ada di store
- Property test backend menggunakan `pgregory.net/rapid`, frontend menggunakan `fast-check`
