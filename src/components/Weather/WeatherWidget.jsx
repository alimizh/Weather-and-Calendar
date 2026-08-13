import { useWeather } from '../../hooks/useWeather'
import { useSettings } from '../../context/SettingsContext'
import './WeatherWidget.css'

function getDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function getTime(dt) {
  return new Date(dt * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function getConditionIcon(icon, isDay) {
  if (icon.includes('01')) return isDay ? '☀️' : '🌙'
  if (icon.includes('02')) return '⛅'
  if (icon.includes('03') || icon.includes('04')) return '☁️'
  if (icon.includes('09') || icon.includes('10')) return '🌧️'
  if (icon.includes('11')) return '⛈️'
  if (icon.includes('13')) return '❄️'
  if (icon.includes('50')) return '🌫️'
  return '🌤️'
}

export default function WeatherWidget() {
  const { settings, city } = useSettings()
  const { current, forecast, loading, error, retry } = useWeather({
    lat: city.lat,
    lon: city.lon,
    unit: settings.unit
  })

  const unitSymbol = settings.unit === 'imperial' ? '°F' : '°C'

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-loading">
          <div className="spinner" />
          <span>در حال دریافت اطلاعات آب‌وهوا...</span>
        </div>
      </div>
    )
  }

  if (error || !current) {
    return (
      <div className="weather-widget">
        <div className="weather-error">
          <span className="error-icon">⚠</span>
          <span>{error || 'خطا در دریافت اطلاعات'}</span>
          <button className="retry-btn" onClick={retry}>تلاش مجدد</button>
        </div>
      </div>
    )
  }

  const isDay = current.weather[0].icon.includes('d')
  const daily = forecast?.list?.filter((_, i) => i % 8 === 0)?.slice(0, 5) || []

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-primary">
          <div className="weather-icon-large">{getConditionIcon(current.weather[0].icon, isDay)}</div>
          <div className="weather-temp-block">
            <div className="weather-temp">{Math.round(current.main.temp)}{unitSymbol}</div>
            <div className="weather-condition">{current.weather[0].description}</div>
            <div className="feels-like">احساسی {Math.round(current.main.feels_like)}{unitSymbol}</div>
          </div>
        </div>

        <div className="weather-secondary">
          <div className="weather-location">
            <span className="location-icon">📍</span>
            <span>{city.name}</span>
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">رطوبت</span>
              <span className="detail-value">{current.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">باد</span>
              <span className="detail-value">
                {getDirection(current.wind.deg)} {Math.round(current.wind.speed)} m/s
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">حداکثر</span>
              <span className="detail-value">{Math.round(current.main.temp_max)}{unitSymbol}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">حداقل</span>
              <span className="detail-value">{Math.round(current.main.temp_min)}{unitSymbol}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-forecast">
        <div className="forecast-title">پیش‌بینی ۵ روز آینده</div>
        <div className="forecast-list">
          {daily.map((d, i) => (
            <div key={i} className="forecast-item">
              <span className="forecast-day">
                {i === 0
                  ? 'امروز'
                  : new Date(d.dt * 1000).toLocaleDateString('fa-IR', { weekday: 'short' })}
              </span>
              <span className="forecast-icon">
                {getConditionIcon(d.weather[0].icon, true)}
              </span>
              <span className="forecast-temps">
                <span className="forecast-high">{Math.round(d.main.temp_max)}{unitSymbol}</span>
                <span className="forecast-low">{Math.round(d.main.temp_min)}{unitSymbol}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-update">آخرین به‌روزرسانی: {getTime(current.dt)}</div>
    </div>
  )
}
