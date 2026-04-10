// Komponen tips hemat perjalanan dan rekomendasi waktu berkunjung
// Props:
//   - tips: array string tips dari backend
//   - bestVisitTime: string rekomendasi waktu terbaik berkunjung
function TravelTips({ tips, bestVisitTime }) {
  if (!tips || tips.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Tips hemat perjalanan */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          💡 Tips Hemat Perjalanan
        </h4>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rekomendasi waktu terbaik berkunjung */}
      {bestVisitTime && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            ⏰ Rekomendasi Waktu Berkunjung
          </h4>
          <p className="text-blue-700 text-sm">{bestVisitTime}</p>
        </div>
      )}
    </div>
  )
}

export default TravelTips
