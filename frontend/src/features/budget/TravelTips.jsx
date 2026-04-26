function TravelTips({ tips, bestVisitTime }) {
  if (!tips || tips.length === 0) return null

  return (
    <div className="space-y-3">
      {/* Tips hemat */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: '#fff',
          border: '1px solid var(--surface-2)',
          boxShadow: '0 1px 4px rgba(44,46,15,0.06)',
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-3)' }}
        >
          Tips Hemat Perjalanan
        </p>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs mt-0.5"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--accent)' }}
              >
                ✓
              </span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Waktu terbaik */}
      {bestVisitTime && (
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-2)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-3)' }}>
            Waktu Terbaik Berkunjung
          </p>
          <p className="text-sm" style={{ color: 'var(--text-1)' }}>{bestVisitTime}</p>
        </div>
      )}
    </div>
  )
}

export default TravelTips
