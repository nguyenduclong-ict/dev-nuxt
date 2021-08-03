import { GetApisController } from '@/server/controllers/config/get_apis.controller';
import { GetProjectController } from '@/server/controllers/config/get_project.controller';
import { UpdatePagesController } from '@/server/controllers/config/update_pages.controller';
import { createApi } from '@/server/helpers/router';
import { hasApiPermission, isAdmin, isAuthenticated, } from '@/server/middlewares/auth';
import { Router } from 'express';
const router = Router();
const api = createApi(router, '/config');
api.get('/project', GetProjectController.init());
api.get('/apis', isAuthenticated, hasApiPermission, GetApisController.init());
api.post('/pages', isAuthenticated, isAdmin, UpdatePagesController.init());
export default {
    path: '/config',
    router,
};
