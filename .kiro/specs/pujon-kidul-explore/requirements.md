# Requirements Document

## Introduction

Pujon Kidul Explore adalah platform web wisata fullstack production-ready yang memungkinkan pengguna menjelajahi destinasi wisata di kawasan Pujon Kidul, Malang. Platform ini menyediakan informasi destinasi lengkap dengan tampilan card expandable, peta interaktif berbasis Leaflet, kalkulator budget perjalanan, informasi akses jalan, serta integrasi cuaca real-time. Sistem dibangun dengan frontend React 18 (Vite) + TailwindCSS + Zustand dan backend Go (Fiber) + PostgreSQL, mengikuti arsitektur berlapis handler–service–repository.

## Glossary

- **System**: Aplikasi web Pujon Kidul Explore secara keseluruhan
- **Frontend**: Aplikasi React 18 yang berjalan di browser pengguna
- **Backend**: Server Go Fiber yang menyediakan REST API
- **Database**: PostgreSQL yang menyimpan seluruh data persisten
- **Destination_Card**: Komponen UI yang menampilkan informasi destinasi dalam mode collapsed dan expanded
- **Budget_Calculator**: Fitur yang menghitung estimasi biaya perjalanan berdasarkan input pengguna
- **Interactive_Map**: Peta berbasis Leaflet + OpenStreetMap dengan marker destinasi
- **Weather_Proxy**: Endpoint backend yang meneruskan permintaan ke OpenWeatherMap API
- **Route_Status**: Informasi kondisi akses jalan menuju destinasi beserta timestamp pembaruan
- **Visitor_Chart**: Grafik Chart.js yang menampilkan data kunjungan per destinasi
- **Travel_Package**: Paket wisata yang tersedia untuk setiap destinasi
- **Province**: Data provinsi untuk keperluan kalkulator budget
- **City**: Data kota yang bergantung pada provinsi yang dipilih
- **Zustand_Store**: State management global di sisi frontend

---

## Requirements

### Requirement 1: Halaman Beranda

**User Story:** Sebagai pengunjung, saya ingin melihat halaman beranda yang menarik dengan informasi cuaca, destinasi unggulan, dan ajakan bertindak, sehingga saya mendapatkan gambaran awal tentang wisata Pujon Kidul.

#### Acceptance Criteria

1. THE Frontend SHALL menampilkan section hero dengan judul, deskripsi singkat kawasan Pujon Kidul, dan tombol CTA "Rencanakan Wisata" yang mengarahkan ke halaman Budget Calculator.
2. WHEN halaman beranda dimuat, THE Weather_Proxy SHALL mengambil data cuaca terkini dari OpenWeatherMap API menggunakan koordinat Pujon Kidul dan mengembalikannya ke Frontend dalam format JSON.
3. WHEN data cuaca berhasil diterima, THE Frontend SHALL menampilkan suhu, kondisi cuaca, dan ikon cuaca di section hero.
4. IF permintaan data cuaca gagal, THEN THE Frontend SHALL menampilkan pesan "Data cuaca tidak tersedia saat ini" tanpa mengganggu tampilan konten lainnya.
5. THE Frontend SHALL menampilkan tepat 3 destinasi unggulan dalam bentuk Destination_Card pada section featured destinations.
6. WHEN pengguna mengklik tombol CTA "Rencanakan Wisata", THE Frontend SHALL menavigasi pengguna ke halaman Budget Calculator.

---

### Requirement 2: Destination Card (Collapsed & Expanded)

**User Story:** Sebagai pengunjung, saya ingin melihat informasi destinasi dalam card yang bisa diperluas, sehingga saya dapat melihat ringkasan dulu dan detail lengkap saat dibutuhkan.

#### Acceptance Criteria

1. THE Destination_Card SHALL menampilkan mode collapsed secara default dengan informasi: nama destinasi, deskripsi singkat (maksimal 150 karakter), jam buka, dan harga tiket masuk.
2. WHEN pengguna mengklik Destination_Card dalam mode collapsed, THE Frontend SHALL mengubah card ke mode expanded dengan animasi transisi yang halus.
3. WHILE Destination_Card dalam mode expanded, THE Frontend SHALL menampilkan: deskripsi lengkap, gambar placeholder berukuran besar dengan komentar kode "Ganti gambar di sini", informasi akses kendaraan, ketersediaan parkir, waktu terbaik berkunjung, Visitor_Chart, dan daftar Travel_Package.
4. WHEN pengguna mengklik Destination_Card yang sedang expanded, THE Frontend SHALL mengembalikan card ke mode collapsed.
5. THE Visitor_Chart SHALL menampilkan data kunjungan bulanan dalam bentuk bar chart menggunakan Chart.js dengan label bulan dalam Bahasa Indonesia.
6. IF data Visitor_Chart tidak tersedia, THEN THE Frontend SHALL menampilkan pesan "Data pengunjung belum tersedia" di area chart.
7. THE Destination_Card SHALL menggunakan desain playful dengan warna-warna cerah sesuai tema wisata alam.

---

### Requirement 3: Halaman Wisata (Semua Destinasi)

**User Story:** Sebagai pengunjung, saya ingin melihat semua destinasi wisata yang tersedia, sehingga saya dapat memilih destinasi yang ingin dikunjungi.

#### Acceptance Criteria

1. WHEN pengguna mengakses halaman Wisata, THE Backend SHALL mengembalikan daftar semua destinasi (minimal 10 destinasi) dari tabel `destinations` beserta data terkait dari tabel `destination_details`.
2. THE Frontend SHALL menampilkan semua destinasi dalam grid layout menggunakan Destination_Card dengan perilaku collapsed/expanded yang identik dengan halaman Beranda.
3. THE Frontend SHALL menyediakan fitur pencarian destinasi berdasarkan nama yang memfilter card secara real-time tanpa memanggil ulang API.
4. WHEN daftar destinasi berhasil dimuat, THE Zustand_Store SHALL menyimpan data destinasi sehingga tidak perlu fetch ulang saat pengguna berpindah halaman dan kembali.
5. IF tidak ada destinasi yang cocok dengan kata kunci pencarian, THEN THE Frontend SHALL menampilkan pesan "Destinasi tidak ditemukan".

---

### Requirement 4: Peta Interaktif

**User Story:** Sebagai pengunjung, saya ingin melihat lokasi semua destinasi pada peta interaktif, sehingga saya dapat memahami tata letak geografis kawasan wisata.

#### Acceptance Criteria

1. WHEN pengguna mengakses halaman Peta, THE Frontend SHALL menginisialisasi Interactive_Map menggunakan Leaflet (vanilla JS, bukan react-leaflet) dengan tile layer OpenStreetMap yang terpusat pada koordinat kawasan Pujon Kidul.
2. THE Interactive_Map SHALL menampilkan marker untuk setiap destinasi yang diambil dari Backend berdasarkan data koordinat latitude dan longitude di tabel `destinations`.
3. WHEN pengguna mengklik marker destinasi pada Interactive_Map, THE Frontend SHALL menampilkan sidebar informasi yang berisi nama, deskripsi singkat, jam buka, harga tiket, dan tombol "Lihat Detail".
4. WHEN pengguna mengklik tombol "Lihat Detail" pada sidebar peta, THE Frontend SHALL menavigasi pengguna ke halaman Wisata dengan card destinasi yang bersangkutan dalam keadaan expanded.
5. IF data koordinat destinasi tidak valid atau kosong, THEN THE Backend SHALL mengembalikan error dengan kode HTTP 422 dan pesan deskriptif, dan THE Frontend SHALL melewati destinasi tersebut tanpa menampilkan marker.
6. THE Interactive_Map SHALL mendukung zoom in/out dan drag untuk navigasi peta.

---

### Requirement 5: Kalkulator Budget Perjalanan

**User Story:** Sebagai calon wisatawan, saya ingin menghitung estimasi biaya perjalanan ke Pujon Kidul, sehingga saya dapat merencanakan anggaran dengan lebih baik.

#### Acceptance Criteria

1. THE Budget_Calculator SHALL menyediakan form input dengan field: Provinsi asal (dropdown), Kota asal (dropdown dependent pada Provinsi), Jenis kendaraan (motor/mobil), Jumlah orang (input angka 1–10), Destinasi yang akan dikunjungi (multi-select), Anggaran makan per orang (pilihan: Rp 25.000 / Rp 50.000 / Rp 100.000), dan Anggaran oleh-oleh (pilihan: Rp 0 / Rp 50.000 / Rp 150.000 / Rp 300.000).
2. WHEN pengguna memilih Provinsi, THE Frontend SHALL memuat daftar Kota yang sesuai dari Backend berdasarkan relasi tabel `provinces` dan `cities` tanpa me-reload halaman.
3. WHEN pengguna mengklik tombol "Hitung Budget", THE Backend SHALL menghitung estimasi biaya dengan formula: biaya transportasi = (jarak km / konsumsi BBM) × harga BBM per liter, biaya aktivitas = jumlah orang × total harga tiket destinasi yang dipilih, biaya makan = jumlah orang × anggaran makan × estimasi hari, biaya oleh-oleh = anggaran oleh-oleh × jumlah orang.
4. WHEN kalkulasi selesai, THE Frontend SHALL menampilkan breakdown biaya dalam kategori: Transport, Aktivitas, Makan, Oleh-oleh, dan Total Estimasi.
5. THE Frontend SHALL menampilkan minimal 3 tips hemat perjalanan yang relevan berdasarkan jenis kendaraan dan jumlah orang yang dipilih.
6. THE Frontend SHALL menampilkan rekomendasi waktu terbaik berkunjung berdasarkan data dari Backend.
7. IF jumlah orang yang diinput melebihi 10 atau kurang dari 1, THEN THE Frontend SHALL menampilkan pesan validasi "Jumlah orang harus antara 1 hingga 10" dan menonaktifkan tombol "Hitung Budget".
8. IF pengguna belum memilih Provinsi, Kota, atau Destinasi, THEN THE Frontend SHALL menampilkan pesan validasi pada field yang kosong dan menonaktifkan tombol "Hitung Budget".

---

### Requirement 6: Informasi Akses Jalan

**User Story:** Sebagai calon wisatawan, saya ingin mengetahui kondisi akses jalan menuju destinasi, sehingga saya dapat mempersiapkan perjalanan dengan tepat.

#### Acceptance Criteria

1. WHEN pengguna mengakses halaman Akses Jalan, THE Backend SHALL mengembalikan data 5 rute akses jalan dari tabel `routes` beserta status kondisi (Lancar / Hati-hati / Macet) dan timestamp pembaruan terakhir.
2. THE Frontend SHALL menampilkan setiap rute dalam card yang memuat: nama rute, deskripsi jalur, status kondisi dengan indikator warna (hijau/kuning/merah), dan timestamp pembaruan dalam format "DD MMMM YYYY, HH:mm WIB".
3. WHEN pengguna mengklik tombol "Refresh", THE Frontend SHALL memanggil ulang endpoint Backend untuk mendapatkan data rute terbaru dan memperbarui tampilan tanpa me-reload halaman.
4. THE Backend SHALL menyertakan header `Last-Modified` pada response endpoint rute untuk mendukung caching di sisi Frontend.
5. IF permintaan data rute gagal, THEN THE Frontend SHALL menampilkan pesan "Gagal memuat data akses jalan. Silakan coba lagi." beserta tombol "Coba Lagi".

---

### Requirement 7: Halaman WebGIS

**User Story:** Sebagai pengguna yang ingin analisis spasial lebih mendalam, saya ingin diarahkan ke platform WebGIS eksternal, sehingga saya dapat mengakses data geospasial kawasan Pujon Kidul.

#### Acceptance Criteria

1. WHEN pengguna mengakses halaman WebGIS, THE Frontend SHALL menampilkan halaman informasi singkat tentang WebGIS Pujon Kidul beserta tombol "Buka WebGIS".
2. WHEN pengguna mengklik tombol "Buka WebGIS", THE Frontend SHALL membuka URL eksternal WebGIS pada tab browser baru menggunakan `target="_blank"` dengan atribut `rel="noopener noreferrer"`.
3. THE Frontend SHALL menampilkan peringatan singkat bahwa pengguna akan diarahkan ke situs eksternal sebelum tombol diklik.

---

### Requirement 8: Backend REST API

**User Story:** Sebagai sistem, saya membutuhkan REST API yang terstruktur dan aman untuk melayani semua kebutuhan data Frontend, sehingga aplikasi dapat berjalan dengan andal.

#### Acceptance Criteria

1. THE Backend SHALL mengimplementasikan arsitektur berlapis dengan pemisahan: handler (HTTP layer di `internal/handler/`), service (business logic di `internal/service/`), dan repository (database di `internal/repository/`).
2. THE Backend SHALL menyediakan endpoint berikut:
   - `GET /api/v1/destinations` — daftar semua destinasi
   - `GET /api/v1/destinations/:id` — detail satu destinasi
   - `GET /api/v1/destinations/featured` — 3 destinasi unggulan
   - `GET /api/v1/weather` — data cuaca via Weather_Proxy
   - `GET /api/v1/routes` — daftar rute akses jalan
   - `GET /api/v1/provinces` — daftar provinsi
   - `GET /api/v1/provinces/:id/cities` — daftar kota berdasarkan provinsi
   - `POST /api/v1/budget/calculate` — kalkulasi budget perjalanan
3. THE Backend SHALL memvalidasi semua input request menggunakan library validasi Go dan mengembalikan error HTTP 400 dengan pesan deskriptif untuk input yang tidak valid.
4. THE Backend SHALL mengimplementasikan middleware CORS untuk mengizinkan request dari domain Frontend yang dikonfigurasi melalui environment variable.
5. THE Backend SHALL mengimplementasikan middleware global error handler yang menangkap semua panic dan error tak terduga, mencatatnya ke log, dan mengembalikan response HTTP 500 yang aman tanpa mengekspos detail internal.
6. THE Backend SHALL membaca semua konfigurasi sensitif (database URL, API key OpenWeatherMap, port, allowed origins) dari file `.env` melalui environment variable, bukan dari hardcode dalam kode.
7. WHEN Backend menerima request ke `GET /api/v1/weather`, THE Weather_Proxy SHALL meneruskan permintaan ke OpenWeatherMap API menggunakan API key yang tersimpan di environment variable Backend, sehingga API key tidak pernah terekspos ke Frontend.

---

### Requirement 9: Skema Database

**User Story:** Sebagai sistem, saya membutuhkan skema database yang terstruktur dengan relasi yang benar, sehingga semua data dapat disimpan dan diambil secara konsisten.

#### Acceptance Criteria

1. THE Database SHALL mengimplementasikan tabel `destinations` dengan kolom: id (PK), name, short_description, full_description, opening_hours, ticket_price, latitude, longitude, best_time, parking_available, vehicle_access, is_featured, created_at, updated_at.
2. THE Database SHALL mengimplementasikan tabel `destination_details` dengan foreign key ke `destinations.id` yang menyimpan data tambahan: visitor_data (JSON array data kunjungan bulanan), image_url.
3. THE Database SHALL mengimplementasikan tabel `travel_packages` dengan foreign key ke `destinations.id` yang menyimpan: name, description, price, duration, includes.
4. THE Database SHALL mengimplementasikan tabel `routes` dengan kolom: id (PK), name, description, status, last_updated.
5. THE Database SHALL mengimplementasikan tabel `provinces` dengan kolom: id (PK), name.
6. THE Database SHALL mengimplementasikan tabel `cities` dengan foreign key ke `provinces.id` yang menyimpan: id (PK), province_id (FK), name, distance_km, fuel_consumption_motor, fuel_consumption_car.
7. THE Database SHALL menggunakan foreign key constraint dengan `ON DELETE CASCADE` pada semua relasi child-to-parent untuk menjaga integritas referensial.
8. THE Database SHALL menyertakan data seed awal minimal 10 destinasi, 5 rute, data provinsi dan kota utama di Jawa Timur.

---

### Requirement 10: State Management Frontend

**User Story:** Sebagai sistem Frontend, saya membutuhkan state management yang bersih dan efisien, sehingga data tidak perlu di-fetch berulang kali dan UI tetap responsif.

#### Acceptance Criteria

1. THE Zustand_Store SHALL diorganisasikan dalam slice terpisah untuk setiap domain: destinationStore, weatherStore, budgetStore, routeStore.
2. WHEN data destinasi berhasil dimuat dari Backend, THE Zustand_Store SHALL menyimpan data tersebut sehingga navigasi antar halaman tidak memicu fetch ulang selama sesi yang sama.
3. THE Frontend SHALL mengimplementasikan loading state dan error state pada setiap operasi fetch API, menampilkan skeleton loader saat data sedang dimuat.
4. THE Frontend SHALL menggunakan custom hooks di `src/hooks/` untuk mengenkapsulasi logika fetch dan state management, sehingga komponen UI tetap bersih dari logika bisnis.
5. THE Frontend SHALL mengimplementasikan service layer di `src/services/` yang memusatkan semua pemanggilan API dengan base URL yang dikonfigurasi melalui environment variable `VITE_API_BASE_URL`.

---

### Requirement 11: Kualitas Kode dan Struktur Proyek

**User Story:** Sebagai developer, saya ingin kode yang modular, terdokumentasi, dan mudah dipelihara, sehingga pengembangan dan pemeliharaan aplikasi dapat dilakukan secara efisien.

#### Acceptance Criteria

1. THE Backend SHALL mengikuti struktur folder: `cmd/` (entry point), `internal/handler/`, `internal/service/`, `internal/repository/`, `internal/model/`, `internal/middleware/`, `pkg/`, `config/`.
2. THE Frontend SHALL mengikuti struktur folder: `src/components/` (reusable UI), `src/pages/` (halaman), `src/features/` (fitur domain), `src/store/` (Zustand), `src/services/` (API calls), `src/hooks/` (custom hooks), `src/utils/` (helper functions).
3. THE Backend SHALL menyertakan komentar kode dalam Bahasa Indonesia pada setiap fungsi handler, service, dan repository yang menjelaskan tujuan dan parameter fungsi tersebut.
4. THE Frontend SHALL menyertakan komentar kode dalam Bahasa Indonesia pada setiap komponen dan fungsi utama.
5. THE System SHALL menyertakan file `README.md` dengan instruksi lengkap cara menjalankan Backend, Frontend, dan setup Database.
6. THE System SHALL menyertakan file `.env.example` untuk Backend dan Frontend yang mendokumentasikan semua environment variable yang dibutuhkan beserta contoh nilainya.
7. THE Frontend SHALL menggunakan nama variabel dan fungsi dalam Bahasa Inggris (camelCase untuk variabel/fungsi, PascalCase untuk komponen React).
8. THE Backend SHALL menggunakan nama variabel dan fungsi dalam Bahasa Inggris sesuai konvensi Go (camelCase untuk unexported, PascalCase untuk exported).
