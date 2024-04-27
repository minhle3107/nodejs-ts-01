import User from '~/models/shcemas/User.schema'
import databaseService from '~/services/database.services'
import databaseServices from '~/services/database.services'
import { IRegisterReqBody, IUpdateMeReqBody } from '~/models/requests/User.requests'
import { handleHashPassword } from '~/utils/crypto'
import { EnumTokenType, EnumUserVerifyStatus } from '~/constants/enum'
import { handleSignToken } from '~/utils/jwt'
import * as process from 'process'
import RefreshToken from '~/models/shcemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import USERS_MESSAGES from '~/constants/messages'
import Follower from '~/models/shcemas/Follower.schema'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import httpStatus from '~/constants/httpStatus'

config()

class UsersServices {
  private signAccessToken({ user_id, verify_status }: { user_id: string; verify_status: EnumUserVerifyStatus }) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.AccessToken,
        verify_status
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPORES_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify_status }: { user_id: string; verify_status: EnumUserVerifyStatus }) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.RefreshToken,
        verify_status
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFEESH_TOKEN_EXPORES_IN
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify_status }: { user_id: string; verify_status: EnumUserVerifyStatus }) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.EmailVerifyToken,
        verify_status
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken({
    user_id,
    verify_status
  }: {
    user_id: string
    verify_status: EnumUserVerifyStatus
  }) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.ForgotPasswordToken,
        verify_status
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken({
    user_id,
    verify_status
  }: {
    user_id: string
    verify_status: EnumUserVerifyStatus
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify_status }),
      this.signRefreshToken({ user_id, verify_status })
    ])
  }

  async registerUser(payload: IRegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify_status: EnumUserVerifyStatus.Unverified
    })
    const user = new User({
      ...payload,
      _id: user_id,
      username: `user${user_id.toString()}`,
      email: payload.email.toLowerCase(),
      email_verify_token: email_verify_token,
      password: handleHashPassword(payload.password),
      date_of_birth: new Date(payload.date_of_birth)
    })
    await databaseService.users.insertOne(user)
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify_status: EnumUserVerifyStatus.Unverified
    })
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    console.log('email_verify_token', email_verify_token)
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login({ user_id, verify_status }: { user_id: string; verify_status: EnumUserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify_status
    })
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    return { access_token, refresh_token }
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauthGoogle(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: httpStatus.BAD_REQUEST
      })
    }
    // Kiểm tra email đã được đăng ký chưa
    const user = await databaseService.users.findOne({ email: userInfo.email })
    const newUserTrue = 1
    const newUserFalse = 0
    // Nếu tồn tại cho login vào
    if (user) {
      const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
        user_id: user._id.toString(),
        verify_status: user.verify_status
      })
      await databaseServices.refreshTokens.insertOne(new RefreshToken({ user_id: user._id, token: refresh_token }))
      return {
        access_token,
        refresh_token,
        newUser: newUserFalse,
        verify_status: user.verify_status
      }
    } else {
      const password = Math.random().toString(36).slice(2, 15)
      const data = await this.registerUser({
        email: userInfo.email,
        name: userInfo.name,
        password,
        confirm_password: password,
        date_of_birth: new Date().toISOString()
      })
      return {
        ...data,
        newUser: newUserTrue,
        verify_status: EnumUserVerifyStatus.Unverified
      }
    }
  }

  async logout(refresh_token: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESSFULLY }
  }

  async refreshToken({
    user_id,
    verify_status,
    refresh_token
  }: {
    user_id: string
    verify_status: EnumUserVerifyStatus
    refresh_token: string
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify_status }),
      this.signRefreshToken({ user_id, verify_status }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ user_id, verify_status: EnumUserVerifyStatus.Verified }),
      await databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify_status: EnumUserVerifyStatus.Verified
            // updated_at: new Date()
          },
          $currentDate: { updated_at: true }
        }
      )
    ])
    const [access_token, refresh_token] = token
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    return { access_token, refresh_token }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify_status: EnumUserVerifyStatus.Unverified
    })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: { updated_at: true }
      }
    )
    console.log('Resend verify email', email_verify_token)
    return { message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY }
  }

  async forgotPassword({ user_id, verify_status }: { user_id: string; verify_status: EnumUserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify_status })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: { updated_at: true }
      }
    )
    // Gửi email chứa link reset password có dạng: https://domain.com/reset-password?token=forgot_password_token
    console.log('Forgot password token', forgot_password_token)
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: handleHashPassword(password)
        },
        $currentDate: { updated_at: true }
      }
    )
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFULLY }
  }

  async getMe(user_id: string) {
    return await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
  }

  async updateMe(user_id: string, payload: IUpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    return await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { ...(_payload as IUpdateMeReqBody & { date_of_birth?: Date }) },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
  }

  async getProfile(username: string) {
    return await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify_status: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
  }

  async followUser(user_id: string, followed_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower === null) {
      await databaseServices.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return { message: USERS_MESSAGES.FOLLOW_USER_SUCCESSFULLY }
    }
    return { message: USERS_MESSAGES.FOLLOW_USER_ALREADY }
  }

  async unfollowUser(user_id: string, followed_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower === null) {
      return { message: USERS_MESSAGES.ALREADY_UNFOLLOWED_USER }
    }
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return { message: USERS_MESSAGES.UNFOLLOW_SUCCESSFULLY }
  }

  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: handleHashPassword(new_password)
        },
        $currentDate: { updated_at: true }
      }
    )
    return { message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESSFULLY }
  }
}

const usersServices = new UsersServices()
export default usersServices
