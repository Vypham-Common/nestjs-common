import { Inject } from '@nestjs/common'
import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument, Schema, Types } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION, COMMON_STATUS, STATUS, TOKEN } from '../../enums'

@NestSchema({
  timestamps: true,
})
export class Department {
  @Prop({ type: String })
  name: string

  @Prop({ type: String, enum: COMMON_STATUS, default: STATUS.ACTIVE })
  status: STATUS

  @Prop({ type: Schema.Types.ObjectId })
  parent: Types.ObjectId

  @Prop({ type: Schema.Types.ObjectId })
  hrPOC: Types.ObjectId
  @Prop({ type: Schema.Types.ObjectId })
  financePOC: Types.ObjectId
}

export class DepartmentModel extends AbstractModel<Department> {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(TOKEN.TENANT) tenant: string
  ) {
    super(connection, COMMON_COLLECTION.departments, Department, tenant, {
      hooks(model) {
        model.schema.index({
          name: 'text',
        })
      },
    })
  }
}
export type DepartmentDocument = HydratedDocument<Department>

export type DepartmentSelectNameDocument = HydratedDocument<Pick<Department, 'name'>>
