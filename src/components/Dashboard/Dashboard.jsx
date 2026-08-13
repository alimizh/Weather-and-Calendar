import { useState } from 'react'
import Header from '../Header/Header'
import CalendarWidget from '../Calendar/CalendarWidget'
import WeatherWidget from '../Weather/WeatherWidget'
import SettingsModal from '../Settings/SettingsModal'
import './Dashboard.css'

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="dashboard">
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
          <WeatherWidget />
        </section>
      </main>

      <footer className="dashboard-footer">
        <span className="footer-text">
          New Tab Extension · React + Node.js Backend
        </span>
      </footer>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
