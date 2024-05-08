import { AnyKeys, FilterQuery, Model, Types, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import { AbstractSchema } from '../../../abstracts';
import { generateCreateQueue } from './create-queue';

export const generateInsertMany = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant?: string) => {
  const createQueue = generateCreateQueue(Model, name, tenant)
  async function insertMany<DocContents = D>(docs: (DocContents | AnyKeys<D>)[]) {
    const isIncreasementId = Model?.isIncreasementId?.()
    if (isIncreasementId) {
      const data = await createQueue(async () => {
        const total = (await Model.findOne({ _id: { $type: 'number' } }).sort({ _id: -1 }).select('_id').lean())?._id || 0
        return await Model.insertMany(docs.map((o, index) => ({ ...o, _id: (total as number) + 1 + index })))
      })
      return data
    }
    return await Model.insertMany(docs.map((o) => ({ ...o, _id: new Types.ObjectId() })))
  }
  return insertMany
}


export const generateUpdateMany = <D extends AbstractSchema>(Model: Model<D> & ModelStatics) => {
  async function updateMany(
    query: FilterQuery<D>,
    update: UpdateQuery<D> | UpdateWithAggregationPipeline,
    { softDelete }: { softDelete?: boolean } = { softDelete: true }
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      query.deletedAt = { $exists: false }
    }
    return await Model.updateMany(query, update)
  }

  return updateMany
}

export const generateDeleteMany = <D extends AbstractSchema>(Model: Model<D> & ModelStatics) => {
  async function deleteMany(
    query: FilterQuery<D>,
    { softDelete }: { softDelete?: boolean } = { softDelete: true }
  ) {
    const isSoftDelete = Model?.isSoftDelete?.()
    if (isSoftDelete && softDelete) {
      return await Model.updateMany(query, { deletedAt: new Date() })
    }
    return await Model.deleteMany(query)
  }
  return deleteMany
}
