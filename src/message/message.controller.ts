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
import { CreateMessageDto, FindMessageDto } from 'src/dto';
import { MessageService } from './message.service';
import { FormDataRequest } from 'nestjs-form-data';
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
  @Post()
  // @FormDataRequest()
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './images/avatar',
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
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const sendMessageDto = {
        ...createMessageDto,
        senderId: req.user.userId,
        media: file.path,
      };
      const sendMessage = await this.messageService.createMessage(
        sendMessageDto,
      );
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
  @Post('find')
  async findAllMessages(
    @Res() response,
    @Request() req,
    @Body() findMessageDto: FindMessageDto,
  ) {
    try {
      const messages = await this.messageService.getAllMessages({
        senderId: new Types.ObjectId(req.user.userId),
        ...findMessageDto,
      });
      return response.status(HttpStatus.OK).json({
        message: `All Message from ${findMessageDto.senderId} to ${findMessageDto.receiverId} found successfully`,
        messages,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `Messages from ${findMessageDto.senderId} to ${findMessageDto.receiverId} could not found`,
        error: error.message,
      });
    }
  }

  //   @UseGuards(AccessTokenGuard)
  //   @Get(':sender/:receiver')
  //   async findAllMessages(
  //     @Res() response,
  //     @Request() req,
  //     @Param('sender') senderId: string,
  //     @Param('receiver') receiverId: string,
  //   ) {
  //     try {
  //       const findMessageDto = { senderId: req.user.userId, receiverId: receiverId };
  //       const messages = this.messageService.getAllMessages(findMessageDto);
  //       return response.status(HttpStatus.OK).json({
  //         message: `All Messages from ${findMessageDto.senderId} to ${findMessageDto.senderId} found successfully`,
  //         messages,
  //       });
  //     } catch (error) {
  //       return response.status(HttpStatus.BAD_REQUEST).json({
  //         message: `Messages could not found`,
  //         error: error.message,
  //       });
  //     }
  //   }

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
