import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { TOKEN } from '../../enums'
import { TenantModel } from './tenant.schema'

export class TenantService extends AbstractService<TenantModel> {
  constructor(@Inject(TOKEN.USER) user: JWTPayload, model: TenantModel) {
    super(model, user)
  }
}
