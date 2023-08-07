import { Module } from '@nestjs/common'
import { EmployeeModel } from './employee.schema'
import { EmployeeService } from './employee.service'

@Module({
  providers: [EmployeeService, EmployeeModel],
  exports: [EmployeeService, EmployeeModel],
})
export class EmployeeModule {}
