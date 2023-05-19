import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class FollowDto {
  @IsNotEmpty()
  @IsString()
  followerId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  followingId: Types.ObjectId;
}
