const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const LAT = 27.6746
const LON = 54.3429

export async function fetchCurrentWeather() {
  const url = `${BASE_URL}/weather?lat=${LAT}&lon=${LON}&units=metric&lang=fa&appid=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch weather data')
  return res.json()
}

export async function fetchForecast() {
  const url = `${BASE_URL}/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=fa&appid=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch forecast data')
  return res.json()
}
