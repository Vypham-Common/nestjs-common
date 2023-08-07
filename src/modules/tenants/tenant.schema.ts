import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION } from '../../enums'

@NestSchema({
  timestamps: true,
})
export class Tenant {
  @Prop({ type: String, unique: true, required: true })
  id: string
}

export class TenantModel extends AbstractModel<Tenant> {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, COMMON_COLLECTION.tenants, Tenant)
  }
}
export type TenantDocument = HydratedDocument<Tenant>
