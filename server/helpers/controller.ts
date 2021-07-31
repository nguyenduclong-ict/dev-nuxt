import { EntityPermission, Permission, User } from '@/server/entities'
import { plainToClass, Transform } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { RequestError, sendError, UNPROCESSABLE_ENTITY } from './errors'
import { PermissionHelper } from './permission'

export function params(cls: any) {
  return function (target: any) {
    target.prototype.paramsCls = cls
  }
}

export function Convert(type: 'number' | 'string' | 'boolean' | 'falsy') {
  return Transform(({ value }) => {
    if (type === 'number') return Number(value)
    if (type === 'string') return '' + value
    if (type === 'boolean') {
      const lower = value.toLowerCase()
      if (lower === 'true') return true
      if (lower === 'false') return false
    }
    if (type === 'falsy' && !value) {
      return undefined
    }
    return value
  })
}

export interface ControllerOptions {
  parseQuery?: boolean
  validate?: boolean
}

export interface BaseMeta {
  user?: User
  userPermissions?: EntityPermission[]
  auth?: PermissionHelper
  token?: string
  isCreator?: boolean
  isSameRole?: boolean
  endpoint?: string
  [x: string]: any
}

export class Controller<Params = undefined, M = undefined> {
  params: Params
  paramsCls: any
  meta: M | BaseMeta

  options: ControllerOptions

  req: Request
  res: Response
  next: NextFunction

  static get init() {
    return (
      options: ControllerOptions = { parseQuery: false, validate: true }
    ) => {
      return async (req: any, res: any, next: any) => {
        const controller = new this(req, res, next, options)
        return controller.handler.bind(controller)()
      }
    }
  }

  constructor(
    req: Request,
    res: Response,
    next: NextFunction,
    options?: ControllerOptions
  ) {
    this.req = req
    this.res = res
    this.next = next
    this.options = options ?? this.options
    this.paramsCls = this.constructor.prototype.paramsCls
    this.meta = this.req.meta
  }

  sendError(...errors: (Error | RequestError)[]) {
    return sendError(this.res, ...errors)
  }

  customParams: (parmas: Params) => void

  getParamsFromRequest() {
    const { params: _params = {}, body = {}, query = {} } = this.req
    if (this.options.parseQuery && query) {
      Object.keys(query).forEach((key) => {
        const value = query[key]
        if (typeof value === 'string') {
          // number
          if (!isNaN(+value)) {
            query[key] = Number(value) as any
          }

          // boolean
          if (['true', 'false'].includes(value.toLowerCase())) {
            query[key] = {
              true: true,
              false: false,
            }[value.toLowerCase()] as any
          }

          // object
          try {
            query[key] = JSON.parse(value)
          } catch (error) {
            console.warn(`Cannot parse ${key}`, value)
          }
        }
      })
    }

    let params: Params = {
      ...query,
      ..._params,
      ...body,
    }

    if (this.paramsCls) {
      params = plainToClass(this.paramsCls, params)
    }

    if (this.customParams) {
      this.customParams(params)
    }

    this.params = params
    return params
  }

  async validate() {
    const errors = await validate(this.params as any)

    return errors
  }

  async handler() {
    try {
      await this.getParamsFromRequest()
      if (this.options.validate && this.paramsCls) {
        const addErrorMessages = (arr: any[], errors: ValidationError[]) => {
          errors.forEach((e) => {
            if (e.constraints) arr.push(...Object.values(e.constraints))
            if (e.children?.length) {
              const item = { property: e.property, errors: [] as any }
              addErrorMessages(item.errors, e.children)
              arr.push(item)
            }
          })
        }

        const errors = await this.validate()

        if (errors.length) {
          const strs: any[] = []
          addErrorMessages(strs, errors)
          return this.sendError({
            ...UNPROCESSABLE_ENTITY,
            message: strs[0],
            errors: strs,
          })
        }
      }
      const result = await this.main.bind(this)()
      return result
    } catch (error) {
      this.next(error)
      throw error
    }
  }

  main() {
    this.res.send(this.constructor.name)
  }
}

/**
 * @param sync Synchronous
 */
export function createRollback(sync = false) {
  const tasks: any[] = []

  return {
    sync,
    tasks,
    add(task: any) {
      this.tasks.push(task)
    },
    async run() {
      if (!this.tasks) return []
      let result = []
      if (sync) {
        for (const task of this.tasks) {
          result.push(await task())
        }
      } else {
        result = await Promise.all(this.tasks.map((task) => task()))
      }
      return result
    },
  }
}
