/// <reference types="mongoose" />
import { Permission } from '@/server/entities';
export declare function createApiPermissionIfNotExists(): Promise<(Permission & import("mongoose").Document<any, any, Permission>)[]>;
export declare function createEntityPermissionIfNotExists(): Promise<[Permission & import("mongoose").Document<any, any, Permission>, Permission & import("mongoose").Document<any, any, Permission>, Permission & import("mongoose").Document<any, any, Permission>, Permission & import("mongoose").Document<any, any, Permission>][]>;
export declare function initRolesAndPermissions(): Promise<boolean>;
