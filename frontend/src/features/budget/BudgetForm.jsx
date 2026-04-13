import { useState, useEffect } from 'react'
import { validateBudgetForm } from '../../utils/budgetValidation'
import {
  MEAL_BUDGET_OPTIONS,
  SOUVENIR_BUDGET_OPTIONS,
  VEHICLE_OPTIONS,
  DAY_TYPE_OPTIONS,
} from '../../utils/constants'
import { formatRupiahShort } from '../../utils/formatCurrency'
import useDestinationStore from '../../store/destinationStore'

// Hitung harga tiket destinasi berdasarkan day_type
// Menggunakan struktur data yang sama dengan backend (ticket_weekday/ticket_weekend)
function resolveTicketPrice(dest, dayType) {
  if (dayType === 'weekday' && dest.ticket_weekday > 0) return dest.ticket_weekday
  if (dayType === 'weekend' && dest.ticket_weekend > 0) return dest.ticket_weekend
  return dest.ticket_price // fallback harga tunggal
}

// Komponen form kalkulator budget — context-aware terhadap hari kunjungan
function BudgetForm({ provinces, cities, isLoading, isCalculating, onProvinceChange, onSubmit }) {
  const { destinations } = useDestinationStore()

  const [formData, setFormData] = useState({
    provinceId: '',
    cityId: '',
    vehicleType: 'motor',
    personCount: 2,
    destinationIds: [],
    dayType: '',        // wajib dipilih — mempengaruhi harga tiket
    mealBudget: 50000,
    souvenirBudget: 150000,
    estimatedDays: 1,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validasi real-time
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: newErrors } = validateBudgetForm(formData)
      setErrors(newErrors)
    }
  }, [formData])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleProvinceChange = (provinceId) => {
    handleChange('provinceId', provinceId)
    handleChange('cityId', '')
    onProvinceChange(provinceId)
  }

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      province: true, city: true, destinations: true,
      personCount: true, vehicleType: true, dayType: true,
      mealBudget: true, souvenirBudget: true,
    })
    const { isValid, errors: validationErrors } = validateBudgetForm(formData)
    setErrors(validationErrors)
    if (!isValid) return

    onSubmit({
      province_id:     Number(formData.provinceId),
      city_id:         Number(formData.cityId),
      vehicle_type:    formData.vehicleType,
      person_count:    Number(formData.personCount),
      destination_ids: formData.destinationIds,
      day_type:        formData.dayType,
      meal_budget:     Number(formData.mealBudget),
      souvenir_budget: Number(formData.souvenirBudget),
      estimated_days:  Number(formData.estimatedDays),
    })
  }

  const { isValid } = validateBudgetForm(formData)

  // Label hari untuk ditampilkan di UI
  const dayLabel = formData.dayType === 'weekday'
    ? 'Harga Weekday'
    : formData.dayType === 'weekend'
    ? 'Harga Weekend'
    : 'Harga Tiket'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Provinsi dan Kota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#41431B' }}>
            Provinsi Asal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{
              border: `1px solid ${errors.province && touched.province ? '#ef4444' : '#AEB784'}`,
              color: '#41431B',
            }}
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

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#41431B' }}>
            Kota Asal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.cityId}
            onChange={(e) => handleChange('cityId', e.target.value)}
            disabled={!formData.provinceId || isLoading}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50"
            style={{
              border: `1px solid ${errors.city && touched.city ? '#ef4444' : '#AEB784'}`,
              color: '#41431B',
            }}
          >
            <option value="">-- Pilih Kota --</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.distance_km} km)</option>
            ))}
          </select>
          {errors.city && touched.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Kendaraan dan Jumlah Orang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#41431B' }}>
            Jenis Kendaraan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {VEHICLE_OPTIONS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => handleChange('vehicleType', v.value)}
                className="flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors"
                style={{
                  backgroundColor: formData.vehicleType === v.value ? '#237227' : '#fff',
                  color: formData.vehicleType === v.value ? '#F8F3E1' : '#41431B',
                  borderColor: formData.vehicleType === v.value ? '#237227' : '#AEB784',
                }}
              >
                {v.label}
                <span className="block text-xs opacity-70">{v.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#41431B' }}>
            Jumlah Orang (1–10) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.personCount}
            onChange={(e) => handleChange('personCount', e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{
              border: `1px solid ${errors.personCount && touched.personCount ? '#ef4444' : '#AEB784'}`,
              color: '#41431B',
            }}
          />
          {errors.personCount && touched.personCount && (
            <p className="text-red-500 text-xs mt-1">{errors.personCount}</p>
          )}
        </div>
      </div>

      {/* ===== HARI KUNJUNGAN — mempengaruhi harga tiket ===== */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#41431B' }}>
          Hari Kunjungan <span className="text-red-500">*</span>
          <span className="ml-2 text-xs font-normal" style={{ color: '#4C5C2D' }}>
            (mempengaruhi harga tiket beberapa destinasi)
          </span>
        </label>
        <div className="flex gap-3">
          {DAY_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('dayType', opt.value)}
              className="flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-left"
              style={{
                backgroundColor: formData.dayType === opt.value ? '#4C5C2D' : '#fff',
                color: formData.dayType === opt.value ? '#F8F3E1' : '#41431B',
                borderColor: formData.dayType === opt.value ? '#4C5C2D' : '#AEB784',
              }}
            >
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-xs opacity-80">{opt.description}</span>
              <span className="block text-xs mt-0.5 opacity-70">{opt.note}</span>
            </button>
          ))}
        </div>
        {errors.dayType && touched.dayType && (
          <p className="text-red-500 text-xs mt-1">{errors.dayType}</p>
        )}
      </div>

      {/* Destinasi — harga ditampilkan sesuai day_type yang dipilih */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#41431B' }}>
          Destinasi yang Dikunjungi <span className="text-red-500">*</span>
          {formData.dayType && (
            <span
              className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#E3DBBB', color: '#4C5C2D' }}
            >
              {dayLabel}
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {destinations.map((dest) => {
            const price = resolveTicketPrice(dest, formData.dayType)
            const isSelected = formData.destinationIds.includes(dest.id)
            // Tandai destinasi yang memiliki harga berbeda weekday/weekend
            const hasDiffPrice = dest.ticket_weekday !== dest.ticket_weekend &&
              dest.ticket_weekday > 0 && dest.ticket_weekend > 0

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleDestinationToggle(dest.id)}
                className="text-left px-3 py-2 rounded-xl border text-xs transition-colors"
                style={{
                  backgroundColor: isSelected ? '#237227' : '#fff',
                  color: isSelected ? '#F8F3E1' : '#41431B',
                  borderColor: isSelected ? '#237227' : '#AEB784',
                }}
              >
                <span className="block font-medium truncate">{dest.name}</span>
                <span className="opacity-80">
                  {formData.dayType ? formatRupiahShort(price) : formatRupiahShort(dest.ticket_price)}
                </span>
                {/* Indikator harga berbeda weekday/weekend */}
                {hasDiffPrice && (
                  <span
                    className="block text-xs mt-0.5"
                    style={{ color: isSelected ? '#AEB877' : '#4C5C2D', opacity: 0.8 }}
                  >
                    ⚡ harga bervariasi
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {errors.destinations && touched.destinations && (
          <p className="text-red-500 text-xs mt-1">{errors.destinations}</p>
        )}
      </div>

      {/* Anggaran Makan dan Oleh-oleh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#41431B' }}>
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
                />
                <span className="text-sm" style={{ color: '#41431B' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#41431B' }}>
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
                />
                <span className="text-sm" style={{ color: '#41431B' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Estimasi hari */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#41431B' }}>
          Estimasi Lama Perjalanan (hari)
        </label>
        <input
          type="number"
          min="1"
          max="7"
          value={formData.estimatedDays}
          onChange={(e) => handleChange('estimatedDays', e.target.value)}
          className="w-32 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
          style={{ border: '1px solid #AEB784', color: '#41431B' }}
        />
      </div>

      {/* Tombol submit */}
      <button
        type="submit"
        disabled={!isValid || isCalculating}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all"
        style={{
          backgroundColor: isValid && !isCalculating ? '#237227' : '#AEB784',
          color: '#F8F3E1',
          cursor: isValid && !isCalculating ? 'pointer' : 'not-allowed',
        }}
      >
        {isCalculating ? '⏳ Menghitung...' : '💰 Hitung Budget'}
      </button>
    </form>
  )
}

export default BudgetForm
