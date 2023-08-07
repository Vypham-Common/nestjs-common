import { BadRequestException, Injectable } from '@nestjs/common'
import {
  FilterQuery,
  HydratedDocument,
  MergeType,
  Model,
  PipelineStage,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
  isValidObjectId,
} from 'mongoose'
import { AbstractModel } from './AbstractModel'
type Group = {
  asObject: {
    [k: string]: number
  }
  asArray: {
    status: string
    total: number
  }[]
}
type OptionalQueryOption = {
  skip?: number
  limit?: number
  sort?: any
  lean?: boolean
  idsOnly?: boolean
  count?: boolean
  exportColumns?: {
    label: string
    value: string
  }[]
  populate?: PopulateOptions[] | false
  projection?: ProjectionType<any>
}
interface AbstractServiceOptions<D> {
  shortLookup?: GeneratePipeline<D>[]
  populate?: (PopulateOptions & { global?: boolean })[]
}
@Injectable()
export abstract class AbstractService<
  M extends AbstractModel<any>,
  PullPopulate extends {} = object
> {
  tenant?: string
  name: string
  model: Model<M['Doc']>
  user: JWTPayload
  populate: PopulateOptions[] = []
  lookup: PipelineStage[] = []
  shortLookup: GeneratePipeline<M['Doc']>[] = []
  getCollectionName: M['getCollectionName']
  constructor(
    M: M,
    user: JWTPayload | undefined = undefined,
    { shortLookup, populate }: AbstractServiceOptions<M['Doc']> = {}
  ) {
    this.name = M.name
    this.getCollectionName = M.getCollectionName.bind(M)
    this.tenant = M.tenant

    if (user) {
      this.user = user
    }
    if (shortLookup) {
      this.shortLookup = shortLookup
      this.lookup = this.generateLookup(this.shortLookup)
    }
    if (populate) {
      this.populate = this.generatePopulate(populate)
    }

    this.model = M.model
  }

  generatePopulate(
    populate: (PopulateOptions & { global?: boolean })[]
  ): PopulateOptions[] {
    return populate.map(({ global, ...o }) => {
      if (
        o.model &&
        typeof o.model === 'string' &&
        !global &&
        !o.model.includes(this.tenant as string)
      ) {
        o.model = this.getCollectionName(o.model)
      }
      if (o.populate) {
        o.populate = this.generatePopulate(o.populate as PopulateOptions[])
      }
      return {
        ...o,
      }
    })
  }
  generateLookup(pipelines: GeneratePipeline[], prefix = '') {
    const mappedPipeline: Exclude<
      PipelineStage,
      PipelineStage.Merge | PipelineStage.Out
    >[] = []
    pipelines.forEach((pipeline) => {
      const { unwind = true, keepNull = false, project } = pipeline
      const localField = `${prefix}${String(pipeline.localField)}`
      const as = `${prefix}${String(pipeline.as || pipeline.localField)}`
      const from = pipeline.global
        ? pipeline.from
        : this.getCollectionName(pipeline.from)
      const lookupStage: PipelineStage.Lookup = {
        $lookup: {
          from: from,
          localField: localField,
          foreignField: pipeline.foreignField || '_id',
          as: as,
        },
      }

      if (pipeline.pipeline) {
        lookupStage.$lookup.pipeline = pipeline.pipeline
      }

      mappedPipeline.push(lookupStage)
      if (unwind) {
        mappedPipeline.push({
          $unwind: {
            path: `$${as}`,
            preserveNullAndEmptyArrays: keepNull,
          },
        })
      }
      if (pipeline.match) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $match: pipeline.match
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $match: pipeline.match
          }]
        }
      }
      if (pipeline.lookup) {
        const nestedLookup = this.generateLookup(pipeline.lookup)
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...nestedLookup)
        } else {
          lookupStage.$lookup.pipeline = nestedLookup
        }
      }
      if (pipeline.postPipeline) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...pipeline.postPipeline)
        } else {
          lookupStage.$lookup.pipeline = pipeline.postPipeline
        }
      }
      if (project) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $project: project
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $project: project
          }]
        }
      }
    })
    return mappedPipeline
  }

  find(
    input: {
      query?: FilterQuery<M['Doc']>
      idsOnly: true
    } & OptionalQueryOption
  ): Promise<Types.ObjectId[]>

  find(
    input: {
      query?: FilterQuery<M['Doc']>
      count: false
      populate: false
    } & OptionalQueryOption
  ): Promise<HydratedDocument<M['Doc']>[]>
  find(
    input: {
      query?: FilterQuery<M['Doc']>
      populate: false
    } & OptionalQueryOption
  ): Promise<{
    data: HydratedDocument<M['Doc']>[]
    total: number
    next: Pagination
    pre: Pagination
  }>

  find<P extends {} = PullPopulate>(
    input: { query?: FilterQuery<M['Doc']>; count: false } & OptionalQueryOption
  ): Promise<MergePopulate<M['Doc'], P>[]>

  find<P extends {} = PullPopulate>(
    input: { query?: FilterQuery<M['Doc']> } & OptionalQueryOption
  ): Promise<{
    data: MergePopulate<M['Doc'], P>[]
    total: number
    next: Pagination
    pre: Pagination
  }>
  async find<P extends {} = PullPopulate>({
    query = {},
    skip,
    limit,
    sort,
    lean,
    count,
    populate,
    idsOnly,
    projection,
  }: MergeType<{ query?: FilterQuery<M['Doc']> }, OptionalQueryOption>) {
    const options: QueryOptions = {}
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
    if (typeof lean === 'boolean') {
      options.lean = lean
    }

    if (idsOnly) {
      return (await this.model.find(query).select('_id')).map((o) => o._id)
    }
    let promiseFind: Promise<
      (HydratedDocument<M['Doc']> | MergePopulate<M['Doc'], P>)[]
    > = this.model
      .find(query, projection, options)
      .populate<P>(populate || this.populate)
      .exec()

    if (populate === false) {
      promiseFind = this.model.find(query, projection, options).exec()
    }
    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<(HydratedDocument<M['Doc']> | MergePopulate<M['Doc'], P>)[]>,
      Promise<number>
    ] = [promiseFind, this.model.countDocuments(query).exec()]
    const [data, total] = await Promise.all(promises)
    const next: Pagination = {
      page: null,
      limit: null,
    }
    const pre: Pagination = {
      page: null,
      limit: null,
    }
    if (
      skip !== undefined &&
      limit !== undefined &&
      Number.isInteger(skip) &&
      Number.isInteger(limit)
    ) {
      next.page = skip + limit >= total ? null : (skip + limit) / limit + 1
      next.limit = limit
      pre.page = skip - limit >= 0 ? (skip - limit) / limit + 1 : null
      pre.limit = limit
    }
    return {
      data,
      total,
      next,
      pre,
    }
  }

  findById<P extends {} = {}>(
    id: StringOrObjectId,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findById<P extends {}>(
    id: StringOrObjectId,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findById<P extends {}>(
    id: StringOrObjectId,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findById<P extends {} = PullPopulate>(
    id: StringOrObjectId,
    option?: { message?: string }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findById<P extends {} = PullPopulate>(
    id: StringOrObjectId,
    options: {
      message?: string
      isThrow: true
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  async findById<P extends {} = {}>(
    id: StringOrObjectId,
    {
      isThrow,
      message,
      populate,
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[] | false
    } = {}
  ) {
    const data = await this.model
      .findById(id)
      .populate<P>(
        populate === false
          ? []
          : populate === undefined
            ? this.populate
            : populate
      )
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  findOne<P extends {} = {}>(
    query: FilterQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findOne<P extends {}>(
    query: FilterQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findOne<P extends {}>(
    query: FilterQuery<M['Doc']>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findOne<P extends {} = PullPopulate>(
    query: FilterQuery<M['Doc']>,
    options?: { message: string }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findOne<P extends {} = PullPopulate>(
    query: FilterQuery<M['Doc']>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  async findOne<P>(
    query: FilterQuery<M['Doc']>,
    {
      isThrow,
      message,
      populate,
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[] | false
    } = {}
  ) {
    const data = await this.model
      .findOne(query)
      .populate<P>(
        populate === false
          ? []
          : populate === undefined
            ? this.populate
            : populate
      )
      .exec()
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }
  async exists(
    query: FilterQuery<M['Doc']>,
    options?: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS'; message?: string }
  ) {
    const { throwCase, message } = options || {}
    const isExists = await this.model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new BadRequestException(message || `${this.name} already exist`)
        }
        break
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new BadRequestException(message || `${this.name} not found`)
        }
        break
    }
    return !!isExists
  }

  async existsAll(
    ids: StringOrObjectId[],
    options: {
      throwCase?:
      | 'IF_ONE_EXISTS'
      | 'IF_ONE_NOT_EXISTS'
      | 'IF_ALL_EXISTS'
      | 'IF_ALL_NOT_EXISTS'
      message?: string
    } = {},
    customQuery?: (ids: StringOrObjectId[]) => FilterQuery<M['Doc']>
  ) {
    const hashTypes: { [k: string]: 1 } = {}
    ids.forEach((o) => {
      hashTypes[o.toString()] = 1
    })
    ids = Object.keys(hashTypes)
    const query: FilterQuery<M['Doc']> = customQuery
      ? customQuery(ids)
      : { _id: { $in: ids } }
    const { throwCase, message } = options || {}
    const totalDocs = await this.model.countDocuments(query)
    const isExistsOne = totalDocs > 0
    const isExistsAll = totalDocs === ids.length
    switch (throwCase) {
      case 'IF_ONE_EXISTS':
        if (isExistsOne) {
          throw new BadRequestException(
            message || `One of ${this.name} already exist`
          )
        }
        break
      case 'IF_ONE_NOT_EXISTS':
        if (!isExistsAll) {
          throw new BadRequestException(
            message || `One of ${this.name} not found`
          )
        }
        break
      case 'IF_ALL_EXISTS':
        if (isExistsAll) {
          throw new BadRequestException(
            message || `All ${this.name} already exist`
          )
        }
        break
      case 'IF_ALL_NOT_EXISTS':
        if (!isExistsOne) {
          throw new BadRequestException(message || `All ${this.name} not found`)
        }
        break
    }
    return {
      isExistsOne,
      isExistsAll,
    }
  }

  async groupBy(field: string, keys: string[], pipeline: PipelineStage[] = []) {
    const rawData = await this.model.aggregate([
      ...pipeline,
      {
        $group: {
          _id: `$${field}`,
          total: { $count: {} },
        },
      },
    ])
    const data: Group = {
      asObject: {},
      asArray: [],
    }
    rawData.forEach(({ _id, total }) => {
      data.asObject[_id] = total
      data.asArray.push({
        status: _id,
        total,
      })
    })
    keys.forEach((status) => {
      if (!data.asObject[status]) {
        data.asObject[status] = 0
        data.asArray.push({
          status,
          total: 0,
        })
      }
    })
    return data
  }

  isValidObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId')
    }
    return new Types.ObjectId(id)
  }

  findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findByIdAndUpdate<P extends {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findByIdAndUpdate<P extends {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findByIdAndUpdate<P extends {} = PullPopulate>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    options?: { message: string }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findByIdAndUpdate<P extends {} = PullPopulate>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>
  async findByIdAndUpdate<P>(
    id: string | Types.ObjectId,
    input: UpdateQuery<M['Doc']>,
    {
      isThrow,
      message,
      populate,
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[] | false
    } = {}
  ) {
    const data = await this.model
      .findByIdAndUpdate(id, input, { new: true })
      .populate<P>(
        populate === false
          ? []
          : populate === undefined
            ? this.populate
            : populate
      )
      .exec()
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  findOneAndUpdate<P = {}>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findOneAndUpdate<P>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>

  findOneAndUpdate<P>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findOneAndUpdate<P = PullPopulate>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    options?: { message: string }
  ): Promise<MergePopulate<M['Doc'], P> | null>

  findOneAndUpdate<P = PullPopulate>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<M['Doc'], P>>
  public async findOneAndUpdate<P>(
    query: FilterQuery<M['Doc']>,
    input: UpdateQuery<M['Doc']>,
    {
      isThrow,
      message,
      populate,
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[] | false
    } = {}
  ) {
    const data = await this.model
      .findOneAndUpdate(query, input, { new: true })
      .populate<P>(
        populate === false
          ? []
          : populate === undefined
            ? this.populate
            : populate
      )
      .exec()
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  public async findByIdAndDelete(
    id: string | Types.ObjectId,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model.findByIdAndDelete(id)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  public async findOneAndDelete(
    query: FilterQuery<M['Doc']>,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await this.model.findOneAndDelete(query)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  async findByPipeline<T = any[]>(
    { skip, limit, sort }: QueryParams,
    pipelines: PipelineStage[]
  ): Promise<{ data: T; total: number }> {
    if (!Number.isInteger(skip)) {
      skip = 0
    }
    if (sort) {
      pipelines.push({ $sort: sort })
    } else {
      pipelines.push({ $sort: { createdAt: -1 } })
    }
    pipelines.push(
      {
        $group: {
          _id: null,
          total: {
            $count: {},
          },
          data: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $addFields: {
          data: {
            $slice: [
              '$data',
              skip,
              !limit || limit === Number.MAX_SAFE_INTEGER
                ? { $size: '$data' }
                : limit,
            ],
          },
        },
      }
    )
    const [result] = await this.model.aggregate(pipelines)
    const { data, total } = result || { data: [], total: 0 }
    return {
      data,
      total,
    }
  }
}
