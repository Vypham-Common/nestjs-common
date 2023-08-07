import { Module } from '@nestjs/common'
import { DepartmentModel } from './department.schema'
import { DepartmentService } from './department.service'

@Module({
  providers: [DepartmentService, DepartmentModel],
  exports: [DepartmentService, DepartmentModel],
})
export class DepartmentModule {}
