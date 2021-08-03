import { set, omit } from '@/utils/lodash'
import { parseBool } from '@/utils/utils'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { RequestHandler } from 'express'
import { sendValidateError } from '../errors'

export const ParseQuery: RequestHandler = (req, res, next) => {
  const query = req.query

  if (!query) return next()
  const keys = [
    'query',
    'populates',
    'page',
    'pageSize',
    'projection',
    'softDelete',
    'select',
    'exact',
    'sort',
    'limit',
    'skip',
    'strict',
  ]

  Object.keys(query).forEach((key) => {
    if (query[key] && typeof query[key] === 'string' && keys.includes(key)) {
      if (['strict'].includes(key)) {
        set(query, key, true)
      } else if (['page', 'pageSize', 'skip', 'limit'].includes(key)) {
        set(query, key, Number(query[key]))
      } else if (['exact', 'softDelete'].includes(key)) {
        set(query, key, parseBool(query[key]))
      } else if (typeof query[key] === 'string') {
        try {
          query[key] = JSON.parse(query[key] as string)
        } catch (error) {}
      }
    } else if (Array.isArray(query[key])) {
      query[key] = (query[key] as any).map((e) => {
        let v = e
        if (typeof e === 'string') {
          try {
            v = JSON.parse(query[key] as string)
          } catch (error) {}
        }
        return v
      })
    }
  })

  next()
}

type MergeParamsOptions = {
  paramsIdToQuery?: boolean
}

export const MergeParams = (
  { paramsIdToQuery }: MergeParamsOptions = { paramsIdToQuery: false }
): RequestHandler => {
  return (req, res, next) => {
    const params = {
      ...req.body,
      ...req.params,
      ...req.query,
      meta: req.meta,
    }

    if (paramsIdToQuery) {
      set(params, 'query.id', req.params.id)
    }

    req.data = params
    next()
  }
}

// validate merged params by class
export const ValidateRequestParams = (cls: any): RequestHandler => {
  return async function (req, res, next) {
    const data = plainToClass(cls, omit(req.data, 'meta'), {})
    const errors = await validate(data as any)
    if (errors.length) return sendValidateError(res, errors)
    next()
  }
}
