import { Request } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import USERS_MESSAGES from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  // if (!access_token) {
  //   throw new ErrorWithStatus({
  //     message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
  //     status: HTTP_STATUS.UNAUTHORIZED
  //   })
  // }
  //
  // if (!access_token.startsWith('Bearer ')) {
  //   throw new ErrorWithStatus({
  //     message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
  //     status: HTTP_STATUS.UNAUTHORIZED
  //   })
  // }
  //
  // const access_token = (access_token || '').split(' ')[1] // 'Bearer minh'
  if (!access_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    ;(req as Request).decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.jwtSecretAccessToken
    })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }
  return true
}
