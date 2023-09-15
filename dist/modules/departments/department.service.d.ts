import { AbstractService } from '../../abstracts';
import { DepartmentModel } from './department.schema';
export declare class DepartmentService extends AbstractService<DepartmentModel> {
    constructor(user: JWTPayload, model: DepartmentModel);
}
