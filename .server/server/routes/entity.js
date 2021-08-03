import { GetEntitiesController } from '@/server/controllers/entity/get_entities.controller';
import { createApi, entityCrud } from '@/server/helpers/router';
import { GetUserInfo, hasPermission, isAuthenticated, } from '@/server/middlewares/auth';
import { Repository } from '@nguyenduclong/mongodbts';
import { Router } from 'express';
import { GetEntitiesOfMeController } from '@/server/controllers/entity/get_entities_of_me.controller';
import { DefaultPermission } from '@/server/constants';
const router = Router();
const api = createApi(router, '/entity');
router.use(GetUserInfo);
// get all entity
router.get('/', isAuthenticated, hasPermission(DefaultPermission.Authorize), GetEntitiesController.init());
// get entities of me
router.get('/me', isAuthenticated, GetEntitiesOfMeController.init());
Repository.repositories.forEach((repos) => {
    Object.keys(repos).forEach((key) => {
        const repo = repos[key];
        entityCrud(api, repo);
    });
});
// api.get('/')
export default {
    path: '/entity',
    router,
};
