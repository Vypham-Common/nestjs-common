import { BadRequestException, DynamicModule, InternalServerErrorException, Module, Provider } from '@nestjs/common'
import { SchemaFactory, getConnectionToken } from '@nestjs/mongoose'
import { ClientSession, Connection, FilterQuery, HydratedDocument, MergeType, Model, PipelineStage, PopulateOptions, ProjectionType, QueryOptions, Schema, Types, UpdateQuery } from 'mongoose'
import { AbstractSchema } from '../../abstracts/AbstractSchema'
import { getMethodFactoryToken, getMethodToken, getModelFactoryToken, getModelToken } from '../../decorators'
import { TOKEN } from '../../enums'
import { getDbName } from '../../utils'
import { eventEmitter } from '../../utils/eventEmitter'
import { ConnectionModule } from '../connection'
import { ConnectionService } from '../connection/connection.service'
import { WorkerService } from '../worker'
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
  populate?: PopulateOptions[]
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

const methodFactory = function <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant: string) {
  name ??= Model.collection.name
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

  function find<P extends {} = {}>(
    input: { query?: FilterQuery<D>; count: false } & OptionalQueryOption
  ): Promise<MergePopulate<D, P>[]>

  function find<P extends {} = {}>(
    input: { query?: FilterQuery<D> } & OptionalQueryOption
  ): Promise<{
    data: MergePopulate<D, P>[]
    total: number
    next: Pagination
    pre: Pagination
  }>
  async function find<P extends {} = {}>({
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

    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }

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
    if (lean) {
      options.lean = lean
    }

    if (idsOnly) {
      return (await Model.find(query).select('_id')).map((o) => o._id)
    }
    let promiseFind: Promise<
      (HydratedDocument<D> | MergePopulate<D, P>)[]
    > = Model
      .find(query, projection, options)
      .populate<P>(populate || [])
      .exec()


    if (!populate) {
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
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  function findById<P extends {} = {}>(
    id: StringOrObjectId,
    options: {
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findById<P extends {} = {}>(
    id: StringOrObjectId,
    option?: {
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findById<P extends {} = {}>(
    id: StringOrObjectId,
    options: {
      message?: string
      isThrow: true
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  async function findById<P extends {} = {}>(
    id: StringOrObjectId,
    {
      isThrow,
      message,
      populate,
      softDelete = true
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[]
      softDelete?: boolean
    } = {}
  ) {
    const isSoftDelete = Model.isSoftDelete()
    const query: FilterQuery<D> = { _id: id }

    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const data = await Model
      .findOne(query)
      .populate<P>(populate || [])
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${name} not found`)
      }
    }
    return data
  }

  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options?: {
      message: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options: {
      isThrow: true
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  async function findOne<P>(
    query: FilterQuery<D>,
    {
      isThrow,
      message,
      populate,
      select,
      softDelete = true
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[]
      softDelete?: boolean
      select?: string | string[] | Record<string, number | boolean | object>
    } = {}
  ) {
    const isSoftDelete = Model.isSoftDelete()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const data = await Model
      .findOne(query)
      .populate<P>(populate || [])
      .select(select || [])
      .exec()
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${name} not found`)
      }
    }
    return data
  }
  async function exists(
    query: FilterQuery<D>,
    options: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS'; message?: string, softDelete?: boolean } = {}
  ) {
    const { throwCase, message, softDelete = true } = options || {}
    const isSoftDelete = Model.isSoftDelete()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const isExists = await Model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new BadRequestException(message || `${name} already exist`)
        }
        break
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new BadRequestException(message || `${name} not found`)
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
      softDelete?: boolean
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
    const { throwCase, message, softDelete = true } = options || {}

    const isSoftDelete = Model.isSoftDelete()
    if (isSoftDelete && softDelete && !query.deletedAt) {
      query.deletedAt = { $exists: false }
    }

    const totalDocs = await Model.countDocuments(query)
    const isExistsOne = totalDocs > 0
    const isExistsAll = totalDocs === ids.length
    switch (throwCase) {
      case 'IF_ONE_EXISTS':
        if (isExistsOne) {
          throw new BadRequestException(
            message || `One of ${name} already exist`
          )
        }
        break
      case 'IF_ONE_NOT_EXISTS':
        if (!isExistsAll) {
          throw new BadRequestException(
            message || `One of ${name} not found`
          )
        }
        break
      case 'IF_ALL_EXISTS':
        if (isExistsAll) {
          throw new BadRequestException(
            message || `All ${name} already exist`
          )
        }
        break
      case 'IF_ALL_NOT_EXISTS':
        if (!isExistsOne) {
          throw new BadRequestException(message || `All ${name} not found`)
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
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  function findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options?: {
      message: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>
  async function findByIdAndUpdate<P extends {} = {}>(
    id: string | Types.ObjectId,
    input: UpdateQuery<D>,
    {
      isThrow,
      message,
      populate,
      softDelete = true
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[]
      softDelete?: boolean
    } = {}
  ) {
    const query: FilterQuery<D> = { _id: id }
    const isSoftDelete = Model.isSoftDelete()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }

    const data = await Model
      .findByIdAndUpdate(id, input, { new: true })
      .populate<P>(populate || [])
      .exec()


    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${name} not found`)
      }
    }
    return data
  }


  function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>

  function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      populate: PopulateOptions[]
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options?: {
      message: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P> | null>

  function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: {
      isThrow: true
      message?: string
      softDelete?: boolean
    }
  ): Promise<MergePopulate<D, P>>
  async function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    {
      isThrow,
      message,
      populate,
      softDelete = true
    }: {
      isThrow?: boolean
      message?: string
      populate?: PopulateOptions[]
      softDelete?: boolean
    } = {}
  ) {
    const isSoftDelete = Model.isSoftDelete()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const data = await Model
      .findOneAndUpdate(query, input, { new: true })
      .populate<P>(populate || [])
      .exec()
    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${name} not found`)
      }
    }
    return data
  }

  async function findByIdAndDelete(
    id: string | Types.ObjectId,
    { isThrow, message, softDelete = true }: { isThrow?: boolean; message?: string, softDelete?: boolean } = {}
  ) {
    const isSoftDelete = Model.isSoftDelete()

    let data: HydratedDocument<D> | null = null

    if (softDelete && isSoftDelete) {
      data = await Model.findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true })
    } else {
      data = await Model.findByIdAndDelete(id)
    }

    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${name} not found`)
      }
    }
    return data
  }

  async function findOneAndDelete(
    query: FilterQuery<D>,
    { isThrow, message, softDelete }: { isThrow?: boolean; message?: string, softDelete?: boolean } = {}
  ) {
    const isSoftDelete = Model.isSoftDelete()

    let data: HydratedDocument<D> | null = null

    if (softDelete && isSoftDelete) {
      data = await Model.findOneAndUpdate(query, { deletedAt: Date.now() }, { new: true })
    } else {
      data = await Model.findOneAndDelete(query)
    }

    if (!data) {
      if (isThrow) {
        throw new BadRequestException(message || `${name} not found`)
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
    if (!tenant) {
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

    eventEmitter.emit(`${tenant}_${name}`, {
      id,
      fn
    })
    return promise
  }

  async function transaction<T = any>(callback: (session: ClientSession) => Promise<T>) {
    const session = await Model.startSession()
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


  function generateLookup(pipelines: GeneratePipeline[], prefix = '') {
    const mappedPipeline: Exclude<
      PipelineStage,
      PipelineStage.Merge | PipelineStage.Out
    >[] = []
    pipelines.forEach((pipeline) => {
      const { unwind = true, keepNull = false, project } = pipeline

      if (typeof pipeline.localField === 'string') {
        const localField = `${prefix}${String(pipeline.localField)}`
        const as = `${prefix}${String(pipeline.as || pipeline.localField)}`
        const from = pipeline.from
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
          const nestedLookup = generateLookup(pipeline.lookup)
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
          const pipelines = generateLookup([{ ...pipeline, localField }])
          mappedPipeline.push(...pipelines)
        })
      }

    })
    return mappedPipeline
  }

  return {
    model: Model,
    generateLookup,
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

export type Method<D extends AbstractSchema> = ReturnType<typeof methodFactory<D >>

export type ModelFactory<D extends AbstractSchema> = (tenant?: string) => Model<D>
export type MethodFactory<D extends AbstractSchema> = (tenant?: string) => Method<D>

@Module({})
export class ModelModule {
  private static registerInput: {
    [k: string]: ((new () => any) & { collectionName?: string, hook?: (schema: Schema<any>) => void, master?: boolean, })
  } = {}

  private static registerSchema<D extends AbstractSchema>(Decorator: new () => any, hook?: (schema: Schema<D>) => void) {
    const Schema = SchemaFactory.createForClass(Decorator)
    Schema.add({ deletedAt: Date })
    if (hook) {
      hook(Schema)
    }
    return Schema
  }

  private static registerWithTenant<D extends AbstractSchema = AbstractSchema>(
    input: ((new () => any) & { collectionName?: string, hook?: (schema: Schema<D>) => void, master?: boolean, }),
    tenant: string | undefined = undefined,
    connection: Connection,
    connectionService: ConnectionService,
  ) {
    const Schema = this.registerSchema(input, input.hook)
    const name = this.getName(input)
    this.createModelFactory(name, Schema)(connection, connectionService, tenant)
  }

  static init(connection: Connection, connectionService: ConnectionService, workerService: WorkerService) {
    Object.values(this.registerInput).forEach(input => {
      if (input.master) {
        ModelModule.registerWithTenant(input, undefined, connection, connectionService)
      } else {
        global.tenants.forEach((id) => {
          ModelModule.registerWithTenant(input, id, connection, connectionService)
          workerService.register(id, input.collectionName || input.name)
        })
      }
    })
  }

  static createModelFactory<D = any>(name: string, Schema: Schema<D>) {
    return function (connection: Connection, connectionService: ConnectionService, tenant: string | undefined = undefined,) {
      const dbName = getDbName(tenant)
      const getConnection = connectionService.get(dbName)
      if (getConnection) {
        if (getConnection.models[name]) {
          return getConnection.models[name]
        }
        return getConnection.model(name, Schema)
      }

      const createConnection = connection
        .useDb(dbName)

      const setConnection = connectionService.set(dbName, createConnection)
      if (setConnection.models[name]) {
        return setConnection.models[name]
      }
      return setConnection.model(name, Schema)
    }
  }

  private static getName(Decorator: (new () => any) & { collectionName?: string }) {
    return Decorator.collectionName || Decorator.name
  }

  static register<D extends AbstractSchema = any>(
    regiserInput: ((new () => any) & { collectionName?: string, hook?: (schema: Schema<D>) => void, master?: boolean, })[],
  ): DynamicModule {
    const providers: Provider[] = []
    regiserInput.forEach(input => {
      const Schema = this.registerSchema(input, input.hook)
      const name = this.getName(input)
      this.registerInput[name] = input
      const injectModel = [getConnectionToken(), ConnectionService,]
      const injectMethod = [getModelToken(name),]
      if (!input.master) {
        injectModel.push(TOKEN.TENANT)
        injectMethod.push(TOKEN.TENANT)
      }

      providers.push(
        {
          provide: getModelToken(name),
          useFactory: this.createModelFactory(name, Schema),
          inject: injectModel
        },
        {
          provide: getMethodToken(name),
          useFactory: (Model: Model<D> & ModelStatics, tenant?: string) => {
            return methodFactory(Model, name, tenant || global.GlobalConfig.MONGODB_NAME)
          },
          inject: injectMethod
        }
      )
    })
    return {
      module: ModelModule,
      providers: providers,
      exports: providers,
    }
  }

  static registerWithoutRequest<D extends AbstractSchema = AbstractSchema>(
    regiserInput: ((new () => any) & { collectionName?: string, hook?: (schema: Schema<D>) => void, master?: boolean, })[],
  ): DynamicModule {
    const providers: Provider[] = []
    regiserInput.forEach(input => {
      const Schema = this.registerSchema(input, input.hook)
      const name = this.getName(input)
      this.registerInput[name] = input
      providers.push(
        {
          provide: getModelFactoryToken(name),
          useFactory: (connection: Connection, tenantService: ConnectionService) => {
            return (tenant?: string) => {
              return this.createModelFactory(name, Schema)(connection, tenantService, tenant)
            }
          },
          inject: [getConnectionToken(), ConnectionService],
        },
        {
          provide: getMethodFactoryToken(name),
          useFactory: (modelFactory: (tenant?: string) => Model<D> & ModelStatics) => {
            return function (tenant?: string) {
              const model = modelFactory(tenant)
              return methodFactory(model, name, tenant || global.GlobalConfig.MONGODB_NAME)
            }
          },
          inject: [getModelFactoryToken(name)],
        }
      )
    })

    return {
      module: ModelModule,
      imports: [ConnectionModule],
      providers: providers,
      exports: providers,
    }
  }
}
