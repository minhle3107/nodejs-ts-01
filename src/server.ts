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
import Conversation from '~/models/shcemas/Conversations.schema'
import { ObjectId } from 'mongodb'

async function startServer() {
  try {
    await Promise.all([initFolder(), databaseService.initializeDatabase()])

    const swaggerDocument = yaml.parse(fs.readFileSync(path.resolve('openapi/openapi.yaml'), 'utf-8'))

    const app = express()

    app.use([limiter, helmet(), cors(corsOptions), express.json(), requestLoggerMiddleware])
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.use('/api/v1', v1Routes)
    app.use(defaultErrorHandler)

    const httpServer = createServer(app)
    const io = new Server(httpServer, { cors: corsOptions })

    const users: {
      [key: string]: {
        socket_id: string
      }
    } = {}

    io.use((socket, next) => {
      const { Authorization } = socket.handshake.auth
    })

    io.on('connection', (socket) => {
      console.log(`user ${socket.id} connected`)
      const user_id = socket.handshake.auth._id
      console.log(user_id)
      users[user_id] = { socket_id: socket.id }

      console.log(users)

      socket.on('send_message', async (data) => {
        const receiver_socket_id = users[data.to]?.socket_id
        console.log(receiver_socket_id)
        if (!receiver_socket_id) {
          return
        }

        await databaseService.conversations.insertOne(
          new Conversation({
            sender_id: new ObjectId(data.from),
            receiver_id: new ObjectId(data.to),
            content: data.content
          })
        )

        socket.to(receiver_socket_id).emit('receive_private_message', {
          content: data.content,
          from: user_id
        })
      })

      socket.on('disconnect', () => {
        delete users[user_id]
        console.log(`user ${socket.id} disconnected`)
        console.log(users)
      })
    })

    httpServer.listen(envConfig.port, () => console.log(`App listening on port ${envConfig.port}`))
  } catch (error) {
    console.error('Failed to start the server:', error)
  }
}

startServer()
  .then(() => console.log('Server started successfully'))
  .catch((error) => console.error('Failed to start the server:', error))
