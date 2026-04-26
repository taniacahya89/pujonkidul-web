import { formatRupiahShort } from '../../utils/formatCurrency'

const DAY_LABEL = {
  weekday: { text: 'Weekday (Senin–Jumat)', badge: 'Weekday' },
  weekend: { text: 'Weekend (Sabtu–Minggu)', badge: 'Weekend' },
}

function BudgetResult({ result }) {
  if (!result) return null

  const dayInfo = DAY_LABEL[result.day_type] || DAY_LABEL.weekday

  const breakdown = [
    { label: 'Transport (PP)',  value: result.transport_cost,  desc: `${result.distance_km} km × 2` },
    { label: 'Aktivitas',       value: result.activity_cost,   desc: `${result.destination_tickets?.length || 0} destinasi` },
    { label: 'Makan',           value: result.meal_cost,        desc: '3× sehari' },
    { label: 'Oleh-oleh',       value: result.souvenir_cost,    desc: 'Per orang' },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#fff',
        border: '1px solid var(--surface-2)',
        boxShadow: '0 1px 4px rgba(44,46,15,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>
          <p className="font-semibold text-sm" style={{ color: '#F8F3E1' }}>Estimasi Budget</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(248,243,225,0.65)' }}>
            {dayInfo.text} · {result.distance_km} km · {result.fuel_liters?.toFixed(1)} L BBM
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(248,243,225,0.15)', color: '#E3DBBB' }}
        >
          {dayInfo.badge}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Tiket per destinasi */}
        {result.destination_tickets?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>
              Tiket Masuk · {dayInfo.badge}
            </p>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--surface-2)' }}
            >
              {result.destination_tickets.map((dt, i) => (
                <div
                  key={dt.id}
                  className="flex justify-between items-center px-3 py-2.5 text-sm"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--bg)' : '#fff',
                    color: 'var(--text-1)',
                    borderBottom: i < result.destination_tickets.length - 1 ? '1px solid var(--surface-2)' : 'none',
                  }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-2)' }}>{dt.name}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>
                    {formatRupiahShort(dt.ticket_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown 2×2 */}
        <div className="grid grid-cols-2 gap-2.5">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-2)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{item.label}</p>
              <p className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>
                {formatRupiahShort(item.value)}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <p className="text-xs mb-1" style={{ color: 'rgba(248,243,225,0.65)' }}>Total Estimasi</p>
          <p className="font-bold text-2xl" style={{ color: '#F8F3E1' }}>
            {formatRupiahShort(result.total_estimate)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(248,243,225,0.5)' }}>
            Harga {dayInfo.text.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BudgetResult
