import { Inject } from '@nestjs/common'
import { InjectConnection, Schema as NestSchema, Prop } from '@nestjs/mongoose'
import { Connection, HydratedDocument, Schema, Types } from 'mongoose'
import { AbstractModel } from '../../abstracts'
import { COMMON_COLLECTION, COMMON_STATUS, STATUS, TOKEN } from '../../enums'
import { CurrencyDocument } from '../currencies'

@NestSchema()
class HeadQuarterAddress {
  @Prop({ type: String })
  addressLine1: string
  @Prop({ type: String })
  addressLine2: string
  @Prop({ type: String })
  state: string
  @Prop({ type: String })
  zipCode: string
  @Prop({ type: String })
  city: string
  @Prop({ type: String })
  country: string
}

@NestSchema()
class Coordinates {
  @Prop({ type: Number })
  lat: number
  @Prop({ type: Number })
  long: number
}

@NestSchema({
  timestamps: true,
})
export class Location {
  @Prop({ type: String })
  name: string
  @Prop({ type: String })
  timezone: string

  @Prop(HeadQuarterAddress)
  headQuarterAddress: HeadQuarterAddress

  @Prop({ type: Boolean, default: false })
  isHeadQuarter: boolean

  @Prop({ type: String, enum: COMMON_STATUS, default: STATUS.ACTIVE })
  status: STATUS

  @Prop({ type: Schema.Types.ObjectId })
  company: Types.ObjectId

  @Prop(Coordinates)
  coordinates: Coordinates

  @Prop([{ type: String }])
  wifiAccessIds: string[]
  @Prop({ type: Number })
  distance: number
  @Prop({ type: String })
  phone: string
  @Prop({ type: String })
  googleMapsUrl: string
  @Prop({ type: Schema.Types.ObjectId })
  currency: Types.ObjectId
}

export type LocationDocument = HydratedDocument<Location>
export interface LocationPullPopulate {
  currency: CurrencyDocument
}

export type LocationFullyPopulate = MergePopulate<
  Location,
  LocationPullPopulate
>

export class LocationModel extends AbstractModel<Location> {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(TOKEN.TENANT) tenant: string
  ) {
    super(connection, COMMON_COLLECTION.locations, Location, tenant, {
      hooks(model) {
        model.schema.index({
          name: 'text',
        })
      },
    })
  }
}
