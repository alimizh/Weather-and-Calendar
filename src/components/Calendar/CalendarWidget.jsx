import { useCalendar } from '../../hooks/useCalendar'
import './CalendarWidget.css'

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export default function CalendarWidget() {
  const { today, year, month, monthName, grid, goToPrevMonth, goToNextMonth, goToToday } = useCalendar()

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <div className="calendar-date-info">
          <span className="calendar-day-name">{today.dayName}</span>
          <span className="calendar-full-date">{today.day} {today.monthName} {today.year}</span>
        </div>
        <button className="calendar-today-btn" onClick={goToToday}>امروز</button>
      </div>

      <div className="calendar-nav">
        <button className="nav-btn" onClick={goToPrevMonth}>&#8249;</button>
        <span className="calendar-month-title">{monthName} {year}</span>
        <button className="nav-btn" onClick={goToNextMonth}>&#8250;</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map((d, i) => (
            <div key={i} className={`weekday ${i === 0 ? 'weekend' : ''} ${i === 6 ? 'friday' : ''}`}>{d}</div>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="calendar-week">
            {week.map((day, di) => (
              <div
                key={di}
                className={`calendar-day ${day === null ? 'empty' : ''} ${day === today.day && month === today.month && year === today.year ? 'today' : ''} ${di === 0 ? 'weekend' : ''} ${di === 6 ? 'friday' : ''}`}
              >
                {day !== null && <span className="day-number">{day}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
