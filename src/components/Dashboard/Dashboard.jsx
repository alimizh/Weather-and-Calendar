import CalendarWidget from '../Calendar/CalendarWidget'
import WeatherWidget from '../Weather/WeatherWidget'
import './Dashboard.css'

export default function Dashboard() {
  const currentHour = new Date().getHours()
  let greeting = 'عصر بخیر'
  if (currentHour >= 5 && currentHour < 12) greeting = 'صبح بخیر'
  else if (currentHour >= 12 && currentHour < 17) greeting = 'ظهر بخیر'
  else if (currentHour >= 17 && currentHour < 22) greeting = 'عصر بخیر'
  else greeting = 'شب بخیر'

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="greeting">{greeting} 👋</h1>
          <p className="subtitle">لار، استان فارس</p>
        </div>
        <div className="header-right">
          <div className="time-display">
            {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-icon">🗓️</span>
            <h2 className="widget-title">تقویم</h2>
          </div>
          <CalendarWidget />
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <span className="widget-icon">🌤️</span>
            <h2 className="widget-title">آب‌وهوا</h2>
          </div>
          <WeatherWidget />
        </div>
      </main>

      <footer className="dashboard-footer">
        <a
          href="https://github.com/YOUR_USERNAME/new-tab-extension"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          New Tab Extension
        </a>
      </footer>
    </div>
  )
}
