import { Repository } from '@nguyenduclong/mongodbts';
import { Schema } from 'mongoose';
import { EntityPermission } from './EntityPermission';
export declare enum DefaultRole {
    ADMIN = "Admin",
    WRITER = "Writer",
    AUTHENTIACATED = "Authenticated",
    GUEST = "Guest"
}
export declare class Role {
    id?: any;
    _id?: any;
    name: string;
    isDefault: boolean;
    permissions: EntityPermission[];
}
export declare class RoleRepository extends Repository<Role> {
    onCreateSchema(schema: Schema<Role>): Schema<Role, import("mongoose").Model<any, any, any>, undefined, any>;
}
