import { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

export const CITIES = {
  lar: { name: 'لار، فارس', lat: 27.6746, lon: 54.3429 },
  shiraz: { name: 'شیراز', lat: 29.5918, lon: 52.5837 },
  tehran: { name: 'تهران', lat: 35.6892, lon: 51.389 },
  mashhad: { name: 'مشهد', lat: 36.2605, lon: 59.6168 },
  tabriz: { name: 'تبریز', lat: 38.0962, lon: 46.2738 },
  esfahan: { name: 'اصفهان', lat: 32.6546, lon: 51.668 }
}

const STORAGE_KEY = 'ntx-settings'

const DEFAULT_SETTINGS = { city: 'lar', unit: 'metric' }

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* storage unavailable */
    }
  }, [settings])

  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const city = CITIES[settings.city] || CITIES.lar

  return (
    <SettingsContext.Provider
      value={{ settings, city, updateSettings, resetSettings, cities: CITIES }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings باید داخل SettingsProvider استفاده شود')
  }
  return ctx
}
