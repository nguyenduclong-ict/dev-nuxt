import { Controller } from '@/server/helpers/controller';
declare class Params {
    username: string;
    password: string;
    email: string;
    profile: {};
}
export declare class PostRegisterController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
