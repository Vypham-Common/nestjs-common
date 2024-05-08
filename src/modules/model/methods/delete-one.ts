import { BadRequestException } from '@nestjs/common';
import { Document, FilterQuery, HydratedDocument, IfAny, Model, Require_id } from 'mongoose';
import { AbstractSchema } from '../../../abstracts';
import { DeleteOneOption } from '../model.interface';

export const generateFindOneAndDelete = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  function findOneAndDelete(
    query: FilterQuery<D>,
    options: Omit<DeleteOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<HydratedDocument<D>>

  function findOneAndDelete(
    query: FilterQuery<D>,
    options?: DeleteOneOption
  ): Promise<HydratedDocument<D> | null>

  async function findOneAndDelete(
    query: FilterQuery<D>,
    {
      isThrow,
      message,
      softDelete = true,
      sort,
    }: DeleteOneOption = {}
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    let data: IfAny<D, any, Document<unknown, {}, D> & Require_id<D>> | null = null
    if (isSoftDelete && softDelete) {
      data = await Model.findOneAndUpdate(query, { deletedAt: Date.now() }).sort(sort || {})
    } else {
      data = await Model.findOneAndDelete(query).sort(sort || {})
    }

    if (!data && isThrow) {
      throw new BadRequestException(message || `${name} with filter ${JSON.stringify(query)} not found`)
    }

    return data
  }

  return findOneAndDelete
}

export const generateFindByIdAndDelete = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  const findOneAndDelete = generateFindOneAndDelete(Model, name)

  function findByIdAndDelete(
    id: DataId,
    options: Omit<DeleteOneOption, 'isThrow'> & { isThrow: true }
  ): Promise<HydratedDocument<D>>

  function findByIdAndDelete(
    id: DataId,
    options?: DeleteOneOption
  ): Promise<HydratedDocument<D> | null>

  async function findByIdAndDelete(
    id: DataId,
    options: DeleteOneOption = {}
  ) {
    return await findOneAndDelete({ _id: id } as FilterQuery<D>, options)
  }

  return findByIdAndDelete
}

