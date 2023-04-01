import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, required: true })
  followerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  followingId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
