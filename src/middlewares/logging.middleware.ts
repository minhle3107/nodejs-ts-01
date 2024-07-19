import { Request, Response, NextFunction } from 'express'
import logger from '~/utils/logs'

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime()
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const userAgent = req.headers['user-agent']

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2) // Convert to milliseconds

    setImmediate(() => {
      logger.info(
        `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Response time: ${responseTime}ms - Client IP: ${clientIp} - User-Agent: ${userAgent}`
      )
    })
  })

  next()
}
