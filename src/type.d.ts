import User from '~/models/shcemas/User.schema'
import { ITokenPayload } from '~/models/requests/User.requests'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: ITokenPayload
    decoded_refresh_token?: ITokenPayload
  }
}
