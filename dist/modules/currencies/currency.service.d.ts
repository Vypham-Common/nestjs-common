import { AbstractService } from '../../abstracts';
import { CurrencyModel } from './currency.schema';
export declare class CurrencyService extends AbstractService<CurrencyModel> {
    constructor(user: JWTPayload, model: CurrencyModel);
}
