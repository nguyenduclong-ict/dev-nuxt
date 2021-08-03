import { Repository } from '@nguyenduclong/mongodbts';
export declare class Config {
    id?: any;
    _id?: any;
    key: string;
    value: any;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class ConfigRepository extends Repository<Config> {
}
