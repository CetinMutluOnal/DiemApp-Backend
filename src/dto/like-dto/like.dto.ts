import { IsNotEmpty, IsString } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  postId: string;
}
