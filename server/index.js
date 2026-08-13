import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'
import weatherRouter from './routes/weather.js'
import { createCache } from './middleware/cache.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { config } from './config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'تعداد درخواست‌های شما بیش از حد مجاز است' }
})
app.use('/api', limiter)

const cache = createCache(config.cacheTtl)
app.use('/api/weather', cache)

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'سرور فعال است',
    env: config.env,
    time: new Date().toISOString()
  })
})

app.use('/api/weather', weatherRouter)

const distPath = path.resolve(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'))
    }
    next()
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`🚀 Backend running on http://localhost:${config.port}`)
  console.log(`🌦️  Weather API: http://localhost:${config.port}/api/weather/current`)
})
