import { Response } from 'express';
export interface RequestError {
    code?: number;
    message?: string;
    name?: string;
    type?: string;
    errors?: any;
}
export declare const NOT_FOUND: RequestError;
export declare const ENTITY_EXIST: RequestError;
export declare const FORBIDDEN: RequestError;
export declare const UNAUTHORIZED: RequestError;
export declare const USER_IS_BLOCKED: RequestError;
export declare const INVALID_TOKEN: RequestError;
export declare const UNPROCESSABLE_ENTITY: RequestError;
export declare const INTERNAL_SERVER_ERROR: RequestError;
export declare function sendError(res: Response, ...errors: (Error | RequestError)[]): void;
export declare function sendValidateError(res: Response, errors: any): void;
