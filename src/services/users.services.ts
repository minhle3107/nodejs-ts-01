import User from '~/models/shcemas/User.schema'
import databaseService from '~/services/database.services'
import { IRegisterReqBody } from '~/models/requests/User.requests'
import { handleHashPassword } from '~/utils/crypto'
import { EnumTokenType, EnumUserVerifyStatus } from '~/constants/enum'
import { handleSignToken } from '~/utils/jwt'
import * as process from 'process'
import databaseServices from '~/services/database.services'
import RefreshToken from '~/models/shcemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import USERS_MESSAGES from '~/constants/messages'

config()

class UsersServices {
  private signAccessToken(user_id: string) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPORES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFEESH_TOKEN_EXPORES_IN
      }
    })
  }

  private signEmailVerifyToken(user_id: string) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async registerUser(payload: IRegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    const user = new User({
      ...payload,
      _id: user_id,
      email: payload.email.toLowerCase(),
      email_verify_token: email_verify_token,
      password: handleHashPassword(payload.password),
      date_of_birth: new Date(payload.date_of_birth)
    })
    await databaseService.users.insertOne(user)
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id.toString())
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

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESSFULLY }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken(user_id.toString()),
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
}

const usersServices = new UsersServices()
export default usersServices
