import { Router } from 'express'
import { getCurrentWeather, getForecast } from '../services/openweatherService.js'
import { config } from '../config.js'

const router = Router()

function resolveLocation(req) {
  const { lat, lon } = req.query
  if (lat && lon) {
    return { lat: Number(lat), lon: Number(lon) }
  }
  return config.defaultLocation
}

router.get('/current', async (req, res, next) => {
  try {
    const location = resolveLocation(req)
    const units = req.query.units || 'metric'
    const data = await getCurrentWeather(location, units)
    res.json({ success: true, location: config.defaultLocation.name, data })
  } catch (err) {
    next(err)
  }
})

router.get('/forecast', async (req, res, next) => {
  try {
    const location = resolveLocation(req)
    const units = req.query.units || 'metric'
    const data = await getForecast(location, units)
    res.json({ success: true, location: config.defaultLocation.name, data })
  } catch (err) {
    next(err)
  }
})

export default router
