import { Request, Response } from 'express'
import usersServices from '~/services/users.services'

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

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersServices.registerUser({ email, password })
    return res.status(200).json({ message: 'Register successfully', result })
  } catch (e) {
    return res.status(400).json({ message: 'Register failed', error: e })
  }
}
