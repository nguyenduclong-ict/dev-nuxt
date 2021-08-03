import { sendError } from '@/server/helpers/errors';
import { GetUserInfo } from './get_user_info';
export const isAuthenticated = async (req, res, next) => {
    if (!req.meta.__get_user_info__) {
        await GetUserInfo(req);
    }
    if (req.meta.__get_user_info_error__) {
        return sendError(res, req.meta.__get_user_info_error__);
    }
    next();
};
