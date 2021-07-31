export enum DefaultPermission {
  AdminPannel = 'AdminPannel',
  Authorize = 'Authorize',
}

export enum PermissionType {
  ENTITY = 'entity',
  API = 'api',
  PAGE = 'page',
  OTHER = 'other',
}

export enum PermissionAction {
  FIND = 'find',
  FIND_ONE = 'findOne',
  LIST = 'list',
  UPDATE = 'update',
  UPDATE_ONE = 'updateOne',
  CREATE = 'create',
  CREATE_MANY = 'createMany',
  DELETE = 'delete',
  DELETE_ONE = 'deleteOne',
  READ = 'read',
}

export enum PermissionMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}
