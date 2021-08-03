import { PermissionAction, PermissionMethod, PermissionType } from '@/server/constants/permission.enum';
import { Repository } from '@nguyenduclong/mongodbts';
export declare class Permission {
    id?: any;
    _id?: any;
    type: PermissionType;
    isDefault?: boolean;
    name?: string;
    description?: string;
    api?: {
        endpoint: string;
        method: PermissionMethod;
    };
    entity?: {
        name: string;
        action: PermissionAction;
    };
    createdAt?: Date;
    updatedAt?: Date;
    page?: string;
}
export declare class PermissionRepository extends Repository<Permission> {
}
