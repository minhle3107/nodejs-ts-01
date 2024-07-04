import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import { LOGS_DIR } from '~/constants/dir'

// Ensure the log directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR)
}

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
  transports: [new transports.File({ filename: `${LOGS_DIR}/combined.log` })]
})

export default logger
