import { plainToClass, Transform } from 'class-transformer';
import { validate } from 'class-validator';
import { sendError, UNPROCESSABLE_ENTITY } from './errors';
export function params(cls) {
    return function (target) {
        target.prototype.paramsCls = cls;
    };
}
export function Convert(type) {
    return Transform(({ value }) => {
        if (type === 'number')
            return Number(value);
        if (type === 'string')
            return '' + value;
        if (type === 'boolean') {
            const lower = value.toLowerCase();
            if (lower === 'true')
                return true;
            if (lower === 'false')
                return false;
        }
        if (type === 'falsy' && !value) {
            return undefined;
        }
        return value;
    });
}
export class Controller {
    constructor(req, res, next, options) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.options = options !== null && options !== void 0 ? options : this.options;
        this.paramsCls = this.constructor.prototype.paramsCls;
        this.meta = this.req.meta;
    }
    static get init() {
        return (options = { parseQuery: false, validate: true }) => {
            return async (req, res, next) => {
                const controller = new this(req, res, next, options);
                return controller.handler.bind(controller)();
            };
        };
    }
    sendError(...errors) {
        return sendError(this.res, ...errors);
    }
    getParamsFromRequest() {
        const { params: _params = {}, body = {}, query = {} } = this.req;
        if (this.options.parseQuery && query) {
            Object.keys(query).forEach((key) => {
                const value = query[key];
                if (typeof value === 'string') {
                    // number
                    if (!isNaN(+value)) {
                        query[key] = Number(value);
                    }
                    // boolean
                    if (['true', 'false'].includes(value.toLowerCase())) {
                        query[key] = {
                            true: true,
                            false: false,
                        }[value.toLowerCase()];
                    }
                    // object
                    try {
                        query[key] = JSON.parse(value);
                    }
                    catch (error) {
                        console.warn(`Cannot parse ${key}`, value);
                    }
                }
            });
        }
        let params = {
            ...query,
            ..._params,
            ...body,
        };
        if (this.paramsCls) {
            params = plainToClass(this.paramsCls, params);
        }
        if (this.customParams) {
            this.customParams(params);
        }
        this.params = params;
        return params;
    }
    async validate() {
        const errors = await validate(this.params);
        return errors;
    }
    async handler() {
        try {
            await this.getParamsFromRequest();
            if (this.options.validate && this.paramsCls) {
                const addErrorMessages = (arr, errors) => {
                    errors.forEach((e) => {
                        var _a;
                        if (e.constraints)
                            arr.push(...Object.values(e.constraints));
                        if ((_a = e.children) === null || _a === void 0 ? void 0 : _a.length) {
                            const item = { property: e.property, errors: [] };
                            addErrorMessages(item.errors, e.children);
                            arr.push(item);
                        }
                    });
                };
                const errors = await this.validate();
                if (errors.length) {
                    const strs = [];
                    addErrorMessages(strs, errors);
                    return this.sendError({
                        ...UNPROCESSABLE_ENTITY,
                        message: strs[0],
                        errors: strs,
                    });
                }
            }
            const result = await this.main.bind(this)();
            return result;
        }
        catch (error) {
            this.next(error);
            throw error;
        }
    }
    main() {
        this.res.send(this.constructor.name);
    }
}
/**
 * @param sync Synchronous
 */
export function createRollback(sync = false) {
    const tasks = [];
    return {
        sync,
        tasks,
        add(task) {
            this.tasks.push(task);
        },
        async run() {
            if (!this.tasks)
                return [];
            let result = [];
            if (sync) {
                for (const task of this.tasks) {
                    result.push(await task());
                }
            }
            else {
                result = await Promise.all(this.tasks.map((task) => task()));
            }
            return result;
        },
    };
}
