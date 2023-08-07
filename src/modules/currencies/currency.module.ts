import { Module } from '@nestjs/common'
import { CurrencyModel } from './currency.schema'
import { CurrencyService } from './currency.service'

@Module({
  providers: [CurrencyService, CurrencyModel],
  exports: [CurrencyService, CurrencyModel],
})
export class CurrencyModule {}
