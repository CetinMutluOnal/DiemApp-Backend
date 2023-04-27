import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  postId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: null })
  media: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
