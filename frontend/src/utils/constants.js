// Konstanta aplikasi Pujon Kidul Explore

// Koordinat pusat kawasan Pujon Kidul untuk peta Leaflet
export const PUJON_KIDUL_CENTER = [-7.9285, 112.4012]
export const DEFAULT_MAP_ZOOM = 14

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

// URL WebGIS eksternal Pujon Kidul
export const WEBGIS_URL = 'https://www.arcgis.com/apps/instant/basic/index.html?appid=647f2b41fe55407d88c40f6b7afc0660'

// Warna tema untuk Chart.js
export const CHART_COLORS = {
  primary: 'rgba(22, 163, 74, 0.8)',
  primaryBorder: 'rgba(22, 163, 74, 1)',
  secondary: 'rgba(245, 158, 11, 0.8)',
  secondaryBorder: 'rgba(245, 158, 11, 1)',
}
