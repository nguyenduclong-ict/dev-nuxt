import { EntityPermission, User } from '@/server/entities';
import { ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { RequestError } from './errors';
import { PermissionHelper } from './permission';
export declare function params(cls: any): (target: any) => void;
export declare function Convert(type: 'number' | 'string' | 'boolean' | 'falsy'): PropertyDecorator;
export interface ControllerOptions {
    parseQuery?: boolean;
    validate?: boolean;
}
export interface BaseMeta {
    user?: User;
    userPermissions?: EntityPermission[];
    auth?: PermissionHelper;
    token?: string;
    isCreator?: boolean;
    isSameRole?: boolean;
    endpoint?: string;
    [x: string]: any;
}
export declare class Controller<Params = undefined, M = undefined> {
    params: Params;
    paramsCls: any;
    meta: M | BaseMeta;
    options: ControllerOptions;
    req: Request;
    res: Response;
    next: NextFunction;
    static get init(): (options?: ControllerOptions) => (req: any, res: any, next: any) => Promise<void>;
    constructor(req: Request, res: Response, next: NextFunction, options?: ControllerOptions);
    sendError(...errors: (Error | RequestError)[]): void;
    customParams: (parmas: Params) => void;
    getParamsFromRequest(): Params;
    validate(): Promise<ValidationError[]>;
    handler(): Promise<void>;
    main(): void;
}
/**
 * @param sync Synchronous
 */
export declare function createRollback(sync?: boolean): {
    sync: boolean;
    tasks: any[];
    add(task: any): void;
    run(): Promise<any[]>;
};
