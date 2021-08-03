import { Repository } from '@nguyenduclong/mongodbts';
import { createApi } from './create_api';
export declare const entityCrud: (api: ReturnType<typeof createApi>, repository: Repository) => void;
