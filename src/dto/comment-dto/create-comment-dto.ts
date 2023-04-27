import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;

  @IsDateString()
  deletedAt: string;
}
