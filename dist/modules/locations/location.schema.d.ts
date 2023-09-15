import { Connection, HydratedDocument, Types } from 'mongoose';
import { AbstractModel } from '../../abstracts';
import { STATUS } from '../../enums';
import { CurrencyDocument } from '../currencies';
declare class HeadQuarterAddress {
    addressLine1: string;
    addressLine2: string;
    state: string;
    zipCode: string;
    city: string;
    country: string;
}
declare class Coordinates {
    lat: number;
    long: number;
}
export declare class Location {
    name: string;
    timezone: string;
    headQuarterAddress: HeadQuarterAddress;
    isHeadQuarter: boolean;
    status: STATUS;
    company: Types.ObjectId;
    coordinates: Coordinates;
    wifiAccessIds: string[];
    distance: number;
    phone: string;
    googleMapsUrl: string;
    currency: Types.ObjectId;
}
export type LocationDocument = HydratedDocument<Location>;
export interface LocationPullPopulate {
    currency: CurrencyDocument;
}
export type LocationFullyPopulate = MergePopulate<Location, LocationPullPopulate>;
export declare class LocationModel extends AbstractModel<Location> {
    constructor(connection: Connection, tenant: string);
}
export {};
