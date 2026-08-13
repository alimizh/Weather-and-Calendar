import { useState, useEffect } from 'react'
import { fetchLandmark } from '../services/landmarkService'

export function useLandmark({ lat, lon }) {
  const [landmark, setLandmark] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setLandmark(null)

    fetchLandmark({ lat, lon })
      .then((data) => {
        if (!cancelled) setLandmark(data)
      })
      .catch(() => {
        if (!cancelled) setLandmark(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lat, lon])

  return { landmark, loading }
}
