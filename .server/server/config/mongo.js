import { createMongoConnection } from '@nguyenduclong/mongodbts';
if (!process.env.MONGO_URI)
    throw new Error('MONGO_URI is not set');
export const { connection, ready } = createMongoConnection(process.env.MONGO_URI, {
    authSource: process.env.MONGO_AUTH_SOURCE,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME,
});
