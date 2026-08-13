import { useEffect } from 'react'
import { useSettings, CUSTOM_CITY_KEY } from '../../context/SettingsContext'
import './SettingsModal.css'

export default function SettingsModal({ onClose }) {
  const { settings, updateSettings, resetSettings, cities } = useSettings()

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">تنظیمات</h2>
          <button className="modal-close" onClick={onClose} aria-label="بستن">×</button>
        </div>

        <div className="modal-body">
          <div className="setting-group">
            <label className="setting-label" htmlFor="city-select">شهر</label>
            <select
              id="city-select"
              className="setting-select"
              value={settings.city}
              onChange={(e) => updateSettings({ city: e.target.value })}
            >
              {Object.entries(cities).map(([key, city]) => (
                <option key={key} value={key}>{city.name}</option>
              ))}
              <option value={CUSTOM_CITY_KEY}>
                {settings.customCity ? settings.customCity.name : 'شهر دلخواه (از ویجت آب‌وهوا)'}
              </option>
            </select>
          </div>

          <div className="setting-group">
            <span className="setting-label">واحد دما</span>
            <div className="unit-toggle">
              <button
                className={`unit-btn ${settings.unit === 'metric' ? 'active' : ''}`}
                onClick={() => updateSettings({ unit: 'metric' })}
              >
                سانتی‌گراد (°C)
              </button>
              <button
                className={`unit-btn ${settings.unit === 'imperial' ? 'active' : ''}`}
                onClick={() => updateSettings({ unit: 'imperial' })}
              >
                فارنهایت (°F)
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="reset-btn" onClick={resetSettings}>
            بازنشانی پیش‌فرض
          </button>
        </div>
      </div>
    </div>
  )
}
