import { Request, Response } from 'express'

export interface RequestError {
  code?: number
  message?: string
  name?: string
  type?: string
  errors?: any
}

export const NOT_FOUND: RequestError = {
  code: 404,
  type: 'NotFound',
}

export const ENTITY_EXIST: RequestError = {
  code: 409,
  type: 'Entity Exist',
}

export const FORBIDDEN: RequestError = {
  code: 403,
  type: 'Forbidden',
}

export const UNAUTHORIZED: RequestError = {
  code: 401,
  type: 'Unauthorized',
}

export const USER_IS_BLOCKED: RequestError = {
  ...UNAUTHORIZED,
  message: 'User blocked',
}

export const INVALID_TOKEN: RequestError = {
  ...UNAUTHORIZED,
  message: 'Invalid Token',
}

export const UNPROCESSABLE_ENTITY: RequestError = {
  code: 422,
  type: 'Params Invalid',
}

export const INTERNAL_SERVER_ERROR: RequestError = {
  code: 500,
  type: 'Internal Server Error',
}

export function sendError(res: Response, ...errors: (Error | RequestError)[]) {
  let error: Error | RequestError = errors[0] || INTERNAL_SERVER_ERROR
  error = { ...error }

  if (errors.length > 1) {
    errors.forEach((e) => Object.assign(error, e))
  }

  if (error instanceof Error) {
    res.status(500).json({
      message: error.message,
      name: error.name,
    })
  } else {
    res.status(error.code).json(error)
  }
}

export function sendValidateError(res: Response, errors: any) {
  const getError = (error, result = []) => {
    if (error.constraints) {
      result.push(...Object.values(error.constraints))
      return result
    }
    if (error.children) {
      error.children.forEach((element) => {
        getError(element, result)
      })
    }
    return result
  }

  const message: any = {}

  errors.forEach((error) => {
    message[error.property] = getError(error)
    if (message[error.property].length === 1) {
      message[error.property] = message[error.property][0]
    }
  })

  sendError(res, UNPROCESSABLE_ENTITY, { errors: message })
}
