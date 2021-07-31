import {
  DeleteContext,
  FindContext,
  ListContext,
  UpdateContext,
  CreateContext,
  CreateContextMany,
} from '@nguyenduclong/mongodbts'

export type Actions =
  | 'find'
  | 'list'
  | 'findOne'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateOne'
  | 'delete'
  | 'deleteOne'

export function buildParams<E = any>(
  params:
    | FindContext<E>
    | ListContext<E>
    | CreateContext<E>
    | UpdateContext<E>
    | DeleteContext<E>
) {
  return params
}

buildParams.list = function <E = any>(params: ListContext<E>) {
  return buildParams(params)
}

buildParams.find = function <E = any>(params: FindContext<E>) {
  return buildParams(params)
}

buildParams.create = function <E = any>(params: CreateContext<E>) {
  return buildParams(params)
}

buildParams.createMany = function <E = any>(params: CreateContextMany<E>) {
  return buildParams(params)
}

buildParams.update = function <E = any>(params: UpdateContext<E>) {
  return buildParams(params)
}

buildParams.delete = function <E = any>(params: DeleteContext<E>) {
  return buildParams(params)
}
