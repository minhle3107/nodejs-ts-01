import app from '~/app'
import process from 'node:process'
import { config } from 'dotenv'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
// import '~/utils/fake'
// import '~/utils/s3'
import { createServer } from 'http'
import { Server } from 'socket.io'

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

initFolder()

const PORT = process.env.PORT || 4000
const httpServer = createServer(app)
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`)
  })
})
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`))
