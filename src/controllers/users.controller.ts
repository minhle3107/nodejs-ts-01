import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { IRegisterReqBody } from '~/models/requests/Use.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/shcemas/User.schema'
import USERS_MESSAGES from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login(user_id.toString())
  return res.status(200).json({
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
  return res.status(200).json({
    message: USERS_MESSAGES.RESIGNED_SUCCESSFULLY,
    result
  })
}
