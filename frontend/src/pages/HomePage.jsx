import { useNavigate } from 'react-router-dom'
import { useFeaturedDestinations } from '../hooks/useDestinations'
import WeatherWidget from '../features/weather/WeatherWidget'
import DestinationCard from '../features/destination/DestinationCard'
import SkeletonLoader from '../components/SkeletonLoader'

function HomePage() {
  const navigate = useNavigate()
  const { featuredDestinations, isLoading, error } = useFeaturedDestinations()

  return (
    <div>
      {/* HERO */}
      <section className="hero-video-container" style={{ minHeight: '100vh' }}>
        <video
          className="hero-video"
          src="/images/images_video.mp4.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay" />

        <div className="hero-content flex flex-col justify-end" style={{ minHeight: '100vh', paddingBottom: '12vh' }}>
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div style={{ maxWidth: '560px' }}>
              {/* Eyebrow */}
              <p
                className="text-xs font-medium uppercase tracking-widest mb-6"
                style={{ color: 'rgba(227, 219, 187, 0.7)' }}
              >
                Pujon Kidul · Malang · Jawa Timur
              </p>

              {/* H1 */}
              <h1
                className="font-display mb-6"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                  color: '#F8F3E1',
                  lineHeight: 1.08,
                }}
              >
                Jelajahi<br />
                <span style={{ color: '#C8C98A' }}>Pujon Kidul</span>
              </h1>

              {/* Body */}
              <p
                className="mb-8 leading-relaxed"
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(248, 243, 225, 0.68)',
                  maxWidth: '420px',
                  lineHeight: '1.7',
                }}
              >
                Destinasi wisata alam, kuliner, dan budaya di kawasan Pujon Kidul —
                dari cafe sawah hingga taman bunga bergaya Eropa.
              </p>

              {/* Weather */}
              <div className="mb-8">
                <WeatherWidget />
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary" onClick={() => navigate('/wisata')}>
                  Lihat Destinasi
                </button>
                <button className="btn-ghost" onClick={() => navigate('/budget')}>
                  Rencanakan Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINASI UNGGULAN */}
      <section className="max-w-7xl mx-auto px-6" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-3)', marginBottom: '8px' }}
          >
            Pilihan Terbaik
          </p>
          <h2 className="font-display text-3xl" style={{ color: 'var(--text-1)' }}>
            Destinasi Unggulan
          </h2>
        </div>

        {isLoading && <SkeletonLoader type="card" count={3} />}
        {error && !isLoading && (
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Gagal memuat destinasi unggulan.</p>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}

        <div style={{ marginTop: '36px' }}>
          <button className="btn-secondary" onClick={() => navigate('/wisata')}>
            Lihat Semua Destinasi
          </button>
        </div>
      </section>

      {/* FITUR */}
      <section style={{ backgroundColor: 'var(--surface)', paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ marginBottom: '36px' }}>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-3)', marginBottom: '8px' }}
            >
              Fitur Aplikasi
            </p>
            <h2 className="font-display text-2xl" style={{ color: 'var(--text-1)' }}>
              Semua yang Kamu Butuhkan
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Peta Interaktif',    desc: 'Lokasi semua destinasi',    path: '/peta' },
              { title: 'Kalkulator Budget',  desc: 'Estimasi biaya perjalanan', path: '/budget' },
              { title: 'Akses Jalan',        desc: 'Kondisi lalu lintas',       path: '/akses-jalan' },
              { title: 'Tanya Asisten',      desc: 'Info wisata via chat',      path: null },
            ].map((f) => (
              <button
                key={f.title}
                onClick={() => f.path ? navigate(f.path) : document.getElementById('chatbot-btn')?.click()}
                className="text-left rounded-xl p-5 transition-all duration-150"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--surface-2)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,46,15,0.08)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-1)' }}>{f.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
