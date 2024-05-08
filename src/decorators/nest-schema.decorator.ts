import { Schema, SchemaOptions } from '@nestjs/mongoose';

export function NestSchema({
  softDelete,
  increasementId,
  partialSearch,
  ...rest
}: SchemaOptions &
  {
    softDelete?: boolean
    increasementId?: boolean
    partialSearch?: string[]
  } = { softDelete: false, increasementId: false, partialSearch: [] }
) {
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
      isIncreasementId: () => increasementId,
      getPartialSearch: () => partialSearch
    },
    ...rest
  })
}
