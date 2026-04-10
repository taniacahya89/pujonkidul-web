import { formatRupiahShort } from '../../utils/formatCurrency'

// Komponen tampilan hasil kalkulasi budget perjalanan
// Prop result: objek BudgetResponse dari backend
function BudgetResult({ result }) {
  if (!result) return null

  // Item breakdown biaya
  const breakdownItems = [
    {
      label: '🚗 Transport (PP)',
      value: result.transport_cost,
      desc: `${result.distance_km} km × 2 (pulang-pergi)`,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-700',
    },
    {
      label: '🎫 Aktivitas',
      value: result.activity_cost,
      desc: 'Tiket masuk semua destinasi',
      color: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-700',
    },
    {
      label: '🍽️ Makan',
      value: result.meal_cost,
      desc: '3 kali makan per hari',
      color: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-700',
    },
    {
      label: '🛍️ Oleh-oleh',
      value: result.souvenir_cost,
      desc: 'Per orang',
      color: 'bg-pink-50 border-pink-100',
      textColor: 'text-pink-700',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header hasil */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5">
        <h3 className="text-white font-bold text-lg mb-1">💰 Estimasi Budget Perjalanan</h3>
        <p className="text-white/80 text-sm">
          Jarak tempuh: {result.distance_km} km · BBM: {result.fuel_liters?.toFixed(1)} liter
        </p>
      </div>

      <div className="p-5">
        {/* Breakdown biaya */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {breakdownItems.map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-3 ${item.color}`}
            >
              <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
              <p className={`font-bold text-base ${item.textColor}`}>
                {formatRupiahShort(item.value)}
              </p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Total estimasi */}
        <div className="bg-green-600 rounded-xl p-4 text-center">
          <p className="text-white/80 text-sm mb-1">Total Estimasi</p>
          <p className="text-white font-bold text-3xl">
            {formatRupiahShort(result.total_estimate)}
          </p>
          <p className="text-white/60 text-xs mt-1">
            Estimasi untuk seluruh perjalanan
          </p>
        </div>
      </div>
    </div>
  )
}

export default BudgetResult
