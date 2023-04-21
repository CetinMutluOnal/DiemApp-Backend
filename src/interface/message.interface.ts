import { Date, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  readonly senderId: Types.ObjectId;
  readonly receiverId: Types.ObjectId;
  content: string;
  readonly media: string;
  readonly created_at: Date;
  deleted_at: Date;
}
