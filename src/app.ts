import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors from 'cors'
import v1Routes from '~/routes/v1'
import { requestLoggerMiddleware } from '~/middlewares/logging.middleware'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import yaml from 'yaml'
import fs from 'fs'

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Your API Title',
//       version: '1.0.0',
//       description: 'API description'
//     },
//     servers: [
//       {
//         url: 'http://localhost:4000/api/v1'
//       }
//     ]
//   },
//   apis: ['./openapi/_build/openapi.yaml']
// }
//
// const openapiSpecification = swaggerJsdoc(options)

const file = fs.readFileSync(path.resolve('openapi/_build/openapi.yaml'), 'utf-8')
const swaggerDocument = yaml.parse(file)

const app = express()
app.use(cors())
app.use(express.json())
app.use(requestLoggerMiddleware)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', v1Routes)
app.use(defaultErrorHandler)

export default app

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
