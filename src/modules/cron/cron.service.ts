import { Inject, Injectable, Scope } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

@Injectable({ scope: Scope.DEFAULT })
export class CronService {
  @Inject() private schedulerRegistry: SchedulerRegistry

  registerTimeout(id: string, miliseconds: number, cb: () => any) {
    const Timeout = setTimeout(cb, miliseconds)
    this.schedulerRegistry.addTimeout(id, Timeout)
  }

  registerInterval(id: string, miliseconds: number, cb: () => any) {
    const interval = setInterval(cb, miliseconds)
    this.schedulerRegistry.addInterval(id, interval)
  }

  registerCron(id: string, timePattern: string, cb: () => any) {
    const job = new CronJob(timePattern, cb)
    this.schedulerRegistry.addCronJob(id, job)
    job.start()
  }

  replaceTimeout(id: string, miliseconds: number, cb: () => any) {
    if (this.schedulerRegistry.doesExist('timeout', id)) {
      this.schedulerRegistry.deleteTimeout(id)
    }
    this.registerTimeout(id, miliseconds, cb)
  }

  replaceInterval(id: string, miliseconds: number, cb: () => any) {
    if (this.schedulerRegistry.doesExist('interval', id)) {
      this.schedulerRegistry.deleteInterval(id)
    }
    this.registerInterval(id, miliseconds, cb)
  }

  replaceCron(id: string, timePattern: string, cb: () => any) {
    if (this.schedulerRegistry.doesExist('cron', id)) {
      this.schedulerRegistry.deleteCronJob(id)
    }
    this.registerCron(id, timePattern, cb)
  }

  deleteCron(id: string, type: 'cron' | 'timeout' | 'interval' = 'cron') {
    if (this.schedulerRegistry.doesExist(type, id)) {
      switch (type) {
        case 'cron':
          this.schedulerRegistry.deleteCronJob(id)
          break;
        case 'timeout':
          this.schedulerRegistry.deleteTimeout(id)
          break;
        case 'interval':
          this.schedulerRegistry.deleteInterval(id)
          break;
        default:
          break;
      }
    }
  }
}
