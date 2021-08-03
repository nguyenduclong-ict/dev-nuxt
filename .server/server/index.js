import path from 'path';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import './config/mongo';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, sendError } from './helpers/errors';
import { registerRoutes } from './helpers/router';
import { initRolesAndPermissions } from './seeders/roles_permissions';
import { initFolder } from './helpers/multer';
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use((req, res, next) => {
    req.meta = req.meta || {
        // eslint-disable-next-line node/no-deprecated-api
        endpoint: req.path,
        req,
        res,
    };
    next();
});
registerRoutes(path.join(__dirname, 'routes'), app);
const handle404 = (_req, res, _next) => {
    // Request not match to any route
    sendError(res, NOT_FOUND);
};
const handleError = (err, _req, res, _next) => {
    // Request not match to any route
    console.error(err);
    return sendError(res, INTERNAL_SERVER_ERROR, {
        message: err.message || err.name,
    });
};
app.use(handle404);
app.use(handleError);
initRolesAndPermissions();
initFolder();
export default app;
