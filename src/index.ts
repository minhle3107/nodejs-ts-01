import express from 'express'
import databaseService from '~/services/database.services'
import usersRoutes from '~/routes/users.routes'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import mediasRoutes from '~/routes/medias.routes'
import { config } from 'dotenv'

databaseService.connect()
const app = express()
config()
const port = process.env.PORT

app.use(express.json())
app.use('/users', usersRoutes)
app.use('/medias', mediasRoutes)
app.use(defaultErrorHandler)
app.listen(port, () => console.log(`App listening on port ${port}`))
