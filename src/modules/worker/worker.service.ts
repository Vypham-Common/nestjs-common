import { Injectable, Scope } from '@nestjs/common'
import { eventEmitter } from '../../utils/eventEmitter'

interface Queue {
  id: string
  fn: () => Promise<any> | any
}
@Injectable({ scope: Scope.DEFAULT })
export class WorkerService {
  queueTenant: {
    [tenant: string]: {
      [collectionName: string]: {
        isRunning: boolean
        queue: Queue[]
      }
    }
  } = {}

  async register(tenant: string, collectionName: string) {
    if (!this.queueTenant[tenant]) {
      this.queueTenant[tenant] = {
        [collectionName]: {
          isRunning: false,
          queue: []
        }
      }

    } else {
      this.queueTenant[tenant][collectionName] = {
        isRunning: false,
        queue: []
      }
    }
    eventEmitter.on(`${tenant}_${collectionName}`, async (queue: Queue) => {
      this.addQueue(tenant, collectionName, queue)
    })
  }

  async addQueue(tenant: string, collectionName: string, queue: Queue) {
    this.queueTenant[tenant][collectionName].queue.push(queue)
    if (!this.queueTenant[tenant].isRunning) {
      this.start(tenant, collectionName)
    }
  }

  async start(tenant: string, collectionName: string) {
    this.queueTenant[tenant][collectionName].isRunning = true
    while (true) {
      const payload = this.queueTenant[tenant][collectionName].queue.shift()
      if (!payload) break
      const { fn, id } = payload
      try {
        const data = await fn()
        eventEmitter.emit(id, data)
      } catch (error) {
        eventEmitter.emit(id, error)
      }
    }
    this.queueTenant[tenant][collectionName].isRunning = false
  }
}
