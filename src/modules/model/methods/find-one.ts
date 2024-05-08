import { BadRequestException } from '@nestjs/common'
import { FilterQuery, Model } from 'mongoose'
import { AbstractSchema } from '../../../abstracts'
import { FindOneOption } from '../model.interface'

export const generateFindOne = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  function findOne<P extends {} = {}>(
    query: FilterQuery<D>,
    options: Omit<FindOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<MergePopulate<D, P>>

  function findOne<P extends {} = {}>(
    query?: FilterQuery<D>,
    options?: FindOneOption
  ): Promise<MergePopulate<D, P> | null>

  async function findOne<P extends {} = {}>(
    query: FilterQuery<D> = {},
    {
      isThrow,
      message,
      populate,
      select,
      softDelete = true,
      sort
    }: FindOneOption = {}
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const data = await Model
      .findOne(query)
      .populate<P>(populate || [])
      .sort(sort || {})
      .select(select || [])
      .exec()
    if (isThrow === true) {
      if (!data) {
        throw new BadRequestException(message || `${name} with query ${JSON.stringify(query)} not found`)
      }
    }
    return data
  }

  return findOne
}


export const generateFindById = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  const findOne = generateFindOne(Model, name)

  function findById<P extends {} = {}>(
    id: DataId,
    options: Omit<FindOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<MergePopulate<D, P>>

  function findById<P extends {} = {}>(
    id: DataId,
    options?: FindOneOption
  ): Promise<MergePopulate<D, P> | null>
  async function findById<P extends {} = {}>(
    id: DataId,
    options: FindOneOption = {}
  ) {
    return await findOne<P>({ _id: id } as FilterQuery<D>, options)
  }

  return findById
}

