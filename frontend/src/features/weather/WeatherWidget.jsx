import { useWeather } from '../../hooks/useWeather'
import SkeletonLoader from '../../components/SkeletonLoader'

// Komponen widget cuaca untuk section hero halaman beranda
// Data cuaca diambil dari backend proxy — API key OWM tidak ada di frontend
function WeatherWidget() {
  const { weather, isLoading, error } = useWeather()

  if (isLoading) {
    return <SkeletonLoader type="weather" />
  }

  // Tampilkan pesan error tanpa mengganggu konten lain
  if (error || !weather) {
    return (
      <p className="text-sm italic" style={{ color: '#AEB784' }}>
        ☁️ Data cuaca tidak tersedia saat ini
      </p>
    )
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 w-fit"
      style={{ backgroundColor: 'rgba(76, 92, 45, 0.6)' }}
    >
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        className="w-12 h-12"
      />
      <div>
        <p className="font-bold text-2xl leading-none" style={{ color: '#F8F3E1' }}>
          {Math.round(weather.temp)}°C
        </p>
        <p className="text-sm capitalize" style={{ color: '#AEB784' }}>{weather.description}</p>
        <p className="text-xs mt-0.5" style={{ color: '#AEB877' }}>
          💧 {weather.humidity}% · 💨 {weather.wind_speed} m/s
        </p>
      </div>
    </div>
  )
}

export default WeatherWidget
