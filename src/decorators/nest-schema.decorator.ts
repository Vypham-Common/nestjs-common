import { Schema, SchemaOptions } from '@nestjs/mongoose';

export function NestSchema({ softDelete }: SchemaOptions & { softDelete?: boolean } = { softDelete: false }) {
  return Schema({
    timestamps: true,
    versionKey: false,
    methods: {
      isSoftDelete: () => softDelete,
    },
  })
}
