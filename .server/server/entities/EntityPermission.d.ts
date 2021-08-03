import { Repository } from '@nguyenduclong/mongodbts';
import { Permission } from './Permission';
export declare class EntityPermission {
    id?: any;
    _id?: any;
    entityName: string;
    entity?: any;
    permission: Permission;
    isCreator?: boolean;
    isSameRole?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface EntityPermissionOptions {
    isCreator?: boolean;
    isSameRole?: boolean;
}
export declare class EntityPermissionRepository extends Repository<EntityPermission> {
    test(): void;
}
