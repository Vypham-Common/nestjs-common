import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { TOKEN } from '../../enums'
import { DepartmentModel } from './department.schema'

export class DepartmentService extends AbstractService<DepartmentModel> {
  constructor(@Inject(TOKEN.USER) user: JWTPayload, model: DepartmentModel) {
    super(model, user)
  }
}
