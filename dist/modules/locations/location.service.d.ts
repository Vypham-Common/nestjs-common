import { AbstractService } from '../../abstracts';
import { LocationModel, LocationPullPopulate } from './location.schema';
export declare class LocationService extends AbstractService<LocationModel, LocationPullPopulate> {
    constructor(user: JWTPayload, model: LocationModel);
}
