import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractSchema } from '../../../abstracts';
import { UpdateOneOption } from '../model.interface';
import { generateCreate } from './create';
import { generateFindOne } from './find-one';

export const generateFindOneAndUpdate = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant?: string) => {
  const create = generateCreate(Model, name, tenant)
  const findOne = generateFindOne(Model, name)

  function findOneAndUpdate<P extends {} = {}>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options: Omit<UpdateOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<MergePopulate<D, P>>

  function findOneAndUpdate<P extends {} = {}>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    options?: UpdateOneOption
  ): Promise<MergePopulate<D, P> | null>

  async function findOneAndUpdate<P extends {} = []>(
    query: FilterQuery<D>,
    input: UpdateQuery<D>,
    {
      isThrow,
      message,
      populate,
      softDelete = true,
      newRecord = false,
      sort
    }: UpdateOneOption = {}
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const data = await findOne(query, { isThrow, message, softDelete, sort })

    if (!data) {
      return null
    } else {
      if (newRecord) {
        const newData = await create({
          ...data.toJSON(),
          ...input,
          cloneOf: data.cloneOf || data._id
        })

        data.deletedAt = new Date()
        await data.save()
        return await newData.populate<P>(populate || [])
      } else {
        data.set(input)
        return await Model.findOneAndUpdate(query, data, { new: true }).populate<P>(populate || [])
      }
    }
  }

  return findOneAndUpdate
}

export const generateFindByIdAndUpdate = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant?: string) => {
  const findOneAndUpdate = generateFindOneAndUpdate(Model, name, tenant)
  function findByIdAndUpdate<P extends {} = {}>(
    id: DataId,
    input: UpdateQuery<D>,
    options: Omit<UpdateOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<MergePopulate<D, P>>

  function findByIdAndUpdate<P extends {} = {}>(
    id: DataId,
    input: UpdateQuery<D>,
    options?: UpdateOneOption
  ): Promise<MergePopulate<D, P> | null>

  async function findByIdAndUpdate<P extends {} = []>(
    id: DataId,
    input: UpdateQuery<D>,
    options: UpdateOneOption = {}
  ) {
    return await findOneAndUpdate<P>({ _id: id } as FilterQuery<D>, input, options)
  }

  return findByIdAndUpdate
}
