import { Schema, SchemaOptions } from '@nestjs/mongoose';

export function NestSchema({ softDelete, ...rest }: SchemaOptions & { softDelete?: boolean } = { softDelete: false }) {
  return Schema({
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
    toObject: {
      versionKey: false,
      virtuals: true,
    },
    id: false,
    statics: {
      isSoftDelete: () => softDelete,
    },
    ...rest
  })
}
