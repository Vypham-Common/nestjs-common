import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { TOKEN } from '../../enums'
import { CurrencyModel } from './currency.schema'

export class CurrencyService extends AbstractService<CurrencyModel> {
  constructor(@Inject(TOKEN.USER) user: JWTPayload, model: CurrencyModel) {
    super(model, user)
  }
}
