import { Repository } from '@nguyenduclong/mongodbts';
import { FilterQuery } from 'mongoose';
export declare function createIfNotExits<E extends object>(repository: Repository<E>, query: FilterQuery<E>, data?: FilterQuery<E>, onCreate?: any, options?: any): Promise<import("mongoose").EnforceDocument<E, {}>>;
