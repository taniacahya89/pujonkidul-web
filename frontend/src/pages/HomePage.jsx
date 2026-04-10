import { useNavigate } from 'react-router-dom'
import { useFeaturedDestinations } from '../hooks/useDestinations'
import WeatherWidget from '../features/weather/WeatherWidget'
import DestinationCard from '../features/destination/DestinationCard'
import SkeletonLoader from '../components/SkeletonLoader'

// Halaman beranda Pujon Kidul Explore
function HomePage() {
  const navigate = useNavigate()
  const { featuredDestinations, isLoading, error } = useFeaturedDestinations()

  return (
    <div>
      {/* ===== SECTION HERO ===== */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white overflow-hidden">
        {/* Dekorasi latar belakang */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            {/* Badge lokasi */}
            <span className="inline-block bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-4">
              📍 Pujon Kidul, Malang, Jawa Timur
            </span>

            {/* Judul utama */}
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Jelajahi Keindahan
              <br />
              <span className="text-yellow-300">Pujon Kidul</span>
            </h1>

            {/* Deskripsi singkat */}
            <p className="text-white/80 text-lg mb-6 leading-relaxed">
              Temukan destinasi wisata alam, kuliner, dan budaya yang memukau di
              kawasan Pujon Kidul. Dari cafe sawah hingga air terjun tersembunyi.
            </p>

            {/* Widget cuaca */}
            <div className="mb-8">
              <WeatherWidget />
            </div>

            {/* Tombol CTA */}
            <button
              onClick={() => navigate('/budget')}
              className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              🗺️ Rencanakan Wisata
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION DESTINASI UNGGULAN ===== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
            Pilihan Terbaik
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            Destinasi Unggulan
          </h2>
          <p className="text-gray-500 mt-2">
            Tiga destinasi paling populer di kawasan Pujon Kidul
          </p>
        </div>

        {/* Loading state */}
        {isLoading && <SkeletonLoader type="card" count={3} />}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-red-500">Gagal memuat destinasi unggulan.</p>
          </div>
        )}

        {/* Grid destinasi unggulan */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                colorIndex={index}
              />
            ))}
          </div>
        )}

        {/* Tombol lihat semua */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/wisata')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Lihat Semua Destinasi →
          </button>
        </div>
      </section>

      {/* ===== SECTION FITUR APLIKASI ===== */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
            Fitur Lengkap untuk Wisatawan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🗺️', title: 'Peta Interaktif', desc: 'Lihat lokasi semua destinasi', path: '/peta' },
              { icon: '💰', title: 'Kalkulator Budget', desc: 'Hitung estimasi biaya perjalanan', path: '/budget' },
              { icon: '🛣️', title: 'Akses Jalan', desc: 'Cek kondisi jalan terkini', path: '/peta' },
              { icon: '🌐', title: 'WebGIS', desc: 'Analisis spasial kawasan', path: '/webgis' },
            ].map((feature) => (
              <button
                key={feature.title}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
