import { Inject } from '@nestjs/common'
import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument, Schema, Types } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION, TOKEN } from '../../enums'

@NestSchema({
  timestamps: true,
})
export class Attachment {
  @Prop({ type: Schema.Types.ObjectId })
  user: Types.ObjectId

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, unique: true, required: true })
  fileName: string

  @Prop({ type: String, required: true, unique: true })
  path: string

  @Prop({ type: String })
  type: string

  @Prop({ type: Number })
  size: number

  @Prop({ type: String, required: true })
  category: string

  @Prop({ type: String })
  ipAddress: string

  @Prop({ type: Number, default: 0 })
  status: number

  @Prop({ type: String })
  tenant: string

  @Prop({ type: String })
  url: string

  @Prop({ type: Date })
  expiresDate: Date
}

export class AttachmentModel extends AbstractModel<Attachment> {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(TOKEN.TENANT) tenant: string
  ) {
    super(connection, COMMON_COLLECTION.attachments, Attachment, tenant)
  }
}
export type AttachmentDocument = HydratedDocument<Attachment>
