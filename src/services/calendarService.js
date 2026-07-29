function gregorianToJalali(gy, gm, gd) {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

  let gy2 = (gm > 2) ? (gy + 1) : gy
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400)
  for (let i = 0; i < gm - 1; ++i) days += g_days_in_month[i]
  days += gd

  let jy = -1595 + (33 * Math.floor(days / 12053))
  days %= 12053
  jy += 33 * Math.floor(days / 1461)
  days %= 1461

  jy += Math.floor((days - 1) / 365)
  if (days > 365) days = (days - 1) % 365

  let jm, jd
  for (jm = 0; jm < 11 && days > j_days_in_month[jm]; ++jm) days -= j_days_in_month[jm]
  jd = days + 1

  return { year: jy, month: jm + 1, day: jd }
}

function jalaliMonthName(month) {
  const names = [
    'فروردین', 'اردیبهشت', 'خرداد',
    'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر',
    'دی', 'بهمن', 'اسفند'
  ]
  return names[month - 1]
}

function dayName(dayIndex) {
  const names = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
  return names[dayIndex]
}

export function getToday() {
  const now = new Date()
  const j = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate())
  return {
    ...j,
    monthName: jalaliMonthName(j.month),
    dayName: dayName(now.getDay()),
    gregorian: now
  }
}

export function getMonthDays(year, month) {
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
  const isLeap = (year % 33 === 1 || year % 33 === 5 || year % 33 === 9 ||
                  year % 33 === 13 || year % 33 === 17 || year % 33 === 22 ||
                  year % 33 === 26 || year % 33 === 30)
  if (month === 12 && isLeap) return 30
  return j_days_in_month[month - 1]
}

function jalaliToGregorian(jy, jm, jd) {
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
  let jy1 = jy + 1595
  let days = -355668 + (365 * jy1) + Math.floor(jy1 / 33) * 8 + Math.floor((jy1 % 33 + 3) / 4)
  for (let i = 0; i < jm - 1; ++i) days += j_days_in_month[i]
  days += jd

  let gy = 400 * Math.floor(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524)
    days %= 36524
    if (days >= 365) days++
  }
  gy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }

  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm
  for (gm = 0; gm < 11 && days >= g_days_in_month[gm]; ++gm) days -= g_days_in_month[gm]
  const gd = days + 1

  return { year: gy, month: gm + 1, day: gd }
}

export function getCalendarGrid(year, month) {
  const firstDayG = jalaliToGregorian(year, month, 1)
  const firstDate = new Date(firstDayG.year, firstDayG.month - 1, firstDayG.day)
  const startDayOfWeek = firstDate.getDay()
  const daysInMonth = getMonthDays(year, month)

  const grid = []
  const startOffset = (startDayOfWeek + 1) % 7

  let dayCounter = 1
  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < startOffset) || dayCounter > daysInMonth) {
        week.push(null)
      } else {
        week.push(dayCounter++)
      }
    }
    grid.push(week)
    if (dayCounter > daysInMonth) break
  }

  return grid
}

export { jalaliMonthName, dayName }
