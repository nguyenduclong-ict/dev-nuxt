import { BaseMeta } from '@/server/helpers/controller'

declare global {
  namespace Express {
    interface Request {
      meta?: BaseMeta
      data?: any
    }
  }
}
