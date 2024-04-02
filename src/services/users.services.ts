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
}

const usersServices = new UsersServices()
export default usersServices
