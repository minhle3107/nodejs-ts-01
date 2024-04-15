import { Request } from 'express'
import User from '~/models/shcemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
  }
}
