import { Router } from 'express'
import { getCurrentWeather, getForecast } from '../services/openweatherService.js'
import { searchCities } from '../services/geocodingService.js'
import { config } from '../config.js'

const router = Router()

function resolveLocation(req) {
  const { lat, lon } = req.query
  if (lat && lon) {
    return { lat: Number(lat), lon: Number(lon) }
  }
  return config.defaultLocation
}

router.get('/search', async (req, res, next) => {
  try {
    const { q, limit } = req.query
    if (!q) {
      return res.status(400).json({ success: false, message: 'پارامتر q (نام شهر) الزامی است' })
    }
    const data = await searchCities(q, Math.min(Number(limit) || 5, 10))
    res.json({ success: true, count: data.length, data })
  } catch (err) {
    next(err)
  }
})

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
