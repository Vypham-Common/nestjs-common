import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { TOKEN } from '../../enums'
import { EmployeeModel } from './employee.schema'

export class EmployeeService extends AbstractService<EmployeeModel> {
  constructor(model: EmployeeModel, @Inject(TOKEN.USER) user: JWTPayload) {
    super(model, user)
  }
}
