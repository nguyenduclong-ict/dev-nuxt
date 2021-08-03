import { FORBIDDEN, sendError } from '@/server/helpers/errors';
export const isAdmin = (req, res, next) => {
    if (req.meta.auth.isAdmin)
        return next();
    return sendError(res, FORBIDDEN);
};
