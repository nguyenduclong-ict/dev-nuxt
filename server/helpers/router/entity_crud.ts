import { PermissionAction } from '@/server/constants'
import { GetUserInfo, hasEntityPermission } from '@/server/middlewares/auth'
import { kebabCase } from '@/utils/lodash'
import { joinUrl } from '@/utils/utils'
import { Repository } from '@nguyenduclong/mongodbts'
import { INTERNAL_SERVER_ERROR, sendError, sendValidateError } from '../errors'
import { logger } from '../logger'
import {
  ParamsCreate,
  ParamsCreateMany,
  ParamsDelete,
  ParamsList,
  ParamsUpdate,
} from '../params.dto'
import { createApi } from './create_api'
import { MergeParams, ParseQuery, ValidateRequestParams } from './middleware'

export const setSeachQuery = (ctx) => {
  const { search, strict } = ctx

  if (search) {
    ctx.query = ctx.query || {}
    ctx.query.$text = {
      $search: strict ? '"' + search + '"' : search,
    }
  }
}

export const entityCrud = (
  api: ReturnType<typeof createApi>,
  repository: Repository
) => {
  const entityName = repository.name.replace('Repository', '')
  const endpoint = '/' + kebabCase(entityName) + 's'
  const router = api.router

  // ===== list =====
  router.get(
    endpoint,
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.READ),
    ParseQuery,
    MergeParams(),
    ValidateRequestParams(ParamsList),
    async (req, res, next) => {
      try {
        const ctx: ParamsList = req.data
        setSeachQuery(ctx)
        const data = await repository.list(ctx as any)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== find =====
  router.get(
    joinUrl(endpoint, '/find'),
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.READ),
    ParseQuery,
    MergeParams(),
    ValidateRequestParams(ParamsList),
    async (req, res) => {
      try {
        const ctx: ParamsList = req.data
        setSeachQuery(ctx)
        const data = await repository.find(ctx as any)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== findOne =====
  router.get(
    joinUrl(endpoint, '/find-one'),
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.READ),
    ParseQuery,
    MergeParams(),
    ValidateRequestParams(ParamsList),
    async (req, res) => {
      try {
        const ctx: ParamsList = req.data
        setSeachQuery(ctx)
        const data = await repository.findOne(ctx as any)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== create =====
  router.post(
    endpoint,
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.CREATE),
    MergeParams(),
    ValidateRequestParams(ParamsCreate),
    async (req, res) => {
      try {
        const ctx: ParamsCreate = req.data

        // validate entity
        const errors = await repository.validate(ctx.data)
        if (errors.length) return sendValidateError(res, errors)

        const data = await repository.create(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== createMany =====
  router.post(
    endpoint + '/bulk-create',
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.CREATE),
    MergeParams(),
    ValidateRequestParams(ParamsCreateMany),
    async (req, res) => {
      try {
        const ctx: ParamsCreateMany = req.data

        // valiadate entity
        for (const item of ctx.data) {
          const errors = await repository.validate(item)
          if (errors.length) return sendValidateError(res, errors)
        }

        const data = await repository.createMany(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== update =====
  router.put(
    endpoint,
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.UPDATE),
    MergeParams(),
    ValidateRequestParams(ParamsUpdate),
    async (req, res) => {
      try {
        const ctx: ParamsUpdate = req.data

        // validate entity
        const errors = await repository.validate(ctx.data)
        if (errors.length) return sendValidateError(res, errors)

        const data = await repository.updateOne(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== updateOne =====
  router.put(
    endpoint + '/:id',
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.UPDATE),
    MergeParams({ paramsIdToQuery: true }),
    ValidateRequestParams(ParamsUpdate),
    async (req, res) => {
      try {
        const ctx: ParamsUpdate = req.data

        // validate entity
        const errors = await repository.validate(ctx.data)
        if (errors.length) return sendValidateError(res, errors)

        const data = await repository.update(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== deleteOne =====
  router.delete(
    endpoint + '/:id',
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.DELETE),
    ParseQuery,
    MergeParams({ paramsIdToQuery: true }),
    ValidateRequestParams(ParamsDelete),
    async (req, res) => {
      try {
        const ctx: ParamsDelete = req.data
        ctx.query = {
          id: req.data.id,
        }
        const data = await repository.deleteOne(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )

  // ===== update =====
  router.delete(
    endpoint + '/',
    GetUserInfo,
    hasEntityPermission(repository.name, PermissionAction.DELETE),
    ParseQuery,
    MergeParams(),
    ValidateRequestParams(ParamsDelete),
    async (req, res) => {
      try {
        const ctx: ParamsDelete = req.data
        const data = await repository.delete(ctx)
        res.json(data)
      } catch (error) {
        logger.error(error)
        return sendError(res, INTERNAL_SERVER_ERROR, {
          message: error.message || error.name,
        })
      }
    }
  )
}
