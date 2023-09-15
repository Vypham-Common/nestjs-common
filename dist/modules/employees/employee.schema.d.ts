import { Connection, HydratedDocument, Schema, Types } from 'mongoose';
import { AbstractModel } from '../../abstracts';
import { EMPLOYEE, STATUS } from '../../enums';
import { DepartmentDocument } from '../departments';
export declare class GeneralInfo {
    legalName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    shortName: string;
    DOB: Date;
    legalGender: string;
    workEmail: string;
    userId: string;
    workNumber: string;
    nationality: string;
    linkedIn: string;
    personalNumber: string;
    personalEmail: string;
    isShowPersonalNumber: boolean;
    isShowPersonalEmail: boolean;
    isShowAvatar: boolean;
    Blood: string;
    maritalStatus: string;
    passportNo: string;
    passportIssueCountry: string;
    passportIssueOn: string;
    passportValidDate: string;
    preJobTitle: string;
    preCompany: string;
    pastExp: number;
    totalExp: number;
    qualification: string;
    avatar: string;
    employeeId: string;
    bioInfo: string;
    isNewComer: boolean;
}
export declare class Employee {
    generalInfo: GeneralInfo;
    employeeId: string;
    employeeCode: string;
    employeeType: Types.ObjectId;
    title: Types.ObjectId;
    manager: Types.ObjectId;
    department: Types.ObjectId;
    company: Types.ObjectId;
    location: Types.ObjectId;
    locationCustomer: Types.ObjectId;
    managePermission: Schema.Types.ObjectId;
    tenant: string;
    status: STATUS;
    statusType: EMPLOYEE.TYPE.STATUS;
    grade: Types.ObjectId;
    schedule: Types.ObjectId;
}
export declare class EmployeeModel extends AbstractModel<Employee> {
    constructor(connection: Connection, tenant: string);
}
export type EmployeeDocument = HydratedDocument<Employee>;
export type EmployeeSimpleSelectDocument = HydratedDocument<Pick<Employee, 'generalInfo' | 'employeeId'> & {
    generalInfo: Pick<GeneralInfo, 'legalName' | 'userId' | 'avatar' | 'workEmail'>;
}>;
export interface EmployeeManagerPullPopulate {
    manager: EmployeeDocument;
}
export interface EmployeeDepartmentPullPopulate {
    department: DepartmentDocument;
}
export interface EmployeeManagerDepartmentPullPopulate extends EmployeeManagerPullPopulate, EmployeeDepartmentPullPopulate {
}
