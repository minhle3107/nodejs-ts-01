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
const users: { [key: string]: { socket_id: string } } = {}
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = { socket_id: socket.id }
  console.log(users)
  socket.on('private message', (data) => {
    console.log(data)
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
    console.log(users)
  })
})
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`))
