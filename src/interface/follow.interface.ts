import { Document, Types } from 'mongoose';

export interface IFollow extends Document {
  readonly followerId: Types.ObjectId;
  readonly followingId: Types.ObjectId;
}
