import { connection } from './config/mongo'
import {
  ConfigRepository,
  EntityPermissionRepository,
  FileRepository,
  PermissionRepository,
  RoleRepository,
  TokenRepository,
  UserRepository,
} from './entities'

export const userRepository = new UserRepository(connection)
export const tokenRepository = new TokenRepository(connection)
export const configRepository = new ConfigRepository(connection)
export const roleRepository = new RoleRepository(connection)
export const permissionRepository = new PermissionRepository(connection)
export const entityPermission = new EntityPermissionRepository(connection)
export const fileRepository = new FileRepository(connection)
