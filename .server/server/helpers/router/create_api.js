import { MiddlewareId } from '@/server/middlewares/auth';
import { joinUrl } from '@/utils/utils';
import globby from 'globby';
export function registerRoutes(dir, app) {
    const paths = globby.sync(dir, {
        expandDirectories: {
            files: ['*.js', '*.ts'],
        },
        onlyFiles: true,
    });
    for (const path of paths) {
        const module = require(path).default;
        if (!module)
            continue;
        if (Array.isArray(module)) {
            module.forEach((item) => {
                if (item.path)
                    app.use(item.path, item.router);
            });
        }
        else if (module.path) {
            app.use(module.path, module.router);
        }
    }
}
export const apis = [];
export const createApi = (router, prefix = '/') => {
    const api = (method, path, ...handlers) => {
        apis.push({
            prefix,
            path,
            fullPath: joinUrl(prefix, path),
            method,
            secured: !!handlers.find((handler) => handler.id === MiddlewareId.hasApiPermission),
        });
        router[method.toLowerCase()](path, ...handlers);
    };
    api.get = (path, ...handlers) => {
        apis.push({
            prefix,
            path,
            fullPath: joinUrl(prefix, path),
            method: 'get',
            secured: !!handlers.find((handler) => handler.id === MiddlewareId.hasApiPermission),
        });
        router.get(path, ...handlers);
    };
    api.post = (path, ...handlers) => {
        apis.push({
            prefix,
            path,
            fullPath: joinUrl(prefix, path),
            method: 'post',
            secured: !!handlers.find((handler) => handler.id === MiddlewareId.hasApiPermission),
        });
        router.post(path, ...handlers);
    };
    api.put = (path, ...handlers) => {
        apis.push({
            prefix,
            path,
            fullPath: joinUrl(prefix, path),
            method: 'put',
            secured: !!handlers.find((handler) => handler.id === MiddlewareId.hasApiPermission),
        });
        router.put(path, ...handlers);
    };
    api.delete = (path, ...handlers) => {
        apis.push({
            prefix,
            path,
            fullPath: joinUrl(prefix, path),
            method: 'delete',
            secured: !!handlers.find((handler) => handler.id === MiddlewareId.hasApiPermission),
        });
        router.delete(path, ...handlers);
    };
    api.router = router;
    return api;
};
