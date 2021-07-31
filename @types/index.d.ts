import { User } from '@/server/entities'
import { PermissionHelper } from '@/server/helpers/permission'
import { Request, Response } from 'express'

declare global {
  interface AnyObject {
    [x: string]: any
  }
  namespace Mongodbts {
    interface BaseMeta {
      user?: User
      auth?: PermissionHelper
      isCreator?: boolean
      isSameRole?: boolean
      endpoint?: string
      req?: Request
      res?: Response
    }
  }
}

export {}
