export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: 'مسیر مورد نظر یافت نشد'
  })
}

export function errorHandler(err, req, res, _next) {
  console.error('[ERROR]', err.message)

  const status = err.status || 500
  const message = status === 500
    ? 'خطای داخلی سرور'
    : err.message

  res.status(status).json({
    success: false,
    message
  })
}
