import { Transform } from 'class-transformer';

export const TransformTrimString = Transform(({ value }) => {
  if (typeof value === 'string') {
    return value.trim()
  } else {
    return undefined
  }
})
