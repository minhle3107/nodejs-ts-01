import { NextFunction, Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { IRegisterReqBody } from '~/models/requests/Use.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (email === 'leminhhh@gmail.com' && password === '123456') {
      return res.status(200).json({ message: 'Login successfully' })
    }
  } catch (e) {
    return res.status(400).json({ message: 'Login failed', error: e })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, IRegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('Lỗi rồi')
  const result = await usersServices.registerUser(req.body)
  return res.status(200).json({
    message: 'Register successfully',
    result
  })
}
