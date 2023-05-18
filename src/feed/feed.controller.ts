import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  Res,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { MyWebSocketGateway } from 'src/socket/event.gateway';
import { AccessTokenGuard } from 'src/common/guards';
import { Socket } from 'socket.io';

@Controller('feed')
export class FeedController {
  constructor(
    private postService: PostService,
    private socketService: MyWebSocketGateway,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async createUserFeed(@Request() req, @Res() response, socket: Socket) {
    try {
      const posts = await this.socketService.handleConnection(
        socket,
        req.user.userId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'feed created successfully',
        feed: posts,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
