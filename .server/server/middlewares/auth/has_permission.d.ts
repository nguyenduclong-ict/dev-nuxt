import { PermissionAction } from '@/server/constants';
import { Permission, EntityPermissionOptions } from '@/server/entities';
import { ValueOf } from '@/server/helpers/interface';
import { RequestHandler } from 'express';
export declare function hasPermission(...names: (string | Partial<Permission> | [string | Partial<Permission>, EntityPermissionOptions])[]): RequestHandler;
export declare const hasApiPermission: RequestHandler;
export declare const hasEntityPermission: {
    (entity: string, ...actions: ValueOf<typeof PermissionAction>[]): RequestHandler;
    id: string;
};
