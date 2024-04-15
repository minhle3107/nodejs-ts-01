import { JwtPayload } from 'jsonwebtoken'
import { EnumTokenType } from '~/constants/enum'

export interface IRegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface ITokenPayload extends JwtPayload {
  user_id: string
  token_type: EnumTokenType
}

export interface ILogoutReqBody {
  refresh_token: string
}
