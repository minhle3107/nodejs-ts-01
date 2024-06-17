import app from '~/app'
import process from 'node:process'
import { config } from 'dotenv'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
})

initFolder()

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`App listening on port ${port}`))
