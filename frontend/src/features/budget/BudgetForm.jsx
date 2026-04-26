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

// Hitung harga tiket berdasarkan day_type — konsisten dengan backend
function resolveTicketPrice(dest, dayType) {
  if (dayType === 'weekday' && dest.ticket_weekday > 0) return dest.ticket_weekday
  if (dayType === 'weekend' && dest.ticket_weekend > 0) return dest.ticket_weekend
  return dest.ticket_price
}

// Style helper — input/select border berdasarkan error state
function inputBorder(hasError) {
  return `1px solid ${hasError ? '#C03030' : 'var(--surface-2)'}`
}

function BudgetForm({ provinces, cities, isLoading, isCalculating, onProvinceChange, onSubmit }) {
  const { destinations } = useDestinationStore()

  const [formData, setFormData] = useState({
    provinceId:     '',
    cityId:         '',
    vehicleType:    'motor',
    personCount:    2,
    destinationIds: [],
    dayType:        '',
    mealBudget:     50000,
    souvenirBudget: 150000,
    estimatedDays:  1,
  })

  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: e } = validateBudgetForm(formData)
      setErrors(e)
    }
  }, [formData])

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }))
    setTouched((p) => ({ ...p, [field]: true }))
  }

  const handleProvinceChange = (id) => {
    handleChange('provinceId', id)
    handleChange('cityId', '')
    onProvinceChange(id)
  }

  const handleDestinationToggle = (destId) => {
    const numId = Number(destId)
    setFormData((p) => {
      const ids = p.destinationIds.includes(numId)
        ? p.destinationIds.filter((id) => id !== numId)
        : [...p.destinationIds, numId]
      return { ...p, destinationIds: ids }
    })
    setTouched((p) => ({ ...p, destinations: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      province: true, city: true, destinations: true,
      personCount: true, vehicleType: true, dayType: true,
      mealBudget: true, souvenirBudget: true,
    })
    const { isValid, errors: ve } = validateBudgetForm(formData)
    setErrors(ve)
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

  const dayLabel = formData.dayType === 'weekday'
    ? 'Harga Weekday'
    : formData.dayType === 'weekend'
    ? 'Harga Weekend'
    : null

  // Style untuk tombol toggle (kendaraan, hari, destinasi)
  const toggleStyle = (active) => ({
    backgroundColor: active ? 'var(--accent)' : '#fff',
    color:           active ? 'var(--bg)'     : 'var(--text-1)',
    border:          active ? '1.5px solid var(--accent)' : '1.5px solid var(--surface-2)',
    boxShadow:       active ? '0 2px 8px rgba(61,107,53,0.22)' : 'none',
    transform:       active ? 'translateY(-1px)' : 'none',
    transition:      'all 0.15s ease',
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Provinsi & Kota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>
            Provinsi Asal <span style={{ color: '#C03030' }}>*</span>
          </label>
          <select
            value={formData.provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ border: inputBorder(errors.province && touched.province), color: 'var(--text-1)', backgroundColor: '#fff' }}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.province && touched.province && (
            <p className="text-xs mt-1" style={{ color: '#C03030' }}>{errors.province}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>
            Kota Asal <span style={{ color: '#C03030' }}>*</span>
          </label>
          <select
            value={formData.cityId}
            onChange={(e) => handleChange('cityId', e.target.value)}
            disabled={!formData.provinceId || isLoading}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50"
            style={{ border: inputBorder(errors.city && touched.city), color: 'var(--text-1)', backgroundColor: '#fff' }}
          >
            <option value="">-- Pilih Kota --</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.distance_km} km)</option>
            ))}
          </select>
          {errors.city && touched.city && (
            <p className="text-xs mt-1" style={{ color: '#C03030' }}>{errors.city}</p>
          )}
        </div>
      </div>

      {/* Kendaraan & Jumlah Orang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-1)' }}>
            Jenis Kendaraan <span style={{ color: '#C03030' }}>*</span>
          </label>
          <div className="flex gap-2">
            {VEHICLE_OPTIONS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => handleChange('vehicleType', v.value)}
                className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium"
                style={toggleStyle(formData.vehicleType === v.value)}
              >
                {v.label}
                <span className="block text-xs opacity-70">{v.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>
            Jumlah Orang (1–10) <span style={{ color: '#C03030' }}>*</span>
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.personCount}
            onChange={(e) => handleChange('personCount', e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ border: inputBorder(errors.personCount && touched.personCount), color: 'var(--text-1)', backgroundColor: '#fff' }}
          />
          {errors.personCount && touched.personCount && (
            <p className="text-xs mt-1" style={{ color: '#C03030' }}>{errors.personCount}</p>
          )}
        </div>
      </div>

      {/* Hari Kunjungan */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-1)' }}>
          Hari Kunjungan <span style={{ color: '#C03030' }}>*</span>
          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-3)' }}>
            (mempengaruhi harga tiket beberapa destinasi)
          </span>
        </label>
        <div className="flex gap-2">
          {DAY_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('dayType', opt.value)}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-left"
              style={toggleStyle(formData.dayType === opt.value)}
            >
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-xs opacity-80">{opt.description}</span>
              <span className="block text-xs mt-0.5 opacity-60">{opt.note}</span>
            </button>
          ))}
        </div>
        {errors.dayType && touched.dayType && (
          <p className="text-xs mt-1" style={{ color: '#C03030' }}>{errors.dayType}</p>
        )}
      </div>

      {/* Destinasi */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>
          Destinasi yang Dikunjungi <span style={{ color: '#C03030' }}>*</span>
          {dayLabel && (
            <span
              className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {dayLabel}
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {destinations.map((dest) => {
            const price = resolveTicketPrice(dest, formData.dayType)
            const isSelected = formData.destinationIds.includes(dest.id)
            const hasDiffPrice =
              dest.ticket_weekday > 0 &&
              dest.ticket_weekend > 0 &&
              dest.ticket_weekday !== dest.ticket_weekend

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleDestinationToggle(dest.id)}
                className="text-left px-3 py-2 rounded-xl text-xs"
                style={toggleStyle(isSelected)}
              >
                <span className="block font-medium truncate">{dest.name}</span>
                <span className="opacity-80">
                  {formData.dayType ? formatRupiahShort(price) : formatRupiahShort(dest.ticket_price)}
                </span>
                {hasDiffPrice && (
                  <span
                    className="block text-xs mt-0.5 opacity-70"
                    style={{ color: isSelected ? 'var(--bg)' : 'var(--text-3)' }}
                  >
                    ⚡ harga bervariasi
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {errors.destinations && touched.destinations && (
          <p className="text-xs mt-1" style={{ color: '#C03030' }}>{errors.destinations}</p>
        )}
      </div>

      {/* Anggaran Makan & Oleh-oleh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-1)' }}>
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
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-1)' }}>
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
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Estimasi hari */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>
          Estimasi Lama Perjalanan (hari)
        </label>
        <input
          type="number"
          min="1"
          max="7"
          value={formData.estimatedDays}
          onChange={(e) => handleChange('estimatedDays', e.target.value)}
          className="w-32 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
          style={{ border: '1px solid var(--surface-2)', color: 'var(--text-1)', backgroundColor: '#fff' }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isCalculating}
        className="btn-primary w-full"
        style={{
          fontSize: '0.9375rem',
          padding: '13px 24px',
          opacity: (!isValid || isCalculating) ? 0.5 : 1,
          cursor: (!isValid || isCalculating) ? 'not-allowed' : 'pointer',
        }}
      >
        {isCalculating ? '⏳ Menghitung...' : '💰 Hitung Budget'}
      </button>
    </form>
  )
}

export default BudgetForm
