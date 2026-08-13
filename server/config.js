import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

export const config = {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV || 'development',
  weatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  cacheTtl: Number(process.env.CACHE_TTL) || 600,
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200
  },
  defaultLocation: {
    name: 'لار، فارس',
    lat: 27.6746,
    lon: 54.3429
  }
}

if (!config.weatherApiKey) {
  console.warn('⚠️  OPENWEATHER_API_KEY تنظیم نشده است. از فایل .env استفاده کنید.')
}
