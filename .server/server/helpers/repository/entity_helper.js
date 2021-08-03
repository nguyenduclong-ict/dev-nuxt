import { connection } from '@/server/config/mongo';
import { kebabCase, pick, set, get } from '@/utils/lodash';
import { Repository, KEYS } from '@nguyenduclong/mongodbts';
import { getMetadataStorage, ValidationTypes } from 'class-validator';
import { FIELD_OPTIONS } from './constants';
export class EntityHelper {
    static getEntities() {
        const entities = [];
        Repository.getRepositories(connection).forEach((repository) => {
            const entityName = repository.name;
            const endpoint = '/api/entity/' + kebabCase(entityName) + 's';
            const schema = this.getEntitySchema(repository);
            const options = pick(Reflect.getMetadata(KEYS.SCHEMA_OPTIONS, repository.entityCls), 'name', 'description');
            entities.push({
                id: entityName,
                ...options,
                name: options.name || entityName,
                endpoint,
                schema,
            });
        });
        return entities;
    }
    static getEntitySchema(repository) {
        const cache = this.cache.get(repository.entityCls);
        if (cache)
            return cache;
        // get schema
        const validateSchema = this.getEntityValidate(repository.entityCls);
        const schema = Reflect.getMetadata(KEYS.SCHEMA_RAW, repository.entityCls);
        Object.keys(schema).forEach((key) => {
            if (validateSchema[key]) {
                set(schema, `${key}.validate`, validateSchema[key]);
            }
            const fieldOptions = Reflect.getMetadata(FIELD_OPTIONS, repository.entityCls, key);
            if (fieldOptions) {
                Object.assign(schema[key], fieldOptions);
            }
        });
        this.cache.set(repository.entityCls, schema);
        return schema;
    }
    static getEntityValidate(cls) {
        if (this.cacheValidate.get(cls))
            return this.cacheValidate.get(cls);
        const metadatas = [
            ...getMetadataStorage().getTargetValidationMetadatas(cls, null, false, false),
        ];
        metadatas.forEach((item) => {
            if (item.constraintCls) {
                ;
                item.__constraints =
                    getMetadataStorage().getTargetValidatorConstraints(item.constraintCls);
            }
        });
        const defined = getMetadataStorage().groupByPropertyName(metadatas);
        const schema = {};
        Object.keys(defined).forEach((key) => {
            schema[key] = defined[key].map((item) => {
                if (item.type === ValidationTypes.CONDITIONAL_VALIDATION) {
                    return {
                        name: 'isOptional',
                        each: item.each,
                    };
                }
                if (item.type === ValidationTypes.CUSTOM_VALIDATION) {
                    return {
                        name: get(item, '__constraints[0].name'),
                        each: item.each,
                        constraints: item.constraints,
                    };
                }
                return null;
            });
        });
        this.cacheValidate.set(cls, schema);
        return schema;
    }
}
EntityHelper.cache = new Map();
EntityHelper.cacheValidate = new Map();
