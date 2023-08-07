import { Inject } from '@nestjs/common'
import { AbstractService } from '../../abstracts'
import { COMMON_COLLECTION, TOKEN } from '../../enums'
import { LocationModel, LocationPullPopulate } from './location.schema'

export class LocationService extends AbstractService<
  LocationModel,
  LocationPullPopulate
> {
  constructor(@Inject(TOKEN.USER) user: JWTPayload, model: LocationModel) {
    super(model, user, {
      populate: [
        {
          path: 'currency',
          model: COMMON_COLLECTION.currencies,
        },
      ],
    })
  }
}
