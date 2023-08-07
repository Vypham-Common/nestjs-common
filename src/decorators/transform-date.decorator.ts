import { Transform } from 'class-transformer';
export const TransformDate = Transform(({ value }) =>
  value ? new Date(value) : undefined
)

