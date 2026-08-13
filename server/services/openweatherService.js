import { config } from '../config.js'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

async function request(path, params) {
  if (!config.weatherApiKey) {
    const err = new Error('API key تنظیم نشده است')
    err.status = 500
    throw err
  }

  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  url.searchParams.set('appid', config.weatherApiKey)
  url.searchParams.set('units', params.units || 'metric')
  url.searchParams.set('lang', 'fa')

  const res = await fetch(url)

  if (!res.ok) {
    const err = new Error(`OpenWeather API Error: ${res.status}`)
    err.status = res.status
    throw err
  }

  return res.json()
}

export function getCurrentWeather({ lat, lon }, units = 'metric') {
  return request('/weather', { lat, lon, units })
}

export function getForecast({ lat, lon }, units = 'metric') {
  return request('/forecast', { lat, lon, units, cnt: 40 })
}
