import express from 'express'
import databaseService from '~/services/database.services'
import usersRoutes from '~/routes/users.routes'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'

databaseService.connect()
const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRoutes)
app.use(defaultErrorHandler)
app.listen(port, () => console.log(`App listening on port ${port}`))
