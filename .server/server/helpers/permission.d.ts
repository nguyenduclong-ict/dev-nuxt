import { EntityPermission, EntityPermissionOptions, Permission, Role, User } from '@/server/entities';
export declare class PermissionHelper {
    roles: Role[];
    user: User;
    rolePermissions: EntityPermission[];
    userPermissions: EntityPermission[];
    permissions: EntityPermission[];
    constructor(user?: User);
    get isAdmin(): boolean;
    get isAuthenticated(): boolean;
    hasPermission(...items: (string | Partial<Permission> | [string | Partial<Permission>, EntityPermissionOptions])[]): boolean | EntityPermission;
    hasRole(...items: (string | Partial<Role>)[]): boolean;
}
