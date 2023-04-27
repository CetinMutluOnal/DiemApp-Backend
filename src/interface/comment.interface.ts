import { Document, Types, Date } from 'mongoose';

export interface IComment extends Document {
  readonly userId: Types.ObjectId;
  readonly postId: Types.ObjectId;
  readonly content: string;
  readonly media: string;
  readonly createdAt: Date;
  deletedAt: Date;
}
