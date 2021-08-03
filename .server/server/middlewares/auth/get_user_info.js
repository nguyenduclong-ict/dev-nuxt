import { DefaultRole } from '@/server/entities';
import { verifyToken } from '@/server/helpers/crypt';
import { INVALID_TOKEN, UNAUTHORIZED, } from '@/server/helpers/errors';
import { PermissionHelper } from '@/server/helpers/permission';
import { userRepository, roleRepository } from '@/server/repository';
export const GetUserInfo = async (req, res, next) => {
    let user = null;
    req.meta = req.meta || {};
    const userPermissions = [];
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        req.meta.__get_user_info_error__ = INVALID_TOKEN;
    }
    else {
        // get user from authorication
        const token = authorization.replace('Bearer ', '');
        if (!token) {
            req.meta.__get_user_info_error__ = INVALID_TOKEN;
        }
        else {
            let tokenData;
            try {
                tokenData = verifyToken(token);
            }
            catch (error) {
                req.meta.__get_user_info_error__ = {
                    ...UNAUTHORIZED,
                    message: error.message,
                    type: error.name,
                };
            }
            if (tokenData && tokenData.type === 'default') {
                user = await userRepository.findOne({
                    query: {
                        _id: tokenData.id,
                    },
                    fields: ['-password'],
                    populates: [
                        { path: 'permissions', populate: { path: 'permission' } },
                        {
                            path: 'roles',
                            populate: {
                                path: 'permissions',
                                populate: { path: 'permission' },
                            },
                            justOne: false,
                        },
                    ],
                });
                if (user && !user.blocked) {
                    userPermissions.push(...user.permissions, ...(user.roles || []).flatMap((role) => role.permissions));
                    req.meta.token = token;
                }
                else if (user && user.blocked) {
                    req.meta.__get_user_info_error__ = {
                        ...INVALID_TOKEN,
                        message: 'User NotFound',
                    };
                }
                else {
                    req.meta.__get_user_info_error__ = {
                        ...INVALID_TOKEN,
                        message: 'User NotFound',
                    };
                }
            }
            else {
                req.meta.__get_user_info_error__ = INVALID_TOKEN;
            }
        }
    }
    if (!user) {
        // get all permisison for guest
        const guestRole = await roleRepository.findOne({
            query: {
                name: DefaultRole.GUEST,
                isDefault: true,
            },
            populates: ['permissions'],
        });
        userPermissions.push(...guestRole.permissions);
    }
    req.meta.user = user;
    const authHelper = new PermissionHelper(user);
    authHelper.userPermissions = userPermissions;
    req.meta.permissions = userPermissions;
    req.meta.auth = authHelper;
    req.meta.__get_user_info__ = true; // set flag is called
    next && next();
};
