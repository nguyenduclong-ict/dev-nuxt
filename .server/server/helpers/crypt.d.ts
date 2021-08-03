import jwt from 'jsonwebtoken';
export declare const hasPassword: (password: string) => string;
export declare const comparePassword: (password: string, hashed: string) => boolean;
export declare function createToken<T = any>(payload: T, expiresIn?: string | number /** 10 phút */): string;
export declare function verifyToken<T = undefined>(str: string): T & jwt.JwtPayload;
