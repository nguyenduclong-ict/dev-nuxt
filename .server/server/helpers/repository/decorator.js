import { ENTITY_META, FIELD_OPTIONS } from './constants';
export function Meta(meta) {
    return function (constructor) {
        Reflect.defineMetadata(ENTITY_META, constructor, meta);
    };
}
export function FieldOption(options) {
    return function (target, key) {
        Reflect.defineMetadata(FIELD_OPTIONS, options, target.constructor, key);
    };
}
