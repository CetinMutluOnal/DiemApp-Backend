import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  readonly senderId: string;

  @IsString()
  readonly receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;
}
