// Konstanta aplikasi Pujon Kidul Explore

// Koordinat pusat kawasan Pujon Kidul untuk peta Leaflet
// Titik tengah antara semua 6 destinasi
export const PUJON_KIDUL_CENTER = [-7.860, 112.477]
export const DEFAULT_MAP_ZOOM = 13

// Urutan prioritas highlight beranda — JANGAN diubah urutannya
// Berdasarkan nama destinasi, bukan ID (agar tidak bergantung pada urutan insert DB)
export const FEATURED_PRIORITY_NAMES = [
  'Florawisata Santerra De Laponte',
  'Bobocabin Coban Rondo',
  'Coban Rondo',
]

// Pilihan anggaran makan per orang per kali makan
export const MEAL_BUDGET_OPTIONS = [
  { value: 25000, label: 'Rp 25.000 (Warung sederhana)' },
  { value: 50000, label: 'Rp 50.000 (Restoran biasa)' },
  { value: 100000, label: 'Rp 100.000 (Restoran premium)' },
]

// Pilihan anggaran oleh-oleh per orang
export const SOUVENIR_BUDGET_OPTIONS = [
  { value: 0, label: 'Tidak beli oleh-oleh' },
  { value: 50000, label: 'Rp 50.000 (Oleh-oleh ringan)' },
  { value: 150000, label: 'Rp 150.000 (Oleh-oleh standar)' },
  { value: 300000, label: 'Rp 300.000 (Oleh-oleh lengkap)' },
]

// Pilihan jenis kendaraan
export const VEHICLE_OPTIONS = [
  { value: 'motor', label: '🏍️ Motor', description: '40-60 km/liter' },
  { value: 'mobil', label: '🚗 Mobil', description: '10-18 km/liter' },
]

// Pilihan hari kunjungan — mempengaruhi harga tiket destinasi
export const DAY_TYPE_OPTIONS = [
  {
    value: 'weekday',
    label: '📅 Weekday',
    description: 'Senin – Jumat',
    note: 'Harga lebih murah di beberapa destinasi',
  },
  {
    value: 'weekend',
    label: '🎉 Weekend',
    description: 'Sabtu – Minggu',
    note: 'Harga lebih tinggi di beberapa destinasi',
  },
]

// URL WebGIS eksternal Pujon Kidul
export const WEBGIS_URL = 'https://www.arcgis.com/apps/instant/basic/index.html?appid=647f2b41fe55407d88c40f6b7afc0660'

// Design token warna — sesuai palette brand
export const COLORS = {
  dark:   '#41431B',
  sage:   '#AEB784',
  forest: '#4C5C2D',
  green:  '#237227',
  cream:  '#E3DBBB',
  ivory:  '#F8F3E1',
  lime:   '#AEB877',
}

// Warna Chart.js menggunakan palette brand
export const CHART_COLORS = {
  primary:       'rgba(35, 114, 39, 0.8)',   // brand.green
  primaryBorder: 'rgba(35, 114, 39, 1)',
  secondary:     'rgba(174, 184, 119, 0.8)', // brand.lime
  secondaryBorder:'rgba(174, 184, 119, 1)',
}

// 4 rute akses jalan menuju Pujon Kidul
// origin/destination digunakan untuk Google Maps Directions API
export const TRAFFIC_ROUTES = [
  {
    id: 'batu-pujon',
    name: 'Jalur Utama Batu–Pujon',
    description: 'Rute paling populer via Kota Batu. Jalan 2 jalur, cocok semua kendaraan. ±15 km.',
    origin: 'Kota Batu, Jawa Timur',
    destination: 'Pujon Kidul, Malang, Jawa Timur',
    waypoints: [],
  },
  {
    id: 'songgoriti',
    name: 'Jalur Alternatif Songgoriti',
    description: 'Rute via Songgoriti, pemandangan lebih indah, jalan lebih sempit. ±18 km.',
    origin: 'Songgoriti, Batu, Jawa Timur',
    destination: 'Pujon Kidul, Malang, Jawa Timur',
    waypoints: [],
  },
  {
    id: 'malang-kota',
    name: 'Jalur dari Malang Kota',
    description: 'Dari pusat Kota Malang via Batu. Jarak ±35 km, waktu tempuh ±1 jam.',
    origin: 'Kota Malang, Jawa Timur',
    destination: 'Pujon Kidul, Malang, Jawa Timur',
    waypoints: [],
  },
  {
    id: 'kediri-pujon',
    name: 'Jalur Kediri–Pujon',
    description: 'Dari arah barat via Kediri. Jarak ±80 km, melewati pegunungan.',
    origin: 'Kota Kediri, Jawa Timur',
    destination: 'Pujon Kidul, Malang, Jawa Timur',
    waypoints: [],
  },
]
