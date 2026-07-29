import { useState, useEffect } from 'react'
import { getToday, getCalendarGrid, jalaliMonthName } from '../services/calendarService'

export function useCalendar() {
  const [today, setToday] = useState(getToday())
  const [year, setYear] = useState(today.year)
  const [month, setMonth] = useState(today.month)
  const [grid, setGrid] = useState([])

  useEffect(() => {
    setGrid(getCalendarGrid(year, month))
  }, [year, month])

  const goToPrevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  const goToNextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const goToToday = () => {
    const t = getToday()
    setToday(t)
    setYear(t.year)
    setMonth(t.month)
  }

  return {
    today,
    year,
    month,
    monthName: jalaliMonthName(month),
    grid,
    goToPrevMonth,
    goToNextMonth,
    goToToday
  }
}
