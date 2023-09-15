import { Connection, HydratedDocument, Types } from 'mongoose';
import { AbstractModel } from '../../abstracts';
import { STATUS } from '../../enums';
export declare class Department {
    name: string;
    status: STATUS;
    parent: Types.ObjectId;
    hrPOC: Types.ObjectId;
    financePOC: Types.ObjectId;
}
export declare class DepartmentModel extends AbstractModel<Department> {
    constructor(connection: Connection, tenant: string);
}
export type DepartmentDocument = HydratedDocument<Department>;
export type DepartmentSelectNameDocument = HydratedDocument<Pick<Department, 'name'>>;
