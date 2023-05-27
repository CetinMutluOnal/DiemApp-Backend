import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AccessTokenGuard } from 'src/common/guards';
import { LikeDto } from 'src/dto';
import { Types } from 'mongoose';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/:id')
  async likePost(@Request() req, @Res() response, @Param('id') postId: string) {
    try {
      const like = await this.likeService.createLike({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(req.user.userId),
      });
      return response.status(HttpStatus.CREATED).json({
        message: 'Liked Successfully',
        data: like,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Could not like.',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  async getUserLikes(@Res() response, @Param('id') userId: string) {
    try {
      const likes = await this.likeService.getUserAllLikes(
        new Types.ObjectId(userId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Likes found Successfully',
        data: likes,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }

  @Get('/post/:id')
  async getPostLikes(@Res() response, @Param('id') postId: string) {
    try {
      const likes = await this.likeService.getPostAllLikes(
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Likes found Successfully',
        data: likes,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
  @UseGuards(AccessTokenGuard)
  @Get('/check/:id')
  async checkLike(
    @Res() response,
    @Request() req,
    @Param('id') postId: string,
  ) {
    try {
      const isLiked = await this.likeService.controlLike(
        new Types.ObjectId(req.user.userId),
        new Types.ObjectId(postId),
      );
      if (isLiked) {
        return response.status(HttpStatus.OK).json({
          message: 'User liked this post',
          data: isLiked,
        });
      }
    } catch (error) {
      return response.status(error.status).json({
        message: 'Like Not Found',
        error: error.message,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteLike(
    @Request() req,
    @Res() response,
    @Param('id') postId: string,
  ) {
    try {
      const deletedLike = await this.likeService.deleteLike(
        new Types.ObjectId(req.user.userId),
        new Types.ObjectId(postId),
      );
      return response.status(HttpStatus.OK).json({
        message: 'Like deleted successfully',
        data: deletedLike,
      });
    } catch (error) {
      return response.status(error.status).json(error.status);
    }
  }
}
