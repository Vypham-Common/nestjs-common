"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeManagerDepartmentLookup = exports.EmployeeManagerLookup = exports.EmployeeDepartmentLookup = exports.EmployeeManagerDepartmentPopulate = exports.EmployeeManagerPopulate = exports.EmployeeDepartmentPopulate = exports.EmployeeSimpleSelect = void 0;
const enums_1 = require("../../enums");
const departments_1 = require("../departments");
exports.EmployeeSimpleSelect = {
    generalInfo: {
        legalName: 1,
        userId: 1,
        workEmail: 1,
        avatar: 1
    },
    employeeId: 1,
    department: 1,
    manager: 1,
};
exports.EmployeeDepartmentPopulate = [
    {
        path: 'department',
        model: enums_1.COMMON_COLLECTION.departments,
        select: departments_1.DepartmentSimpleSelect
    },
];
exports.EmployeeManagerPopulate = [
    {
        path: 'manager',
        model: enums_1.COMMON_COLLECTION.employees,
        select: exports.EmployeeSimpleSelect
    },
];
exports.EmployeeManagerDepartmentPopulate = exports.EmployeeDepartmentPopulate.concat(exports.EmployeeManagerPopulate);
const EmployeeDepartmentLookup = (query, select) => ({
    from: enums_1.COMMON_COLLECTION.departments,
    localField: 'department',
    project: select || departments_1.DepartmentSimpleSelect,
    match: query
});
exports.EmployeeDepartmentLookup = EmployeeDepartmentLookup;
const EmployeeManagerLookup = (query, select) => ({
    from: enums_1.COMMON_COLLECTION.employees,
    localField: 'manager',
    project: select || exports.EmployeeSimpleSelect,
    match: query
});
exports.EmployeeManagerLookup = EmployeeManagerLookup;
exports.EmployeeManagerDepartmentLookup = [
    (0, exports.EmployeeDepartmentLookup)(),
    (0, exports.EmployeeManagerLookup)()
];
