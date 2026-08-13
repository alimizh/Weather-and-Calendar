import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useLandmark } from '../../hooks/useLandmark'
import Background from '../Background/Background'
import Header from '../Header/Header'
import CalendarWidget from '../Calendar/CalendarWidget'
import WeatherWidget from '../Weather/WeatherWidget'
import SettingsModal from '../Settings/SettingsModal'
import './Dashboard.css'

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { city } = useSettings()
  const { landmark, loading: landmarkLoading } = useLandmark({
    lat: city.lat,
    lon: city.lon
  })

  return (
    <div className="dashboard">
      <Background landmark={landmark} />

      <div className="dashboard-inner">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <main className="dashboard-content">
          <section className="widget-card">
            <div className="widget-header">
              <span className="widget-icon">🗓️</span>
              <h2 className="widget-title">تقویم</h2>
            </div>
            <CalendarWidget />
          </section>

          <section className="widget-card">
            <div className="widget-header">
              <span className="widget-icon">🌤️</span>
              <h2 className="widget-title">آب‌وهوا</h2>
            </div>
            <WeatherWidget landmark={landmark} landmarkLoading={landmarkLoading} />
          </section>
        </main>

        <footer className="dashboard-footer">
          <span className="footer-text">
            New Tab Extension · React + Node.js Backend
          </span>
        </footer>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
