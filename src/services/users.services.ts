import User from '~/models/shcemas/User.schema'
import databaseService from '~/services/database.services'

class UsersServices {
  async registerUser(payload: { email: string; password: string }) {
    const { email, password } = payload
    const user = new User({
      email: email,
      password: password
    })
    return await databaseService.users.insertOne(user)
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }
}

const usersServices = new UsersServices()
export default usersServices
