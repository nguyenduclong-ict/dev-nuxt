import {
  EntityPermission,
  EntityPermissionOptions,
  Permission,
  Role,
  User,
} from '@/server/entities'
import { isMatch } from 'lodash'

export class PermissionHelper {
  roles: Role[] = []
  user: User = null

  rolePermissions: EntityPermission[] = []
  userPermissions: EntityPermission[] = []
  permissions: EntityPermission[] = []

  constructor(user?: User) {
    if (user) {
      this.user = user
      this.roles = user.roles
      this.rolePermissions =
        user.roles?.flatMap((role) => role.permissions) || []
      this.userPermissions = user.permissions
      this.permissions = [...this.rolePermissions, ...this.userPermissions]
    }
  }

  get isAdmin() {
    return this.user?.isAdmin
  }

  get isAuthenticated() {
    return !!this.user
  }

  hasPermission(
    ...items: (
      | string
      | Partial<Permission>
      | [string | Partial<Permission>, EntityPermissionOptions]
    )[]
  ): boolean | EntityPermission {
    if (this.isAdmin) return true

    if (items.length === 0) {
      return true
    }

    let result: boolean | EntityPermission = false

    for (const item of items) {
      if (!item) continue

      if (Array.isArray(item)) {
        const [condition, options] = item
        if (typeof condition === 'string') {
          result =
            !!this.permissions.find(
              (upers) =>
                upers.permission?.name === condition &&
                (options ? isMatch(upers, options) : true)
            ) || false
        } else if (typeof condition === 'object') {
          result =
            !!this.permissions.find(
              (upers) =>
                isMatch(upers.permission, condition) &&
                (options ? isMatch(upers, options) : true)
            ) || false
        }
      } else if (typeof item === 'string') {
        result = this.permissions.find(
          (upers) => upers.permission?.name === item
        )
      } else if (typeof item === 'object') {
        result = this.permissions.find((upers) =>
          isMatch(upers.permission, item)
        )
      }
    }

    return result
  }

  hasRole(...items: (string | Partial<Role>)[]) {
    if (this.isAdmin) return true

    if (items.length === 0) {
      return true
    }

    return items.some((item) => {
      if (!item) return false

      if (typeof item === 'string') {
        return !!this.roles.find((e) => e.name === item)
      }

      if (typeof item === 'object') {
        return !!this.roles.find((e) => isMatch(e, item))
      }

      return false
    })
  }
}
