import express from 'express'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { envConfig } from '~/constants/config'
import app from '~/app'

initFolder()

const startServer = async () => {
  try {
    await databaseService.initializeDatabase()
    console.log('Database connected successfully.')

    const PORT = envConfig.port
    const httpServer = createServer(app)
    const io = new Server(httpServer)

    io.on('connection', (socket) => {
      console.log(`user ${socket.id} connected`)
      socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`)
      })
    })

    httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`))
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    process.exit(1)
  }
}

startServer()
