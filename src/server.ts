import app from '~/app'
import process from 'node:process'
import { config } from 'dotenv'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
// import '~/utils/fake'
// import '~/utils/s3'

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
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
