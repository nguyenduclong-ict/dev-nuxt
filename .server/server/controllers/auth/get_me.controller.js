import { Controller } from '@/server/helpers/controller';
export class GetMeController extends Controller {
    main() {
        const user = this.req.meta.user;
        this.res.json(user);
    }
}
