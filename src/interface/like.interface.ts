import { Document, Types } from 'mongoose';

export interface ILike extends Document {
  readonly userId: Types.ObjectId;
  readonly postId: Types.ObjectId;
}
