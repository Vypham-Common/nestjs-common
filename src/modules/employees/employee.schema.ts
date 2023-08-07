import { Inject } from '@nestjs/common'
import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument, Schema, Types } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION, EMPLOYEE, STATUS, TOKEN } from '../../enums'
import { DepartmentDocument } from '../departments'

@NestSchema()
export class GeneralInfo {
  @Prop({ type: String })
  legalName: string
  @Prop({ type: String })
  firstName: string
  @Prop({ type: String })
  middleName: string
  @Prop({ type: String })
  lastName: string
  @Prop({ type: String })
  shortName: string
  @Prop({ type: Date })
  DOB: Date
  @Prop({ type: String })
  legalGender: string
  @Prop({ type: String })
  workEmail: string
  @Prop({ type: String })
  userId: string
  @Prop({ type: String })
  workNumber: string
  @Prop({ type: String })
  nationality: string
  @Prop({ type: String })
  linkedIn: string
  @Prop({ type: String })
  personalNumber: string
  @Prop({ type: String })
  personalEmail: string
  @Prop({ type: Boolean, default: false })
  isShowPersonalNumber: boolean
  @Prop({ type: Boolean, default: false })
  isShowPersonalEmail: boolean
  @Prop({ type: Boolean, default: true })
  isShowAvatar: boolean
  @Prop({ type: String })
  Blood: string
  @Prop({ type: String })
  maritalStatus: string
  @Prop({ type: String })
  passportNo: string
  @Prop({ type: String })
  passportIssueCountry: string
  @Prop({ type: String })
  passportIssueOn: string
  @Prop({ type: String })
  passportValidDate: string
  @Prop({ type: String })
  preJobTitle: string
  @Prop({ type: String })
  preCompany: string
  @Prop({ type: Number })
  pastExp: number
  @Prop({ type: Number })
  totalExp: number
  @Prop({ type: String })
  qualification: string
  @Prop({ type: String })
  avatar: string
  @Prop({ type: String })
  employeeId: string
  @Prop({ type: String })
  bioInfo: string
  @Prop({ type: Boolean })
  isNewComer: boolean
}
@NestSchema({
  timestamps: true,
})
export class Employee {
  @Prop({ type: GeneralInfo })
  generalInfo: GeneralInfo
  @Prop({ type: String })
  employeeId: string
  @Prop({ type: String })
  employeeCode: string

  @Prop({ type: Schema.Types.ObjectId })
  employeeType: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  title: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  manager: Types.ObjectId

  @Prop({ type: Schema.Types.ObjectId })
  department: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId, required: true })
  company: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId, required: true })
  location: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  locationCustomer: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  managePermission: Schema.Types.ObjectId
  @Prop({ type: String })
  tenant: string

  @Prop({ type: String, enum: Object.values(STATUS), default: STATUS.ACTIVE })
  status: STATUS
  @Prop({
    type: String,
    enum: Object.values(EMPLOYEE.TYPE.STATUS),
    default: EMPLOYEE.TYPE.STATUS.EMPLOYED,
  })
  statusType: EMPLOYEE.TYPE.STATUS
  @Prop({ type: Schema.Types.ObjectId })
  grade: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  schedule: Types.ObjectId
}

export class EmployeeModel extends AbstractModel<Employee> {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(TOKEN.TENANT) tenant: string
  ) {
    super(connection, COMMON_COLLECTION.employees, Employee, tenant, {
      hooks(model) {
        model.schema.index({
          'generalInfo.firstName': 'text',
          'generalInfo.middleName': 'text',
          'generalInfo.lastName': 'text',
          'generalInfo.userId': 'text',
          'generalInfo.workEmail': 'text',
          employeeId: 'text',
        })
      }
    })
  }
}
export type EmployeeDocument = HydratedDocument<Employee>

export type EmployeeSimpleSelectDocument = HydratedDocument<
  Pick<Employee, 'generalInfo' | 'employeeId'>
  &
  {
    generalInfo: Pick<GeneralInfo, 'legalName' | 'userId' | 'avatar' | 'workEmail'>
  }
>

export interface EmployeeManagerPullPopulate {
  manager: EmployeeDocument
}

export interface EmployeeDepartmentPullPopulate {
  department: DepartmentDocument
}

export interface EmployeeManagerDepartmentPullPopulate
  extends EmployeeManagerPullPopulate,
  EmployeeDepartmentPullPopulate { }
