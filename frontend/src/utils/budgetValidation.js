// Fungsi validasi form kalkulator budget
// Mengembalikan { isValid: boolean, errors: { fieldName: string } }
export function validateBudgetForm(formData) {
  const errors = {}

  // Validasi provinsi wajib dipilih
  if (!formData.provinceId) {
    errors.province = 'Pilih provinsi asal terlebih dahulu'
  }

  // Validasi kota wajib dipilih
  if (!formData.cityId) {
    errors.city = 'Pilih kota asal terlebih dahulu'
  }

  // Validasi destinasi wajib dipilih minimal 1
  if (!formData.destinationIds || formData.destinationIds.length === 0) {
    errors.destinations = 'Pilih minimal 1 destinasi yang akan dikunjungi'
  }

  // Validasi jumlah orang harus antara 1-10
  const personCount = Number(formData.personCount)
  if (!formData.personCount || isNaN(personCount)) {
    errors.personCount = 'Jumlah orang harus antara 1 hingga 10'
  } else if (personCount < 1 || personCount > 10) {
    errors.personCount = 'Jumlah orang harus antara 1 hingga 10'
  }

  // Validasi jenis kendaraan
  if (!formData.vehicleType) {
    errors.vehicleType = 'Pilih jenis kendaraan'
  }

  // Validasi anggaran makan
  if (!formData.mealBudget) {
    errors.mealBudget = 'Pilih anggaran makan per orang'
  }

  // Validasi anggaran oleh-oleh (0 adalah nilai valid)
  if (formData.souvenirBudget === undefined || formData.souvenirBudget === null || formData.souvenirBudget === '') {
    errors.souvenirBudget = 'Pilih anggaran oleh-oleh'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
