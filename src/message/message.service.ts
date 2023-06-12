import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageDto, FindMessageDto } from 'src/dto/';
import { IMessage } from 'src/interface/message.interface';
import { Date } from 'mongoose';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private messageModel: Model<IMessage>,
    @InjectModel('User') private userModel: Model<IUser>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async getAllMessagedUsers(userId: Types.ObjectId): Promise<IMessage[]> {
    const conversations = await this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    if (!conversations || conversations.length == 0) {
      throw new NotFoundException('Message Not Found');
    }

    return conversations;
  }

  async getUsers(userId: Types.ObjectId): Promise<any[]> {
    const messages = await this.getAllMessagedUsers(userId);

    const userList: Array<string> = [];

    messages.forEach((message) => {
      if (message.receiverId.toString() == userId.toString()) {
        userList.push(message.senderId.toString());
      } else {
        userList.push(message.receiverId.toString());
      }
    });

    const mySet = new Set(Array.from(userList));

    const users = Array.from(mySet);
    const message: Array<any> = [];
    for (const id of users) {
      message.push(
        await this.userModel.aggregate([
          {
            $match: {
              _id: new Types.ObjectId(id),
            },
          },
          {
            $project: {
              __v: 0,
              refreshToken: 0,
              password: 0,
            },
          },
        ]),
      );
    }

    return message;
  }

  async getAllMessages(findMessageDto: FindMessageDto): Promise<IMessage[]> {
    const sentMessages = await this.messageModel.find({
      senderId: findMessageDto.senderId,
      receiverId: findMessageDto.receiverId,
    });

    const receivedMessages = await this.messageModel.find({
      senderId: findMessageDto.receiverId,
      receiverId: findMessageDto.senderId,
    });

    const allMessages = [...sentMessages, ...receivedMessages];

    return allMessages.sort((a: any, b: any) => a.createdAt - b.createdAt);
  }

  async getMessageById(messageId: Types.ObjectId): Promise<IMessage> {
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message Not Found');
    }
    return message;
  }

  async deleteMessage(
    messageId: Types.ObjectId,
    tokenOwner: Types.ObjectId,
  ): Promise<IMessage> {
    const message = await this.messageModel.findById(messageId);
    const senderId = message.senderId;
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

  async startConversation(userId: Types.ObjectId) {
    const messagedUsers = await this.getUsers(userId);

    const followedIds = messagedUsers.map((user) => user[0]._id);

    const recommendUsers = await this.userModel
      .aggregate([
        { $match: { _id: { $nin: followedIds, $ne: userId } } },
        {
          $project: {
            __v: 0,
            password: 0,
            refreshToken: 0,
          },
        },
        { $sample: { size: 10 } },
      ])
      .exec();

    if (!recommendUsers) {
      throw new NotFoundException('Not Found');
    }

    return recommendUsers;
  }
}
