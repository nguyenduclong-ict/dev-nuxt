import { toMongoId } from '@nguyenduclong/mongodbts'
import {
  PermissionType,
  PermissionAction,
  DefaultPermission,
} from '@/server/constants'
import { DefaultRole, Permission, Role } from '@/server/entities'
import {
  createIfNotExits,
  EntityDeclaration,
  EntityHelper,
} from '@/server/helpers/repository'
import { apis } from '@/server/helpers/router'
import {
  entityPermission,
  permissionRepository,
  roleRepository,
} from '@/server/repository'

export function createApiPermissionIfNotExists() {
  return Promise.all(
    apis.map((api) => {
      return createIfNotExits(
        permissionRepository,
        {
          isDefault: true,
          type: PermissionType.API,
          api: {
            method: api.method as any,
            endpoint: api.fullPath,
          },
        },
        {
          isDefault: true,
          type: PermissionType.API,
          api: {
            method: api.method as any,
            endpoint: api.fullPath,
          },
        },
        () => console.log('create permission', api.method, api.fullPath)
      )
    })
  )
}

export function createEntityPermissionIfNotExists() {
  const checkAndCreatePermissionIfNotExist = (
    entity: EntityDeclaration,
    action: PermissionAction
  ) => {
    return createIfNotExits(
      permissionRepository,
      {
        isDefault: true,
        type: PermissionType.ENTITY,
        entity: {
          name: entity.id,
          action,
        },
      },
      undefined,
      () => console.log('create permission', entity.id, action)
    )
  }

  return Promise.all(
    EntityHelper.getEntities().map((entity) =>
      Promise.all([
        checkAndCreatePermissionIfNotExist(entity, PermissionAction.READ),
        checkAndCreatePermissionIfNotExist(entity, PermissionAction.CREATE),
        checkAndCreatePermissionIfNotExist(entity, PermissionAction.UPDATE),
        checkAndCreatePermissionIfNotExist(entity, PermissionAction.DELETE),
      ])
    )
  )
}

export async function initRolesAndPermissions() {
  const [adminPanelPermission, authorizePermisison] = await Promise.all([
    createIfNotExits<Permission>(
      permissionRepository,
      {
        type: PermissionType.OTHER,
        name: DefaultPermission.AdminPannel,
        description: 'Access Admin Pannel',
        isDefault: true,
      },
      undefined,
      () => {
        console.log('create permission', DefaultPermission.AdminPannel)
      }
    ),
    createIfNotExits<Permission>(
      permissionRepository,
      {
        type: PermissionType.OTHER,
        name: DefaultPermission.Authorize,
        description: 'Setup Permission of role and user',
        isDefault: true,
      },
      undefined,
      () => {
        console.log('create permission', DefaultPermission.Authorize)
      }
    ),
  ])

  let createRoleAdmin = false
  const createRoleWriter = false

  await Promise.all([
    createIfNotExits<Role>(
      roleRepository,
      {
        isDefault: true,
        name: DefaultRole.ADMIN,
      },
      {
        isDefault: true,
        name: DefaultRole.ADMIN,
        permissions: [],
      },
      () => {
        createRoleAdmin = true
        console.log('create role', DefaultRole.ADMIN)
      }
    ).then(async (doc) => {
      if (createRoleAdmin) {
        const [e1, e2] = await entityPermission.createMany({
          data: [
            {
              permission: toMongoId(adminPanelPermission),
              entityName: 'Role',
              entity: toMongoId(doc),
            },
            {
              permission: toMongoId(authorizePermisison),
              entityName: 'Role',
              entity: toMongoId(doc),
            },
          ],
        })

        return doc.set('permissions', [toMongoId(e1), toMongoId(e2)]).save()
      }
    }),

    createIfNotExits<Role>(
      roleRepository,
      {
        isDefault: true,
        name: DefaultRole.WRITER,
      },
      {
        isDefault: true,
        name: DefaultRole.WRITER,
      },
      () => {
        console.log('create role', DefaultRole.WRITER)
      }
    ).then(async (doc) => {
      if (createRoleWriter) {
        const [e1] = await entityPermission.createMany({
          data: [
            {
              permission: toMongoId(adminPanelPermission),
              entityName: 'Role',
              entity: toMongoId(doc),
            },
          ],
        })

        return doc.set('permissions', [toMongoId(e1)]).save()
      }
    }),

    createIfNotExits<Role>(
      roleRepository,
      {
        isDefault: true,
        name: DefaultRole.AUTHENTIACATED,
      },
      {
        isDefault: true,
        name: DefaultRole.AUTHENTIACATED,
        permissions: [],
      },
      () => {
        console.log('create role', DefaultRole.AUTHENTIACATED)
      }
    ),

    createIfNotExits<Role>(
      roleRepository,
      {
        isDefault: true,
        name: DefaultRole.GUEST,
      },
      {
        isDefault: true,
        name: DefaultRole.GUEST,
        permissions: [],
      },
      () => {
        console.log('create role', DefaultRole.GUEST)
      }
    ),
  ])

  await createEntityPermissionIfNotExists()

  await createApiPermissionIfNotExists()

  return true
}
