import { useState, useEffect, useCallback } from 'react'
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService'

export function useWeather({ lat, lon, unit }) {
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [curr, fore] = await Promise.all([
        fetchCurrentWeather(lat, lon, unit),
        fetchForecast(lat, lon, unit)
      ])
      setCurrent(curr)
      setForecast(fore)
    } catch (err) {
      setError('امکان دریافت اطلاعات آب‌وهوا وجود ندارد')
    } finally {
      setLoading(false)
    }
  }, [lat, lon, unit])

  useEffect(() => { load() }, [load])

  return { current, forecast, loading, error, retry: load }
}
