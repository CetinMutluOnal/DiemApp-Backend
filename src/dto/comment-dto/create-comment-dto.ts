import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  postId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;

  @IsDateString()
  deletedAt: string;
}
