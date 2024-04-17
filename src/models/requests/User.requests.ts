import { JwtPayload } from 'jsonwebtoken'
import { EnumTokenType } from '~/constants/enum'

export interface IRegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface ILoginReqBody {
  email: string
  password: string
}

export interface IVerifyEmailReqBody {
  email_verify_token: string
}

export interface IForgotPasswordReqBody {
  email: string
}

export interface IVerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ITokenPayload extends JwtPayload {
  user_id: string
  token_type: EnumTokenType
}

export interface ILogoutReqBody {
  refresh_token: string
}
