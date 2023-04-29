import { Date, Document, Types } from 'mongoose';

export interface IPost extends Document {
  userId: Types.ObjectId;
  content: string;
  readonly media: string;
  readonly createdAt: Date;
  deletedAt: Date;
}
