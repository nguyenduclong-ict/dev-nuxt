import { set, omit } from '@/utils/lodash';
import { parseBool } from '@/utils/utils';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { sendValidateError } from '../errors';
export const ParseQuery = (req, res, next) => {
    const query = req.query;
    if (!query)
        return next();
    const keys = [
        'query',
        'populates',
        'page',
        'pageSize',
        'projection',
        'softDelete',
        'select',
        'exact',
        'sort',
        'limit',
        'skip',
    ];
    Object.keys(query).forEach((key) => {
        if (query[key] && typeof query[key] === 'string' && keys.includes(key)) {
            if (['page', 'pageSize', 'skip', 'limit'].includes(key)) {
                set(query, key, Number(query[key]));
            }
            else if (['exact', 'softDelete'].includes(key)) {
                set(query, key, parseBool(query[key]));
            }
            else if (typeof query[key] === 'string') {
                try {
                    query[key] = JSON.parse(query[key]);
                }
                catch (error) { }
            }
        }
    });
    next();
};
export const MergeParams = ({ paramsIdToQuery } = { paramsIdToQuery: false }) => {
    return (req, res, next) => {
        const params = {
            ...req.body,
            ...req.params,
            ...req.query,
            meta: req.meta,
        };
        if (paramsIdToQuery) {
            set(params, 'query.id', req.params.id);
        }
        req.data = params;
        next();
    };
};
// validate merged params by class
export const ValidateRequestParams = (cls) => {
    return async function (req, res, next) {
        const data = plainToClass(cls, omit(req.data, 'meta'), {});
        const errors = await validate(data);
        if (errors.length)
            return sendValidateError(res, errors);
        next();
    };
};
