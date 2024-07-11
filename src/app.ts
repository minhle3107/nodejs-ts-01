import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import v1Routes from '~/routes/v1'
import { requestLoggerMiddleware } from '~/middlewares/logging.middleware'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import yaml from 'yaml'
import fs from 'fs'
import { corsOptions, limiter } from '~/constants/config'

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
app.use(limiter)
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(requestLoggerMiddleware)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', v1Routes)
app.use(defaultErrorHandler)

export default app
