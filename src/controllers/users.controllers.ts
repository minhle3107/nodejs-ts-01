import { Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  IChangePasswordReqBody,
  IFollowReqBody,
  IForgotPasswordReqBody,
  IGetProfileReqParams,
  ILoginReqBody,
  ILogoutReqBody,
  IRefreshTokenReqBody,
  IRegisterReqBody,
  IResetPasswordReqBody,
  ITokenPayload,
  IUnfollowReqParams,
  IUpdateMeReqBody,
  IVerifyEmailReqBody,
  IVerifyForgotPasswordReqBody
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/shcemas/User.schema'
import USERS_MESSAGES from '~/constants/messages'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { EnumUserVerifyStatus } from '~/constants/enums'
import * as process from 'node:process'

export const loginController = async (req: Request<ParamsDictionary, any, ILoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login({ user_id: user_id.toString(), verify_status: user.verify_status })
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
    result
  })
}

export const oauthGoogleController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersServices.oauthGoogle(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_URI}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify_status=${result.verify_status}`
  return res.redirect(urlRedirect)
}

export const registerController = async (req: Request<ParamsDictionary, any, IRegisterReqBody>, res: Response) => {
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

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, IRefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, verify_status, exp } = req.decoded_refresh_token as ITokenPayload
  const result = await usersServices.refreshToken({ user_id, verify_status, refresh_token, exp })
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
    result
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, IVerifyEmailReqBody>,
  res: Response
) => {
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

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.verify_status === EnumUserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersServices.resendVerifyEmail(user_id, user.email)
  return res.json({ result })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, IForgotPasswordReqBody>,
  res: Response
) => {
  const { _id, verify_status, email } = req.user as User
  const result = await usersServices.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify_status,
    email
  })
  return res.json({ result })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, IVerifyForgotPasswordReqBody>,
  res: Response
) => {
  return res.json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESSFULLY })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, IResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as ITokenPayload
  const { password } = req.body
  const result = await usersServices.resetPassword(user_id, password)
  return res.json({ result })
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const user = await usersServices.getMe(user_id)
  return res.json({ message: USERS_MESSAGES.GET_ME_SUCCESSFULLY, result: user })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, IUpdateMeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const { body } = req
  // console.log(body)
  // const body = pick(req.body, [
  //   'name',
  //   'date_of_birth',
  //   'bio',
  //   'location',
  //   'website',
  //   'username',
  //   'avatar',
  //   'cover_photo'
  // ])
  const result = await usersServices.updateMe(user_id, body)
  return res.json({ message: USERS_MESSAGES.UPDATE_ME_SUCCESSFULLY, result })
}

export const getProfileController = async (
  req: Request<ParamsDictionary, any, IGetProfileReqParams>,
  res: Response
) => {
  const { username } = req.params
  const user = await usersServices.getProfile(username)
  return res.json({ message: USERS_MESSAGES.GET_PROFILE_SUCCESSFULLY, result: user })
}

export const followController = async (req: Request<ParamsDictionary, any, IFollowReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const { followed_user_id } = req.body
  const user = await usersServices.followUser(user_id, followed_user_id)
  return res.json({ result: user })
}

export const unfollowController = async (req: Request<ParamsDictionary, any, IUnfollowReqParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const { user_id: followed_user_id } = req.params
  const user = await usersServices.unfollowUser(user_id, followed_user_id)
  return res.json({ result: user })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, IChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const { password } = req.body
  const result = await usersServices.changePassword(user_id, password)
  return res.json({ result })
}
