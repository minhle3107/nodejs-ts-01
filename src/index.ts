import express from 'express'
import { config } from 'dotenv'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRoutes from '~/routes/users.routes'
import mediasRoutes from '~/routes/medias.routes'
import { initFolder } from '~/utils/file'
import * as process from 'node:process'
import staticRoutes from '~/routes/static.routes'
import cors from 'cors'

config()
databaseService.connect()
const app = express()
app.use(cors())
const port = process.env.PORT || 4000

initFolder()
app.use(express.json())
app.use('/users', usersRoutes)
app.use('/medias', mediasRoutes)
app.use('/static', staticRoutes)
// app.use('/static/video', express.static(UPLOADS_VIDEOS_DIR))
app.use(defaultErrorHandler)
app.listen(port, () => console.log(`App listening on port ${port}`))

/**
 *
 *
 * __       __  __            __        __                   ______     __    ______   ________
 * |  \     /  \|  \          |  \      |  \                 /      \  _/  \  /      \ |        \
 * | $$\   /  $$ \$$ _______  | $$____  | $$  ______        |  $$$$$$\|   $$ |  $$$$$$\ \$$$$$$$$
 * | $$$\ /  $$$|  \|       \ | $$    \ | $$ /      \        \$$__| $$ \$$$$ | $$$\| $$    /  $$
 * | $$$$\  $$$$| $$| $$$$$$$\| $$$$$$$\| $$|  $$$$$$\        |     $$  | $$ | $$$$\ $$   /  $$
 * | $$\$$ $$ $$| $$| $$  | $$| $$  | $$| $$| $$    $$       __\$$$$$\  | $$ | $$\$$\$$  /  $$
 * | $$ \$$$| $$| $$| $$  | $$| $$  | $$| $$| $$$$$$$$      |  \__| $$ _| $$_| $$_\$$$$ /  $$
 * | $$  \$ | $$| $$| $$  | $$| $$  | $$| $$ \$$     \ ______\$$    $$|   $$ \\$$  \$$$|  $$
 *  \$$      \$$ \$$ \$$   \$$ \$$   \$$ \$$  \$$$$$$$|      \\$$$$$$  \$$$$$$ \$$$$$$  \$$
 *                                                     \$$$$$$
 *
 *
 */
