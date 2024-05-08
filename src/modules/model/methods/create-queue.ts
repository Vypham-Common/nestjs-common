import { Model, Types } from 'mongoose'
import { AbstractSchema } from '../../../abstracts'
import { eventEmitter } from '../../../utils'

export const generateCreateQueue = <D extends AbstractSchema>(Model: Model<D> & ModelStatics, name: string, tenant?: string) => {
  function createQueue<T = any>(
    fn: () => Promise<T> | T
  ): Promise<T> {
    const id = new Types.ObjectId().toString()
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

    eventEmitter.emit(`${tenant || 'master'}_${name}`, {
      id,
      fn
    })
    return promise
  }

  return createQueue
}
