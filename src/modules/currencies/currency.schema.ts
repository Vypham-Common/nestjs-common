import { Inject } from '@nestjs/common'
import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION, COMMON_STATUS, STATUS, TOKEN } from '../../enums'

@NestSchema({
  timestamps: true,
})
export class Currency {
  @Prop({ type: String })
  name: string
  @Prop({ type: String })
  code: string
  @Prop({ type: String })
  symbol: string
  @Prop({ type: Number })
  rate: number
  @Prop({ type: Number })
  modifyAmount: number
  @Prop({ type: String, enum: COMMON_STATUS, default: STATUS.ACTIVE })
  status: STATUS
}

export class CurrencyModel extends AbstractModel<Currency> {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(TOKEN.TENANT) tenant: string
  ) {
    super(connection, COMMON_COLLECTION.currencies, Currency, tenant, {
      hooks(model) {
        model.schema.index({
          name: 'text',
          code: 'text',
          symbol: 'text',
        })
      },
    })
  }
}
export type CurrencyDocument = HydratedDocument<Currency>
