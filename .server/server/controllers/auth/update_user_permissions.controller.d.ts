import { EntityPermission } from '@/server/entities';
import { Controller } from '@/server/helpers/controller';
declare class Params {
    user: any;
    permissions: EntityPermission[];
}
export declare class UpdateUserPermissionsController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
