import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path from 'path'

import TransportStream from 'winston-transport'
import { LOGS_DIR } from '~/constants/dir'
import { isDevelopment } from '~/constants/config'

// Ensure the log directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR)
}

const loggerTransports: TransportStream[] = [
  // File transport for JSON format
  new transports.File({
    filename: path.join(LOGS_DIR, 'combined.log'),
    format: format.json()
  })
]

// If in development, add console transport for text format
if (isDevelopment) {
  loggerTransports.push(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    })
  )
}

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: loggerTransports
})

export default logger
