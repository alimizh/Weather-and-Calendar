import { useEffect, useRef, useState } from 'react'
import { useWeather } from '../../hooks/useWeather'
import { useSettings, CUSTOM_CITY_KEY } from '../../context/SettingsContext'
import { searchCities } from '../../services/weatherService'
import Landmark from './Landmark'
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

function flagEmoji(countryCode) {
  if (!countryCode) return '🌐'
  return countryCode.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  )
}

function CitySelector() {
  const { settings, updateSettings, cities } = useSettings()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef(null)

  const cityKeys = Object.keys(cities)

  const navigateCity = (dir) => {
    const idx = cityKeys.indexOf(settings.city)
    const base = idx === -1 ? 0 : idx
    const next = (base + dir + cityKeys.length) % cityKeys.length
    updateSettings({ city: cityKeys[next] })
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const el = e.target
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        return
      }
      e.preventDefault()
      navigateCity(e.key === 'ArrowRight' ? -1 : 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query.trim(), 6)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const handleCityChange = (e) => {
    updateSettings({ city: e.target.value })
  }

  const handleSelectCity = (r) => {
    const label = [r.name, r.state, r.country].filter(Boolean).join('، ')
    updateSettings({
      city: CUSTOM_CITY_KEY,
      customCity: { name: label, lat: r.lat, lon: r.lon }
    })
    setQuery('')
    setResults([])
    setSearchOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="city-selector">
      <div className="city-search">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="city-search-input"
          placeholder="جستجوی شهر در سراسر جهان..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSearchOpen(true)
          }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        {searching && <span className="search-spinner" />}
      </div>

      {searchOpen && query.trim().length >= 2 && (
        <ul className="search-results">
          {!searching && results.length === 0 && (
            <li className="search-empty">نتیجه‌ای یافت نشد</li>
          )}
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                className="search-result-item"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelectCity(r)
                }}
              >
                <span className="result-flag">{flagEmoji(r.country)}</span>
                <span className="result-name">{r.name}</span>
                <span className="result-region">
                  {[r.state, r.country].filter(Boolean).join('، ')}
                </span>
                <span className="result-coords">
                  {r.lat.toFixed(2)}, {r.lon.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="city-nav-row">
        <button
          type="button"
          className="city-nav-btn"
          aria-label="شهر بعدی"
          title="شهر بعدی"
          onClick={() => navigateCity(-1)}
        >
          ‹
        </button>

        <select
          className="city-select"
          value={settings.city}
          onChange={handleCityChange}
          aria-label="شهرهای پرکاربرد"
        >
          <optgroup label="شهرهای ایران">
            {Object.entries(cities).map(([key, c]) => (
              <option key={key} value={key}>{c.name}</option>
            ))}
          </optgroup>
          {settings.city === CUSTOM_CITY_KEY && settings.customCity && (
            <optgroup label="شهر انتخاب‌شده">
              <option value={CUSTOM_CITY_KEY}>{settings.customCity.name}</option>
            </optgroup>
          )}
        </select>

        <button
          type="button"
          className="city-nav-btn"
          aria-label="شهر قبلی"
          title="شهر قبلی"
          onClick={() => navigateCity(1)}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default function WeatherWidget({ landmark, landmarkLoading }) {
  const { settings, city } = useSettings()
  const { current, forecast, loading, error, retry } = useWeather({
    lat: city.lat,
    lon: city.lon,
    unit: settings.unit
  })

  const unitSymbol = settings.unit === 'imperial' ? '°F' : '°C'
  const isDay = current?.weather?.[0]?.icon?.includes('d')
  const daily = forecast?.list?.filter((_, i) => i % 8 === 0)?.slice(0, 5) || []

  return (
    <div className="weather-widget">
      <CitySelector />

      {loading ? (
        <div className="weather-loading">
          <div className="spinner" />
          <span>در حال دریافت اطلاعات آب‌وهوا...</span>
        </div>
      ) : error || !current ? (
        <div className="weather-error">
          <span className="error-icon">⚠</span>
          <span>{error || 'خطا در دریافت اطلاعات'}</span>
          <button className="retry-btn" onClick={retry}>تلاش مجدد</button>
        </div>
      ) : (
        <>
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

          <Landmark landmark={landmark} loading={landmarkLoading} />

          <div className="weather-update">آخرین به‌روزرسانی: {getTime(current.dt)}</div>
        </>
      )}
    </div>
  )
}
