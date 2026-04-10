// Fungsi untuk memformat angka ke format Rupiah Indonesia
// Contoh: 50000 → "Rp 50.000"
export function formatRupiah(amount) {
  if (amount === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Fungsi untuk memformat angka ke format singkat Rupiah
// Contoh: 50000 → "Rp 50.000"
export function formatRupiahShort(amount) {
  if (amount === 0) return 'Gratis'
  return `Rp ${amount.toLocaleString('id-ID')}`
}
