import { Controller } from '@/server/helpers/controller';
import { configRepository } from '@/server/repository';
export class GetProjectController extends Controller {
    async main() {
        const project = await configRepository.findOne({
            query: {
                key: 'project',
            },
        });
        this.res.json(project ? project.value : null);
    }
}
