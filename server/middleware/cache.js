export function createCache(ttlSeconds = 600) {
  const store = new Map()

  function getCached(key) {
    const entry = store.get(key)
    if (!entry) return null
    if (Date.now() - entry.createdAt > ttlSeconds * 1000) {
      store.delete(key)
      return null
    }
    return entry.data
  }

  return function cacheMiddleware(req, res, next) {
    const key = req.originalUrl

    const cached = getCached(key)
    if (cached) {
      res.setHeader('X-Cache', 'HIT')
      return res.json(cached)
    }

    const originalJson = res.json.bind(res)
    res.json = (body) => {
      store.set(key, { data: body, createdAt: Date.now() })
      res.setHeader('X-Cache', 'MISS')
      return originalJson(body)
    }

    next()
  }
}
