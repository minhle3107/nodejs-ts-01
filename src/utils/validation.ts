import express from 'express'
import { validationResult } from 'express-validator'
import { ValidationChain } from 'express-validator/src/chain'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    // Không có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }
    // Có lỗi thì tạo ra một object lỗi mới
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const errorsObjectKey in errorsObject) {
      const { msg } = errorsObject[errorsObjectKey]
      // Nếu lỗi không phải là lỗi do validate của express-validator thì next lỗi đó
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[errorsObjectKey] = errorsObject[errorsObjectKey]
    }

    next(entityError)
  }
}
