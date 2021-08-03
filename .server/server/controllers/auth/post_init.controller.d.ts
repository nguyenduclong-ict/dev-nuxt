import { Controller } from '@/server/helpers/controller';
declare class Params {
    projectName: string;
    username: string;
    password: string;
    email: string;
}
export declare class PostInitController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
