import { Types } from 'mongoose';

export class AbstractSchema {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
