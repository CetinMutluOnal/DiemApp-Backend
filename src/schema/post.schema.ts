import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: null })
  media: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
