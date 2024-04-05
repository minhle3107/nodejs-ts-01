import express from 'express'
import databaseService from '~/services/database.services'
import usersRoutes from '~/routes/users.routes'

const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRoutes)
databaseService.connect()

app.listen(port, () => console.log(`App listening on port ${port}`))
