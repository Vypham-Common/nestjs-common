import { AnyKeys, Model } from 'mongoose'
import { AbstractSchema } from '../../../abstracts'
import { generateCreateQueue } from './create-queue'

export const generateCreate = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant?: string) => {
  const createQueue = generateCreateQueue(Model, name, tenant)
  async function create<DocContents = D>(doc: DocContents | AnyKeys<D>) {
    const isIncreasementId = Model?.isIncreasementId?.()

    if (isIncreasementId) {
      return createQueue(async () => {
        const total = (await Model.findOne({ _id: { $type: 'number' } }).sort({ _id: -1 }).select('_id').lean())?._id || 0
        return await Model.create({
          ...doc,
          _id: (total as number) + 1
        })
      })
    }

    return await Model.create(doc)
  }

  return create
}
