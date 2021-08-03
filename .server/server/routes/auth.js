import { DefaultPermission } from '@/server/constants';
import { CreateRoleController } from '@/server/controllers/auth/create_role.controller';
import { PostAddUserController } from '@/server/controllers/auth/post_add_user.controller';
import { PostInitController } from '@/server/controllers/auth/post_init.controller';
import { PostLoginController } from '@/server/controllers/auth/post_login.controller';
import { PostLogoutController } from '@/server/controllers/auth/post_logout.controller';
import { PostRefreshTokenController } from '@/server/controllers/auth/post_refresh_token.controller';
import { PostRegisterController } from '@/server/controllers/auth/post_register.controller';
import { PutUpdatePasswordController } from '@/server/controllers/auth/put_update_password.controller';
import { PutUpdateUserController } from '@/server/controllers/auth/put_update_user.controller';
import { UpdateRoleController } from '@/server/controllers/auth/update_role.controller';
import { UpdateRolePermissionsController } from '@/server/controllers/auth/update_role_permissions.controller';
import { UpdateUserPermissionsController } from '@/server/controllers/auth/update_user_permissions.controller';
import { createApi } from '@/server/helpers/router';
import { hasPermission, isAuthenticated } from '@/server/middlewares/auth';
import { Router } from 'express';
import { GetMeController } from '../controllers/auth/get_me.controller';
const router = Router();
const api = createApi(router, '/auth');
api('get', '/me', isAuthenticated, GetMeController.init());
api('get', '/register', PostRegisterController.init());
api('post', '/login', PostLoginController.init());
api('post', '/refresh', PostRefreshTokenController.init());
api('post', '/logout', PostLogoutController.init());
api('post', '/forgot-password');
api('post', '/rest-password');
api('post', '/init', PostInitController.init());
api.post('/create-role', isAuthenticated, hasPermission(DefaultPermission.Authorize), CreateRoleController.init());
api.put('/update-role', isAuthenticated, hasPermission(DefaultPermission.Authorize), UpdateRoleController.init());
api.post('/create-user', isAuthenticated, hasPermission(DefaultPermission.Authorize), PostAddUserController.init());
api.put('/update-user', isAuthenticated, hasPermission(DefaultPermission.Authorize), PutUpdateUserController.init());
api.put('/update-password', isAuthenticated, hasPermission(DefaultPermission.Authorize), PutUpdatePasswordController.init());
api.put('/update-user-permissions', isAuthenticated, hasPermission(DefaultPermission.Authorize), UpdateUserPermissionsController.init());
api.put('/update-role-permissions', isAuthenticated, hasPermission(DefaultPermission.Authorize), UpdateRolePermissionsController.init());
export default {
    path: '/auth',
    router,
};
