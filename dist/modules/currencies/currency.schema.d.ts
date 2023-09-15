import { Connection, HydratedDocument } from 'mongoose';
import { AbstractModel } from '../../abstracts';
import { STATUS } from '../../enums';
export declare class Currency {
    name: string;
    code: string;
    symbol: string;
    rate: number;
    modifyAmount: number;
    status: STATUS;
}
export declare class CurrencyModel extends AbstractModel<Currency> {
    constructor(connection: Connection, tenant: string);
}
export type CurrencyDocument = HydratedDocument<Currency>;
