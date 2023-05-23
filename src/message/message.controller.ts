import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/dto';
import { MessageService } from './message.service';
import { AccessTokenGuard } from 'src/common/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Types } from 'mongoose';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @UseGuards(AccessTokenGuard)
  @Post('/:id')
  // @FormDataRequest()
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './images/message',
        filename: (req, file, cb) => {
          const fileName: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async sendMessage(
    @Res() response,
    @Request() req,
    @UploadedFile() file,
    @Param('id') receiverId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const sendMessage = await this.messageService.createMessage({
        senderId: new Types.ObjectId(req.user.userId),
        receiverId: new Types.ObjectId(receiverId),
        media: file?.path,
        ...createMessageDto,
      });
      return response.status(HttpStatus.OK).json({
        message: 'Message Sent Successfully',
        sendMessage,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Message not send',
        error: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('find/:id')
  async findAllMessages(
    @Res() response,
    @Request() req,
    @Param('id') receiverId: string,
  ) {
    try {
      const messages = await this.messageService.getAllMessages({
        senderId: new Types.ObjectId(req.user.userId),
        receiverId: new Types.ObjectId(receiverId),
      });
      return response.status(HttpStatus.OK).json({
        message: `All Messages found successfully`,
        messages,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `Messages could not found! `,
        error: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async findMessageById(
    @Res() response,
    @Request() req,
    @Param('id') messageId: string,
  ) {
    try {
      const msg = await this.messageService.getMessageById(
        new Types.ObjectId(messageId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Message found successfully',
        msg,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `Message could not found`,
        error: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteMessage(
    @Res() response,
    @Request() req,
    @Param('id') messageId: string,
  ) {
    try {
      const deletedMessage = await this.messageService.deleteMessage(
        new Types.ObjectId(messageId),
        new Types.ObjectId(req.user.userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Message deleted successfully',
        deletedMessage,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Message could not deleted',
        error: error.message,
      });
    }
  }
}
