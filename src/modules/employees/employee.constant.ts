import { PopulateOptions } from 'mongoose'
import { COMMON_COLLECTION } from '../../enums'
import { DepartmentSimpleSelect } from '../departments'
import { Employee } from './employee.schema'

export const EmployeeSimpleSelect = {
  generalInfo: {
    legalName: 1,
    userId: 1,
    workEmail: 1,
    avatar: 1
  },
  employeeId: 1,
  department: 1,
  manager: 1,
}
export const EmployeeDepartmentPopulate: PopulateOptions[] = [
  {
    path: 'department',
    model: COMMON_COLLECTION.departments,
    select: DepartmentSimpleSelect
  },
]

export const EmployeeManagerPopulate: PopulateOptions[] = [
  {
    path: 'manager',
    model: COMMON_COLLECTION.employees,
    select: EmployeeSimpleSelect
  },
]

export const EmployeeManagerDepartmentPopulate = EmployeeDepartmentPopulate.concat(EmployeeManagerPopulate)

export const EmployeeDepartmentLookup: GeneratePipelineWithOptions<Employee> = (query, select) => ({
  from: COMMON_COLLECTION.departments,
  localField: 'department',
  project: select || DepartmentSimpleSelect,
  match: query
})


export const EmployeeManagerLookup: GeneratePipelineWithOptions<Employee> = (query, select) => ({
  from: COMMON_COLLECTION.employees,
  localField: 'manager',
  project: select || EmployeeSimpleSelect,
  match: query
})

export const EmployeeManagerDepartmentLookup: GeneratePipeline<Employee>[] = [
  EmployeeDepartmentLookup(),
  EmployeeManagerLookup()
]
