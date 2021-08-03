import { Repository } from '@nguyenduclong/mongodbts';
interface ValidateItem {
    name: string;
    constraints: any[];
    each: boolean;
}
export interface EntityDeclaration extends AnyObject {
    id: string;
    description: string;
    name: string;
    endpoint: string;
    schema: {
        [x: string]: SchemaField;
    };
}
export interface SchemaField {
    type?: string;
    label?: string;
    auto?: boolean;
    isArray?: boolean;
    unique?: boolean;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
    ref?: string;
    enum?: any[];
    validate?: ValidateItem[];
}
export declare class EntityHelper {
    private static cache;
    private static cacheValidate;
    static getEntities(): EntityDeclaration[];
    static getEntitySchema(repository: Repository<any>): EntityDeclaration['schema'];
    static getEntityValidate(cls: any): any;
}
export {};
