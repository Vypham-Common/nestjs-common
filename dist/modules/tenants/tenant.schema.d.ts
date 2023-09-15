import { Connection, HydratedDocument } from 'mongoose';
import { AbstractModel } from '../../abstracts';
export declare class Tenant {
    id: string;
}
export declare class TenantModel extends AbstractModel<Tenant> {
    constructor(connection: Connection);
}
export type TenantDocument = HydratedDocument<Tenant>;
