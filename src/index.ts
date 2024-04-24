import express from 'express'
import { config } from 'dotenv'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRoutes from '~/routes/users.routes'
import mediasRoutes from '~/routes/medias.routes'
import { initFolder } from '~/utils/file'

config()
databaseService.connect()
const app = express()
const port = process.env.PORT

initFolder()

app.use(express.json())
app.use('/users', usersRoutes)
app.use('/medias', mediasRoutes)
app.use(defaultErrorHandler)

app.listen(port, () => console.log(`App listening on port ${port}`))
