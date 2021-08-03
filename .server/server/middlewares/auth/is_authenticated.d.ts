import { RequestHandler } from 'express';
export declare type DefaultTokenData = {
    id: string;
    type: 'default';
};
export declare type RefreshTokenData = {
    id: string;
    type: 'refresh_token';
};
export declare const isAuthenticated: RequestHandler;
