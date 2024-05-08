import { FilterQuery, Model, PopulateOptions, ProjectionType, QueryOptions, Types } from 'mongoose';
import { AbstractSchema } from '../../../abstracts';
type OptionalQueryOption<D> = {
  query?: FilterQuery<D>
  search?: string
  skip?: number
  limit?: number
  sort?: any
  lean?: boolean
  idsOnly?: boolean
  count?: boolean
  populate?: PopulateOptions[]
  projection?: ProjectionType<any>
  softDelete?: boolean
}
export const generateFind = <D extends AbstractSchema>(Model: Model<D> & ModelStatics) => {
  function find(
    input: {
      idsOnly: true
    } & OptionalQueryOption<D>
  ): Promise<Types.ObjectId[]>

  function find<P extends {} = {}>(
    input: {
      lean: true,
      count: false
    } & OptionalQueryOption<D>
  ): Promise<LeanDocument<MergePopulate<D, P>>[]>

  function find<P extends {} = {}>(
    input: {
      count: false
    } & OptionalQueryOption<D>
  ): Promise<MergePopulate<D, P>[]>

  function find<P extends {} = {}>(
    input: {
      lean: true
    } & OptionalQueryOption<D>
  ): Promise<{ total: number, data: LeanDocument<MergePopulate<D, P>>[] }>

  function find<P extends {} = {}>(
    input: OptionalQueryOption<D>
  ): Promise<{ data: MergePopulate<D, P>[], total: number }>
  async function find<P extends {} = {}>(
    {
      query = {},
      skip,
      limit,
      sort,
      lean,
      count,
      populate = [],
      idsOnly,
      projection,
      softDelete = true,
      search,
    }: OptionalQueryOption<D>
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    const partialSearch = Model?.getPartialSearch?.()
    if (partialSearch && search) {
      const queryOr = partialSearch.map(key => {
        const q = {
          [key]: new RegExp(search, 'i')
        } as unknown as FilterQuery<D>['$or']
        return q
      })
      query = {
        $and: [
          {
            ...query
          },
          {
            $or: queryOr
          }
        ]
      } as FilterQuery<D>
    }

    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }

    const options: QueryOptions = { populate }
    if (skip) {
      options.skip = skip
    }
    if (limit) {
      options.limit = limit
    }
    if (sort) {
      options.sort = sort
    } else {
      options.sort = { _id: -1 }
    }
    if (lean) {
      options.lean = lean
    }

    if (idsOnly) {
      return (await Model.find(query).select('_id')).map((o) => o._id)
    }

    const promiseFind: Promise<MergePopulate<D, P>[]> = Model
      .find(query, projection, options)

    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<MergePopulate<D, P>[]>,
      Promise<number>
    ] = [promiseFind, Model.countDocuments(query).exec()]
    const [data, total] = await Promise.all(promises)

    return {
      data,
      total,
    }
  }

  return find
}

export const generateCount = <D extends AbstractSchema>(Model: Model<D> & ModelStatics) => {
  async function count(query: FilterQuery<D>, { softDelete }: { softDelete?: boolean } = { softDelete: true }) {
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    return await Model.countDocuments(query)
  }

  return count
}

