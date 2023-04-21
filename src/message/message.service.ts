import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto, FindMessageDto } from 'src/dto/';
import { IMessage } from 'src/interface/message.interface';
import { Date } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private messageModel: Model<IMessage>) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async getAllMessages(findMessageDto: FindMessageDto): Promise<IMessage[]> {
    const allMessages = await this.messageModel.find({
      senderId: findMessageDto.senderId,
      receiverId: findMessageDto.receiverId,
    });

    if (!allMessages || allMessages.length == 0) {
      throw new NotFoundException('Message Not Found');
    }
    return allMessages;
  }

  async getMessageById(messageId: string): Promise<IMessage> {
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message Not Found');
    }
    return message;
  }

  async deleteMessage(
    messageId: string,
    tokenOwner: string,
  ): Promise<IMessage> {
    const message = await this.messageModel.findById(messageId);
    const senderId = message.senderId.toString();
    if (senderId === tokenOwner) {
      const deletedMessage = await this.messageModel.findByIdAndUpdate(
        messageId,
        { deletedAt: new Date() },
      );
      if (deletedMessage.deleted_at === null) {
        throw new BadRequestException('Message could not deleted');
      }
      return deletedMessage;
    }
    throw new UnauthorizedException('You Can Only Delete Your Own Message');
  }
}
