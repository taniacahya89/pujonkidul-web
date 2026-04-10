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
-- Seed: 10 Destinasi Wisata Pujon Kidul
-- ============================================================

INSERT INTO destinations (name, short_description, full_description, opening_hours, ticket_price, latitude, longitude, best_time, parking_available, vehicle_access, is_featured, rating) VALUES

('Cafe Sawah',
 'Kafe unik di tengah hamparan sawah hijau dengan pemandangan pegunungan yang memukau.',
 'Cafe Sawah Pujon Kidul adalah destinasi wisata kuliner yang menawarkan pengalaman makan di tengah sawah yang hijau. Pengunjung dapat menikmati berbagai menu makanan dan minuman sambil menikmati pemandangan alam pegunungan Malang yang indah. Tersedia berbagai spot foto instagramable di area persawahan.',
 '07:00 - 21:00', 10000, -7.92850000, 112.40120000,
 'Pagi hari (07:00-10:00) atau sore hari (15:00-18:00)',
 TRUE, 'Motor, Mobil', TRUE, 4.7),

('Wisata Petik Sayur',
 'Pengalaman seru memetik sayuran segar langsung dari kebun organik Pujon Kidul.',
 'Wisata Petik Sayur menawarkan pengalaman agrowisata yang edukatif. Pengunjung dapat langsung memetik berbagai jenis sayuran segar seperti tomat, cabai, wortel, dan selada dari kebun organik yang dikelola warga setempat. Cocok untuk keluarga dan edukasi anak-anak tentang pertanian.',
 '08:00 - 16:00', 15000, -7.93010000, 112.39980000,
 'Pagi hari (08:00-11:00)',
 TRUE, 'Motor, Mobil', TRUE, 4.5),

('Taman Kreatif Wangi Lestari',
 'Taman bunga dan tanaman aromatik dengan berbagai instalasi seni kreatif yang instagramable.',
 'Taman Kreatif Wangi Lestari adalah ruang terbuka hijau yang memadukan keindahan bunga-bunga berwarna-warni dengan instalasi seni kreatif karya seniman lokal. Aroma bunga lavender, mawar, dan melati menyambut pengunjung. Tersedia workshop membuat potpourri dan produk aromaterapi.',
 '08:00 - 17:00', 20000, -7.93150000, 112.40250000,
 'Pagi hingga siang hari',
 TRUE, 'Motor, Mobil', TRUE, 4.6),

('Air Terjun Sumber Pitu',
 'Air terjun tujuh sumber dengan air jernih dan suasana hutan tropis yang menyejukkan.',
 'Air Terjun Sumber Pitu merupakan air terjun alami dengan tujuh sumber mata air yang mengalir membentuk air terjun bertingkat. Dikelilingi hutan tropis yang lebat, suasananya sangat sejuk dan menyegarkan. Jalur trekking menuju air terjun melewati kebun teh dan hutan pinus.',
 '07:00 - 16:00', 15000, -7.94200000, 112.38750000,
 'Musim kemarau (April-Oktober)',
 FALSE, 'Motor (parkir di bawah, jalan kaki 30 menit)', FALSE, 4.8),

('Wisata Petik Buah',
 'Kebun buah tropis dengan pengalaman memetik apel, stroberi, dan jeruk langsung dari pohonnya.',
 'Wisata Petik Buah menawarkan pengalaman memetik buah-buahan segar langsung dari pohon. Tersedia kebun apel, stroberi, jeruk, dan jambu kristal. Pengunjung dapat membeli buah yang dipetik dengan harga langsung dari petani. Tersedia juga jus buah segar di area wisata.',
 '08:00 - 16:00', 20000, -7.92780000, 112.40450000,
 'Musim panen (Mei-Agustus)',
 TRUE, 'Motor, Mobil', FALSE, 4.4),

('Camping Ground Pujon',
 'Area berkemah dengan pemandangan bintang terbaik dan udara pegunungan yang segar.',
 'Camping Ground Pujon menyediakan area berkemah yang luas dengan pemandangan pegunungan dan lembah yang spektakuler. Pada malam hari, langit bebas polusi cahaya menjadikannya spot terbaik untuk melihat bintang. Tersedia fasilitas toilet, air bersih, dan warung makan di sekitar area.',
 '24 jam (check-in 14:00)', 35000, -7.93500000, 112.39500000,
 'Musim kemarau, akhir pekan',
 TRUE, 'Motor, Mobil', FALSE, 4.3),

('Peternakan Sapi Pujon',
 'Wisata edukasi peternakan sapi perah dengan pengalaman memerah susu langsung.',
 'Peternakan Sapi Pujon adalah wisata edukasi yang memperkenalkan proses peternakan sapi perah modern. Pengunjung dapat melihat proses pemerahan susu, pengolahan susu segar, dan mencicipi berbagai produk olahan susu seperti yogurt, keju, dan es krim susu segar.',
 '07:00 - 15:00', 25000, -7.92650000, 112.40600000,
 'Pagi hari saat pemerahan (07:00-09:00)',
 TRUE, 'Motor, Mobil', FALSE, 4.5),

('Kampung Budaya',
 'Desa wisata yang melestarikan tradisi dan budaya lokal Jawa dengan pertunjukan seni.',
 'Kampung Budaya Pujon Kidul adalah pusat pelestarian budaya Jawa yang menampilkan pertunjukan tari tradisional, wayang kulit, dan gamelan. Pengunjung dapat belajar membatik, membuat gerabah, dan memasak masakan tradisional Jawa. Tersedia homestay untuk pengalaman menginap di rumah warga.',
 '09:00 - 17:00', 30000, -7.92950000, 112.40050000,
 'Akhir pekan (ada pertunjukan seni)',
 TRUE, 'Motor, Mobil', FALSE, 4.6),

('Gardu Pandang Pujon',
 'Menara pandang dengan panorama 360 derajat kawasan Pujon Kidul dan Gunung Kawi.',
 'Gardu Pandang Pujon adalah titik tertinggi yang dapat diakses di kawasan wisata Pujon Kidul. Dari atas menara setinggi 15 meter, pengunjung dapat menikmati panorama 360 derajat yang mencakup hamparan sawah, kebun teh, dan siluet Gunung Kawi di kejauhan. Spot terbaik untuk sunrise dan sunset.',
 '05:30 - 18:00', 10000, -7.93300000, 112.39850000,
 'Sunrise (05:30-07:00) atau Sunset (16:30-18:00)',
 TRUE, 'Motor, Mobil', FALSE, 4.7),

('Pasar Desa Pujon',
 'Pasar tradisional desa dengan produk lokal, kuliner khas, dan kerajinan tangan Pujon Kidul.',
 'Pasar Desa Pujon adalah pasar tradisional yang beroperasi setiap hari dengan menjual berbagai produk lokal. Tersedia sayuran segar hasil panen petani setempat, produk olahan susu, kerajinan tangan bambu dan rotan, serta berbagai kuliner khas Pujon seperti nasi jagung, pecel, dan minuman wedang jahe.',
 '05:00 - 12:00', 0, -7.92700000, 112.40150000,
 'Pagi hari (05:00-09:00) saat pasar ramai',
 TRUE, 'Motor, Mobil', FALSE, 4.2);

-- ============================================================
-- Seed: Detail destinasi (visitor_data 12 bulan + image_url)
-- ============================================================

-- Cafe Sawah (destination_id = 1)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(1,
 '[{"month":"Jan","count":1850},{"month":"Feb","count":1620},{"month":"Mar","count":1900},{"month":"Apr","count":2100},{"month":"Mei","count":2350},{"month":"Jun","count":2800},{"month":"Jul","count":3200},{"month":"Agu","count":3100},{"month":"Sep","count":2600},{"month":"Okt","count":2200},{"month":"Nov","count":1950},{"month":"Des","count":2700}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Wisata Petik Sayur (destination_id = 2)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(2,
 '[{"month":"Jan","count":980},{"month":"Feb","count":870},{"month":"Mar","count":1050},{"month":"Apr","count":1200},{"month":"Mei","count":1450},{"month":"Jun","count":1700},{"month":"Jul","count":1900},{"month":"Agu","count":1850},{"month":"Sep","count":1500},{"month":"Okt","count":1250},{"month":"Nov","count":1100},{"month":"Des","count":1600}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Taman Kreatif Wangi Lestari (destination_id = 3)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(3,
 '[{"month":"Jan","count":1100},{"month":"Feb","count":950},{"month":"Mar","count":1200},{"month":"Apr","count":1350},{"month":"Mei","count":1600},{"month":"Jun","count":1900},{"month":"Jul","count":2100},{"month":"Agu","count":2050},{"month":"Sep","count":1700},{"month":"Okt","count":1400},{"month":"Nov","count":1200},{"month":"Des","count":1800}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Air Terjun Sumber Pitu (destination_id = 4)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(4,
 '[{"month":"Jan","count":650},{"month":"Feb","count":580},{"month":"Mar","count":700},{"month":"Apr","count":1100},{"month":"Mei","count":1400},{"month":"Jun","count":1750},{"month":"Jul","count":2000},{"month":"Agu","count":1950},{"month":"Sep","count":1600},{"month":"Okt","count":1200},{"month":"Nov","count":750},{"month":"Des","count":900}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Wisata Petik Buah (destination_id = 5)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(5,
 '[{"month":"Jan","count":700},{"month":"Feb","count":620},{"month":"Mar","count":750},{"month":"Apr","count":850},{"month":"Mei","count":1500},{"month":"Jun","count":1800},{"month":"Jul","count":1950},{"month":"Agu","count":1900},{"month":"Sep","count":1100},{"month":"Okt","count":850},{"month":"Nov","count":720},{"month":"Des","count":950}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Camping Ground Pujon (destination_id = 6)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(6,
 '[{"month":"Jan","count":420},{"month":"Feb","count":380},{"month":"Mar","count":450},{"month":"Apr","count":600},{"month":"Mei","count":850},{"month":"Jun","count":1100},{"month":"Jul","count":1400},{"month":"Agu","count":1350},{"month":"Sep","count":1000},{"month":"Okt","count":700},{"month":"Nov","count":480},{"month":"Des","count":750}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Peternakan Sapi Pujon (destination_id = 7)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(7,
 '[{"month":"Jan","count":550},{"month":"Feb","count":490},{"month":"Mar","count":600},{"month":"Apr","count":700},{"month":"Mei","count":850},{"month":"Jun","count":1000},{"month":"Jul","count":1150},{"month":"Agu","count":1100},{"month":"Sep","count":900},{"month":"Okt","count":750},{"month":"Nov","count":620},{"month":"Des","count":880}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Kampung Budaya (destination_id = 8)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(8,
 '[{"month":"Jan","count":480},{"month":"Feb","count":420},{"month":"Mar","count":510},{"month":"Apr","count":600},{"month":"Mei","count":720},{"month":"Jun","count":900},{"month":"Jul","count":1050},{"month":"Agu","count":1000},{"month":"Sep","count":820},{"month":"Okt","count":680},{"month":"Nov","count":540},{"month":"Des","count":780}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Gardu Pandang Pujon (destination_id = 9)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(9,
 '[{"month":"Jan","count":900},{"month":"Feb","count":800},{"month":"Mar","count":950},{"month":"Apr","count":1100},{"month":"Mei","count":1300},{"month":"Jun","count":1600},{"month":"Jul","count":1850},{"month":"Agu","count":1800},{"month":"Sep","count":1450},{"month":"Okt","count":1150},{"month":"Nov","count":950},{"month":"Des","count":1400}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- Pasar Desa Pujon (destination_id = 10)
INSERT INTO destination_details (destination_id, visitor_data, image_url) VALUES
(10,
 '[{"month":"Jan","count":1200},{"month":"Feb","count":1050},{"month":"Mar","count":1300},{"month":"Apr","count":1450},{"month":"Mei","count":1600},{"month":"Jun","count":1800},{"month":"Jul","count":2000},{"month":"Agu","count":1950},{"month":"Sep","count":1650},{"month":"Okt","count":1400},{"month":"Nov","count":1250},{"month":"Des","count":1750}]',
 '/images/placeholder.jpg' -- Ganti gambar di sini
);

-- ============================================================
-- Seed: Paket Wisata (minimal 2 paket per destinasi, ~20 paket)
-- ============================================================

-- Paket untuk Cafe Sawah (destination_id = 1)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(1, 'Paket Sarapan Sawah', 'Nikmati sarapan pagi dengan menu tradisional di tengah hamparan sawah hijau.', 45000, '2 jam', 'Tiket masuk, sarapan nasi jagung + lauk, minuman wedang jahe'),
(1, 'Paket Foto Sawah Premium', 'Sesi foto profesional di berbagai spot instagramable area persawahan.', 75000, '3 jam', 'Tiket masuk, pemandu foto, 1 minuman gratis, akses semua spot foto');

-- Paket untuk Wisata Petik Sayur (destination_id = 2)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(2, 'Paket Petik Sayur Keluarga', 'Pengalaman memetik sayuran segar bersama keluarga dengan panduan petani lokal.', 60000, '2 jam', 'Tiket masuk, 1 kg sayuran pilihan, panduan petani, keranjang petik'),
(2, 'Paket Edukasi Pertanian', 'Paket edukatif untuk anak-anak tentang cara bercocok tanam sayuran organik.', 80000, '3 jam', 'Tiket masuk, sesi edukasi, menanam bibit sendiri, 500 gr sayuran, sertifikat');

-- Paket untuk Taman Kreatif Wangi Lestari (destination_id = 3)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(3, 'Paket Workshop Potpourri', 'Belajar membuat potpourri dan produk aromaterapi dari bunga-bunga segar.', 85000, '2.5 jam', 'Tiket masuk, bahan workshop, 1 produk potpourri hasil karya sendiri, teh bunga'),
(3, 'Paket Foto Taman Bunga', 'Sesi foto di berbagai sudut taman bunga yang indah dengan kostum tradisional.', 70000, '2 jam', 'Tiket masuk, sewa kostum tradisional, pemandu foto, 1 minuman herbal');

-- Paket untuk Air Terjun Sumber Pitu (destination_id = 4)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(4, 'Paket Trekking Sumber Pitu', 'Trekking menyusuri jalur hutan menuju air terjun tujuh sumber yang menakjubkan.', 65000, '4 jam', 'Tiket masuk, pemandu trekking, air minum, snack energi, asuransi perjalanan'),
(4, 'Paket Petualangan Alam', 'Paket lengkap trekking + berenang di kolam alami air terjun + makan siang.', 120000, '6 jam', 'Tiket masuk, pemandu, makan siang bekal, air minum, snack, asuransi');

-- Paket untuk Wisata Petik Buah (destination_id = 5)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(5, 'Paket Petik Apel & Stroberi', 'Memetik apel dan stroberi segar langsung dari pohon dengan panduan petani.', 75000, '2 jam', 'Tiket masuk, 500 gr apel + 250 gr stroberi, jus buah segar, keranjang petik'),
(5, 'Paket Kebun Buah Lengkap', 'Akses ke semua kebun buah termasuk jeruk, jambu kristal, dan buah musiman.', 100000, '3 jam', 'Tiket masuk, 1 kg buah pilihan, jus buah 2 gelas, panduan kebun');

-- Paket untuk Camping Ground Pujon (destination_id = 6)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(6, 'Paket Camping 1 Malam', 'Berkemah semalam di bawah bintang dengan pemandangan pegunungan yang spektakuler.', 150000, '1 malam', 'Tiket masuk, sewa tenda 2 orang, sleeping bag, makan malam + sarapan, api unggun'),
(6, 'Paket Camping Weekend', 'Paket berkemah 2 malam untuk pengalaman alam yang lebih mendalam.', 250000, '2 malam', 'Tiket masuk, sewa tenda, sleeping bag, 2x makan malam + 2x sarapan, api unggun, pemandu');

-- Paket untuk Peternakan Sapi Pujon (destination_id = 7)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(7, 'Paket Edukasi Peternakan', 'Belajar proses peternakan sapi perah dari pemerahan hingga pengolahan susu.', 70000, '2 jam', 'Tiket masuk, sesi edukasi, pengalaman memerah susu, 1 gelas susu segar'),
(7, 'Paket Olahan Susu Segar', 'Mencicipi dan membuat produk olahan susu seperti yogurt dan es krim.', 95000, '3 jam', 'Tiket masuk, workshop membuat yogurt, 1 cup yogurt + es krim, 500 ml susu segar');

-- Paket untuk Kampung Budaya (destination_id = 8)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(8, 'Paket Seni Budaya Jawa', 'Menyaksikan pertunjukan tari tradisional dan wayang kulit serta belajar gamelan.', 90000, '3 jam', 'Tiket masuk, pertunjukan seni, sesi belajar gamelan, snack tradisional'),
(8, 'Paket Homestay Budaya', 'Menginap di rumah warga dan merasakan kehidupan sehari-hari masyarakat Pujon.', 200000, '1 malam', 'Tiket masuk, menginap 1 malam, makan 3x, workshop batik, pertunjukan seni malam');

-- Paket untuk Gardu Pandang Pujon (destination_id = 9)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(9, 'Paket Sunrise Gardu Pandang', 'Menyaksikan matahari terbit dari ketinggian dengan pemandangan Gunung Kawi.', 40000, '2 jam', 'Tiket masuk, akses menara pandang, kopi/teh hangat, foto kenangan'),
(9, 'Paket Sunset & Foto Panorama', 'Menikmati sunset spektakuler dan sesi foto panorama 360 derajat.', 50000, '2 jam', 'Tiket masuk, akses menara pandang, minuman hangat, pemandu foto spot terbaik');

-- Paket untuk Pasar Desa Pujon (destination_id = 10)
INSERT INTO travel_packages (destination_id, name, description, price, duration, includes) VALUES
(10, 'Paket Kuliner Pasar Desa', 'Tur kuliner menjelajahi berbagai jajanan dan makanan khas Pujon di pasar tradisional.', 50000, '2 jam', 'Pemandu pasar, voucher jajan Rp 30.000, tas belanja kain, resep masakan tradisional'),
(10, 'Paket Belanja Produk Lokal', 'Berbelanja produk lokal pilihan dengan panduan untuk mendapatkan harga terbaik.', 35000, '1.5 jam', 'Pemandu belanja, voucher diskon produk mitra, tas belanja, 1 minuman tradisional');

-- ============================================================
-- Seed: 5 Rute Akses Jalan
-- ============================================================

INSERT INTO routes (name, description, status, last_updated) VALUES
('Jalur Utama Malang - Pujon via Batu',
 'Rute paling populer dari Kota Malang melalui Kota Batu. Jalan beraspal mulus, lebar 2 jalur, cocok untuk semua jenis kendaraan. Jarak ±35 km, waktu tempuh ±1 jam.',
 'baik', NOW()),

('Jalur Alternatif Kepanjen - Pujon',
 'Rute alternatif dari arah selatan melalui Kepanjen dan Ngajum. Jalan lebih sempit namun pemandangan lebih indah melewati perkebunan. Jarak ±45 km, waktu tempuh ±1.5 jam.',
 'sedang', NOW()),

('Jalur Singosari - Pujon via Karangploso',
 'Rute dari arah utara melalui Singosari dan Karangploso. Cocok untuk pengunjung dari arah Surabaya. Jarak ±40 km dari Singosari, waktu tempuh ±1.2 jam.',
 'baik', NOW()),

('Jalur Dalam Kawasan Pujon Kidul',
 'Jalan desa di dalam kawasan wisata Pujon Kidul menghubungkan semua destinasi. Jalan sempit (1 jalur), disarankan menggunakan motor atau berjalan kaki antar destinasi.',
 'baik', NOW()),

('Jalur Pujon - Air Terjun Sumber Pitu',
 'Jalur khusus menuju Air Terjun Sumber Pitu. Jalan tanah berbatu setelah parkiran, hanya bisa dilalui motor atau berjalan kaki. Trekking ±30 menit dari area parkir.',
 'sedang', NOW());

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

-- DKI Jakarta (province_id = 1), jarak sekitar 810-835 km
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(1, 'Jakarta Pusat',  820, 45.00, 14.00),
(1, 'Jakarta Utara',  835, 45.00, 14.00),
(1, 'Jakarta Barat',  815, 45.00, 14.00),
(1, 'Jakarta Selatan',825, 45.00, 14.00),
(1, 'Jakarta Timur',  810, 45.00, 14.00);

-- Banten (province_id = 2), jarak sekitar 795-940 km
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(2, 'Kota Serang',            870, 45.00, 13.50),
(2, 'Kota Cilegon',           890, 45.00, 13.50),
(2, 'Kota Tangerang',         800, 45.00, 14.00),
(2, 'Kota Tangerang Selatan', 805, 45.00, 14.00),
(2, 'Kabupaten Serang',       875, 45.00, 13.50),
(2, 'Kabupaten Pandeglang',   920, 44.00, 13.00),
(2, 'Kabupaten Lebak',        940, 44.00, 13.00),
(2, 'Kabupaten Tangerang',    795, 45.00, 14.00);

-- Jawa Barat (province_id = 3), jarak sekitar 530-810 km
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

-- Jawa Tengah (province_id = 4), jarak sekitar 280-450 km
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

-- DI Yogyakarta (province_id = 5), jarak sekitar 255-290 km
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(5, 'Kota Yogyakarta',       260, 47.00, 15.50),
(5, 'Kabupaten Sleman',      255, 47.00, 15.50),
(5, 'Kabupaten Bantul',      265, 47.00, 15.50),
(5, 'Kabupaten Gunungkidul', 290, 47.00, 15.00),
(5, 'Kabupaten Kulon Progo', 280, 47.00, 15.00);

-- Jawa Timur (province_id = 6), jarak sekitar 20-250 km
INSERT INTO cities (province_id, name, distance_km, fuel_consumption_motor, fuel_consumption_car) VALUES
(6, 'Kota Surabaya',       110, 48.00, 16.00),
(6, 'Kota Malang',          35, 50.00, 17.00),
(6, 'Kota Batu',            20, 50.00, 17.00),
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
