import { Transform } from 'class-transformer'
export const TransformArray = Transform(({ value }) =>
  Array.isArray(value) ? value : [value]
)
