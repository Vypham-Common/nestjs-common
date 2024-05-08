import { BadRequestException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { AbstractSchema } from '../../../abstracts';

export const generateExists = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  async function exists(
    query: FilterQuery<D>,
    options: { throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS'; message?: string, softDelete?: boolean } = {}
  ) {
    const { throwCase, message, softDelete = true } = options || {}
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    const isExists = await Model.exists(query)
    switch (throwCase) {
      case 'IF_EXISTS':
        if (isExists) {
          throw new BadRequestException(message || `${name} with filter ${JSON.stringify(query)} already exist`)
        }
        break
      case 'IF_NOT_EXISTS':
        if (!isExists) {
          throw new BadRequestException(message || `${name} with filter ${JSON.stringify(query)} not found`)
        }
        break
    }
    return !!isExists
  }

  return exists
}

export const generateExistsAll = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string) => {
  async function existsAll(
    ids: DataId[],
    options: {
      throwCase?:
      | 'IF_ONE_EXISTS'
      | 'IF_ONE_NOT_EXISTS'
      | 'IF_ALL_EXISTS'
      | 'IF_ALL_NOT_EXISTS'
      message?: string
      softDelete?: boolean
    } = {},
    customQuery?: (ids: DataId[]) => FilterQuery<D>
  ) {
    const hashTypes: { [k: string]: 1 } = {}
    ids.forEach((o) => {
      hashTypes[o.toString()] = 1
    })
    ids = Object.keys(hashTypes)
    const query = customQuery
      ? customQuery(ids)
      : { _id: { $in: ids } } as FilterQuery<D>
    const { throwCase, message, softDelete = true } = options || {}

    const isSoftDelete = Model?.isSoftDelete?.()
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
  return existsAll
}
