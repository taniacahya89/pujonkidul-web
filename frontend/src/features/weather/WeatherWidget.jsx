import { useWeather } from '../../hooks/useWeather'
import SkeletonLoader from '../../components/SkeletonLoader'

// Komponen widget cuaca untuk section hero halaman beranda
// Data cuaca diambil dari backend proxy — API key OWM tidak ada di frontend
function WeatherWidget() {
  const { weather, isLoading, error } = useWeather()

  // Tampilkan skeleton saat loading
  if (isLoading) {
    return <SkeletonLoader type="weather" />
  }

  // Tampilkan pesan error tanpa mengganggu konten lain
  if (error || !weather) {
    return (
      <p className="text-white/70 text-sm italic">
        ☁️ Data cuaca tidak tersedia saat ini
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 w-fit">
      {/* Ikon cuaca dari OpenWeatherMap */}
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        className="w-12 h-12"
      />
      <div>
        {/* Suhu */}
        <p className="text-white font-bold text-2xl leading-none">
          {Math.round(weather.temp)}°C
        </p>
        {/* Deskripsi cuaca */}
        <p className="text-white/80 text-sm capitalize">{weather.description}</p>
        {/* Kelembaban dan angin */}
        <p className="text-white/60 text-xs mt-0.5">
          💧 {weather.humidity}% · 💨 {weather.wind_speed} m/s
        </p>
      </div>
    </div>
  )
}

export default WeatherWidget
