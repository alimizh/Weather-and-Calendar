import { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

export const CITIES = {
  lar: { name: 'لار، فارس', lat: 27.6746, lon: 54.3429 },
  shiraz: { name: 'شیراز', lat: 29.5918, lon: 52.5837 },
  tehran: { name: 'تهران', lat: 35.6892, lon: 51.389 },
  mashhad: { name: 'مشهد', lat: 36.2605, lon: 59.6168 },
  tabriz: { name: 'تبریز', lat: 38.0962, lon: 46.2738 },
  esfahan: { name: 'اصفهان', lat: 32.6546, lon: 51.668 },
  karaj: { name: 'کرج', lat: 35.8400, lon: 50.9391 },
  qom: { name: 'قم', lat: 34.6401, lon: 50.8764 },
  ahvaz: { name: 'اهواز', lat: 31.3183, lon: 48.6706 },
  kermanshah: { name: 'کرمانشاه', lat: 34.3142, lon: 47.0650 },
  urmia: { name: 'ارومیه', lat: 37.5527, lon: 45.0761 },
  rasht: { name: 'رشت', lat: 37.2808, lon: 49.5832 },
  zahedan: { name: 'زاهدان', lat: 29.4963, lon: 60.8629 },
  kerman: { name: 'کرمان', lat: 30.2839, lon: 57.0834 },
  hamedan: { name: 'همدان', lat: 34.7983, lon: 48.5150 },
  arak: { name: 'اراک', lat: 34.0916, lon: 49.6893 },
  ardabil: { name: 'اردبیل', lat: 38.2498, lon: 48.2933 },
  yazd: { name: 'یزد', lat: 31.8974, lon: 54.3569 },
  qazvin: { name: 'قزوین', lat: 36.2688, lon: 50.0041 },
  zanjan: { name: 'زنجان', lat: 36.6736, lon: 48.4787 },
  bushehr: { name: 'بوشهر', lat: 28.9234, lon: 50.8203 },
  babol: { name: 'بابل', lat: 36.5513, lon: 52.6786 },
  sari: { name: 'ساری', lat: 36.5633, lon: 53.0601 },
  bandarAbbas: { name: 'بندرعباس', lat: 27.1865, lon: 56.2808 },
  gorgan: { name: 'گرگان', lat: 36.8453, lon: 54.4393 },
  bojnord: { name: 'بجنورد', lat: 37.4747, lon: 57.3298 },
  sanandaj: { name: 'سنندج', lat: 35.3219, lon: 47.0072 },
  khorramabad: { name: 'خرم‌آباد', lat: 33.4878, lon: 48.3558 },
  ilam: { name: 'ایلام', lat: 33.6374, lon: 46.4227 },
  shahrKord: { name: 'شهرکرد', lat: 32.3256, lon: 50.8644 },
  birjand: { name: 'بیرجند', lat: 32.8663, lon: 59.2211 },
  semnan: { name: 'سمنان', lat: 35.5768, lon: 53.3875 },
  kish: { name: 'کیش', lat: 26.5563, lon: 53.9808 },
  qeshm: { name: 'قشم', lat: 26.8119, lon: 55.8913 }
}

export const CUSTOM_CITY_KEY = '__custom__'

const STORAGE_KEY = 'ntx-settings'

const DEFAULT_SETTINGS = { city: 'lar', unit: 'metric', customCity: null }

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

  const city =
    settings.city === CUSTOM_CITY_KEY && settings.customCity
      ? { name: settings.customCity.name, lat: settings.customCity.lat, lon: settings.customCity.lon }
      : CITIES[settings.city] || CITIES.lar

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
