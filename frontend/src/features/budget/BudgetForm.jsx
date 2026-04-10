import { useState, useEffect } from 'react'
import { validateBudgetForm } from '../../utils/budgetValidation'
import { MEAL_BUDGET_OPTIONS, SOUVENIR_BUDGET_OPTIONS, VEHICLE_OPTIONS } from '../../utils/constants'
import { formatRupiahShort } from '../../utils/formatCurrency'
import useDestinationStore from '../../store/destinationStore'

// Komponen form input kalkulator budget perjalanan
// Props:
//   - provinces: array provinsi dari store
//   - cities: array kota berdasarkan provinsi yang dipilih
//   - isLoading: status loading data
//   - isCalculating: status kalkulasi sedang berjalan
//   - onProvinceChange: callback saat provinsi berubah
//   - onSubmit: callback saat form disubmit dengan data valid
function BudgetForm({
  provinces,
  cities,
  isLoading,
  isCalculating,
  onProvinceChange,
  onSubmit,
}) {
  const { destinations } = useDestinationStore()

  // State form
  const [formData, setFormData] = useState({
    provinceId: '',
    cityId: '',
    vehicleType: 'motor',
    personCount: 2,
    destinationIds: [],
    mealBudget: 50000,
    souvenirBudget: 150000,
    estimatedDays: 1,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validasi real-time saat formData berubah
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: newErrors } = validateBudgetForm(formData)
      setErrors(newErrors)
    }
  }, [formData])

  // Handler perubahan field
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Handler perubahan provinsi (trigger fetch kota)
  const handleProvinceChange = (provinceId) => {
    handleChange('provinceId', provinceId)
    handleChange('cityId', '') // Reset kota saat provinsi berubah
    onProvinceChange(provinceId)
  }

  // Handler toggle destinasi (multi-select)
  const handleDestinationToggle = (destId) => {
    const numId = Number(destId)
    setFormData((prev) => {
      const ids = prev.destinationIds.includes(numId)
        ? prev.destinationIds.filter((id) => id !== numId)
        : [...prev.destinationIds, numId]
      return { ...prev, destinationIds: ids }
    })
    setTouched((prev) => ({ ...prev, destinations: true }))
  }

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    // Tandai semua field sebagai touched
    setTouched({
      province: true, city: true, destinations: true,
      personCount: true, vehicleType: true, mealBudget: true, souvenirBudget: true,
    })

    const { isValid, errors: validationErrors } = validateBudgetForm(formData)
    setErrors(validationErrors)

    if (!isValid) return

    // Kirim data ke parent
    onSubmit({
      province_id: Number(formData.provinceId),
      city_id: Number(formData.cityId),
      vehicle_type: formData.vehicleType,
      person_count: Number(formData.personCount),
      destination_ids: formData.destinationIds,
      meal_budget: Number(formData.mealBudget),
      souvenir_budget: Number(formData.souvenirBudget),
      estimated_days: Number(formData.estimatedDays),
    })
  }

  const { isValid } = validateBudgetForm(formData)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Provinsi dan Kota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dropdown Provinsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provinsi Asal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
              errors.province && touched.province ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.province && touched.province && (
            <p className="text-red-500 text-xs mt-1">{errors.province}</p>
          )}
        </div>

        {/* Dropdown Kota (dependent) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kota Asal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.cityId}
            onChange={(e) => handleChange('cityId', e.target.value)}
            disabled={!formData.provinceId || isLoading}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-50 disabled:text-gray-400 ${
              errors.city && touched.city ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">-- Pilih Kota --</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.distance_km} km)
              </option>
            ))}
          </select>
          {errors.city && touched.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Kendaraan dan Jumlah Orang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Jenis Kendaraan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Kendaraan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {VEHICLE_OPTIONS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => handleChange('vehicleType', v.value)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors ${
                  formData.vehicleType === v.value
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                }`}
              >
                {v.label}
                <span className="block text-xs opacity-70">{v.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Jumlah Orang */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah Orang (1-10) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.personCount}
            onChange={(e) => handleChange('personCount', e.target.value)}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
              errors.personCount && touched.personCount ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.personCount && touched.personCount && (
            <p className="text-red-500 text-xs mt-1">{errors.personCount}</p>
          )}
        </div>
      </div>

      {/* Destinasi yang akan dikunjungi (multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destinasi yang Dikunjungi <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {destinations.map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => handleDestinationToggle(dest.id)}
              className={`text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                formData.destinationIds.includes(dest.id)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              <span className="block font-medium truncate">{dest.name}</span>
              <span className="opacity-70">{formatRupiahShort(dest.ticket_price)}</span>
            </button>
          ))}
        </div>
        {errors.destinations && touched.destinations && (
          <p className="text-red-500 text-xs mt-1">{errors.destinations}</p>
        )}
      </div>

      {/* Anggaran Makan dan Oleh-oleh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Anggaran Makan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anggaran Makan / Orang / Kali
          </label>
          <div className="space-y-2">
            {MEAL_BUDGET_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mealBudget"
                  value={opt.value}
                  checked={Number(formData.mealBudget) === opt.value}
                  onChange={() => handleChange('mealBudget', opt.value)}
                  className="text-green-600"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Anggaran Oleh-oleh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anggaran Oleh-oleh / Orang
          </label>
          <div className="space-y-2">
            {SOUVENIR_BUDGET_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="souvenirBudget"
                  value={opt.value}
                  checked={Number(formData.souvenirBudget) === opt.value}
                  onChange={() => handleChange('souvenirBudget', opt.value)}
                  className="text-green-600"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Estimasi hari */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimasi Lama Perjalanan (hari)
        </label>
        <input
          type="number"
          min="1"
          max="7"
          value={formData.estimatedDays}
          onChange={(e) => handleChange('estimatedDays', e.target.value)}
          className="w-32 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Tombol submit */}
      <button
        type="submit"
        disabled={!isValid || isCalculating}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isValid && !isCalculating
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isCalculating ? '⏳ Menghitung...' : '💰 Hitung Budget'}
      </button>
    </form>
  )
}

export default BudgetForm
