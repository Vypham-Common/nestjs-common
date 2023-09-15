import { Connection, HydratedDocument, Types } from 'mongoose';
import { AbstractModel } from '../../abstracts';
export declare class Attachment {
    user: Types.ObjectId;
    name: string;
    fileName: string;
    path: string;
    type: string;
    size: number;
    category: string;
    ipAddress: string;
    status: number;
    tenant: string;
    url: string;
    expiresDate: Date;
}
export declare class AttachmentModel extends AbstractModel<Attachment> {
    constructor(connection: Connection, tenant: string);
}
export type AttachmentDocument = HydratedDocument<Attachment>;
