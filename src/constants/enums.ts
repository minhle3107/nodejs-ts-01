export enum EnumUserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum EnumTokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum EnumMediaType {
  Image,
  Video,
  HLS
}

export enum EnumMediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum EnumEncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa xử lý)
  Processing, // Đang xử lý
  Completed, // Đã xử lý xong
  Failed, // Xử lý thất bại
  NotFound
}

export enum EnumTweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum EnumTweetAudience {
  Everyone,
  TwitterCircle
}
