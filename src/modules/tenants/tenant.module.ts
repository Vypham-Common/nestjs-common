import { Module } from '@nestjs/common'
import { TenantModel } from './tenant.schema'
import { TenantService } from './tenant.service'

@Module({
  providers: [TenantService, TenantModel],
  exports: [TenantService, TenantModel],
})
export class TenantModule {}
