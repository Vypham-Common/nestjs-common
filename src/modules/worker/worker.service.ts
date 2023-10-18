import { eventEmitter } from '../../utils/eventEmitter'

interface Queue {
  id: string
  fn: () => Promise<any> | any
}
export class WorkerService {
  queueTenant: {
    [k: string]: {
      isRunning: boolean
      queue: Queue[]
    }
  } = {}

  constructor() {
    eventEmitter.on('register_worker', async (tenant: string) => {
      this.register(tenant)
    })
  }

  async register(tenant: string) {
    if (!this.queueTenant[tenant]) {
      this.queueTenant[tenant] = {
        isRunning: false,
        queue: []
      }

      eventEmitter.on(tenant, async (queue: Queue) => {
        this.addQueue(tenant, queue)
      })
    }
  }

  async addQueue(tenant: string, queue: Queue) {
    this.queueTenant[tenant].queue.push(queue)
    if (!this.queueTenant[tenant].isRunning) {
      this.start(tenant)
    }
  }

  async start(tenant: string) {
    this.queueTenant[tenant].isRunning = true
    while (true) {
      const payload = this.queueTenant[tenant].queue.shift()
      if (!payload) break
      const { fn, id } = payload
      try {
        const data = await fn()
        eventEmitter.emit(id, data)

      } catch (error) {

        eventEmitter.emit(id, error)
      }
    }
    this.queueTenant[tenant].isRunning = false
  }
}
