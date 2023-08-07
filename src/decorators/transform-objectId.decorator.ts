import { Transform } from 'class-transformer';
import { Types, isValidObjectId } from 'mongoose';
export const TransformObjectId = Transform(({ value }) => {
  if (Array.isArray(value)) {
    return value.map(o => {
      if (isValidObjectId(o)) return new Types.ObjectId(o)
      return o
    })
  } else {
    if (isValidObjectId(value)) return new Types.ObjectId(value)
    return value
  }
})

