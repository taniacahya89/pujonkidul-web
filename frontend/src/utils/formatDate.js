// Nama bulan dalam Bahasa Indonesia
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

// Fungsi untuk memformat tanggal ke format Indonesia
// Contoh: "2024-01-15T10:00:00Z" → "15 Januari 2024, 10:00 WIB"
export function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = BULAN[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`
  } catch {
    return dateString
  }
}

// Fungsi untuk memformat tanggal singkat
// Contoh: "2024-01-15T10:00:00Z" → "15 Jan 2024"
export function formatDateShort(dateString) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = BULAN[date.getMonth()].slice(0, 3)
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return dateString
  }
}
