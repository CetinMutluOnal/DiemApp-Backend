import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  readonly userId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;

  @IsDateString()
  created_at: string;
}
