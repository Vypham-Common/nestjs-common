import { Module } from '@nestjs/common'
import { LocationModel } from './location.schema'
import { LocationService } from './location.service'

@Module({
  providers: [LocationService, LocationModel],
  exports: [LocationService, LocationModel],
})
export class LocationModule {}
