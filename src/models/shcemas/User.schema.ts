import { ObjectId } from 'mongodb'

enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

interface IUserType {
  _id?: ObjectId
  name?: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verified_token?: string
  forgot_password_token?: string
  verify_status?: UserVerifyStatus

  // Optional fields
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  public _id?: ObjectId
  public name: string
  public date_of_birth: Date
  public email: string
  public password: string
  public created_at: Date
  public updated_at: Date
  public email_verified_token: string
  public forgot_password_token: string
  public verify_status: UserVerifyStatus

  // Optional fields
  public bio: string
  public location: string
  public website: string
  public username: string
  public avatar: string
  public cover_photo: string

  constructor(user: IUserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.date_of_birth = user.date_of_birth || new Date()
    this.email = user.email
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verified_token = user.email_verified_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify_status = user.verify_status || UserVerifyStatus.Unverified

    // Optional fields
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}

// import { ObjectId } from 'mongodb'
//
// enum UserVerifyStatus {
//   Unverified,
//   Verified,
//   Banned
// }
//
// interface IUserType {
//   name?: string
//   email: string
//   date_of_birth?: Date
//   password: string
//   created_at?: Date
//   updated_at?: Date
//   email_verified_token?: string
//   forgot_password_token?: string
//   verify_status?: UserVerifyStatus
//
//   // Optional fields
//   bio?: string
//   location?: string
//   website?: string
//   username?: string
//   avatar?: string
//   cover_photo?: string
// }
//
// export default class User {
//   public _id?: ObjectId
//   public name?: string
//   public date_of_birth?: Date
//   public email: string
//   public password: string
//   public created_at: Date
//   public updated_at: Date
//   public email_verified_token: string
//   public forgot_password_token: string
//   public verify_status: UserVerifyStatus
//
//   // Optional fields
//   public bio?: string
//   public location?: string
//   public website?: string
//   public username?: string
//   public avatar?: string
//   public cover_photo?: string
//
//   constructor({
//     name,
//     email,
//     password,
//     date_of_birth,
//     created_at,
//     updated_at,
//     email_verified_token,
//     forgot_password_token,
//     verify_status,
//     bio,
//     location,
//     website,
//     username,
//     avatar,
//     cover_photo
//   }: IUserType) {
//     this.name = name
//     this.email = email
//     this.password = password
//     this.date_of_birth = date_of_birth || new Date()
//     this.created_at = created_at || new Date()
//     this.updated_at = updated_at || new Date()
//     this.email_verified_token = email_verified_token || ''
//     this.forgot_password_token = forgot_password_token || ''
//     this.verify_status = verify_status || UserVerifyStatus.Unverified
//
//     // Optional fields
//     this.bio = bio
//     this.location = location
//     this.website = website
//     this.username = username
//     this.avatar = avatar
//     this.cover_photo = cover_photo
//   }
// }
