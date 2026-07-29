import { useWeather } from '../../hooks/useWeather'
import './WeatherWidget.css'

function getDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function getTime(dt) {
  return new Date(dt * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

export default function WeatherWidget() {
  const { current, forecast, loading, error, retry } = useWeather()

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

  const daily = forecast?.list?.filter((_, i) => i % 8 === 0)?.slice(0, 5) || []

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-primary">
          <div className="weather-temp">{Math.round(current.main.temp)}°</div>
          <div className="weather-condition">
            <span>{current.weather[0].description}</span>
            <span className="feels-like">احساسی {Math.round(current.main.feels_like)}°</span>
          </div>
        </div>
        <div className="weather-secondary">
          <div className="weather-location">
            <span className="location-icon">📍</span>
            <span>لار، فارس</span>
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">رطوبت</span>
              <span className="detail-value">{current.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">باد</span>
              <span className="detail-value">{getDirection(current.wind.deg)} {Math.round(current.wind.speed)} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">حداکثر</span>
              <span className="detail-value">{Math.round(current.main.temp_max)}°</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">حداقل</span>
              <span className="detail-value">{Math.round(current.main.temp_min)}°</span>
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
                {i === 0 ? 'امروز' : new Date(d.dt * 1000).toLocaleDateString('fa-IR', { weekday: 'short' })}
              </span>
              <span className="forecast-icon">{d.weather[0].icon === '01d' ? '☀️' : d.weather[0].icon.includes('d') ? '🌤' : '🌙'}</span>
              <span className="forecast-temps">
                <span className="forecast-high">{Math.round(d.main.temp_max)}°</span>
                <span className="forecast-low">{Math.round(d.main.temp_min)}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-update">
        آخرین به‌روزرسانی: {getTime(current.dt)}
      </div>
    </div>
  )
}
