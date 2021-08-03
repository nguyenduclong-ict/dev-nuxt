import { Repository } from '@nguyenduclong/mongodbts';
import { Schema } from 'mongoose';
import { EntityPermission } from './EntityPermission';
import { Role } from './Role';
export declare class User {
    id?: any;
    _id?: any;
    username: string;
    password: string;
    email?: string;
    avatar?: String;
    isAdmin: boolean;
    blocked: boolean;
    profile: {
        avatar?: string;
        name?: string;
    };
    roles: Role[];
    permissions?: EntityPermission[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class UserRepository extends Repository<User> {
    onCreateSchema(schema: Schema<User>): Schema<User, import("mongoose").Model<any, any, any>, undefined, any>;
}
