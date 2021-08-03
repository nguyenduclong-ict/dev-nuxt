import { Controller } from '@/server/helpers/controller';
declare class Params {
    username: string;
    password: string;
}
export declare class PostLoginController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
