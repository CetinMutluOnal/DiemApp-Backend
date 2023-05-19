import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class LikeDto {
  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  postId: Types.ObjectId;
}
