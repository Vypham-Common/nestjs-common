import { AbstractService } from '../../abstracts';
import { TenantModel } from './tenant.schema';
export declare class TenantService extends AbstractService<TenantModel> {
    constructor(user: JWTPayload, model: TenantModel);
}
