import { Controller } from '@/server/helpers/controller';
declare class Params {
    refreshToken: string;
}
export declare class PostRefreshTokenController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
