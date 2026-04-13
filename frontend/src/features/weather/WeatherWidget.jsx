import { useWeather } from '../../hooks/useWeather'
import SkeletonLoader from '../../components/SkeletonLoader'

function WeatherWidget() {
  const { weather, isLoading, error } = useWeather()

  if (isLoading) return <SkeletonLoader type="weather" />

  if (error || !weather) {
    return (
      <p className="text-sm" style={{ color: 'rgba(248,243,225,0.5)', fontStyle: 'italic' }}>
        Data cuaca tidak tersedia
      </p>
    )
  }

  return (
    <div
      className="flex items-center gap-4 w-fit"
      style={{
        backgroundColor: 'rgba(20,22,8,0.4)',
        border: '1px solid rgba(248,243,225,0.12)',
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        style={{ width: '44px', height: '44px' }}
      />
      <div>
        {/* Suhu — level 1 */}
        <p
          className="font-bold leading-none"
          style={{ fontSize: '1.5rem', color: '#F8F3E1', marginBottom: '2px' }}
        >
          {Math.round(weather.temp)}°C
        </p>
        {/* Kondisi — level 2 */}
        <p className="text-xs capitalize" style={{ color: 'rgba(248,243,225,0.65)', marginBottom: '2px' }}>
          {weather.description}
        </p>
        {/* Metadata — level 3 */}
        <p className="text-xs" style={{ color: 'rgba(248,243,225,0.45)' }}>
          {weather.humidity}% kelembaban · {weather.wind_speed} m/s angin
        </p>
      </div>
    </div>
  )
}

export default WeatherWidget
