import {
  CreateContext,
  CreateContextMany,
  FindContext,
  Repository,
  set,
  toMongoId,
  UpdateContext,
} from '@nguyenduclong/mongodbts'
import { PermissionHelper } from '../permission'

export type Constructor<T = {}> = new (...args: any[]) => T

export function author(authorKey = ['createdBy', 'updatedBy']) {
  return function (constructor: Constructor<Repository>) {
    return class extends constructor {
      constructor(...agrs: any[]) {
        super(...agrs)
        this.options.authorKey = Array.isArray(authorKey)
          ? authorKey
          : [authorKey]
        this.addBefore(
          [
            'find',
            'list',
            'findOne',
            'delete',
            'deleteOne',
            'update',
            'updateOne',
          ],
          '__author_plugin_buildQuery'
        )

        this.addBefore(
          ['update', 'updateOne'],
          '__author_plugin_buildDataUpdate'
        )
        this.addBefore(
          ['createMany', 'create'],
          '__author_plugin_buildDataCreate'
        )
      }

      __author_plugin_buildQuery(ctx: FindContext) {
        if (!ctx.meta?.user) return
        const auth: PermissionHelper = ctx.meta?.auth
        if (auth.isAdmin) return
        const [createdByKey] = this.options.authorKey || []
        if (
          ctx.meta.isCreator &&
          createdByKey &&
          !!this.schema.path(createdByKey)
        ) {
          if (!ctx.query.$or) set(ctx, 'query.$or', [])
          ctx.query.$or.push({ [createdByKey]: ctx.meta.user.id })
        }

        if (
          ctx.meta.isSameRole &&
          createdByKey &&
          !!this.schema.path(createdByKey)
        ) {
          if (!ctx.query.$or) set(ctx, 'query.$or', [])
          ctx.populates.push({
            path: createdByKey,
            populate: { path: 'roles' },
          })
          ctx.query.$or.push({
            [createdByKey]: {
              roles: ctx.meta.user.roles.map(toMongoId),
            },
          })
        }
      }

      __author_plugin_buildData(ctx: UpdateContext) {
        if (!ctx.meta?.user) return
        const [, updatedByKey] = this.options.authorKey || []
        if (updatedByKey && !!this.schema.path(updatedByKey)) {
          set(ctx.data, updatedByKey, toMongoId(ctx.meta.user))
        }
      }

      __author_plugin_buildDataCreate(ctx: CreateContext | CreateContextMany) {
        if (!ctx.meta?.user) return
        const [createdByKey] = this.options.authorKey || []
        if (createdByKey && !!this.schema.path(createdByKey)) {
          set(ctx.data, createdByKey, toMongoId(ctx.meta.user))
        }
      }
    }
  } as any
}
