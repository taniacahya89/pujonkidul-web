-- ============================================================
-- File: 001_init.sql
-- Deskripsi: Inisialisasi skema database dan data seed
--            untuk aplikasi Pujon Kidul Explore
-- ============================================================

-- ============================================================
-- DDL: Buat tabel-tabel utama
-- ============================================================

-- Tabel utama destinasi wisata
CREATE TABLE destinations (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    full_description  TEXT NOT NULL,
    opening_hours     VARCHAR(100) NOT NULL,
    ticket_price      INTEGER NOT NULL DEFAULT 0,
    latitude          DECIMAL(10, 8) NOT NULL,
    longitude         DECIMAL(11, 8) NOT NULL,
    best_time         VARCHAR(255),
    parking_available BOOLEAN NOT NULL DEFAULT TRUE,
    vehicle_access    VARCHAR(255),
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
    rating            DECIMAL(3, 1) DEFAULT 4.5,
    address           VARCHAR(500),
    parking_info      VARCHAR(500),
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel detail tambahan destinasi (data kunjungan, gambar)
CREATE TABLE destination_details (
    id             SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    visitor_data   JSONB NOT NULL DEFAULT '[]',
    image_url      VARCHAR(500),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(destination_id)
);

-- Tabel paket wisata per destinasi
CREATE TABLE travel_packages (
    id             SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    price          INTEGER NOT NULL,
    duration       VARCHAR(100),
    includes       TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel rute akses jalan menuju kawasan Pujon Kidul
CREATE TABLE routes (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  TEXT NOT NULL,
    status       VARCHAR(50) NOT NULL DEFAULT 'baik',
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel provinsi (hanya Jawa)
CREATE TABLE provinces (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabel kota dengan data jarak dan konsumsi BBM ke Pujon Kidul
CREATE TABLE cities (
    id                     SERIAL PRIMARY KEY,
    province_id            INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    name                   VARCHAR(100) NOT NULL,
    distance_km            INTEGER NOT NULL,
    fuel_consumption_motor DECIMAL(5, 2) NOT NULL,
    fuel_consumption_car   DECIMAL(5, 2) NOT NULL,
    created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Index untuk performa query
-- ============================================================

CREATE INDEX idx_destinations_is_featured    ON destinations(is_featured);
CREATE INDEX idx_destinations_name           ON destinations(name);
CREATE INDEX idx_destination_details_dest_id ON destination_details(destination_id);
CREATE INDEX idx_travel_packages_dest_id     ON travel_packages(destination_id);
CREATE INDEX idx_cities_province_id          ON cities(province_id);

-- ============================================================
-- Seed: 6 Destinasi Wisata Pujon Kidul (single source of truth)
-- Urutan: Cafe Sawah, Coban Rondo, Bukit Nirwana,
--         Bobocabin Coban Rondo, Kelinci Park, Florawisata Santerra De Laponte
-- is_featured = TRUE untuk: Florawisata (id=6), Bobocabin (id=4), Coban Rondo (id=2)
-- ============================================================

INSERT INTO destinations (name, short_description, full_description, opening_hours, ticket_price, latitude, longitude, best_time, parking_available, vehicle_access, is_featured, rating, address, parking_info) VALUES

-- 1. Cafe Sawah
('Cafe Sawah',
 'Kafe unik di tengah hamparan sawah hijau dengan pemandangan pegunungan Pujon yang memukau.',
 'Cafe Sawah Pujon Kidul adalah destinasi wisata kuliner ikonik yang menawarkan pengalaman makan di tengah sawah yang hijau. Pengunjung dapat menikmati berbagai menu makanan dan minuman tradisional sambil menikmati pemandangan alam pegunungan Malang yang indah. Tersedia berbagai spot foto instagramable di area persawahan yang luas.',
 '08:00 - 18:00', 10000, -7.93120000, 112.39870000,
 'Pagi hari (08:00-10:00) atau sore hari (15:00-17:00)',
 TRUE, 'Motor, Mobil', FALSE, 4.7,
 'Kawasan Cafe Sawah, Desa Wisata, Krajan, Pujon Kidul',
 'Parkir Motor: Rp 5.000 | Parkir Mobil: Rp 10.000'),

-- 2. Coban Rondo
('Coban Rondo',
 'Air terjun legendaris dengan ketinggian 84 meter dikelilingi hutan pinus yang sejuk dan asri.',
 'Coban Rondo adalah air terjun ikonik di kawasan Pujon dengan ketinggian sekitar 84 meter. Dikelilingi hutan pinus yang lebat dan udara sejuk pegunungan, destinasi ini menjadi favorit wisatawan dari berbagai daerah. Tersedia area piknik, flying fox, dan berbagai wahana seru di sekitar kawasan air terjun.',
 '08:00 - 17:00', 35000, -7.87520000, 112.52180000,
 'Pagi hari (08:00-11:00) untuk menghindari keramaian',
 TRUE, 'Motor, Mobil, Bus', TRUE, 4.8,
 'Jl. Coban Rondo No.30, Pandesari, Pujon, Malang',
 'Parkir Motor: Rp 5.000 | Parkir Mobil: Rp 10.000 | Parkir Bus: Rp 15.000 | Tiket Weekday: Rp 35.000 | Tiket Weekend: Rp 40.000'),

-- 3. Bukit Nirwana
('Bukit Nirwana',
 'Bukit dengan panorama alam Pujon Kidul yang memukau, cocok untuk trekking dan foto sunrise.',
 'Bukit Nirwana menawarkan pemandangan alam Pujon Kidul yang spektakuler dari ketinggian. Pengunjung dapat menikmati hamparan sawah, kebun teh, dan siluet pegunungan yang memukau. Jalur trekking yang tidak terlalu berat menjadikannya cocok untuk semua kalangan. Spot terbaik untuk foto sunrise dan sunset.',
 '08:00 - 17:00', 10000, -7.93450000, 112.39650000,
 'Pagi hari untuk sunrise atau sore hari untuk sunset',
 TRUE, 'Motor, Mobil', FALSE, 4.5,
 'Tulungrejo, Pujon Kidul, Malang',
 'Parkir Motor: Rp 5.000 | Parkir Mobil: Rp 10.000'),

-- 4. Bobocabin Coban Rondo
('Bobocabin Coban Rondo',
 'Glamping premium di tengah hutan pinus dengan fasilitas modern dan pemandangan alam yang menakjubkan.',
 'Bobocabin Coban Rondo menghadirkan pengalaman glamping (glamorous camping) premium di tengah hutan pinus kawasan Coban Rondo. Setiap kabin dilengkapi fasilitas modern seperti AC, kamar mandi dalam, dan tempat tidur nyaman, sambil tetap merasakan nuansa alam yang autentik. Tersedia berbagai aktivitas outdoor di sekitar kawasan.',
 '24 jam (check-in 14:00, check-out 12:00)', 35000, -7.87650000, 112.52050000,
 'Sepanjang tahun, terutama musim kemarau (April-Oktober)',
 TRUE, 'Motor, Mobil', TRUE, 4.9,
 'Jl. Coban Rondo, Pandesari, Pujon, Malang',
 'Parkir Motor: Rp 5.000 | Parkir Mobil: Rp 10.000 | Tiket Weekday: Rp 35.000 | Tiket Weekend: Rp 40.000'),

-- 5. Kelinci Park
('Kelinci Park',
 'Taman wisata keluarga dengan ratusan kelinci lucu yang bisa diajak berinteraksi langsung.',
 'Kelinci Park Pujon adalah destinasi wisata keluarga yang menyenangkan dengan ratusan kelinci berbagai ras yang bisa diajak berinteraksi langsung. Pengunjung dapat memberi makan, menggendong, dan berfoto bersama kelinci-kelinci lucu. Cocok untuk anak-anak dan keluarga yang ingin pengalaman wisata edukatif yang menyenangkan.',
 '08:00 - 17:00', 20000, -7.87890000, 112.51760000,
 'Pagi hingga siang hari, cocok untuk anak-anak',
 TRUE, 'Motor', FALSE, 4.4,
 'Jurangrejo, Pandesari, Pujon, Malang',
 'Parkir Motor: Rp 5.000 | Tiket Dewasa: Rp 20.000 | Tiket Anak: Rp 10.000'),

-- 6. Florawisata Santerra De Laponte
('Florawisata Santerra De Laponte',
 'Taman bunga Eropa di Malang dengan ribuan bunga berwarna-warni dan spot foto instagramable.',
 'Florawisata Santerra De Laponte adalah taman bunga bergaya Eropa yang memukau di kawasan Pujon. Ribuan bunga berwarna-warni dari berbagai penjuru dunia ditata dengan indah menciptakan pemandangan yang memesona. Tersedia berbagai spot foto instagramable, area piknik, dan wahana keluarga. Destinasi wajib kunjung bagi pecinta bunga dan fotografi.',
 '08:00 - 17:00', 30000, -7.87340000, 112.52340000,
 'Pagi hari (08:00-11:00) saat bunga mekar sempurna',
 TRUE, 'Motor, Mobil, Bus', TRUE, 4.8,
 'Jl. Truno Joyo, Pandesari, Pujon, Malang',
 'Parkir Motor: Rp 5.000 | Parkir Mobil: Rp 10.000 | Parkir Bus: Rp 15.000 | Tiket Reguler Weekday: Rp 30.000 | Tiket Reguler Weekend: Rp 35.000 | Tiket Terusan Weekday: Rp 70.000 | Tiket Terusan Weekend: Rp 85.000');

-- ============================================================
-- Seed: Detail destinasi (visitor_data 12 bulan + image_url)
-- Koordinat diambil dari Google Maps
-- ============================================================

-- Cafe Sawah (id=1)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(1,
 '[{"month":"Jan","count":1850},{"month":"Feb","count":1620},{"month":"Mar","count":1900},{"month":"Apr","count":2100},{"month":"Mei","count":2350},{"month":"Jun","count":2800},{"month":"Jul","count":3200},{"month":"Agu","count":3100},{"month":"Sep","count":2600},{"month":"Okt","count":2200},{"month":"Nov","count":1950},{"month":"Des","count":2700}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- Coban Rondo (id=2)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(2,
 '[{"month":"Jan","count":2200},{"month":"Feb","count":1980},{"month":"Mar","count":2400},{"month":"Apr","count":2800},{"month":"Mei","count":3100},{"month":"Jun","count":3600},{"month":"Jul","count":4200},{"month":"Agu","count":4100},{"month":"Sep","count":3500},{"month":"Okt","count":2900},{"month":"Nov","count":2400},{"month":"Des","count":3800}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- Bukit Nirwana (id=3)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(3,
 '[{"month":"Jan","count":980},{"month":"Feb","count":870},{"month":"Mar","count":1050},{"month":"Apr","count":1200},{"month":"Mei","count":1450},{"month":"Jun","count":1700},{"month":"Jul","count":1900},{"month":"Agu","count":1850},{"month":"Sep","count":1500},{"month":"Okt","count":1250},{"month":"Nov","count":1100},{"month":"Des","count":1600}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- Bobocabin Coban Rondo (id=4)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(4,
 '[{"month":"Jan","count":650},{"month":"Feb","count":580},{"month":"Mar","count":700},{"month":"Apr","count":900},{"month":"Mei","count":1100},{"month":"Jun","count":1400},{"month":"Jul","count":1800},{"month":"Agu","count":1750},{"month":"Sep","count":1300},{"month":"Okt","count":1000},{"month":"Nov","count":750},{"month":"Des","count":1200}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- Kelinci Park (id=5)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(5,
 '[{"month":"Jan","count":720},{"month":"Feb","count":640},{"month":"Mar","count":780},{"month":"Apr","count":900},{"month":"Mei","count":1050},{"month":"Jun","count":1300},{"month":"Jul","count":1500},{"month":"Agu","count":1450},{"month":"Sep","count":1150},{"month":"Okt","count":950},{"month":"Nov","count":800},{"month":"Des","count":1100}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- Florawisata Santerra De Laponte (id=6)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(6,
 '[{"month":"Jan","count":2500},{"month":"Feb","count":2200},{"month":"Mar","count":2700},{"month":"Apr","count":3100},{"month":"Mei","count":3500},{"month":"Jun","count":4000},{"month":"Jul","count":4800},{"month":"Agu","count":4600},{"month":"Sep","count":3800},{"month":"Okt","count":3200},{"month":"Nov","count":2700},{"month":"Des","count":4200}]',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg'
);

-- ============================================================
-- Seed: Paket Wisata (2 paket per destinasi)
-- ============================================================

-- Cafe Sawah (id=1)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(1, 'Paket Sarapan Sawah', 'Sarapan pagi dengan menu tradisional di tengah hamparan sawah hijau.', 45000, '2 jam', 'Tiket masuk, sarapan nasi jagung + lauk, minuman wedang jahe'),
(1, 'Paket Foto Sawah Premium', 'Sesi foto di berbagai spot instagramable area persawahan.', 75000, '3 jam', 'Tiket masuk, pemandu foto, 1 minuman gratis, akses semua spot foto');

-- Coban Rondo (id=2)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(2, 'Paket Wisata Coban Rondo', 'Nikmati keindahan air terjun 84 meter dengan pemandu lokal berpengalaman.', 75000, '3 jam', 'Tiket masuk, pemandu wisata, air minum, snack'),
(2, 'Paket Adventure Coban Rondo', 'Paket lengkap termasuk flying fox dan wahana seru lainnya.', 150000, '5 jam', 'Tiket masuk, flying fox, wahana seru, makan siang, pemandu');

-- Bukit Nirwana (id=3)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(3, 'Paket Trekking Bukit Nirwana', 'Trekking santai menikmati panorama alam Pujon Kidul dari ketinggian.', 50000, '3 jam', 'Tiket masuk, pemandu trekking, air minum, snack energi'),
(3, 'Paket Sunrise Bukit Nirwana', 'Saksikan matahari terbit dari puncak bukit dengan pemandangan spektakuler.', 65000, '2 jam', 'Tiket masuk, pemandu, kopi/teh hangat, foto kenangan');

-- Bobocabin Coban Rondo (id=4)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(4, 'Paket Glamping 1 Malam', 'Menginap semalam di kabin premium dengan fasilitas lengkap di tengah hutan pinus.', 450000, '1 malam', 'Kabin premium, sarapan, akses kawasan Coban Rondo, welcome drink'),
(4, 'Paket Glamping Weekend', 'Paket glamping 2 malam untuk pengalaman alam yang lebih mendalam.', 850000, '2 malam', 'Kabin premium, 2x sarapan, 2x makan malam, akses kawasan, aktivitas outdoor');

-- Kelinci Park (id=5)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(5, 'Paket Keluarga Kelinci Park', 'Paket seru untuk keluarga dengan anak-anak berinteraksi langsung dengan kelinci.', 60000, '2 jam', 'Tiket masuk (2 dewasa + 2 anak), pakan kelinci, foto bersama kelinci'),
(5, 'Paket Edukasi Kelinci', 'Paket edukatif tentang cara merawat dan memelihara kelinci untuk anak-anak.', 80000, '2.5 jam', 'Tiket masuk, sesi edukasi, pakan kelinci, sertifikat, foto kenangan');

-- Florawisata Santerra De Laponte (id=6)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(6, 'Paket Reguler Santerra', 'Nikmati keindahan taman bunga Eropa dengan tiket reguler dan pemandu.', 50000, '3 jam', 'Tiket masuk reguler, pemandu taman, peta lokasi spot foto terbaik'),
(6, 'Paket Terusan Santerra Premium', 'Akses penuh ke semua area taman termasuk wahana dan atraksi premium.', 100000, '5 jam', 'Tiket terusan, semua wahana, pemandu, makan siang, foto kenangan');

-- ============================================================
-- Seed: 4 Rute Akses Jalan (sesuai spesifikasi baru)
-- ============================================================

INSERT INTO routes (name, description, status, last_updated) VALUES
('Jalur Utama Batu–Pujon',
 'Rute paling populer dari Kota Batu menuju Pujon Kidul. Jalan beraspal mulus, lebar 2 jalur, cocok untuk semua jenis kendaraan. Jarak ±15 km, waktu tempuh ±30 menit.',
 'baik', NOW()),

('Jalur Alternatif Songgoriti',
 'Rute via Songgoriti dengan pemandangan lebih indah melewati perkebunan dan hutan pinus. Jalan lebih sempit, disarankan untuk motor dan mobil kecil. Jarak ±18 km.',
 'sedang', NOW()),

('Jalur dari Malang Kota',
 'Rute dari pusat Kota Malang via Batu menuju Pujon Kidul. Cocok untuk pengunjung dari arah Surabaya dan sekitarnya. Jarak ±35 km, waktu tempuh ±1 jam.',
 'baik', NOW()),

('Jalur Kediri–Pujon',
 'Rute dari arah barat via Kota Kediri melewati pegunungan. Pemandangan indah namun jalan berkelok. Jarak ±80 km, waktu tempuh ±2 jam.',
 'baik', NOW());

-- ============================================================
-- Seed: 6 Provinsi Jawa
-- ============================================================

INSERT INTO provinces (name) VALUES
('DKI Jakarta'),
('Banten'),
('Jawa Barat'),
('Jawa Tengah'),
('DI Yogyakarta'),
('Jawa Timur');

-- ============================================================
-- Seed: Kota-kota per provinsi dengan jarak ke Pujon Kidul
-- ============================================================

-- DKI Jakarta (province_id = 1)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(1, 'Jakarta Pusat',  820, 45.00, 14.00),
(1, 'Jakarta Utara',  835, 45.00, 14.00),
(1, 'Jakarta Barat',  815, 45.00, 14.00),
(1, 'Jakarta Selatan',825, 45.00, 14.00),
(1, 'Jakarta Timur',  810, 45.00, 14.00);

-- Banten (province_id = 2)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(2, 'Kota Serang',            870, 45.00, 13.50),
(2, 'Kota Cilegon',           890, 45.00, 13.50),
(2, 'Kota Tangerang',         800, 45.00, 14.00),
(2, 'Kota Tangerang Selatan', 805, 45.00, 14.00),
(2, 'Kabupaten Serang',       875, 45.00, 13.50),
(2, 'Kabupaten Pandeglang',   920, 44.00, 13.00),
(2, 'Kabupaten Lebak',        940, 44.00, 13.00),
(2, 'Kabupaten Tangerang',    795, 45.00, 14.00);

-- Jawa Barat (province_id = 3)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(3, 'Kota Bandung',        620, 46.00, 14.50),
(3, 'Kota Bekasi',         790, 45.00, 14.00),
(3, 'Kota Depok',          810, 45.00, 14.00),
(3, 'Kota Bogor',          780, 45.00, 14.00),
(3, 'Kota Cimahi',         625, 46.00, 14.50),
(3, 'Kota Sukabumi',       720, 45.00, 14.00),
(3, 'Kabupaten Bandung',   615, 46.00, 14.50),
(3, 'Kabupaten Bogor',     775, 45.00, 14.00),
(3, 'Kabupaten Bekasi',    785, 45.00, 14.00),
(3, 'Kabupaten Karawang',  750, 45.00, 14.00),
(3, 'Kabupaten Cirebon',   530, 46.00, 14.50),
(3, 'Kabupaten Garut',     580, 46.00, 14.00),
(3, 'Kabupaten Tasikmalaya',540, 46.00, 14.00);

-- Jawa Tengah (province_id = 4)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(4, 'Kota Semarang',      380, 47.00, 15.00),
(4, 'Kota Surakarta',     280, 47.00, 15.50),
(4, 'Kota Magelang',      320, 47.00, 15.00),
(4, 'Kota Tegal',         450, 46.00, 14.50),
(4, 'Kota Pekalongan',    420, 46.00, 14.50),
(4, 'Kabupaten Semarang', 375, 47.00, 15.00),
(4, 'Kabupaten Banyumas', 360, 47.00, 15.00),
(4, 'Kabupaten Kudus',    400, 46.00, 14.50),
(4, 'Kabupaten Jepara',   430, 46.00, 14.50),
(4, 'Kabupaten Pati',     410, 46.00, 14.50),
(4, 'Kabupaten Cilacap',  390, 47.00, 15.00),
(4, 'Kabupaten Kebumen',  340, 47.00, 15.00);

-- DI Yogyakarta (province_id = 5)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(5, 'Kota Yogyakarta',       260, 47.00, 15.50),
(5, 'Kabupaten Sleman',      255, 47.00, 15.50),
(5, 'Kabupaten Bantul',      265, 47.00, 15.50),
(5, 'Kabupaten Gunungkidul', 290, 47.00, 15.00),
(5, 'Kabupaten Kulon Progo', 280, 47.00, 15.00);

-- Jawa Timur (province_id = 6)
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(6, 'Kota Surabaya',       110, 48.00, 16.00),
(6, 'Kota Malang',          35, 50.00, 17.00),
(6, 'Kota Batu',            15, 50.00, 17.00),
(6, 'Kota Kediri',          80, 49.00, 16.50),
(6, 'Kota Blitar',          95, 49.00, 16.50),
(6, 'Kota Madiun',         175, 48.00, 16.00),
(6, 'Kabupaten Malang',     40, 50.00, 17.00),
(6, 'Kabupaten Sidoarjo',  120, 48.00, 16.00),
(6, 'Kabupaten Gresik',    130, 48.00, 16.00),
(6, 'Kabupaten Jombang',    90, 49.00, 16.50),
(6, 'Kabupaten Pasuruan',   75, 49.00, 16.50),
(6, 'Kabupaten Probolinggo',130, 48.00, 16.00),
(6, 'Kabupaten Kediri',     85, 49.00, 16.50),
(6, 'Kabupaten Banyuwangi',250, 47.00, 15.50),
(6, 'Kabupaten Bojonegoro',200, 48.00, 16.00),
(6, 'Kabupaten Tuban',     220, 48.00, 16.00);
