import { Global, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Global()
@Module({
  providers: [CronService, SchedulerRegistry],
  exports: [CronService]
})
export class CronModule { }
