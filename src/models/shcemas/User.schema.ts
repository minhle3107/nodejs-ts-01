import { ObjectId } from 'mongodb'
import { EnumUserVerifyStatus } from '~/constants/enums'

interface IUserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify_status?: EnumUserVerifyStatus
  twitter_circle?: ObjectId[] // danh sách id của những người user add vào twitter circle
  // Optional fields
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id?: ObjectId
  name: string
  date_of_birth: Date
  email: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify_status: EnumUserVerifyStatus
  twitter_circle: ObjectId[]
  // Optional fields
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: IUserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.date_of_birth = user.date_of_birth || new Date()
    this.email = user.email
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify_status = user.verify_status || EnumUserVerifyStatus.Unverified
    this.twitter_circle = user.twitter_circle || []
    // Optional fields
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}
