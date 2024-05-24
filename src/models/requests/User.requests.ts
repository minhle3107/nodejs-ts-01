import { JwtPayload } from 'jsonwebtoken'
import { EnumTokenType, EnumUserVerifyStatus } from '~/constants/enums'

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

export interface IResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface ITokenPayload extends JwtPayload {
  user_id: string
  token_type: EnumTokenType
  verify_status: EnumUserVerifyStatus
  iat: number
  exp: number
}

export interface ILogoutReqBody {
  refresh_token: string
}

export interface IRefreshTokenReqBody {
  refresh_token: string
}

export interface IUpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface IFollowReqBody {
  followed_user_id: string
}

export interface IUnfollowReqParams {
  user_id: string
}

export interface IGetProfileReqParams {
  username: string
}

export interface IChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
