import { Repository } from '@nguyenduclong/mongodbts';
export declare class Token {
    id?: any;
    _id?: any;
    type: 'refresh_token' | 'reset_password';
    value: string;
    meta?: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class TokenRepository extends Repository<Token> {
    authorKey: any;
}
