import { BadRequestException, DynamicModule, InternalServerErrorException, Module } from '@nestjs/common'
import { SchemaFactory, getConnectionToken } from '@nestjs/mongoose'
import { ClientSession, Connection, FilterQuery, HydratedDocument, MergeType, Model, PipelineStage, PopulateOptions, ProjectionType, QueryOptions, Schema, Types, UpdateQuery } from 'mongoose'
import { AbstractSchema } from '../../abstracts/AbstractSchema'
import { TOKEN } from '../../enums'
import { getDbName } from '../../utils'
import { eventEmitter } from '../../utils/eventEmitter'

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
  softDelete?: boolean
}

type Group = {
  asObject: {
    [k: string]: number
  }
  asArray: {
    status: string
    total: number
  }[]
}

const factoryMethod = function <D extends AbstractSchema, PullPopulate extends {} = object>(Model: Model<D, {}, ModelMethod>) {
  function find(
    input: {
      query?: FilterQuery<D>
      idsOnly: true
    } & OptionalQueryOption
  ): Promise<Types.ObjectId[]>

  function find(
    input: {
      query?: FilterQuery<D>
      count: false
      populate: false
    } & OptionalQueryOption
  ): Promise<HydratedDocument<D>[]>

  function find(
    input: {
      query?: FilterQuery<D>
      populate: false
    } & OptionalQueryOption
  ): Promise<{
    data: HydratedDocument<D>[]
    total: number
    next: Pagination
    pre: Pagination
  }>

  function find<P extends {} = PullPopulate>(
    input: { query?: FilterQuery<D>; count: false } & OptionalQueryOption
  ): Promise<MergePopulate<D, P>[]>

  function find<P extends {} = PullPopulate>(
    input: { query?: FilterQuery<D> } & OptionalQueryOption
  ): Promise<{
    data: MergePopulate<D, P>[]
    total: number
    next: Pagination
    pre: Pagination
  }>
  async function find<P extends {} = PullPopulate>({
    query = {},
    skip,
    limit,
    sort,
    lean,
    count,
    populate,
    idsOnly,
    projection,
    softDelete = true,
  }: MergeType<{ query?: FilterQuery<D> }, OptionalQueryOption>) {
    const isSoftDelete = Model.isSoftDelete()
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
      return (await Model.find(query).select('_id')).map((o) => o._id)
    }
    let promiseFind: Promise<
      (HydratedDocument<D> | MergePopulate<D, P>)[]
    > = Model
      .find(query, projection, options)
      .populate<P>(populate || this.populate)
      .exec()


    if (populate === false) {
      promiseFind = Model.find(query, projection, options).exec()
    }
    if (count === false) {
      return await promiseFind
    }
    const promises: [
      Promise<(HydratedDocument<D> | MergePopulate<D, P>)[]>,
      Promise<number>
    ] = [promiseFind, Model.countDocuments(query).exec()]
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

  function findById<P extends {} = {}>(
    id: StringOrObjectId,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findById<P extends {}>(
    id: StringOrObjectId,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findById<P extends {}>(
    id: StringOrObjectId,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P> | null>

  function findById<P extends {} = PullPopulate>(
    id: StringOrObjectId,
    option?: { message?: string }
  ): Promise<MergePopulate<D, P> | null>

  function findById<P extends {} = PullPopulate>(
    id: StringOrObjectId,
    options: {
      message?: string
      isThrow: true
    }
  ): Promise<MergePopulate<D, P>>

  async function findById<P extends {} = {}>(
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
    const data = await Model
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

  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findOne<P extends {}>(
    query: FilterQuery<D>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findOne<P extends {}>(
    query: FilterQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOne<P extends {} = PullPopulate>(
    query: FilterQuery<D>,
    options?: { message: string }
  ): Promise<MergePopulate<D, P> | null>

  function findOne<P extends {} = PullPopulate>(
    query: FilterQuery<D>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  async function findOne<P>(
    query: FilterQuery<D>,
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
    const data = await Model
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
  async function exists(
    query: FilterQuery<D>,
    options?: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS'; message?: string }
  ) {
    const { throwCase, message } = options || {}
    const isExists = await Model.exists(query)
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

  async function existsAll(
    ids: StringOrObjectId[],
    options: {
      throwCase?:
      | 'IF_ONE_EXISTS'
      | 'IF_ONE_NOT_EXISTS'
      | 'IF_ALL_EXISTS'
      | 'IF_ALL_NOT_EXISTS'
      message?: string
    } = {},
    customQuery?: (ids: StringOrObjectId[]) => FilterQuery<D>
  ) {
    const hashTypes: { [k: string]: 1 } = {}
    ids.forEach((o) => {
      hashTypes[o.toString()] = 1
    })
    ids = Object.keys(hashTypes)
    const query: FilterQuery<D> = customQuery
      ? customQuery(ids)
      : { _id: { $in: ids } }
    const { throwCase, message } = options || {}
    const totalDocs = await Model.countDocuments(query)
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

  async function groupBy(field: string, keys: string[], pipeline: PipelineStage[] = []) {
    const rawData = await Model.aggregate([
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

  function findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findByIdAndUpdate<P extends {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findByIdAndUpdate<P extends {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P> | null>

  function findByIdAndUpdate<P extends {} = PullPopulate>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options?: { message: string }
  ): Promise<MergePopulate<D, P> | null>

  function findByIdAndUpdate<P extends {} = PullPopulate>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<D, P>>
  async function findByIdAndUpdate<P>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
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
    const data = await Model
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

  function findOneAndUpdate<P = {}>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      populate: false
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findOneAndUpdate<P>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P>>

  function findOneAndUpdate<P>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOneAndUpdate<P = PullPopulate>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options?: { message: string }
  ): Promise<MergePopulate<D, P> | null>

  function findOneAndUpdate<P = PullPopulate>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      message?: string
    }
  ): Promise<MergePopulate<D, P>>
  async function findOneAndUpdate<P>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
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
    const data = await Model
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

  async function findByIdAndDelete(
    id: string | Types.ObjectId,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await Model.findByIdAndDelete(id)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  async function findOneAndDelete(
    query: FilterQuery<D>,
    { isThrow, message }: { isThrow?: boolean; message?: string } = {}
  ) {
    const data = await Model.findOneAndDelete(query)
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${this.name} not found`)
      }
    }
    return data
  }

  async function findByPipeline<T = any[]>(
    queryParam: QueryParams | undefined = undefined,
    pipelines: PipelineStage[],
  ): Promise<{ data: T; total: number }> {
    const { skip = 0, limit = Number.MAX_SAFE_INTEGER, sort = { createdAt: -1 } } = queryParam || {}
    pipelines.push({ $sort: sort })
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
              !Number.isInteger(skip) ? 0 : skip,
              !Number.isInteger(limit) || limit === Number.MAX_SAFE_INTEGER
                ? { $size: '$data' }
                : limit,
            ],
          },
        },
      }
    )
    const [result] = await Model.aggregate(pipelines)
    const { data, total } = result || { data: [], total: 0 }
    return {
      data,
      total,
    }
  }

  function createQueue<T = any>(
    fn: () => Promise<T> | T
  ): Promise<T> {
    const id = new Types.ObjectId().toString()
    if (!this.tenant) {
      throw new InternalServerErrorException('Cannot use worker queue without tenant')
    }
    const promise = new Promise<T>((resolve, reject) => {
      const eventCb = function (data: T) {
        if (data instanceof Error) {
          reject(data)
        } else {
          resolve(data)
        }
      }

      eventEmitter.once(id, eventCb)
    })

    eventEmitter.emit(this.tenant, {
      id,
      fn
    })
    return promise
  }

  async function transaction<T = any>(callback: (session: ClientSession) => Promise<T>) {
    const session = await this.M.connection.startSession()
    try {
      session.startTransaction()
      const result = await callback(session)
      await session.commitTransaction()
      return result
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  return {
    model: Model,
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
    },
    generateLookup(pipelines: GeneratePipeline[], prefix = '') {
      const mappedPipeline: Exclude<
        PipelineStage,
        PipelineStage.Merge | PipelineStage.Out
      >[] = []
      pipelines.forEach((pipeline) => {
        const { unwind = true, keepNull = false, project } = pipeline

        if (typeof pipeline.localField === 'string') {
          const localField = `${prefix}${String(pipeline.localField)}`
          const as = `${prefix}${String(pipeline.as || pipeline.localField)}`
          const from = pipeline.global ? pipeline.from : this.getCollectionName(pipeline.from)
          const lookupStage: PipelineStage.Lookup = {
            $lookup: {
              from: from,
              localField: localField,
              foreignField: pipeline.foreignField || '_id',
              as: as,
            },
          }
          if (pipeline.let) {
            lookupStage.$lookup.let = pipeline.let
          }
          if (pipeline.pipeline) {
            lookupStage.$lookup.pipeline = pipeline.pipeline
          }

          if (pipeline.sort) {
            if (lookupStage.$lookup.pipeline) {
              lookupStage.$lookup.pipeline.push({
                $sort: pipeline.sort
              })
            } else {
              lookupStage.$lookup.pipeline = [{
                $sort: pipeline.sort
              }]
            }
          }

          if (pipeline.skip && Number.isInteger(pipeline.skip)) {
            if (lookupStage.$lookup.pipeline) {
              lookupStage.$lookup.pipeline.push({
                $skip: pipeline.skip
              })
            } else {
              lookupStage.$lookup.pipeline = [{
                $skip: pipeline.skip
              }]
            }
          }

          if (pipeline.limit && Number.isInteger(pipeline.limit)) {
            if (lookupStage.$lookup.pipeline) {
              lookupStage.$lookup.pipeline.push({
                $limit: pipeline.limit
              })
            } else {
              lookupStage.$lookup.pipeline = [{
                $limit: pipeline.limit
              }]
            }
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
        } else {
          pipeline.localField.forEach(localField => {
            const pipelines = this.generateLookup([{ ...pipeline, localField }])
            mappedPipeline.push(...pipelines)
          })
        }

      })
      return mappedPipeline
    },
    find,
    findByPipeline,
    findOne,
    findById,
    findOneAndUpdate,
    findOneAndDelete,
    findByIdAndUpdate,
    findByIdAndDelete,
    groupBy,
    exists,
    existsAll,
    createQueue,
    transaction,
  }
}

export type Method<D extends AbstractSchema> = ReturnType<typeof factoryMethod<D >>

export type ModelFactory<D extends AbstractSchema> = (tenant: string) => Model<D>
export type MethodFactory<D extends AbstractSchema> = (tenant: string) => Method<D>

@Module({})
export class ModelModule {
  private static registerSchema<D = any>(Decorator: new () => D, hook?: (schema: Schema<D>) => void) {
    const Schema = SchemaFactory.createForClass(Decorator)
    if (hook) {
      hook(Schema)
    }
    return Schema
  }

  private static createModelFactory<D = any>(name: string, Schema: Schema<D>) {
    return function (connection: Connection, tenant?: string) {
      return connection
        .useDb(getDbName(tenant))
        .model(name, Schema)
    }
  }

  private static getName(Decorator: (new () => any) & { collectionName?: string }) {
    return Decorator.collectionName || Decorator.name
  }

  static register<D = any>(Decorator: (new () => any) & { collectionName?: string }, hook?: (schema: Schema<D>) => void): DynamicModule {
    const Schema = this.registerSchema(Decorator, hook)
    const name = this.getName(Decorator)
    const providers = [
      {
        provide: `MODEL_${name}`,
        useFactory: this.createModelFactory(name, Schema),
        inject: [getConnectionToken(), TOKEN.TENANT],
      },
      {
        provide: `METHOD_${name}`,
        useFactory: factoryMethod,
        inject: [`MODEL_${name}`],
      }
    ]
    return {
      module: ModelModule,
      providers: providers,
      exports: providers,
    }
  }

  static registerWithoutRequest<D extends AbstractSchema = AbstractSchema>(Decorator: (new () => any) & { collectionName?: string }, hook?: (schema: Schema<D>) => void): DynamicModule {
    const Schema = this.registerSchema(Decorator, hook)
    const name = this.getName(Decorator)
    const providers = [
      {
        provide: `MODEL_FACTORY_${name}`,
        useFactory: (connection: Connection) => {
          return (tenant?: string) => {
            this.createModelFactory(name, Schema)(connection, tenant)
          }
        },
        inject: [getConnectionToken()],
      },
      {
        provide: `METHOD_FACTORY_${name}`,
        useFactory: (modelFactory: (tenant: string) => Model<D>) => {
          return function (tenant: string) {
            const model = modelFactory(tenant)
            return factoryMethod(model)
          }
        },
        inject: [`MODEL_FACTORY_${name}`],
      }
    ]
    return {
      module: ModelModule,
      providers: providers,
      exports: providers,
    }
  }
}
