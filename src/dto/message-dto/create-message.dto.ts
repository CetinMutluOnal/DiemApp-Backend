import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  readonly senderId: Types.ObjectId;

  @IsString()
  readonly receiverId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  media: string;
}
