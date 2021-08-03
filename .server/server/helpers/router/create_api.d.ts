import { Router, RequestHandler, Express } from 'express';
export declare function registerRoutes(dir: string, app: Express): void;
export interface RegistedApi {
    path: string | RegExp;
    method: string;
    fullPath: string;
    prefix?: string;
    secured?: boolean;
}
export declare const apis: RegistedApi[];
export declare const createApi: (router: Router, prefix?: string) => {
    (method: 'get' | 'post' | 'put' | 'delete', path: string | RegExp, ...handlers: RequestHandler[]): void;
    get(path: string, ...handlers: RequestHandler[]): void;
    post(path: string, ...handlers: RequestHandler[]): void;
    put(path: string, ...handlers: RequestHandler[]): void;
    delete(path: string, ...handlers: RequestHandler[]): void;
    router: Router;
};
