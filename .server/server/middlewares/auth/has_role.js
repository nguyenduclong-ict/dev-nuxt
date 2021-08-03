import { sendError, FORBIDDEN } from '@/server/helpers/errors';
import { MiddlewareId } from './const';
export function hasRole(...names) {
    return (req, res, next) => {
        var _a, _b;
        if ((_b = (_a = req.meta) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.isAdmin)
            return next();
        const user = req.meta.user;
        const roles = user.roles;
        if (roles.find((role) => names.includes(role.name))) {
            return next();
        }
        sendError(res, FORBIDDEN, {
            message: 'You do not have the role to access the resource',
        });
    };
}
hasRole.id = MiddlewareId.hasRole;
