import { AbstractService } from '../../abstracts';
import { EmployeeModel } from './employee.schema';
export declare class EmployeeService extends AbstractService<EmployeeModel> {
    constructor(model: EmployeeModel, user: JWTPayload);
}
