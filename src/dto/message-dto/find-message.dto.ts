import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';

export class FindMessageDto extends PartialType(CreateMessageDto) {}
