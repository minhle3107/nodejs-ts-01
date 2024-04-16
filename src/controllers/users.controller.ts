import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ILogoutReqBody, IRegisterReqBody, ITokenPayload } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/shcemas/User.schema'
import USERS_MESSAGES from '~/constants/messages'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login(user_id.toString())
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, IRegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('Lỗi rồi')
  const result = await usersServices.registerUser(req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.RESIGNED_SUCCESSFULLY,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, ILogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersServices.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json({ result })
}

export const emailVerifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as ITokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  // Trường hợp không tìm thấy user
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  // Trường hợp đã verify rồi thì mình sẽ không báo lỗi
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersServices.verifyEmail(user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
    result
  })
}
