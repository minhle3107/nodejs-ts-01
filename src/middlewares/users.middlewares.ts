import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import usersServices from '~/services/users.services'

export const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }
  next()
}

export const registerValidation = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: { min: 2, max: 255 },
        errorMessage: 'Name must be between 2 and 255 characters'
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await usersServices.checkEmailExist(value)
          if (isExistEmail) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Password must be at least 6 characters long and less than 50 characters'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Confirm password must be at least 6 characters long and less than 50 characters'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol'
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: 'Passwords do not match'
      }
    },
    date_of_birth: {
      notEmpty: true,
      toDate: true,
      isISO8601: true,
      errorMessage: 'Date of birth must be a valid ISODate'
    }
  })
)
