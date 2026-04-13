import { formatRupiahShort } from '../../utils/formatCurrency'

// Label hari kunjungan untuk ditampilkan di UI
const DAY_LABEL = {
  weekday: { text: 'Weekday (Senin–Jumat)', badge: '📅 Weekday', color: '#4C5C2D' },
  weekend: { text: 'Weekend (Sabtu–Minggu)', badge: '🎉 Weekend', color: '#237227' },
}

// Komponen tampilan hasil kalkulasi budget
// Menampilkan harga sesuai day_type yang dipilih user — tidak menampilkan dua harga sekaligus
function BudgetResult({ result }) {
  if (!result) return null

  const dayInfo = DAY_LABEL[result.day_type] || DAY_LABEL.weekday

  return (
    <div className="rounded-2xl shadow-md overflow-hidden" style={{ backgroundColor: '#fff' }}>
      {/* Header — tampilkan konteks hari kunjungan */}
      <div className="p-5" style={{ backgroundColor: '#4C5C2D' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg" style={{ color: '#F8F3E1' }}>
            💰 Estimasi Budget Perjalanan
          </h3>
          {/* Badge hari kunjungan — jelas dan eksplisit */}
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: '#AEB877', color: '#41431B' }}
          >
            {dayInfo.badge}
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: '#AEB784' }}>
          {dayInfo.text} · {result.distance_km} km · BBM {result.fuel_liters?.toFixed(1)} liter
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Breakdown tiket per destinasi — transparan dan akurat */}
        {result.destination_tickets && result.destination_tickets.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#4C5C2D' }}>
              🎫 Tiket Masuk ({dayInfo.badge})
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E3DBBB' }}>
              {result.destination_tickets.map((dt, i) => (
                <div
                  key={dt.id}
                  className="flex justify-between items-center px-3 py-2 text-sm"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#F8F3E1' : '#fff',
                    color: '#41431B',
                  }}
                >
                  <span className="truncate pr-2">{dt.name}</span>
                  <span className="font-semibold flex-shrink-0">{formatRupiahShort(dt.ticket_price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown biaya per kategori */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: '🚗 Transport (PP)',
              value: result.transport_cost,
              desc: `${result.distance_km} km × 2`,
              bg: '#EFF6FF',
              textColor: '#1d4ed8',
            },
            {
              label: '🎫 Aktivitas',
              value: result.activity_cost,
              desc: `Tiket × ${result.destination_tickets?.length || 0} destinasi`,
              bg: '#F5F3FF',
              textColor: '#6d28d9',
            },
            {
              label: '🍽️ Makan',
              value: result.meal_cost,
              desc: '3× sehari',
              bg: '#FFF7ED',
              textColor: '#c2410c',
            },
            {
              label: '🛍️ Oleh-oleh',
              value: result.souvenir_cost,
              desc: 'Per orang',
              bg: '#FDF2F8',
              textColor: '#be185d',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3"
              style={{ backgroundColor: item.bg }}
            >
              <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>{item.label}</p>
              <p className="font-bold text-base" style={{ color: item.textColor }}>
                {formatRupiahShort(item.value)}
              </p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Total estimasi */}
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#237227' }}>
          <p className="text-sm mb-1" style={{ color: '#AEB784' }}>Total Estimasi</p>
          <p className="font-bold text-3xl" style={{ color: '#F8F3E1' }}>
            {formatRupiahShort(result.total_estimate)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#AEB877' }}>
            Berdasarkan harga {dayInfo.text.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BudgetResult
