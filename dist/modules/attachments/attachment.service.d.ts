import { AbstractService } from '../../abstracts';
import { AttachmentModel } from './attachment.schema';
export declare class AttachmentService extends AbstractService<AttachmentModel> {
    constructor(user: JWTPayload, model: AttachmentModel);
}
