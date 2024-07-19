import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import helmet from 'helmet'
import cors from 'cors'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import { corsOptions, envConfig, limiter } from '~/constants/config'
import { requestLoggerMiddleware } from '~/middlewares/logging.middleware'
import swaggerUi from 'swagger-ui-express'
import v1Routes from '~/routes/v1'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'

async function startServer() {
  try {
    initFolder()
    await databaseService.initializeDatabase()

    const swaggerDocument = yaml.parse(fs.readFileSync(path.resolve('openapi/_build/openapi.yaml'), 'utf-8'))

    const app = express()

    app.use([limiter, helmet(), cors(corsOptions), express.json(), requestLoggerMiddleware])
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.use('/api/v1', v1Routes)
    app.use(defaultErrorHandler)

    const httpServer = createServer(app)
    const io = new Server(httpServer)

    io.on('connection', (socket) => {
      console.log(`user ${socket.id} connected`)
      socket.on('disconnect', () => console.log(`user ${socket.id} disconnected`))
    })

    httpServer.listen(envConfig.port, () => console.log(`App listening on port ${envConfig.port}`))
  } catch (error) {
    console.error('Failed to start the server:', error)
  }
}

startServer().then(() => console.log('Server started successfully'))
