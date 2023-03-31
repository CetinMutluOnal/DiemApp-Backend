import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;

  @IsDateString()
  created_at: string;
}
