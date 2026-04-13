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
      {/* ===== SECTION HERO — warna solid brand.dark ===== */}
      <section className="text-white overflow-hidden" style={{ backgroundColor: '#41431B' }}>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            {/* Badge lokasi */}
            <span
              className="inline-block text-sm px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: '#4C5C2D', color: '#AEB784' }}
            >
              📍 Pujon Kidul, Malang, Jawa Timur
            </span>

            {/* Judul utama */}
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4" style={{ color: '#F8F3E1' }}>
              Jelajahi Keindahan
              <br />
              <span style={{ color: '#AEB877' }}>Pujon Kidul</span>
            </h1>

            {/* Deskripsi singkat */}
            <p className="text-lg mb-6 leading-relaxed" style={{ color: '#AEB784' }}>
              Temukan destinasi wisata alam, kuliner, dan budaya yang memukau di
              kawasan Pujon Kidul. Dari cafe sawah hingga taman bunga Eropa.
            </p>

            {/* Widget cuaca */}
            <div className="mb-8">
              <WeatherWidget />
            </div>

            {/* Tombol CTA — brand.lime bg */}
            <button
              onClick={() => navigate('/budget')}
              className="font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#AEB877', color: '#41431B' }}
            >
              🗺️ Rencanakan Wisata
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION DESTINASI UNGGULAN ===== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#237227' }}>
            Pilihan Terbaik
          </span>
          <h2 className="text-3xl font-bold mt-1" style={{ color: '#41431B' }}>
            Destinasi Unggulan
          </h2>
          <p className="mt-2" style={{ color: '#4C5C2D' }}>
            Tiga destinasi paling populer di kawasan Pujon Kidul
          </p>
        </div>

        {isLoading && <SkeletonLoader type="card" count={3} />}

        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-red-500">Gagal memuat destinasi unggulan.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/wisata')}
            className="font-semibold px-8 py-3 rounded-xl transition-colors"
            style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
          >
            Lihat Semua Destinasi →
          </button>
        </div>
      </section>

      {/* ===== SECTION FITUR APLIKASI ===== */}
      <section className="py-16" style={{ backgroundColor: '#E3DBBB' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#41431B' }}>
            Fitur Lengkap untuk Wisatawan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🗺️', title: 'Peta Interaktif', desc: 'Lihat lokasi semua destinasi', path: '/peta' },
              { icon: '💰', title: 'Kalkulator Budget', desc: 'Hitung estimasi biaya perjalanan', path: '/budget' },
              { icon: '🛣️', title: 'Akses Jalan', desc: 'Cek kondisi lalu lintas terkini', path: '/akses-jalan' },
              { icon: '🤖', title: 'Tanya Chatbot', desc: 'Info wisata via chat', path: null },
            ].map((feature) => (
              <button
                key={feature.title}
                onClick={() => feature.path ? navigate(feature.path) : document.getElementById('chatbot-btn')?.click()}
                className="rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ backgroundColor: '#F8F3E1' }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-sm" style={{ color: '#41431B' }}>{feature.title}</h3>
                <p className="text-xs mt-1" style={{ color: '#4C5C2D' }}>{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
