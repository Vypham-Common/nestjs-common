import { CronJobParameters } from 'cron';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(0)
export { eventEmitter };
export function emitCronJob(input: {
  id: string
  timePattern: string,
  cb: () => any | Promise<any>,
  params?: Omit<CronJobParameters, 'onTick' | 'cronTime'>
}) {
  eventEmitter.emit('cron', input)
}

export function registerWorker(workerId: string) {
  eventEmitter.emit('register_worker', workerId)
}

export function addQueue(workerId: string, queue: {
  id: string
  fn: () => Promise<any> | any
}) {
  eventEmitter.emit(workerId, queue)
}
