import User from '~/models/shcemas/User.schema'
import databaseService from '~/services/database.services'
import { IRegisterReqBody } from '~/models/requests/Use.requests'
import { handleHashPassword } from '~/utils/crypto'
import { EnumTokenType } from '~/constants/enum'
import { handleSignToken } from '~/utils/jwt'
import * as process from 'process'

class UsersServices {
  private signAccessToken(user_id: string) {
    return handleSignToken({
      payload: {
        user_id,
        token_type: EnumTokenType.AccessToken
      },
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
      options: {
        expiresIn: process.env.REFEESH_TOKEN_EXPORES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async registerUser(payload: IRegisterReqBody) {
    const user = new User({
      ...payload,
      email: payload.email.toLowerCase(),
      password: handleHashPassword(payload.password),
      date_of_birth: new Date(payload.date_of_birth)
    })
    const result = await databaseService.users.insertOne(user)
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    return { access_token, refresh_token }
  }
}

const usersServices = new UsersServices()
export default usersServices
