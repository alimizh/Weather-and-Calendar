import { config } from '../config.js'

const GEOCODE_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

export async function searchCities(query, limit = 5) {
  if (!config.weatherApiKey) {
    const err = new Error('API key تنظیم نشده است')
    err.status = 500
    throw err
  }

  const url = new URL(`${GEOCODE_BASE_URL}/direct`)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', limit)
  url.searchParams.set('appid', config.weatherApiKey)

  const res = await fetch(url)

  if (!res.ok) {
    const err = new Error(`Geocoding API Error: ${res.status}`)
    err.status = res.status
    throw err
  }

  return res.json()
}
