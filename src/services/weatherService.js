const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'f44563e05b7d08b6d02269031ca6cca6'
const DIRECT_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const DEFAULT_LOCATION = { lat: 27.6746, lon: 54.3429 }

function buildQuery(params) {
  return new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null)
  ).toString()
}

async function backendRequest(path, { lat, lon, units }) {
  const query = buildQuery({ lat, lon, units })
  const url = `${API_BASE_URL}${path}${query ? `?${query}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error('Backend request failed')
  return json.data
}

async function directRequest(path, { lat, lon, units }) {
  const query = buildQuery({ lat, lon, units, lang: 'fa', appid: API_KEY })
  const url = `${DIRECT_BASE_URL}${path}?${query}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

export async function fetchCurrentWeather(lat, lon, units = 'metric') {
  const location = { lat: lat ?? DEFAULT_LOCATION.lat, lon: lon ?? DEFAULT_LOCATION.lon, units }
  try {
    return await backendRequest('/weather/current', location)
  } catch {
    return directRequest('/weather', location)
  }
}

export async function fetchForecast(lat, lon, units = 'metric') {
  const location = { lat: lat ?? DEFAULT_LOCATION.lat, lon: lon ?? DEFAULT_LOCATION.lon, units }
  try {
    return await backendRequest('/weather/forecast', location)
  } catch {
    return directRequest('/forecast', location)
  }
}
