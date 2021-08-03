/// <reference types="mongoose" />
import { DeleteContext, FindContext, ListContext, UpdateContext, CreateContext, CreateContextMany } from '@nguyenduclong/mongodbts';
export declare type Actions = 'find' | 'list' | 'findOne' | 'create' | 'createMany' | 'update' | 'updateOne' | 'delete' | 'deleteOne';
export declare function buildParams<E = any>(params: FindContext<E> | ListContext<E> | CreateContext<E> | UpdateContext<E> | DeleteContext<E>): FindContext<E, {}> | ListContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | UpdateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
export declare namespace buildParams {
    export var list: <E = any>(params: ListContext<E, {}>) => ListContext<E, {}> | FindContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | UpdateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
    export var find: <E = any>(params: FindContext<E, {}>) => FindContext<E, {}> | ListContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | UpdateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
    export var create: <E = any>(params: CreateContext<E, import("mongoose").AnyObject>) => CreateContext<E, import("mongoose").AnyObject> | FindContext<E, {}> | ListContext<E, {}> | UpdateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
    export var createMany: <E = any>(params: CreateContextMany<E, import("mongoose").AnyObject>) => FindContext<E, {}> | ListContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | UpdateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
    export var update: <E = any>(params: UpdateContext<E, import("mongoose").AnyObject>) => UpdateContext<E, import("mongoose").AnyObject> | FindContext<E, {}> | ListContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | DeleteContext<E, {}>;
    var _a: <E = any>(params: DeleteContext<E, {}>) => DeleteContext<E, {}> | FindContext<E, {}> | ListContext<E, {}> | CreateContext<E, import("mongoose").AnyObject> | UpdateContext<E, import("mongoose").AnyObject>;
    export { _a as delete };
}
