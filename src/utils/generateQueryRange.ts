import { QuerySelector } from 'mongoose'

type GenerateQueryRange<I> = {
  from: I
  to: I
}
export function generateQueryRange<I = any>({
  from,
  to,
}: GenerateQueryRange<I>) {
  const query: QuerySelector<I> = {}
  let isHaveQuery = false
  if (from || Number.isInteger(from)) {
    query.$gte = from
    isHaveQuery = true
  }
  if (to || Number.isInteger(to)) {
    query.$lte = to
    isHaveQuery = true
  }

  return isHaveQuery ? query : null
}
