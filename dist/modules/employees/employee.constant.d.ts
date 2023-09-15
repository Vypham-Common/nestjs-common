import { PopulateOptions } from 'mongoose';
import { Employee } from './employee.schema';
export declare const EmployeeSimpleSelect: {
    generalInfo: {
        legalName: number;
        userId: number;
        workEmail: number;
        avatar: number;
    };
    employeeId: number;
    department: number;
    manager: number;
};
export declare const EmployeeDepartmentPopulate: PopulateOptions[];
export declare const EmployeeManagerPopulate: PopulateOptions[];
export declare const EmployeeManagerDepartmentPopulate: PopulateOptions[];
export declare const EmployeeDepartmentLookup: GeneratePipelineWithOptions<Employee>;
export declare const EmployeeManagerLookup: GeneratePipelineWithOptions<Employee>;
export declare const EmployeeManagerDepartmentLookup: GeneratePipeline<Employee>[];
