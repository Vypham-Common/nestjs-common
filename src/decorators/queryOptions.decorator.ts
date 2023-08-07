import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
const ORDER_BY: { [k: string]: any } = {
  ASC: 1,
  DESC: -1,
}
export const QueryOptions = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request
    const query = req.query
    const page: number | undefined = !Number.isNaN(Number(query.page))
      ? Number(query.page)
      : undefined

    let skip: number | undefined = !Number.isNaN(Number(query.skip))
      ? Number(query.skip)
      : undefined

    const limit: number | undefined = !Number.isNaN(Number(query.limit))
      ? Number(query.limit)
      : undefined

    if (!Number.isNaN(page) && !Number.isNaN(limit)) {
      skip = ((page as number) - 1) * (limit as number)
    }

    const { sort } = query
    let mapSort: { [k: string]: number } | undefined = undefined
    if (Array.isArray(sort) && sort.length > 0) {
      mapSort = {}
      for (const item of sort) {
        const [sortName, value] = item.toString().split(':')
        if (!sortName || !value) continue
        if (ORDER_BY[value.toUpperCase()]) {
          mapSort[sortName] = ORDER_BY[value.toUpperCase()]
        }
      }
    }
    return {
      skip: skip || 0,
      limit: limit || Number.MAX_SAFE_INTEGER,
      sort: mapSort,
    }
  }
)
