import { WEBGIS_URL } from '../utils/constants'

// Halaman WebGIS — redirect ke platform WebGIS eksternal ArcGIS
function WebGISPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌐</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          WebGIS Pujon Kidul
        </h1>
        <p className="text-gray-500 text-lg">
          Analisis spasial dan pemetaan kawasan wisata Pujon Kidul
        </p>
      </div>

      {/* Kartu informasi WebGIS */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
        <h2 className="font-bold text-gray-800 text-xl mb-4">
          Tentang WebGIS Pujon Kidul
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Platform WebGIS Pujon Kidul menyediakan analisis geospasial mendalam tentang
          kawasan wisata Pujon Kidul, Malang. Dengan menggunakan teknologi ArcGIS,
          platform ini menampilkan data spasial seperti batas wilayah, infrastruktur,
          dan potensi wisata dalam format peta interaktif yang komprehensif.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '🗺️', title: 'Peta Tematik', desc: 'Visualisasi data spasial kawasan' },
            { icon: '📊', title: 'Analisis Spasial', desc: 'Data geospasial terperinci' },
            { icon: '🏔️', title: 'Topografi', desc: 'Kontur dan elevasi wilayah' },
          ].map((f) => (
            <div key={f.title} className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-green-800 text-sm">{f.title}</h3>
              <p className="text-green-600 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Peringatan redirect ke situs eksternal */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">
                Perhatian: Anda akan diarahkan ke situs eksternal
              </p>
              <p className="text-amber-700 text-sm">
                Tombol di bawah akan membuka platform WebGIS ArcGIS di tab browser baru.
                Pastikan koneksi internet Anda stabil untuk pengalaman terbaik.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol buka WebGIS */}
        <a
          href={WEBGIS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-center text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          🌐 Buka WebGIS Pujon Kidul
        </a>

        <p className="text-center text-gray-400 text-xs mt-3">
          Akan dibuka di tab baru · Powered by ArcGIS
        </p>
      </div>
    </div>
  )
}

export default WebGISPage
