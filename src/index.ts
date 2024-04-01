import express from 'express'
import databaseService from '~/services/database.services'

const app = express()
const port = 4000

app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.json())
databaseService.connect()

app.listen(port, () => console.log(`App listening on port ${port}`))
