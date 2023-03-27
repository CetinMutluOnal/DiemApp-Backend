import { Date, Document, Types } from 'mongoose';

export interface IPost extends Document {
  readonly userId: Types.ObjectId;
  content: string;
  readonly media: string;
  readonly created_at: Date;
  deleted_at: Date;
}
